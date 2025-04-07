"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Bot, Loader2, Trash, Building, BarChart4, Wrench, MessageSquare, ChevronRight, ChevronLeft, Calculator, FileText, Menu, X, Info } from "lucide-react";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { ToolsPanel } from "@/components/tools-panel";
import { ChatSidebar, SavedChat } from "@/components/chat-sidebar";
import { apiClient, CREAgentResponse } from "@/lib/api-client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Message type definition
type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agent?: string;
  isStreaming?: boolean; // Add streaming flag
};

export default function ChatPage() {
  // State for messages in the current thread
  const [messages, setMessages] = useState<Message[]>([]);
  
  // State for thread ID
  const [threadId, setThreadId] = useState<string>(() => {
    // Generate a random thread ID if none exists
    return "thread_" + Math.random().toString(36).substring(2, 11);
  });
  
  // Message deduplication tracking
  const lastMessageIdRef = useRef<string>("");
  
  // State for current chat ID
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  // Loading state while waiting for response
  const [isLoading, setIsLoading] = useState(false);
  
  // State for API health
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  
  // State for showing tools panel
  const [showTools, setShowTools] = useState(false);

  // State for showing sidebar on mobile
  const [showSidebar, setShowSidebar] = useState(false);

  // Ref for message container to auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Ref to track if chat has been initially loaded
  const hasInitiallyLoaded = useRef(false);
  
  // Ref to track sidebar toggle timeouts
  const sidebarToggleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref to track last save timestamp to prevent duplicate saves
  const lastSaveTimestampRef = useRef<number>(0);
  
  // Ref to track completed stream IDs to prevent duplicate processing
  const completedStreamsRef = useRef<Set<string>>(new Set());
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
  }, []);
  
  // Load chat from localStorage if currentChatId changes
  // We only need this on initial load, direct selection is handled in handleSelectChat
  useEffect(() => {
    // Only load on initial mount if currentChatId is already set (e.g. from URL)
    if (currentChatId && !hasInitiallyLoaded.current) {
      loadChatFromStorage(currentChatId);
      hasInitiallyLoaded.current = true;
    }
  }, []);
  
  // Clean up any timeouts on component unmount
  useEffect(() => {
    return () => {
      if (sidebarToggleTimeoutRef.current) {
        clearTimeout(sidebarToggleTimeoutRef.current);
      }
    };
  }, []);
  
  // State for current agent
  const [currentAgent, setCurrentAgent] = useState<string>("main");
  
  // State for available agents
  const [availableAgents, setAvailableAgents] = useState<string[]>([]);
  
  // Fetch available agents on component mount
  useEffect(() => {
    fetchAvailableAgents();
  }, []);
  
  const fetchAvailableAgents = async () => {
    try {
      const response = await apiClient.getAvailableAgents();
      setAvailableAgents(response.agents);
      // Set default agent if available
      if (response.default_agent && currentAgent === "main") {
        setCurrentAgent(response.default_agent);
      }
    } catch (error) {
      console.error("Error fetching available agents:", error);
      // Set fallback agents if API fails
      setAvailableAgents(["main"]);
    }
  };
  
  const checkApiHealth = async () => {
    try {
      const isHealthy = await apiClient.healthCheck();
      setIsApiHealthy(isHealthy);
      if (!isHealthy) {
        toast.error("API is not available. Please check server status.");
      }
    } catch (error) {
      setIsApiHealthy(false);
      toast.error("Failed to connect to API. Please check server status.");
    }
  };

  // State for streaming message
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  // State for streaming
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  
  // Clean up any active event sources when component unmounts
  useEffect(() => {
    return () => {
      if (eventSource) {
        console.log("Cleaning up EventSource on unmount");
        eventSource.close();
      }
    };
  }, [eventSource]);

  const handleSendMessage = async (message: string) => {
    // Skip if this is a duplicate of the last message
    const messageId = `${message}-${Date.now()}`;
    if (messageId === lastMessageIdRef.current) {
      console.log("Skipping duplicate message");
      return;
    }
    
    // Update the last message ID reference
    lastMessageIdRef.current = messageId;
    
    // Clean up any existing EventSource
    if (eventSource) {
      console.log("Closing existing EventSource");
      eventSource.close();
      setEventSource(null);
    }
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Create initial streaming message
      const streamingAssistantMessage: Message = {
        role: "assistant",
        content: "",
        timestamp: new Date(),
        agent: currentAgent,
        isStreaming: true
      };
      
      setStreamingMessage(streamingAssistantMessage);
      
      // Create EventSource for streaming
      const newEventSource = apiClient.getStreamingResponse(message, threadId, currentAgent);
      setEventSource(newEventSource);
      
      // Track if we've already completed this stream to prevent duplicate completions
      const streamId = `stream_${Date.now()}`;
      let responseCount = 0;
      
      const handleStreamCompletion = (source: EventSource | null) => {
        // Check if already completed *before* doing anything else
        if (!source || completedStreamsRef.current.has(streamId)) {
          console.log(`Stream ${streamId} already marked as complete or source invalid. Aborting completion.`);
          return false; // Indicate completion didn't proceed
        }
        
        console.log(`Stream ${streamId} completion initiated`);
        completedStreamsRef.current.add(streamId); // Mark as complete *immediately*
        source.close();
        
        // Update state
        setEventSource(current => (current === source ? null : current)); 
        setTimeout(() => setIsLoading(false), 50); 
        return true; // Indicate completion proceeded
      };

      newEventSource.onmessage = (event) => {
        // Early exit if completed
        if (completedStreamsRef.current.has(streamId)) return; 
        
        try {
          const data = JSON.parse(event.data);
          console.log(`Message received: ${data.type} (count: ${++responseCount}, stream: ${streamId})`);
          
          // Content update / Agent switch / Tool call/output
          if (data.type === "content" && data.data) {
            setStreamingMessage(prev => prev ? { ...prev, content: prev.content + data.data } : null);
          }
          else if (data.type === "agent_switch" && data.data?.agent_name) { 
              const newAgent = data.data.agent_name.toLowerCase();
              setStreamingMessage(prev => prev ? { ...prev, agent: newAgent } : null);
              setCurrentAgent(newAgent);
          }
          else if (data.type === "tool_call" && data.data) {
            const toolInfo = `Using tool: ${data.data.tool}\n`;
            setStreamingMessage(prev => prev ? { ...prev, content: prev.content + "\n\n" + toolInfo } : null);
          }
          else if (data.type === "tool_output" && data.data) {
            const outputInfo = ` ${typeof data.data === 'string' ? data.data : JSON.stringify(data.data)}\n`;
             setStreamingMessage(prev => prev ? { ...prev, content: prev.content + "\n" + outputInfo + "\n" } : null);
          } 
          // Error handling
          else if (data.type === "error") {
            console.error(`Stream ${streamId} error:`, data.error);
            toast.error(data.error);
            const completed = handleStreamCompletion(newEventSource);
            if (completed) { // Only update messages if completion was successful
              setStreamingMessage(prev => {
                if (!prev || !prev.content) return null;
                const finalMessage = { ...prev, isStreaming: false, content: prev.content + "\n\nError: " + data.error };
                setMessages(msgs => [...msgs, finalMessage]);
                return null;
              });
            }
          } 
          // Done handling
          else if (data.type === "done") {
            const completed = handleStreamCompletion(newEventSource);
            if (completed) { // Only update messages if completion was successful
              setStreamingMessage(prev => {
                if (!prev || !prev.content) return null;
                const finalMessage = { ...prev, isStreaming: false };
                // Use a more robust check against the actual messages state
                setMessages(currentMessages => {
                  // Check if the exact same message content already exists as the last message
                  const lastMsg = currentMessages[currentMessages.length - 1];
                  if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === finalMessage.content && !lastMsg.isStreaming) {
                     console.log("Skipping adding duplicate final message.");
                     return currentMessages; // Don't add duplicate
                  }
                  const updatedMessages = [...currentMessages, finalMessage];
                  saveChatToStorage(updatedMessages); // Save final message
                  return updatedMessages;
                });
                return null; // Clear streaming message state
              });
            }
          }
        } catch (error) {
          console.error(`Error parsing stream ${streamId} data:`, error);
          handleStreamCompletion(newEventSource);
        }
      };
      
      newEventSource.onerror = (error) => {
        console.error(`EventSource error for stream ${streamId}:`, error);
        const completed = handleStreamCompletion(newEventSource);
         if (completed) {
           setStreamingMessage(prev => {
             if (!prev || !prev.content) return null;
             const finalMessage = { ...prev, isStreaming: false, content: prev.content + "\n\nConnection error." };
             setMessages(msgs => [...msgs, finalMessage]);
             return null;
           });
         }
      };
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
      setIsLoading(false);
    }
  };
  
  // Handle tool results
  const handleToolResult = (message: string, response: string) => {
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    // Add assistant message with the response
    const assistantMessage: Message = {
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    
    // Save chat to localStorage
    saveChatToStorage(updatedMessages);
    
    // Auto-scroll to the bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Clear conversation
  const handleClearChat = () => {
    setMessages([]);
    // Generate a new thread ID
    const newThreadId = "thread_" + Math.random().toString(36).substring(2, 11);
    setThreadId(newThreadId);
    setCurrentChatId(null);
    
    // If there was a previous chat ID, remove it from localStorage
    if (currentChatId) {
      const savedChatsJson = localStorage.getItem("cre-saved-chats");
      if (savedChatsJson) {
        try {
          const savedChats = JSON.parse(savedChatsJson);
          const updatedChats = savedChats.filter((chat: SavedChat) => chat.id !== currentChatId);
          localStorage.setItem("cre-saved-chats", JSON.stringify(updatedChats));
          localStorage.removeItem(`cre-chat-${currentChatId}`);
          
          // Dispatch a custom event to notify the sidebar of the update
          window.dispatchEvent(new Event('cre-chat-updated'));
        } catch (error) {
          console.error("Error parsing saved chats:", error);
        }
      }
    }
    
    toast.success("Conversation cleared");
  };
  
  // Save chat to localStorage
  const saveChatToStorage = (chatMessages: Message[]) => {
    if (chatMessages.length === 0) return;
    
    // Determine chatId: use currentChatId if available, otherwise generate a new one.
    const chatId = currentChatId || `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // If a new chat ID was generated, update the state *before* saving.
    // This ensures subsequent calls within the same render cycle (due to StrictMode)
    // will use the *same* newly generated ID.
    if (!currentChatId) {
      console.log(`New chat ID generated and set: ${chatId}`);
      setCurrentChatId(chatId); 
    }

    // Use the timestamp ref to prevent rapid duplicate saves/dispatches
    const now = Date.now();
    if (now - lastSaveTimestampRef.current < 150) { // Increased interval slightly
      console.log(`Skipping potential duplicate saveChatToStorage call for chat: ${chatId}`);
      return;
    }
    lastSaveTimestampRef.current = now;
    
    // Get the first user message as the title, or use a default
    const firstUserMessage = chatMessages.find(msg => msg.role === "user");
    const title = firstUserMessage 
      ? firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "") 
      : "New conversation";
    
    // Get the last message for preview
    const lastMessageContent = chatMessages[chatMessages.length - 1]?.content || "";
    const lastMessage = lastMessageContent.substring(0, 40) + 
      (lastMessageContent.length > 40 ? "..." : "");
    
    // Create the chat object
    const chatData: SavedChat = {
      id: chatId, // Use the determined chatId
      title,
      lastMessage,
      timestamp: new Date(),
      threadId, // Assuming threadId is managed correctly elsewhere
    };
    
    console.log(`Saving chat details: ID=${chatId}, Title=${title}`);
    
    // --- LocalStorage Update --- 
    try {
      // Get existing chats
      const savedChatsJson = localStorage.getItem("cre-saved-chats");
      let savedChats: SavedChat[] = savedChatsJson ? JSON.parse(savedChatsJson) : [];
      
      // Remove the current chat if it exists to update it
      savedChats = savedChats.filter(chat => chat.id !== chatId);
      
      // Add the current chat (potentially updated)
      savedChats.push(chatData);
      
      // Sort chats by timestamp (newest first) before saving
      savedChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Save updated list and specific chat data
      localStorage.setItem("cre-saved-chats", JSON.stringify(savedChats));
      localStorage.setItem(`cre-chat-${chatId}`, JSON.stringify({
        messages: chatMessages,
        threadId,
      }));
      console.log(`Successfully saved chat data for ${chatId} to localStorage.`);
      
      // Use setTimeout to dispatch event after current render cycle
      setTimeout(() => {
        console.log("Dispatching cre-chat-updated event after save");
        window.dispatchEvent(new Event('cre-chat-updated'));
      }, 0);
      
    } catch (error) {
       console.error(`Error saving chat ${chatId} to localStorage:`, error);
    }
    // --- End LocalStorage Update --- 
  };
  
  // Load chat from localStorage
  const loadChatFromStorage = (chatId: string) => {
    const chatDataJson = localStorage.getItem(`cre-chat-${chatId}`);
    
    if (chatDataJson) {
      try {
        const chatData = JSON.parse(chatDataJson);
        
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = chatData.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        setMessages(messagesWithDateObjects);
        setThreadId(chatData.threadId);
      } catch (error) {
        console.error("Error parsing chat data:", error);
        toast.error("Failed to load conversation");
      }
    }
  };
  
  // Handle selecting a chat from the sidebar
  const handleSelectChat = (chat: SavedChat) => {
    setCurrentChatId(chat.id);
    // Load chat data here directly instead of relying on the useEffect
    const chatDataJson = localStorage.getItem(`cre-chat-${chat.id}`);
    if (chatDataJson) {
      try {
        const chatData = JSON.parse(chatDataJson);
        
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = chatData.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        // Update state
        setMessages(messagesWithDateObjects);
        setThreadId(chatData.threadId);
      } catch (error) {
        console.error("Error parsing chat data:", error);
        toast.error("Failed to load conversation");
      }
    }
    
    // Close sidebar on mobile after selection - use setTimeout to avoid state updates during render
    if (window.innerWidth < 768) {
      // Clear any existing timeout to prevent multiple state updates
      if (sidebarToggleTimeoutRef.current) {
        clearTimeout(sidebarToggleTimeoutRef.current);
      }
      
      // Set new timeout
      sidebarToggleTimeoutRef.current = setTimeout(() => {
        setShowSidebar(false);
      }, 0);
    }
  };
  
  // Handle creating a new chat
  const handleNewChat = () => {
    // Clear current messages
    setMessages([]);
    
    // Generate a new thread ID
    const newThreadId = "thread_" + Math.random().toString(36).substring(2, 11);
    setThreadId(newThreadId);
    
    // Create a new chat ID
    const newChatId = "chat_" + Math.random().toString(36).substring(2, 11);
    
    // Create empty chat data
    const emptyChat: SavedChat = {
      id: newChatId,
      title: "New conversation",
      lastMessage: "No messages yet",
      timestamp: new Date(),
      threadId: newThreadId,
    };
    
    // Get existing chats
    const savedChatsJson = localStorage.getItem("cre-saved-chats");
    let savedChats: SavedChat[] = [];
    
    if (savedChatsJson) {
      try {
        savedChats = JSON.parse(savedChatsJson);
      } catch (error) {
        console.error("Error parsing saved chats:", error);
      }
    }
    
    // Add the new empty chat
    savedChats.push(emptyChat);
    
    // Save to localStorage
    localStorage.setItem("cre-saved-chats", JSON.stringify(savedChats));
    localStorage.setItem(`cre-chat-${newChatId}`, JSON.stringify({
      messages: [],
      threadId: newThreadId,
    }));
    
    // Dispatch a custom event to notify the sidebar of the update
    window.dispatchEvent(new Event('cre-chat-updated'));
    
    // Update current chat ID
    setCurrentChatId(newChatId);
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      // Clear any existing timeout
      if (sidebarToggleTimeoutRef.current) {
        clearTimeout(sidebarToggleTimeoutRef.current);
      }
      
      // Set new timeout to close sidebar
      sidebarToggleTimeoutRef.current = setTimeout(() => {
        setShowSidebar(false);
      }, 0);
    }
  };

  // Add handleQuickPrompt function
  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Toggle the tools panel
  const toggleTools = () => {
    setShowTools(!showTools);
    // On mobile, if the tools panel is opened as an overlay, scroll to top
    if (window.innerWidth < 768 && !showTools) {
      window.scrollTo(0, 0);
    }
  };

  // Handle selecting a different agent
  const handleSelectAgent = (agentId: string) => {
    setCurrentAgent(agentId);
    toast.success(`Switched to ${agentId} agent`);
  };

  // State for agent descriptions
  const [agentDescriptions, setAgentDescriptions] = useState<Record<string, string>>({
    main: "Main Triage Agent - Routes queries to specialized agents",
    rag: "Document Retrieval Agent - Finds information in your documents",
    excel: "Excel Data Analyst - Analyzes data from Excel files",
    web: "Web Research Agent - Retrieves up-to-date information from the web"
  });
  
  // Render agent selector with capabilities tooltip
  const renderAgentSelector = () => {
    if (!availableAgents || availableAgents.length === 0) {
      return null;
    }

    return (
      <div className="flex items-center space-x-2">
        <label htmlFor="agent-select" className="text-xs sm:text-sm text-gray-400">
          Agent:
        </label>
        <select
          id="agent-select"
          value={currentAgent}
          onChange={(e) => handleSelectAgent(e.target.value)}
          className="text-xs sm:text-sm px-2 py-1 bg-[#1f2937] text-white border border-[#374151] rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
        >
          {availableAgents.map((agent) => (
            <option key={agent} value={agent}>
              {agent.charAt(0).toUpperCase() + agent.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Update the example prompt click handler
  const getExamplePrompts = () => {
    const basePrompts = [
      "What is the current office space vacancy rate in New York?",
      "What are the recent trends in commercial real estate pricing?",
      "What do the experts predict for retail real estate in 2023?",
    ];
    
    // Add agent-specific prompts
    const agentPrompts: Record<string, string[]> = {
      main: [
        "What's the average cap rate for office buildings in Atlanta?",
        "Can you summarize the key findings from the latest market report?",
        "What are the emerging trends in commercial real estate for 2023?",
      ],
      rag: [
        "Find information about vacancy rates in my documents",
        "What do my documents say about multifamily investments?",
        "Summarize the market analysis from my latest report",
      ],
      excel: [
        "Analyze the tenant data from my Excel file",
        "What's the total revenue from the CostarExport spreadsheet?",
        "Compare occupancy rates across different properties in my Excel data",
      ],
      web: [
        "What are the current interest rates affecting commercial mortgages?",
        "Find recent news about Amazon's office space strategy",
        "What are the latest changes to commercial real estate regulations?",
      ],
    };
    
    // Return agent-specific prompts if available, otherwise base prompts
    return agentPrompts[currentAgent] || basePrompts;
  };

  return (
    <div className="flex h-screen max-h-screen bg-[#0f172a] text-[#f3f4f6] relative overflow-hidden">
      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar - hidden on mobile by default */}
      <div className={`
        fixed md:relative z-50 h-full transition-all duration-300 
        ${showSidebar ? 'left-0' : '-left-64 md:left-0'} 
        md:translate-x-0
      `}>
        <ChatSidebar 
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          currentChatId={currentChatId}
        />
      </div>
      
      <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
        <Toaster position="top-right" richColors closeButton />
        
        {/* Header */}
        <header className="border-b border-[#1e293b] py-3 px-4 flex justify-between items-center bg-[#0f172a] shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile sidebar toggle */}
            <button 
              className="md:hidden p-1 text-[#64748b] hover:text-white"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <h1 className="text-xl font-bold flex items-center gap-2 text-[#3b82f6]">
              <Building className="h-6 w-6" />
              <span>reva.ai</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {isApiHealthy === false && (
              <div className="text-xs px-2 sm:px-3 py-1 bg-red-900/20 text-red-400 border border-red-800/30 rounded-full font-medium flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="hidden xs:inline">Chatbot Offline</span>
              </div>
            )}
            
            {/* Replace the agent selector with our enhanced version */}
            {renderAgentSelector()}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleTools}
                    className="flex items-center gap-1 h-8 md:h-9 bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151]"
                  >
                    <Wrench className="h-4 w-4" />
                    {showTools ? (
                      <>
                        <span className="hidden sm:inline">Hide Tools</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Show Tools</span>
                        <ChevronLeft className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showTools ? "Hide tools panel" : "Show tools panel"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearChat}
                    className="flex items-center gap-1 h-8 md:h-9 bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151]"
                    disabled={messages.length === 0}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear Chat</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Clear current conversation
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>
        
        <div className={`flex flex-1 overflow-hidden ${showTools ? 'flex-col md:flex-row' : 'flex-col'}`}>
          {/* Main Chat Area */}
          <div className={`flex flex-col ${showTools ? "w-full md:w-7/12 md:h-full" : "w-full"} h-full transition-all duration-300`}>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-[#0f172a]">
              {messages.length === 0 && !streamingMessage ? (
                <div className="h-full flex flex-col items-center justify-center px-4 py-10">
                  <div className="flex flex-col items-center max-w-md mx-auto text-center space-y-8">
                    <div className="rounded-full bg-[#1e293b] p-3">
                      <Building className="h-8 w-8 text-[#3b82f6]" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Welcome to reva.ai</h2>
                      <p className="text-[#94a3b8]">
                        Your commercial real estate research assistant, powered by AI specialists
                      </p>
                    </div>
                    
                    {/* Display current agent capabilities */}
                    <div className="bg-[#1e293b] p-4 rounded-lg w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {currentAgent.charAt(0).toUpperCase() + currentAgent.slice(1)} Agent
                        </span>
                        <span className="text-xs bg-[#0f172a] text-[#94a3b8] px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-[#94a3b8] mb-3">
                        {agentDescriptions[currentAgent] || "Ready to answer your questions"}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-[#64748b]">Try asking about:</h4>
                        <div className="grid gap-2">
                          {getExamplePrompts().map((prompt, index) => (
                            <button
                              key={index}
                              className="text-left text-sm bg-[#0f172a] hover:bg-[#172136] p-2 rounded-md text-[#e2e8f0] transition-colors"
                              onClick={() => handleQuickPrompt(prompt)}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto pt-2 sm:pt-4 space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage 
                      key={index}
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                      agent={message.agent}
                    />
                  ))}
                  {streamingMessage && (
                    <ChatMessage 
                      role={streamingMessage.role}
                      content={streamingMessage.content}
                      timestamp={streamingMessage.timestamp}
                      agent={streamingMessage.agent}
                      isStreaming={true}
                    />
                  )}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Form - Fixed at bottom */}
            <div className="p-2 sm:p-4 border-t border-[#1e293b] bg-[#0f172a] flex-shrink-0">
              <div className="max-w-3xl mx-auto relative rounded-lg bg-[#0f172a] border border-[#1e293b] shadow-lg overflow-hidden">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
          
          {/* Tools Panel - Overlay on mobile, side panel on desktop */}
          {showTools && (
            <div className={`
              border-t md:border-t-0 md:border-l border-[#1e293b] overflow-y-auto bg-[#0f172a]/80
              w-full md:w-5/12 h-[60vh] md:h-full
              ${showTools ? 'flex-shrink-0' : 'hidden'}
            `}>
              <div className="p-2 border-b border-[#1e293b] md:hidden flex justify-between items-center">
                <h2 className="font-semibold text-white">Tools</h2>
                <button 
                  onClick={() => setShowTools(false)}
                  className="p-1 text-[#64748b] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ToolsPanel 
                threadId={threadId}
                onToolResult={handleToolResult}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
