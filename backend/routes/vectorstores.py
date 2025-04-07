from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Form
from openai import OpenAIError
import shutil
import os
import tempfile

# Import your existing async functions
# Adjust imports based on your actual file structure if needed
from vector_stores.create import create_vector_store, upload_file
from vector_stores.delete import delete_vector_store
from vector_stores.delete_file import delete_file as delete_openai_file
from vector_stores.list import list_vector_stores
from vector_stores.list_all_files import list_all_files
from vector_stores.search import search_vector_store

router = APIRouter()

# --- Vector Store Endpoints ---

@router.post("/", status_code=201)
async def create_vector_store_endpoint(name: str = Form(...)):
    """
    Creates a new vector store.
    """
    try:
        vector_store = await create_vector_store(name)
        return {"id": vector_store.id, "name": vector_store.name}
    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.get("/")
async def list_vector_stores_endpoint():
    """
    Lists all vector stores registered under the prefix.
    """
    try:
        stores = await list_vector_stores()
        return stores # list_vector_stores already formats it nicely
    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.delete("/{vector_store_id}", status_code=200)
async def delete_vector_store_endpoint(vector_store_id: str):
    """
    Deletes a vector store by its ID.
    """
    try:
        deleted_info = await delete_vector_store(vector_store_id)
        if deleted_info and deleted_info.deleted:
             return {"message": f"Vector store {vector_store_id} deleted successfully."}
        else:
            # Handle cases where deletion might 'succeed' according to the API but not actually delete
             raise HTTPException(status_code=404, detail=f"Vector store {vector_store_id} not found or could not be deleted.")
    except OpenAIError as e:
         # Check for specific error types if needed, e.g., 404 Not Found
        if "No vector store found" in str(e): # Crude check, refine if OpenAI client provides specific error codes/types
            raise HTTPException(status_code=404, detail=f"Vector store {vector_store_id} not found.")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@router.get("/{vector_store_id}/search")
async def search_vector_store_endpoint(vector_store_id: str, query: str = Query(...)):
    """
    Searches a specific vector store.
    """
    try:
        results = await search_vector_store(vector_store_id, query)
        # Process results if necessary, the client might return a complex object
        return results
    except OpenAIError as e:
        if "No vector store found" in str(e): # Crude check
             raise HTTPException(status_code=404, detail=f"Vector store {vector_store_id} not found.")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


# --- File Upload to Vector Store Endpoint (Remains here) ---

@router.post("/{vector_store_id}/files/", status_code=201)
async def upload_file_to_vector_store_endpoint(vector_store_id: str, file: UploadFile = File(...)):
    """
    Uploads a file to a specific vector store.
    """
    try:
        # Get the file content
        contents = await file.read()
        
        # Create a file with the original filename in a controlled directory
        upload_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        # Use the original filename but make it safe for the filesystem
        safe_filename = file.filename.replace(" ", "_").replace("/", "_").replace("\\", "_")
        file_path = os.path.join(upload_dir, safe_filename)
        
        # Write the file content
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Now upload the file
        try:
            await upload_file(vector_store_id, file_path)
            return {"message": f"File '{file.filename}' uploaded successfully to vector store {vector_store_id}."}
        finally:
            # Clean up the file after upload to OpenAI
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    # Log but don't fail if cleanup fails
                    print(f"Warning: Could not remove temporary file {file_path}: {e}")

    except OpenAIError as e:
        if "No vector store found" in str(e):
            raise HTTPException(status_code=404, detail=f"Vector store {vector_store_id} not found.")
        raise HTTPException(status_code=500, detail=f"OpenAI API error during file upload: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during file upload: {str(e)}")
    finally:
        # Close the file explicitly to release resources
        await file.close()
