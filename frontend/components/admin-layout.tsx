"use client";

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, Database, FileText, Folder, FolderPlus, Home, MessageSquare, Plus, Settings } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminLayoutProps {
  children: ReactNode;
}

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <Home size={20} />,
      active: pathname === "/admin",
    },
    {
      title: "Vector Stores",
      href: "/admin/vectorstores",
      icon: <Database size={20} />,
      active: pathname === "/admin/vectorstores" || pathname === "/admin",
    },
    {
      title: "Files",
      href: "/admin/files",
      icon: <FileText size={20} />,
      active: pathname === "/admin/files",
    },
    {
      title: "Knowledge Base",
      href: "/admin/knowledge",
      icon: <Folder size={20} />,
      active: pathname === "/admin/knowledge",
    },
    {
      title: "Prompts",
      href: "/admin/prompts",
      icon: <MessageSquare size={20} />,
      active: pathname === "/admin/prompts",
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
      active: pathname === "/admin/settings",
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f3f4f6] flex">
      {/* Sidebar */}
      <div className={cn(
        "border-r border-[#1e293b] bg-[#0f172a] flex flex-col transition-all duration-300 h-screen sticky top-0",
        expanded ? "w-64" : "w-16"
      )}>
        {/* Logo */}
        <div className="border-b border-[#1e293b] p-4 flex items-center justify-between">
          {expanded ? (
            <Link href="/admin" className="flex items-center gap-2 text-[#3b82f6] font-semibold text-lg">
              <Building size={24} />
              <span>reva.ai Admin</span>
            </Link>
          ) : (
            <div className="w-full flex justify-center">
              <Building size={24} className="text-[#3b82f6]" />
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar} 
            className="p-1 text-[#64748b] hover:text-white hover:bg-[#1e293b]"
          >
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </Button>
        </div>
        
        {/* Nav Items */}
        <div className="p-2 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                          item.active 
                            ? "bg-[#1e40af]/20 text-[#3b82f6] font-medium" 
                            : "text-[#94a3b8] hover:text-white hover:bg-[#1e293b]"
                        )}
                      >
                        <div className="mr-3">{item.icon}</div>
                        {expanded && <span>{item.title}</span>}
                      </div>
                    </TooltipTrigger>
                    {!expanded && <TooltipContent side="right">{item.title}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Create New */}
        <div className="p-3 border-t border-[#1e293b]">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  href="/admin/vectorstores/new" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[#3b82f6] hover:bg-[#2563eb] text-white w-full",
                    !expanded && "justify-center px-0"
                  )}
                >
                  <Plus size={18} />
                  {expanded && <span>Create Vector Store</span>}
                </Link>
              </TooltipTrigger>
              {!expanded && <TooltipContent side="right">Create Vector Store</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* User */}
        <div className="p-4 border-t border-[#1e293b] flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1e40af]/20 flex items-center justify-center text-[#3b82f6]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-[#64748b] truncate">admin@reva.ai</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="border-b border-[#1e293b] py-3 px-4 flex justify-between items-center bg-[#0f172a] shadow-sm">
          <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
          
          
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-[#1e293b] py-4 px-6 text-center text-sm text-[#64748b]">
          <p>© {new Date().getFullYear()} reva.ai CRE Research Agent • All rights reserved</p>
        </footer>
      </div>
    </div>
  );
} 