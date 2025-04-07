import asyncio
from typing import List, Dict, Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()

async def list_vector_stores() -> List[Dict[str, str]]:
    """
    List all available vector stores.
    
    Returns:
        List of dictionaries containing vector store information with 'id' and 'name' keys
    """
    try:
        vector_stores = client.vector_stores.list()
        stores = [{"id": store.id, "name": store.name} for store in vector_stores.data]
        return stores
    except Exception as e:
        print(f"Error listing vector stores: {str(e)}")
        return []

async def get_vector_store_ids() -> List[str]:
    """
    Get just the IDs of all available vector stores.
    
    Returns:
        List of vector store IDs
    """
    stores = await list_vector_stores()
    return [store["id"] for store in stores]

# For testing
# if __name__ == "__main__":
#     async def test():
#         stores = await list_vector_stores()
#         print("Available Vector Stores:")
#         for store in stores:
#             print(f"- {store['name']} (ID: {store['id']}")
        
#         ids = await get_vector_store_ids()
#         print("\nVector Store IDs:", ids)
    
#     asyncio.run(test())
