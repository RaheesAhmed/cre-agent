"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScriptGeneratorForm } from "@/components/script-generator-form";
import { ObjectionHandlerForm } from "@/components/objection-handler-form";
import { UvpCreatorForm } from "@/components/uvp-creator-form";
import { ScrollText, ShieldQuestion, Lightbulb, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolsPanelProps {
  threadId: string;
  onToolResult: (message: string, response: string) => void;
}

export function ToolsPanel({ threadId, onToolResult }: ToolsPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      <div className="p-4 border-b border-[#1e293b] flex items-center gap-2">
        <Wrench className="h-5 w-5 text-[#3b82f6]" />
        <h2 className="font-semibold text-lg text-[#f3f4f6]">CRE Tools</h2>
      </div>
      
      <div className="flex-1 border-0 rounded-none shadow-none overflow-hidden">
        <Tabs defaultValue="call-scripts" className="h-full flex flex-col">
          <TabsList className="w-full justify-start border-b border-[#1e293b] rounded-none bg-[#1f2937] p-0 h-12">
            <TabsTrigger 
              value="call-scripts"
              className={cn(
                "flex items-center rounded-none border-r border-[#1e293b] h-full",
                "data-[state=active]:bg-[#0f172a] data-[state=active]:border-b-2",
                "data-[state=active]:border-b-[#3b82f6] data-[state=active]:shadow-none",
                "text-[#94a3b8] hover:text-[#f3f4f6] data-[state=active]:text-[#f3f4f6]"
              )}
            >
              <ScrollText className="h-4 w-4 mr-2" />
              <span>Call Scripts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="objections"
              className={cn(
                "flex items-center rounded-none border-r border-[#1e293b] h-full",
                "data-[state=active]:bg-[#0f172a] data-[state=active]:border-b-2",
                "data-[state=active]:border-b-[#3b82f6] data-[state=active]:shadow-none",
                "text-[#94a3b8] hover:text-[#f3f4f6] data-[state=active]:text-[#f3f4f6]"
              )}
            >
              <ShieldQuestion className="h-4 w-4 mr-2" />
              <span>Objection Handler</span>
            </TabsTrigger>
            <TabsTrigger 
              value="uvp"
              className={cn(
                "flex items-center rounded-none h-full",
                "data-[state=active]:bg-[#0f172a] data-[state=active]:border-b-2",
                "data-[state=active]:border-b-[#3b82f6] data-[state=active]:shadow-none",
                "text-[#94a3b8] hover:text-[#f3f4f6] data-[state=active]:text-[#f3f4f6]"
              )}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              <span>UVP Creator</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="call-scripts" className="p-0 m-0 h-full">
              <ScriptGeneratorForm 
                threadId={threadId}
                onScriptGenerated={onToolResult}
              />
            </TabsContent>
            
            <TabsContent value="objections" className="p-0 m-0 h-full">
              <ObjectionHandlerForm
                threadId={threadId}
                onObjectionResponseGenerated={onToolResult}
              />
            </TabsContent>
            
            <TabsContent value="uvp" className="p-0 m-0 h-full">
              <UvpCreatorForm
                threadId={threadId}
                onUvpGenerated={onToolResult}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 