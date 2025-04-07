import os
import pandas as pd
import json
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass
import glob
import time
import hashlib
import traceback
from datetime import datetime
import numpy as np

# Base directory where Excel files are stored
XLSX_FILES_DIR = os.path.join(os.getcwd(), "uploads", "xlsx_files")
# Path for the Excel index JSON file
INDEX_FILE_PATH = os.path.join(os.getcwd(), "uploads", "excel_index.json")

# Custom JSON encoder to handle pandas Timestamp and other non-serializable types
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # Handle pandas Timestamp
        if isinstance(obj, pd.Timestamp):
            return obj.isoformat()
        # Handle numpy int/float types
        elif hasattr(obj, 'item'):
            return obj.item()
        # Handle other non-serializable types
        elif hasattr(obj, '__str__'):
            return str(obj)
        # Let the parent class handle the rest
        return super().default(obj)

@dataclass
class ExcelFileInfo:
    """Information about an Excel file and its contents"""
    filename: str
    filepath: str
    sheets: List[str]
    row_count: Dict[str, int]
    column_names: Dict[str, List[str]]
    preview: Dict[str, List[Dict[str, Any]]]
    modified_time: float
    file_hash: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "filename": self.filename,
            "filepath": self.filepath,
            "sheets": self.sheets,
            "row_count": self.row_count,
            "column_names": self.column_names,
            "preview": self.preview,
            "modified_time": self.modified_time,
            "file_hash": self.file_hash
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ExcelFileInfo':
        """Create ExcelFileInfo from dictionary"""
        return cls(
            filename=data["filename"],
            filepath=data["filepath"],
            sheets=data["sheets"],
            row_count=data["row_count"],
            column_names=data["column_names"],
            preview=data["preview"],
            modified_time=data.get("modified_time", 0),
            file_hash=data.get("file_hash", "")
        )

