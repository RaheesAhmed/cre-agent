"""
API routes for managing general OpenAI Files (not specific to Vector Stores).
"""

from fastapi import APIRouter, HTTPException
from openai import OpenAIError

# Import implementations
# Adjust imports based on your actual file structure if needed
from vector_stores.list_all_files import list_all_files
from vector_stores.delete_file import delete_file as delete_openai_file

router = APIRouter()

@router.get("/")
async def list_all_files_endpoint():
    """
    Lists all files uploaded to your OpenAI account.
    """
    try:
        files_page = await list_all_files()
        # Extract relevant info if needed, e.g., file IDs and names
        return [{"id": f.id, "filename": f.filename, "purpose": f.purpose, "bytes": f.bytes} for f in files_page.data]
    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


@router.delete("/{file_id}", status_code=200)
async def delete_file_endpoint(file_id: str):
    """
    Deletes a file by its ID.
    """
    try:
        deleted_info = await delete_openai_file(file_id)
        if deleted_info and deleted_info.deleted:
            return {"message": f"File {file_id} deleted successfully."}
        else:
             raise HTTPException(status_code=404, detail=f"File {file_id} not found or could not be deleted.")
    except OpenAIError as e:
        if "No file found" in str(e): # Crude check
             raise HTTPException(status_code=404, detail=f"File {file_id} not found.")
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}") 