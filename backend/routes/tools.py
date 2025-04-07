from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json

from tools.read_xlsx_files import (
    get_excel_files_info,
    search_excel_files,
    read_excel_sheet,
    get_excel_file_preview,
    refresh_excel_index
)

router = APIRouter()

class ExcelSearchRequest(BaseModel):
    query: str

class ExcelReadRequest(BaseModel):
    filename: str
    sheet_name: str
    max_rows: Optional[int] = 100

@router.get("/excel/files")
async def list_excel_files() -> Dict[str, Any]:
    """Get information about all Excel files in the system"""
    try:
        files_info = get_excel_files_info()
        files_data = json.loads(files_info)
        
        # Remove _changes key if it exists as it's internal
        if "_changes" in files_data:
            del files_data["_changes"]
            
        return {"files": files_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/excel/search")
async def search_in_excel(request: ExcelSearchRequest) -> Dict[str, Any]:
    """Search for a term across all Excel files"""
    try:
        results = search_excel_files(request.query)
        return {"results": json.loads(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/excel/read")
async def read_excel_data(request: ExcelReadRequest) -> Dict[str, Any]:
    """Read data from a specific Excel sheet"""
    try:
        # Cap max rows at a reasonable value
        max_rows = min(request.max_rows or 100, 500)
        data = read_excel_sheet(request.filename, request.sheet_name, max_rows)
        return {"data": json.loads(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/excel/preview/{filename}")
async def get_excel_preview(filename: str) -> Dict[str, Any]:
    """Get a preview of all sheets in an Excel file"""
    try:
        preview = get_excel_file_preview(filename)
        return {"preview": json.loads(preview)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/excel/refresh")
async def refresh_excel_files() -> Dict[str, Any]:
    """Manually refresh the Excel file index"""
    try:
        result = refresh_excel_index()
        return {"changes": json.loads(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 