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
import { Loader2, ShieldQuestion, Info, Building, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ObjectionHandlerFormProps {
  threadId: string;
  onObjectionResponseGenerated: (message: string, response: string) => void;
}

export function ObjectionHandlerForm({ threadId, onObjectionResponseGenerated }: ObjectionHandlerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [objectionType, setObjectionType] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [market, setMarket] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [propertyDetails, setPropertyDetails] = useState<string>("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!objectionType || !propertyType || !market) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format the message for the agent
      const message = `Help me handle a "${objectionType}" objection for a ${propertyType} property in ${market}. 
      ${context ? `Context: ${context}` : ''} 
      ${propertyDetails ? `Property details: ${propertyDetails}` : ''}
      
      Please use the objection_handler tool with these parameters.`;
      
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
      onObjectionResponseGenerated(message, responseContent);
      
      toast.success("Objection handling response generated successfully");
    } catch (error) {
      console.error("Error generating objection response:", error);
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 h-full overflow-y-auto bg-[#0f172a]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
          <ShieldQuestion className="h-5 w-5 text-[#3b82f6]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#f3f4f6]">Objection Handler</h2>
          <p className="text-sm text-[#94a3b8]">Generate professional responses to common client objections</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-[#f3f4f6]">
              <span>Objection Type</span>
              <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={objectionType} 
              onValueChange={setObjectionType}
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0">
                <SelectValue placeholder="Select objection type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="price_too_high">Price is too high</SelectItem>
                <SelectItem value="location_concerns">Location concerns</SelectItem>
                <SelectItem value="better_deal_elsewhere">Better deal elsewhere</SelectItem>
                <SelectItem value="need_to_think_about_it">Need to think about it</SelectItem>
                <SelectItem value="not_interested">Not interested</SelectItem>
                <SelectItem value="no_budget">No budget</SelectItem>
                <SelectItem value="other">Other objection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-[#f3f4f6]">
              <Building className="h-3.5 w-3.5" />
              <span>Property Type</span>
              <span className="text-red-500">*</span>
            </Label>
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
          
          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-1.5 text-[#f3f4f6]">
              <MapPin className="h-3.5 w-3.5" />
              <span>Market/Location</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input 
              value={market} 
              onChange={(e) => setMarket(e.target.value)}
              placeholder="e.g., Atlanta, Buckhead"
              disabled={isLoading}
              className="h-11 bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0 placeholder:text-[#64748b]"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-[#f3f4f6]">
            <Info className="h-3.5 w-3.5" />
            <span>Context</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </Label>
          <Textarea 
            value={context} 
            onChange={(e) => setContext(e.target.value)}
            placeholder="Provide additional context about the situation, such as the stage of the sales process, prior interactions, etc."
            rows={3}
            disabled={isLoading}
            className="resize-none bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0 placeholder:text-[#64748b]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-[#f3f4f6]">
            <Building className="h-3.5 w-3.5" />
            <span>Property Details</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </Label>
          <Textarea 
            value={propertyDetails} 
            onChange={(e) => setPropertyDetails(e.target.value)}
            placeholder="Enter specific property details relevant to the objection"
            rows={3}
            disabled={isLoading}
            className="resize-none bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0 placeholder:text-[#64748b]"
          />
        </div>
        
        <Button 
          type="submit" 
          className={cn(
            "w-full h-11 text-base font-medium bg-[#3b82f6] hover:bg-[#2563eb] text-white",
            isLoading ? "opacity-90" : "hover:opacity-90"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Response...
            </>
          ) : (
            "Generate Objection Response"
          )}
        </Button>
      </form>
    </div>
  );
} 