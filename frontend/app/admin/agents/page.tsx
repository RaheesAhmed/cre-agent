"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Bot, FileSpreadsheet, Globe, RefreshCw, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export default function AgentsPage() {
  const [agents, setAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Agent details mapping
  const agentDetails: Record<string, { name: string, description: string, icon: React.ReactNode, capabilities: string[] }> = {
    main: {
      name: "Main Triage Agent",
      description: "Routes queries to specialized agents based on the content and complexity of the request.",
      icon: <Bot className="h-5 w-5" />,
      capabilities: [
        "Handles simple queries directly",
        "Routes complex queries to specialized agents",
        "Maintains conversation context across agent handoffs",
        "Provides consistent user experience"
      ]
    },
    rag: {
      name: "Document Retrieval Agent",
      description: "Specializes in finding and extracting information from your document knowledge base.",
      icon: <Building className="h-5 w-5" />,
      capabilities: [
        "Retrieves relevant information from vector stores",
        "Answers questions based on your documents",
        "Provides citations to source materials",
        "Handles multiple document formats"
      ]
    },
    excel: {
      name: "Excel Data Analyst",
      description: "Analyzes data from Excel files to extract insights and answer data-driven questions.",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      capabilities: [
        "Reads and analyzes Excel files",
        "Extracts specific data from sheets",
        "Performs data summarization",
        "Creates insights from numerical data"
      ]
    },
    web: {
      name: "Web Research Agent",
      description: "Retrieves up-to-date information from the web about commercial real estate trends and data.",
      icon: <Globe className="h-5 w-5" />,
      capabilities: [
        "Performs web searches for recent information",
        "Finds market trends and economic indicators",
        "Retrieves property-specific information",
        "Provides cited sources from the web"
      ]
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const agentList = await apiClient.getAvailableAgents();
      setAgents(agentList);
      if (agentList.length > 0 && !selectedAgent) {
        setSelectedAgent(agentList[0]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // In a real application, you might have an API endpoint to refresh the agent
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated refresh delay
      toast.success("Agent refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh agent");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getAgentIcon = (agentId: string) => {
    return agentDetails[agentId]?.icon || <Bot className="h-5 w-5" />;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your AI assistant agents</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin">
              <RefreshCw className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Loading agents...</p>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              No Agents Available
            </CardTitle>
            <CardDescription>
              No AI agents were found. There might be an issue with the backend service.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={fetchAgents}>Retry</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Tabs defaultValue={selectedAgent || agents[0]} onValueChange={setSelectedAgent}>
            <TabsList className="grid grid-cols-4 mb-4">
              {agents.map(agent => (
                <TabsTrigger key={agent} value={agent} className="flex items-center gap-2">
                  {getAgentIcon(agent)}
                  <span className="capitalize">{agent}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {agents.map(agent => (
              <TabsContent key={agent} value={agent}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="flex items-center gap-2">
                            {getAgentIcon(agent)}
                            {agentDetails[agent]?.name || `${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent`}
                          </CardTitle>
                          <Badge variant="secondary" className="ml-2">Active</Badge>
                        </div>
                        <CardDescription className="mt-2">
                          {agentDetails[agent]?.description || `Specialized AI agent for ${agent} tasks.`}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                      >
                        {isRefreshing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Capabilities</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                          {agentDetails[agent]?.capabilities.map((capability, index) => (
                            <li key={index}>{capability}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Model</h3>
                        <p className="text-sm text-muted-foreground">GPT-4 Turbo (gpt-4-turbo-preview)</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Status</h3>
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                          <p className="text-sm">Operational</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
} 