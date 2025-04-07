"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Plus, 
  MessageSquare, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Building,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SavedChat = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  threadId: string;
};

type ChatSidebarProps = {
  onSelectChat: (chat: SavedChat) => void;
  onNewChat: () => void;
  currentChatId: string | null;
};

export function ChatSidebar({ onSelectChat, onNewChat, currentChatId }: ChatSidebarProps) {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to load saved chats from localStorage
  const loadSavedChats = () => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      console.log("Debounced: Loading saved chats...");
      try {
        const savedChatsJson = localStorage.getItem("cre-saved-chats");
        if (savedChatsJson) {
          const parsedChats = JSON.parse(savedChatsJson);
          // Convert string timestamps back to Date objects
          const chatsWithDateObjects = parsedChats.map((chat: any) => ({
            ...chat,
            timestamp: new Date(chat.timestamp)
          }));
          
          // Sort chats by timestamp (newest first)
          const sortedChats = chatsWithDateObjects.sort((a: SavedChat, b: SavedChat) => 
            b.timestamp.getTime() - a.timestamp.getTime()
          );
          
          setSavedChats(sortedChats);
        }
      } catch (error) {
        console.error("Error parsing saved chats:", error);
      }
    }, 100); // Debounce for 100ms
  };
  
  // Load saved chats on component mount
  useEffect(() => {
    loadSavedChats(); // Initial load
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cre-saved-chats") {
        loadSavedChats(); // Debounced load on storage change
      }
    };
    
    // Add custom event listener for chat updates
    const handleChatUpdate = () => {
      console.log("Received cre-chat-updated event");
      // Use setTimeout to defer state update to next tick - This might be redundant with debounce now
      // setTimeout(() => {
      loadSavedChats(); // Debounced load on custom event
      // }, 0);
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cre-chat-updated", handleChatUpdate);
    
    // Clean up event listeners and debounce timer
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cre-chat-updated", handleChatUpdate);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Filter chats based on search query
  const filteredChats = searchQuery
    ? savedChats.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedChats;
  
  // Delete a chat
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove from localStorage
    const updatedChats = savedChats.filter(chat => chat.id !== chatId);
    localStorage.setItem("cre-saved-chats", JSON.stringify(updatedChats));
    localStorage.removeItem(`cre-chat-${chatId}`);
    
    // Update state
    setSavedChats(updatedChats);
    
    // If the deleted chat was the current one, clear it
    if (chatId === currentChatId) {
      onNewChat();
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const chatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (chatDate.getTime() === today.getTime()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (chatDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString();
  };
  
  const handleNewChatClick = () => {
    onNewChat();
  };
  
  return (
    <>
      <div 
        className={cn(
          "h-full flex flex-col bg-[#0f172a] border-r border-[#1e293b] transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex-none p-4 border-b border-[#1e293b] flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold flex items-center text-[#3b82f6]">
              <Building className="h-5 w-5 mr-2" />
              reva.ai
            </h1>
          )}
          
          {isCollapsed && (
            <Building className="h-5 w-5 text-[#3b82f6] mx-auto" />
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* New Chat Button */}
        <div className="flex-none p-3">
          <Button
            onClick={handleNewChatClick}
            className="w-full bg-[#1f2937] hover:bg-[#374151] text-white border-none flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span>New chat</span>}
          </Button>
        </div>
        
        {/* Search */}
        {!isCollapsed && (
          <div className="flex-none px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <Input
                placeholder="Search conversations"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-[#1e293b] border-[#334155] text-[#f3f4f6] placeholder:text-[#64748b] focus-visible:ring-[#3b82f6]"
              />
            </div>
          </div>
        )}
        
        {/* Chat List */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-1">
              {filteredChats.length === 0 ? (
                <div className="text-sm text-[#64748b] px-2 py-3 text-center">
                  {searchQuery ? "No matching conversations" : "No conversations yet"}
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={cn(
                      "p-2 rounded hover:bg-[#1e293b] cursor-pointer group transition-colors",
                      currentChatId === chat.id ? "bg-[#1e293b]" : ""
                    )}
                  >
                    <div className="flex gap-2">
                      <MessageSquare className={cn(
                        "h-4 w-4 shrink-0",
                        currentChatId === chat.id ? "text-[#3b82f6]" : "text-[#64748b]"
                      )} />
                      
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-sm text-[#f3f4f6] truncate max-w-[120px]">
                              {chat.title}
                            </h3>
                            <span className="text-xs text-[#64748b]">
                              {formatDate(chat.timestamp)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-[#94a3b8] truncate max-w-[140px]">
                              {chat.lastMessage}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#64748b] hover:text-white hover:bg-[#334155]"
                              onClick={(e) => deleteChat(chat.id, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Footer */}
        <div className="flex-none p-3 border-t border-[#1e293b] flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white">
                <span className="font-semibold text-sm">U</span>
              </div>
              <div className="text-sm text-[#f3f4f6]">
                User
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 rounded-full bg-[#3b82f6] mx-auto flex items-center justify-center text-white">
              <span className="font-semibold text-sm">U</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 