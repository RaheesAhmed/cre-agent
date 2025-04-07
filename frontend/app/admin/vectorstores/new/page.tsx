"use client";

import VectorStoreForm from '@/components/vector-store-form';

export default function CreateVectorStorePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Create Vector Store</h1>
        <p className="text-gray-400">
          Create a new OpenAI vector store for embedding and retrieving documents.
        </p>
      </div>
      
      <VectorStoreForm />
    </div>
  );
} 