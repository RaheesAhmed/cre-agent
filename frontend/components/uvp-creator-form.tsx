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
import { Loader2, Lightbulb, Building, Users, MapPin, Star, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UvpCreatorFormProps {
  threadId: string;
  onUvpGenerated: (message: string, response: string) => void;
}

export function UvpCreatorForm({ threadId, onUvpGenerated }: UvpCreatorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyType, setPropertyType] = useState<string>("");
  const [market, setMarket] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [propertyFeatures, setPropertyFeatures] = useState<string>("");
  const [competitiveAdvantages, setCompetitiveAdvantages] = useState<string>("");
  const [marketTrends, setMarketTrends] = useState<string>("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!propertyType || !market || !targetAudience) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format the message for the agent
      const message = `Create a unique value proposition for a ${propertyType} property in ${market} targeted at ${targetAudience}. 
      ${propertyFeatures ? `Property features: ${propertyFeatures}` : ''} 
      ${competitiveAdvantages ? `Competitive advantages: ${competitiveAdvantages}` : ''}
      ${marketTrends ? `Market trends: ${marketTrends}` : ''}
      
      Please use the uvp_creator tool with these parameters.`;
      
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
      onUvpGenerated(message, responseContent);
      
      toast.success("Unique Value Proposition generated successfully");
    } catch (error) {
      console.error("Error generating UVP:", error);
      toast.error("Failed to generate UVP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6 h-full overflow-y-auto bg-[#0f172a]">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-[#3b82f6]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#f3f4f6]">Unique Value Proposition Creator</h2>
          <p className="text-sm text-[#94a3b8]">Generate compelling UVPs that highlight your property's competitive advantages</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <SelectItem value="Tenant">Tenant</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
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
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
            <Star className="h-3.5 w-3.5" />
            <span>Property Features</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </div>
          <Textarea 
            value={propertyFeatures} 
            onChange={(e) => setPropertyFeatures(e.target.value)}
            placeholder="Enter comma-separated list of key property features (e.g., prime corner location, recent renovations, flexible floor plan)"
            rows={2}
            disabled={isLoading}
            className="resize-none bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
            <Award className="h-3.5 w-3.5" />
            <span>Competitive Advantages</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </div>
          <Textarea 
            value={competitiveAdvantages} 
            onChange={(e) => setCompetitiveAdvantages(e.target.value)}
            placeholder="Enter comma-separated list of advantages over competing properties (e.g., higher traffic count, better parking ratio, superior amenities)"
            rows={2}
            disabled={isLoading}
            className="resize-none bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#f3f4f6]">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Market Trends</span>
            <span className="text-xs text-[#94a3b8] ml-1">(Optional)</span>
          </div>
          <Textarea 
            value={marketTrends} 
            onChange={(e) => setMarketTrends(e.target.value)}
            placeholder="Enter comma-separated list of relevant market trends supporting the opportunity (e.g., population growth, business relocation, infrastructure development)"
            rows={2}
            disabled={isLoading}
            className="resize-none bg-[#1e293b] border-[#334155] text-[#f3f4f6] focus:ring-[#3b82f6] focus:ring-offset-0"
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
              Generating UVP...
            </>
          ) : (
            "Generate Unique Value Proposition"
          )}
        </Button>
      </form>
    </div>
  );
} 