class ExcelFileIndex:
    """Class to manage indexed Excel files"""
    
    def __init__(self, directory: str = XLSX_FILES_DIR, index_path: str = INDEX_FILE_PATH):
        self.directory = directory
        self.index_path = index_path
        self.files: Dict[str, ExcelFileInfo] = {}
        self.last_refresh_time = 0
        # Load existing index if available, otherwise create a new one
        self._load_index()
        
    def _load_index(self) -> None:
        """Load index from JSON file if it exists"""
        try:
            if os.path.exists(self.index_path):
                with open(self.index_path, 'r') as f:
                    try:
                        index_data = json.load(f)
                        
                        self.last_refresh_time = index_data.get("last_refresh_time", 0)
                        for filename, file_data in index_data.get("files", {}).items():
                            self.files[filename] = ExcelFileInfo.from_dict(file_data)
                        
                        print(f"Loaded index with {len(self.files)} Excel files")
                    except json.JSONDecodeError as e:
                        print(f"Error parsing index file: {str(e)}. Creating new index.")
                        # Backup corrupt file before overwriting
                        backup_path = f"{self.index_path}.bak.{int(time.time())}"
                        try:
                            os.rename(self.index_path, backup_path)
                            print(f"Backed up corrupt index to {backup_path}")
                        except Exception as backup_err:
                            print(f"Failed to back up corrupt index: {str(backup_err)}")
                        self.refresh_index()
            else:
                print("No existing index found, creating new index")
                self.refresh_index()
        except Exception as e:
            print(f"Error loading index: {str(e)}")
            traceback.print_exc()
            self.refresh_index()
    
    def _save_index(self) -> None:
        """Save index to JSON file"""
        try:
            # Create directory if it doesn't exist
            os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
            
            # Prepare index data
            index_data = {
                "last_refresh_time": self.last_refresh_time,
                "files": {filename: file_info.to_dict() for filename, file_info in self.files.items()}
            }
            
            # Write to JSON file using custom encoder to handle non-serializable types
            with open(self.index_path, 'w') as f:
                json.dump(index_data, f, indent=2, cls=CustomJSONEncoder)
            
            print(f"Saved index with {len(self.files)} Excel files")
        except Exception as e:
            print(f"Error saving index: {str(e)}")
            traceback.print_exc()
    
    def _clean_data_for_json(self, data):
        """Recursively clean data to make it JSON serializable"""
        try:
            if isinstance(data, dict):
                return {k: self._clean_data_for_json(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [self._clean_data_for_json(item) for item in data]
            elif isinstance(data, pd.Timestamp):
                return data.isoformat()
            elif isinstance(data, np.ndarray):
                # Handle numpy arrays
                return self._clean_data_for_json(data.tolist())
            elif isinstance(data, (int, float, str, bool, type(None))):
                return data
            elif hasattr(data, 'item'):  # Handle numpy types
                return data.item()
            else:
                # Convert anything else to string
                return str(data)
        except Exception as e:
            # If any error occurs during conversion, return a safe string value
            print(f"Error converting data to JSON serializable format: {e}")
            return str(data)
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate a hash of the file to detect content changes"""
        try:
            with open(file_path, 'rb') as f:
                # Read first 8KB of file for quick hash
                return hashlib.md5(f.read(8192)).hexdigest()
        except Exception as e:
            print(f"Error calculating hash for {file_path}: {str(e)}")
            return ""
    
    def has_file_changed(self, file_path: str, file_info: Optional[ExcelFileInfo]) -> bool:
        """Check if a file has been modified since last indexing"""
        if not os.path.exists(file_path):
            return False
        
        # If we don't have file info, it's a new file
        if file_info is None:
            return True
        
        # Check modified time
        mtime = os.path.getmtime(file_path)
        if mtime > file_info.modified_time:
            # Also check hash to confirm real content changes (not just metadata)
            current_hash = self._calculate_file_hash(file_path)
            return current_hash != file_info.file_hash
        
        return False
    
    def refresh_index(self) -> Dict[str, List[str]]:
        """Read all Excel files in the directory and refresh the index"""
        # Ensure directory exists
        os.makedirs(self.directory, exist_ok=True)
        
        # Find all Excel files
        excel_files = glob.glob(os.path.join(self.directory, "*.xlsx"))
        
        # Track changes for reporting
        added_files = []
        updated_files = []
        removed_files = list(self.files.keys())  # Start with all files as potentially removed
        
        # Process each file
        for file_path in excel_files:
            filename = os.path.basename(file_path)
            
            # Check if file exists in index and needs updating
            current_file_info = self.files.get(filename)
            if filename in removed_files:
                removed_files.remove(filename)  # File still exists, not removed
            
            if self.has_file_changed(file_path, current_file_info):
                try:
                    self._index_file(file_path)
                    if current_file_info:
                        updated_files.append(filename)
                    else:
                        added_files.append(filename)
                except Exception as e:
                    print(f"Error indexing {file_path}: {str(e)}")
                    traceback.print_exc()
        
        # Remove files that no longer exist
        for filename in removed_files:
            if filename in self.files:
                del self.files[filename]
        
        # Update refresh time
        self.last_refresh_time = time.time()
        
        # Save the updated index
        self._save_index()
        
        # Return summary of changes
        return {
            "added": added_files,
            "updated": updated_files,
            "removed": removed_files
        }
    
    def _safe_read_excel(self, file_path, sheet_name=None, **kwargs):
        """Safely read an Excel file, handling various errors"""
        try:
            return pd.read_excel(file_path, sheet_name=sheet_name, **kwargs)
        except Exception as e:
            print(f"Error reading {os.path.basename(file_path)}: {str(e)}")
            # If sheet_name is None, return empty dict for consistency with pd.read_excel
            if sheet_name is None:
                return {}
            # Otherwise return empty DataFrame
            return pd.DataFrame()
    
    def _index_file(self, file_path: str) -> None:
        """Index a single Excel file"""
        filename = os.path.basename(file_path)
        print(f"Indexing {filename}...")
        
        # Get file metadata
        modified_time = os.path.getmtime(file_path)
        file_hash = self._calculate_file_hash(file_path)
        
        # Read Excel file with pandas
        try:
            # Use ExcelFile for better performance when reading multiple sheets
            excel_file = pd.ExcelFile(file_path)
            sheets = excel_file.sheet_names
            
            row_count = {}
            column_names = {}
            preview = {}
            
            # Process each sheet
            for sheet in sheets:
                try:
                    # Read with a maximum of 1000 rows for efficiency
                    df = self._safe_read_excel(excel_file, sheet_name=sheet, nrows=1000)
                    
                    if df.empty:
                        row_count[sheet] = 0
                        column_names[sheet] = []
                        preview[sheet] = []
                        continue
                        
                    row_count[sheet] = len(df)
                    column_names[sheet] = [str(col) for col in df.columns.tolist()]
                    
                    # Generate a preview with a few rows
                    preview_rows = min(5, len(df))
                    preview_data = df.head(preview_rows).to_dict(orient='records')
                    
                    # Clean preview data to ensure it's JSON serializable
                    preview[sheet] = self._clean_data_for_json(preview_data)
                except Exception as sheet_err:
                    print(f"Error processing sheet '{sheet}' in {filename}: {str(sheet_err)}")
                    # Add empty data for this sheet
                    row_count[sheet] = 0
                    column_names[sheet] = []
                    preview[sheet] = []
            
            # Store the file info
            self.files[filename] = ExcelFileInfo(
                filename=filename,
                filepath=file_path,
                sheets=sheets,
                row_count=row_count,
                column_names=column_names,
                preview=preview,
                modified_time=modified_time,
                file_hash=file_hash
            )
            
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")
            traceback.print_exc()
    
    def get_file_list(self) -> List[str]:
        """Get list of all indexed Excel files"""
        return list(self.files.keys())
    
    def get_file_info(self, filename: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific file"""
        if filename in self.files:
            return self.files[filename].to_dict()
        return None
    
    def search_in_files(self, query: str) -> Dict[str, List[Dict[str, Any]]]:
        """
        Search for query in Excel files and return matching information
        This is a simple search that looks for the query in column names and preview data
        """
        # First ensure any new files are indexed
        if time.time() - self.last_refresh_time > 300:  # Auto-refresh if over 5 minutes
            self.refresh_index()
            
        results = {}
        
        # Convert query to lowercase for case-insensitive search
        query = query.lower()
        
        for filename, file_info in self.files.items():
            file_matches = []
            
            # Search in column names
            for sheet, columns in file_info.column_names.items():
                matching_columns = [col for col in columns if query in str(col).lower()]
                if matching_columns:
                    file_matches.append({
                        "sheet": sheet,
                        "matching_columns": matching_columns,
                        "type": "column_match"
                    })
            
            # Search in preview data
            for sheet, preview_data in file_info.preview.items():
                for row_idx, row in enumerate(preview_data):
                    for col, value in row.items():
                        # Convert value to string for searching
                        str_value = str(value).lower()
                        if query in str_value:
                            file_matches.append({
                                "sheet": sheet,
                                "row": row_idx,
                                "column": col,
                                "value": value,
                                "type": "data_match"
                            })
            
            if file_matches:
                results[filename] = file_matches
        
        return results
    
    def read_sheet_data(self, filename: str, sheet_name: str, max_rows: int = 1000) -> List[Dict[str, Any]]:
        """Read data from a specific sheet in a file"""
        # First check if file exists in the index
        if filename not in self.files:
            # If not in index, check if it's a new file that needs indexing
            file_path = os.path.join(self.directory, filename)
            if os.path.exists(file_path):
                try:
                    self._index_file(file_path)
                    self._save_index()
                except Exception as e:
                    print(f"Error indexing new file {filename}: {str(e)}")
                    traceback.print_exc()
                    return []
            else:
                return []
        
        try:
            # Read directly from file
            file_path = os.path.join(self.directory, filename)
            df = self._safe_read_excel(file_path, sheet_name=sheet_name, nrows=max_rows)
            
            if df.empty:
                return []
                
            # Convert to dict and ensure it's JSON serializable
            data = df.to_dict(orient='records')
            return self._clean_data_for_json(data)
        except Exception as e:
            print(f"Error reading sheet {sheet_name} from {filename}: {str(e)}")
            traceback.print_exc()
            return []

# Create a global index instance
excel_index = ExcelFileIndex()

def get_excel_files_info() -> str:
    """
    Get information about all indexed Excel files in the system.
    
    Returns:
        A JSON string with information about all Excel files, including filename, 
        sheet names, row counts, and column names.
    """
    # Check for new files before returning info
    changes = excel_index.refresh_index()
    
    # Create a simplified view of the files
    files_info = {}
    for filename, file_info in excel_index.files.items():
        files_info[filename] = {
            "sheets": file_info.sheets,
            "row_count": file_info.row_count,
            "column_names": file_info.column_names
        }
    
    # Add changes information
    files_info["_changes"] = changes
    
    return json.dumps(files_info, indent=2, cls=CustomJSONEncoder)

def search_excel_files(query: str) -> str:
    """
    Search for a term across all Excel files.
    
    Args:
        query: The search term to look for in Excel files
        
    Returns:
        A JSON string with search results matching the query
    """
    # Use the indexed data for searching
    results = excel_index.search_in_files(query)
    return json.dumps(results, indent=2, cls=CustomJSONEncoder)

def read_excel_sheet(filename: str, sheet_name: str, max_rows: int = 100) -> str:
    """
    Read data from a specific sheet in an Excel file.
    
    Args:
        filename: The name of the Excel file
        sheet_name: The name of the sheet to read
        max_rows: Maximum number of rows to read (default 100)
        
    Returns:
        A JSON string with the data from the specified sheet
    """
    data = excel_index.read_sheet_data(filename, sheet_name, max_rows)
    return json.dumps(data, indent=2, cls=CustomJSONEncoder)

def get_excel_file_preview(filename: str) -> str:
    """
    Get a preview of all sheets in an Excel file.
    
    Args:
        filename: The name of the Excel file
        
    Returns:
        A JSON string with preview data for each sheet in the file
    """
    # First check if new files need to be indexed
    if filename not in excel_index.files:
        changes = excel_index.refresh_index()
    
    file_info = excel_index.get_file_info(filename)
    
    if file_info:
        return json.dumps(file_info["preview"], indent=2, cls=CustomJSONEncoder)
    
    return json.dumps({"error": f"File {filename} not found"}, cls=CustomJSONEncoder)

def refresh_excel_index() -> str:
    """
    Manually refresh the Excel index.
    
    Returns:
        A JSON string with information about the changes made during refresh.
    """
    changes = excel_index.refresh_index()
    return json.dumps(changes, indent=2, cls=CustomJSONEncoder)

# Call refresh_index when the module is imported to initialize the index
# excel_index.refresh_index()
