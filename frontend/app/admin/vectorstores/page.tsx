"use client";

import VectorStoresList from '@/components/vector-stores-list';

export default function VectorStoresPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Vector Stores</h1>
        <p className="text-gray-400">
          Create and manage OpenAI vector stores for document storage and retrieval.
        </p>
      </div>
      
      <VectorStoresList />
    </div>
  );
} 