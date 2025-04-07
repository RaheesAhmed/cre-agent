import React from "react";
import { Bot, User, Copy, Check, Building } from "lucide-react";
import { formatMessageDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { format } from "date-fns";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agent?: string;
  isStreaming?: boolean;
}

// Custom code block component to avoid TypeScript errors with SyntaxHighlighter
const CodeBlock: Components['code'] = ({ className, children }) => {
  const language = className ? className.replace('language-', '') : '';
  
  return (
    <div className="rounded-md border my-2 overflow-hidden bg-[#1e293b] border-[#334155]">
      {language && (
        <div className="bg-[#1f2937] px-4 py-1 text-xs font-mono border-b border-[#334155] text-[#94a3b8]">
          {language}
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={cn("text-sm font-mono text-[#f3f4f6]", className)}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export function ChatMessage({ role, content, timestamp, agent, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const copyToClipboard = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser
            ? "bg-[#3b82f6] text-white"
            : "bg-[#1e40af]/20 text-[#3b82f6]"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Building className="h-4 w-4" />}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-[#f3f4f6]">
            {isUser ? "You" : "Reva AI"}
          </span>
          {agent && !isUser && (
            <span className="text-xs bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-full">
              {agent}
            </span>
          )}
          <span className="text-xs text-[#64748b]">
            {format(timestamp, "h:mm a")}
          </span>
        </div>

        <div className={cn(
          "p-4 rounded-lg rounded-tl-sm",
          isUser
            ? "bg-[#4f46e5] text-white"
            : "bg-[#1f2937] text-[#f3f4f6]"
        )}>
          {/* Agent badge if present */}
          {role === "assistant" && agent && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[#3b82f6]">
                {agent.charAt(0).toUpperCase() + agent.slice(1)} Agent
              </span>
              {isStreaming && (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                a: ({ node, ...props }) => (
                  <a 
                    {...props} 
                    className="text-[#60a5fa] hover:text-[#93c5fd] underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-4 last:mb-0" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-4 mb-4 last:mb-0" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal pl-4 mb-4 last:mb-0" />
                ),
                li: ({ node, ...props }) => (
                  <li {...props} className="mb-1 last:mb-0" />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto mb-4 last:mb-0">
                    <table {...props} className="w-full border-collapse" />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead {...props} className="bg-[#1e293b] text-[#f3f4f6]" />
                ),
                th: ({ node, ...props }) => (
                  <th {...props} className="border border-[#334155] px-4 py-2 text-left" />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} className="border border-[#334155] px-4 py-2" />
                ),
              }}
            >
              {content || (isStreaming ? "..." : "")}
            </ReactMarkdown>
          </div>
        </div>

        <div className="flex justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#64748b] hover:text-white hover:bg-[#1e293b]"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
} 