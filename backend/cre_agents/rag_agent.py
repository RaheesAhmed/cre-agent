"""
RAG (Retrieval Augmented Generation) Agent for the CRE Research system.
This agent specializes in retrieving information from vector stores and providing 
accurate information from embedded documents.
"""

import requests
from agents import Agent, function_tool

# Define environment-specific configurations
API_BASE_URL = "http://localhost:8000/api/v1"

# Create tools for the RAG agent
@function_tool
def list_vector_stores() -> str:
    """List all available vector stores in the system."""
    try:
        response = requests.get(f"{API_BASE_URL}/vector-stores/")
        if response.status_code == 200:
            stores = response.json()
            result = ["Available vector stores:"]
            for store in stores:
                result.append(f"- {store['name']} (ID: {store['id']})")
            return "\n".join(result)
        else:
            return f"Error listing vector stores: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to vector store API: {str(e)}"

@function_tool
def search_vector_store(vector_store_id: str, query: str) -> str:
    """Search for information in a specific vector store."""
    try:
        response = requests.get(
            f"{API_BASE_URL}/vector-stores/{vector_store_id}/search", 
            params={"query": query}
        )
        
        if response.status_code == 200:
            results = response.json()
            
            if not results or len(results) == 0:
                return f"No results found for query '{query}' in vector store {vector_store_id}."
            
            formatted_results = []
            formatted_results.append(f"Search results for '{query}' in vector store {vector_store_id}:")
            
            for i, result in enumerate(results, 1):
                score = result.get("score", 0)
                text = result.get("text", "").strip()
                metadata = result.get("metadata", {})
                
                source = metadata.get("source", "Unknown source")
                page = metadata.get("page", "")
                page_info = f" (Page {page})" if page else ""
                
                formatted_results.append(f"\n--- Result {i} (Relevance: {score:.2f}) ---")
                formatted_results.append(f"Source: {source}{page_info}")
                formatted_results.append(f"\n{text}\n")
            
            return "\n".join(formatted_results)
        else:
            return f"Error searching vector store: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to vector store API: {str(e)}"

@function_tool
def list_files_in_store(vector_store_id: str) -> str:
    """List all files embedded in a specific vector store."""
    try:
        response = requests.get(f"{API_BASE_URL}/vector-stores/{vector_store_id}/files")
        
        if response.status_code == 200:
            files = response.json()
            if not files or len(files) == 0:
                return f"No files found in vector store {vector_store_id}."
            
            result = [f"Files in vector store {vector_store_id}:"]
            for file in files:
                filename = file.get("filename", "Unknown")
                file_id = file.get("id", "Unknown ID")
                file_type = file.get("type", "Unknown type")
                result.append(f"- {filename} (ID: {file_id}, Type: {file_type})")
            
            return "\n".join(result)
        else:
            return f"Error listing files: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error connecting to vector store API: {str(e)}"

# Create the RAG Agent
rag_agent = Agent(
    name="Document Retrieval Specialist",
    instructions="""You are a Commercial Real Estate (CRE) Document Retrieval Specialist. You help users find and analyze information from our knowledge base of CRE documents.

I specialize in retrieving accurate information from our knowledge base of Commercial Real Estate (CRE) documents. I can:

1. Search through vector stores for relevant information
2. Find specific facts, data points, and insights from embedded documents
3. Provide cited information with sources
4. Synthesize information from multiple sources into coherent answers

When retrieving information, I will:
- Always cite my sources with the specific document name
- Provide direct quotes when appropriate
- Synthesize information accurately without adding speculation
- Clearly indicate when information might be outdated
- Be transparent about the confidence level of my information""",
    tools=[list_vector_stores, search_vector_store, list_files_in_store],
) 