"use client";

import VectorStoresList from '@/components/vector-stores-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, MessageSquare, Building, Bot } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-400">
          Manage your vector stores, files, and knowledge base for the CRE Research Agent.
        </p>
      </div>
      
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/vectorstores">
          <Card className="bg-[#1f2937] border-[#374151] hover:border-[#3b82f6] transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <Database className="h-8 w-8 text-[#3b82f6] mb-2" />
              <CardTitle className="text-white">Vector Stores</CardTitle>
              <CardDescription className="text-gray-400">
                Manage OpenAI vector stores
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/admin/files">
          <Card className="bg-[#1f2937] border-[#374151] hover:border-[#3b82f6] transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 text-[#3b82f6] mb-2" />
              <CardTitle className="text-white">Files</CardTitle>
              <CardDescription className="text-gray-400">
                View and manage uploaded files
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/admin/agents">
          <Card className="bg-[#1f2937] border-[#374151] hover:border-[#3b82f6] transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <Bot className="h-8 w-8 text-[#3b82f6] mb-2" />
              <CardTitle className="text-white">Agents</CardTitle>
              <CardDescription className="text-gray-400">
                Manage AI agents and capabilities
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/admin/prompts">
          <Card className="bg-[#1f2937] border-[#374151] hover:border-[#3b82f6] transition-colors cursor-pointer h-full">
            <CardHeader className="pb-2">
              <MessageSquare className="h-8 w-8 text-[#3b82f6] mb-2" />
              <CardTitle className="text-white">Prompts</CardTitle>
              <CardDescription className="text-gray-400">
                Manage agent prompts and templates
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
      
      {/* Vector Stores List */}
      <VectorStoresList />
      
      {/* System Status Card */}
      <Card className="bg-[#1f2937] border-[#374151]">
        <CardHeader className="border-b border-[#374151]">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-[#3b82f6]" />
            <CardTitle className="text-white">System Status</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Current status of the CRE Research Agent system
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-white">OpenAI API</span>
              </div>
              <p className="text-sm text-gray-400">Connected and operational</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-white">Vector Database</span>
              </div>
              <p className="text-sm text-gray-400">Connected and operational</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-white">AI Agents System</span>
              </div>
              <p className="text-sm text-gray-400">4 agents operational</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-white">Backend API</span>
              </div>
              <p className="text-sm text-gray-400">Running v1.0.0</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-white">Frontend App</span>
              </div>
              <p className="text-sm text-gray-400">Running v1.0.0</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-white">Excel File System</span>
              </div>
              <p className="text-sm text-gray-400">Indexing enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}