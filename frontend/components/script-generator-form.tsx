"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { Loader2, ClipboardCopy, CheckCircle, ScrollText, Building, Users, MapPin, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ScriptGeneratorFormProps {
  threadId: string;
  onScriptGenerated: (message: string, response: string) => void;
}

export function ScriptGeneratorForm({ threadId, onScriptGenerated }: ScriptGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptType, setScriptType] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [market, setMarket] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [propertyDetails, setPropertyDetails] = useState<string>("");
  const [keySellingPoints, setKeySellingPoints] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!scriptType || !propertyType || !targetAudience || !market || !goal) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format the message for the agent
      const message = `Generate a ${scriptType} call script for a ${propertyType} property in ${market} targeted at ${targetAudience} with the goal to ${goal.replace('_', ' ')}. 
      ${propertyDetails ? `Property details: ${propertyDetails}` : ''} 
      ${keySellingPoints ? `Key selling points: ${keySellingPoints}` : ''}
      
      Please use the call_script_generator tool with these parameters.`;
      
      // Send to the API
      const response = await apiClient.sendMessage(message, threadId);
      
      // Extract the content
      let responseContent: string;
      if (typeof response.response === 'string') {
        responseContent = response.response;
      } else {
        responseContent = response.response.content;
      }
      
      // Pass the data back to the parent component
      onScriptGenerated(message, responseContent);
      
      toast.success("Call script generated successfully");
    } catch (error) {
      console.error("Error generating call script:", error);
      toast.error("Failed to generate call script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="p-6 h-full overflow-y-auto bg-[#0f172a]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
          <ScrollText className="h-5 w-5 text-[#3b82f6]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#f3f4f6]">Call Script Generator</h2>
          <p className="text-sm text-[#94a3b8]">Create professional call scripts for different property types and audiences</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
              <ScrollText className="h-3.5 w-3.5" />
              <span>Script Type</span>
              <span className="text-red-500">*</span>
            </div>
            <Select 
              value={scriptType} 
              onValueChange={setScriptType}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0">
                <SelectValue placeholder="Select script type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="cold_call">Cold Call</SelectItem>
                <SelectItem value="follow_up">Follow Up</SelectItem>
                <SelectItem value="property_pitch">Property Pitch</SelectItem>
                <SelectItem value="objection_handling">Objection Handling</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
              <Building className="h-3.5 w-3.5" />
              <span>Property Type</span>
              <span className="text-red-500">*</span>
            </div>
            <Select 
              value={propertyType} 
              onValueChange={setPropertyType}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Office">Office</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Multifamily">Multifamily</SelectItem>
                <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
              <Users className="h-3.5 w-3.5" />
              <span>Target Audience</span>
              <span className="text-red-500">*</span>
            </div>
            <Select 
              value={targetAudience} 
              onValueChange={setTargetAudience}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0">
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="Investor">Investor</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Tenant">Tenant</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Broker">Broker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
              <MapPin className="h-3.5 w-3.5" />
              <span>Market/Location</span>
              <span className="text-red-500">*</span>
            </div>
            <Input 
              value={market} 
              onChange={(e) => setMarket(e.target.value)}
              placeholder="e.g., Atlanta, Buckhead"
              disabled={isLoading}
              className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
              <Target className="h-3.5 w-3.5" />
              <span>Call Goal</span>
              <span className="text-red-500">*</span>
            </div>
            <Select 
              value={goal} 
              onValueChange={setGoal}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0">
                <SelectValue placeholder="Select call goal" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="schedule_meeting">Schedule Meeting</SelectItem>
                <SelectItem value="property_showing">Property Showing</SelectItem>
                <SelectItem value="send_information">Send Information</SelectItem>
                <SelectItem value="qualify_lead">Qualify Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
            <Building className="h-3.5 w-3.5" />
            <span>Property Details</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </div>
          <Textarea 
            value={propertyDetails} 
            onChange={(e) => setPropertyDetails(e.target.value)}
            placeholder="Enter specific details about the property (location, size, price, etc.)"
            rows={3}
            disabled={isLoading}
            className="resize-none bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Key Selling Points</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </div>
          <Textarea 
            value={keySellingPoints} 
            onChange={(e) => setKeySellingPoints(e.target.value)}
            placeholder="Enter comma-separated selling points (e.g., prime location, high traffic count, recent renovations)"
            rows={3}
            disabled={isLoading}
            className="resize-none bg-background border-input focus:ring-primary"
          />
        </div>
        
        <Button 
          type="submit" 
          className={cn(
            "w-full h-11 text-base font-medium shadow-sm",
            isLoading ? "opacity-90" : "hover:opacity-90"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Script...
            </>
          ) : (
            "Generate Call Script"
          )}
        </Button>
      </form>
    </div>
  );
} 