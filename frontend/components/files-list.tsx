"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FileText, Trash2, RefreshCw, Copy, FileArchive, FileImage, FileCode, FileSpreadsheet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize, getFileIcon } from '@/lib/utils';

interface OpenAIFile {
  id: string;
  filename: string;
  purpose: string;
  bytes: number;
  created_at?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function FilesList() {
  const [files, setFiles] = useState<OpenAIFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch Files
  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/files/`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Failed to fetch files: ${response.statusText}`);
      }
      const data: OpenAIFile[] = await response.json();
      setFiles(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error fetching files", { description: err.message });
      setFiles([]); // Clear files on error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle File Deletion
  const handleDeleteFile = async (fileId: string, filename: string) => {
    const confirmed = confirm(`Are you sure you want to delete file "${filename}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(fileId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Failed to delete file: ${response.statusText}` }));
        throw new Error(errorData.detail || `Failed to delete file: ${response.statusText}`);
      }

      toast.success("File deleted successfully!", { description: `File "${filename}" has been deleted.` });
      // Refresh file list
      fetchFiles();
    } catch (err: any) {
      setError(err.message);
      toast.error("Deletion failed", { description: err.message });
    } finally {
      setIsDeleting(null);
    }
  };

  // Copy file ID to clipboard
  const copyFileId = (fileId: string) => {
    navigator.clipboard.writeText(fileId);
    toast.success("File ID copied to clipboard");
  };

  // Load files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Format timestamp
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Get file icon based on filename
  const getFileIconComponent = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-[#e11d48]" />;
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return <FileArchive className="h-4 w-4 text-[#6366f1]" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <FileImage className="h-4 w-4 text-[#10b981]" />;
      case 'json':
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-4 w-4 text-[#f59e0b]" />;
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
      case 'cpp':
      case 'html':
      case 'css':
        return <FileCode className="h-4 w-4 text-[#8b5cf6]" />;
      default:
        return <FileText className="h-4 w-4 text-[#3b82f6]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#3b82f6]" />
          Files
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchFiles}
          className="bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151] flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-800/30">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error loading files</h3>
              <div className="mt-2 text-sm text-red-400">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fetchFiles}
                  className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-800/30"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-[#1f2937] border-[#374151]">
        <CardHeader className="border-b border-[#374151]">
          <CardTitle className="text-white">Uploaded Files</CardTitle>
          <CardDescription className="text-gray-400">
            All files uploaded to your OpenAI account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
            </div>
          ) : files.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#0f172a]">
                  <TableRow className="border-[#374151]">
                    <TableHead className="text-gray-300">Filename</TableHead>
                    <TableHead className="text-gray-300">Purpose</TableHead>
                    <TableHead className="text-gray-300">Size</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="border-[#374151] hover:bg-[#0f172a]">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          {getFileIconComponent(file.filename)}
                          <span className="truncate max-w-[150px] md:max-w-[250px]">{file.filename}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{file.purpose}</TableCell>
                      <TableCell className="text-gray-300">{(file.bytes / 1024).toFixed(2)} KB</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{formatDate(file.created_at)}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[50px] md:max-w-[120px] font-mono text-xs">{file.id}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyFileId(file.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-[#3b82f6] hover:bg-[#3b82f6]/10"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id, file.filename)}
                          disabled={isDeleting === file.id}
                          className="bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-800/30"
                        >
                          {isDeleting === file.id ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
              <FileText className="h-12 w-12 text-gray-500" />
              <div>
                <h3 className="text-lg font-medium text-white">No files found</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Upload files to a vector store to see them listed here.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 