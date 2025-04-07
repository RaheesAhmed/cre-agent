"use client";

import FilesList from '@/components/files-list';

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Files Management</h1>
        <p className="text-gray-400">
          View and manage all files uploaded to your OpenAI account.
        </p>
      </div>
      
      <FilesList />
    </div>
  );
} 