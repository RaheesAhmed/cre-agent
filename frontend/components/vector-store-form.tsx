"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function VectorStoreForm() {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name for the vector store');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/vector-stores/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Failed to create vector store: ${response.statusText}`);
      }
      
      const result = await response.json();
      toast.success('Vector store created successfully!', {
        description: `Vector store "${name}" has been created.`,
      });
      
      // Redirect back to the vector stores list
      router.push('/admin');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to create vector store', {
        description: err.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-[#1f2937] border-[#374151] max-w-lg mx-auto">
        <CardHeader className="space-y-1 border-b border-[#374151]">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-[#3b82f6]" />
            <CardTitle className="text-white">Create Vector Store</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Create a new vector store for document storage and retrieval.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-red-900/20 text-red-400 border-red-800/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Vector Store Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your vector store"
              required
              className="bg-[#0f172a] border-[#374151] text-white"
            />
            <p className="text-xs text-gray-400">
              Choose a descriptive name to easily identify the purpose of this vector store.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="border-t border-[#374151] pt-4 flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="bg-[#1f2937] hover:bg-[#374151] text-white border-[#374151]"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            disabled={isCreating || !name.trim()}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          >
            {isCreating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Create Vector Store'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
} 