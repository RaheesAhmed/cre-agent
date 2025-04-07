from dotenv import load_dotenv
from openai import OpenAI
import asyncio
from typing import List, Dict, Any, Optional

load_dotenv()

client = OpenAI()

class SearchResult:
    def __init__(self, text: str, metadata: Dict[str, Any], score: float):
        self.text = text
        self.metadata = metadata
        self.score = score

async def search_vector_store(vector_store_id: str, query: str, max_results: int = 5) -> List[SearchResult]:
    """
    Search a vector store and return structured results.
    
    Args:
        vector_store_id: ID of the vector store to search
        query: Search query
        max_results: Maximum number of results to return
        
    Returns:
        List of SearchResult objects containing text, metadata, and relevance scores
    """
    try:
        results = client.vector_stores.search(
            vector_store_id=vector_store_id,
            query=query,
            max_results=max_results
        )
        
        structured_results = []
        for result in results:
            structured_results.append(SearchResult(
                text=result.text,
                metadata=result.metadata,
                score=result.score
            ))
            
        return structured_results
    except Exception as e:
        print(f"Error searching vector store {vector_store_id}: {str(e)}")
        return []

async def search_multiple_stores(store_ids: List[str], query: str, max_results_per_store: int = 3) -> Dict[str, List[SearchResult]]:
    """
    Search multiple vector stores in parallel and return combined results.
    
    Args:
        store_ids: List of vector store IDs to search
        query: Search query
        max_results_per_store: Maximum results to return per store
        
    Returns:
        Dictionary mapping store IDs to their search results
    """
    tasks = [
        search_vector_store(store_id, query, max_results_per_store)
        for store_id in store_ids
    ]
    
    results = await asyncio.gather(*tasks)
    return dict(zip(store_ids, results))

def format_search_results(results: Dict[str, List[SearchResult]], query: str) -> str:
    """Format search results into a readable string."""
    output = [f"Search results for '{query}':"]
    
    for store_id, store_results in results.items():
        if not store_results:
            continue
            
        output.append(f"\nResults from store {store_id}:")
        for i, result in enumerate(store_results, 1):
            source = result.metadata.get("source", "Unknown source")
            page = result.metadata.get("page", "")
            page_info = f" (Page {page})" if page else ""
            
            output.append(f"\n--- Result {i} (Relevance: {result.score:.2f}) ---")
            output.append(f"Source: {source}{page_info}")
            output.append(f"\n{result.text.strip()}\n")
    
    return "\n".join(output) if len(output) > 1 else "No results found."

