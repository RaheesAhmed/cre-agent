"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Database, FileUp, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FileUpload from './file-upload';

interface VectorStore {
  id: string;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function VectorStoresList() {
  const [vectorStores, setVectorStores] = useState<VectorStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedStore, setExpandedStore] = useState<string | null>(null);
  const router = useRouter();

  // Fetch Vector Stores
  const fetchVectorStores = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/vector-stores/`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Failed to fetch vector stores: ${response.statusText}`);
      }
      const data = await response.json();
      const stores = Array.isArray(data) ? data : (data.data || []);
      setVectorStores(stores);
    } catch (err: any) {
      setError(err.message);
      toast.error("Error fetching vector stores", { description: err.message });
      setVectorStores([]); // Clear stores on error
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Vector Store
  const handleDelete = async (storeId: string, storeName: string) => {
    const confirmed = confirm(`Are you sure you want to delete vector store "${storeName}"? This action cannot be undone and will delete all associated files.`);
    if (!confirmed) return;

    setIsDeleting(storeId);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/vector-stores/${storeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Failed to delete vector store: ${response.statusText}`);
      }

      toast.success("Vector store deleted", { description: `Vector store "${storeName}" has been deleted.` });
      fetchVectorStores(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to delete vector store", { description: err.message });
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Toggle expanded store
  const toggleExpandStore = (storeId: string) => {
    if (expandedStore === storeId) {
      setExpandedStore(null);
    } else {
      setExpandedStore(storeId);
    }
  };
  
  // Handle file upload success
  const handleUploadSuccess = () => {
    // Refresh the vector stores list
    fetchVectorStores();
  };

  // Load vector stores on component mount
  useEffect(() => {
    fetchVectorStores();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-[#3b82f6]" />
          Vector Stores
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchVectorStores}
            className="bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151] flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Link href="/admin/vectorstores/new">
            <Button 
              size="sm"
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Store</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-900/20 p-4 border border-red-800/30">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error loading vector stores</h3>
              <div className="mt-2 text-sm text-red-400">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fetchVectorStores}
                  className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border-red-800/30"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
        </div>
      ) : vectorStores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vectorStores.map((store) => (
            <Card key={store.id} className="bg-[#1f2937] border-[#374151] overflow-hidden">
              <CardHeader className="space-y-1 border-b border-[#374151]">
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="truncate">{store.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(store.id, store.name)}
                    disabled={isDeleting === store.id}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                  >
                    {isDeleting === store.id ? (
                      <div className="animate-spin h-5 w-5 border-2 border-current rounded-full border-t-transparent"></div>
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </Button>
                </CardTitle>
                <CardDescription className="text-gray-400 truncate">ID: {store.id}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-300 mb-2">
                  Store for vector embeddings and document search.
                </p>
                <div className="text-xs text-gray-400 flex items-center mt-2">
                  <Database className="h-3 w-3 mr-1" />
                  <span>OpenAI Vector Store</span>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#374151] p-4 flex-col">
                <Button 
                  className="w-full bg-[#1e293b] hover:bg-[#2d3a4f] text-white border border-[#374151] flex items-center justify-center gap-2"
                  variant="outline"
                  onClick={() => toggleExpandStore(store.id)}
                >
                  <FileUp className="h-4 w-4" />
                  {expandedStore === store.id ? (
                    <>
                      Hide Upload <ChevronUp className="h-3 w-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Upload Files <ChevronDown className="h-3 w-3 ml-1" />
                    </>
                  )}
                </Button>
                
                {expandedStore === store.id && (
                  <div className="mt-4 w-full">
                    <FileUpload 
                      vectorStoreId={store.id}
                      onSuccess={handleUploadSuccess}
                      onError={(error) => toast.error("Upload failed", { description: error })}
                    />
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#374151] p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">No vector stores found</h3>
          <p className="mt-2 text-sm text-gray-400">Get started by creating a new vector store.</p>
          <div className="mt-6">
            <Link href="/admin/vectorstores/new">
              <Button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Vector Store
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 