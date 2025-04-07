"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Database, FileUp, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function VectorStoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  
  const [store, setStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchVectorStore();
  }, [storeId]);
  
  const fetchVectorStore = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/vector-stores/${storeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch vector store: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStore(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Error loading vector store", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    // Upload each file individually as the backend endpoint accepts one file at a time
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      // The backend doesn't expect vector_store_id in form data as it's in the URL
      formData.append('file', file);
      
      try {
        // Use the correct endpoint URL structure
        const response = await fetch(`${API_BASE_URL}/api/v1/vector-stores/${storeId}/files/`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: response.statusText }));
          throw new Error(errorData.detail || `Upload failed: ${response.statusText}`);
        }
        
        successCount++;
        // Update progress based on processed files
        setUploadProgress(Math.round((i + 1) / files.length * 100));
        
      } catch (err: any) {
        console.error(`Error uploading file ${file.name}:`, err);
        errorCount++;
        setError(err.message);
      }
    }
    
    // Show appropriate toast based on results
    if (successCount > 0) {
      toast.success("Files uploaded successfully!", {
        description: `${successCount} file(s) uploaded to ${store?.name || "vector store"}.`,
      });
    }
    
    if (errorCount > 0) {
      const errorMessage = `Failed to upload ${errorCount} file(s)`;
      toast.error("Upload incomplete", { description: errorMessage });
    }
    
    // Reset file input
    e.target.value = '';
    setIsUploading(false);
    
    // Set upload progress to 100% briefly before resetting
    setUploadProgress(100);
    setTimeout(() => {
      setUploadProgress(0);
    }, 1000);
  };
  
  const triggerFileInput = () => {
    document.getElementById('file-upload')?.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/vectorstores">
            <Button variant="outline" size="icon" className="bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151]">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isLoading ? 'Loading...' : store?.name || 'Vector Store'}
          </h1>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchVectorStore}
          className="bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151] flex items-center gap-1"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
      
      <p className="text-gray-400">
        Upload files to this vector store for embedding and document search.
      </p>
      
      {error && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-800/30">
          <div className="flex items-start">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error</h3>
              <div className="mt-2 text-sm text-red-400">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Card className="bg-[#1f2937] border-[#374151]">
        <CardHeader className="space-y-1 border-b border-[#374151]">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-[#3b82f6]" />
            <CardTitle className="text-white">Upload Files</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Select files to upload to this vector store. Supported formats: PDF, TXT, CSV, JSON, DOCX.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div 
            className="border-2 border-dashed border-[#374151] rounded-lg p-12 text-center hover:border-[#3b82f6] transition-colors cursor-pointer"
            onClick={triggerFileInput}
          >
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            
            <div className="flex flex-col items-center justify-center gap-2">
              {isUploading ? (
                <>
                  <div className="h-12 w-12 rounded-full border-2 border-[#3b82f6] border-t-transparent animate-spin"></div>
                  <h3 className="mt-2 text-lg font-semibold text-white">Uploading...</h3>
                  <p className="text-sm text-gray-400">Please wait while your files are being processed.</p>
                </>
              ) : (
                <>
                  <FileUp className="h-12 w-12 text-gray-500" />
                  <h3 className="mt-2 text-lg font-semibold text-white">Drop files or click to upload</h3>
                  <p className="text-sm text-gray-400">
                    Drag and drop files here or click to browse your device
                  </p>
                </>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="mt-4">
              <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#3b82f6] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-[#374151] pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151]"
          >
            Back to Vector Stores
          </Button>
          
          <Button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Upload Files
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 