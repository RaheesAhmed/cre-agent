"""
Function tools for AI agents to work with Excel files.
These are designed to be registered as function tools for the agent system.
"""

from typing import List, Dict, Any, Optional
import json
from tools.read_xlsx_files import (
    excel_index,
    get_excel_files_info,
    search_excel_files,
    read_excel_sheet,
    get_excel_file_preview,
    refresh_excel_index as refresh_excel_index_impl
)

def list_excel_files() -> str:
    """
    List all available Excel files in the system along with their structure.
    
    This tool lists all Excel files that have been indexed, showing their sheets,
    row counts, and column names for each sheet.
    
    Returns:
        A description of all indexed Excel files.
    """
    # Get raw JSON data
    files_info_json = get_excel_files_info()
    files_info = json.loads(files_info_json)
    
    # Check if any changes were detected during refresh
    changes = files_info.pop("_changes", {})
    
    # Format into a readable response
    result = []
    result.append(f"Found {len(files_info)} Excel files:")
    
    # Report any changes first
    added = changes.get("added", [])
    updated = changes.get("updated", [])
    removed = changes.get("removed", [])
    
    if added or updated or removed:
        result.append("\n## Recent Changes")
        if added:
            result.append(f"  - Newly added files: {', '.join(added)}")
        if updated:
            result.append(f"  - Updated files: {', '.join(updated)}")
        if removed:
            result.append(f"  - Removed files: {', '.join(removed)}")
    
    # List all files and their content
    for filename, info in files_info.items():
        result.append(f"\n## {filename}")
        for sheet in info['sheets']:
            result.append(f"  - Sheet: {sheet}")
            result.append(f"    - Rows: {info['row_count'][sheet]}")
            result.append(f"    - Columns: {', '.join(info['column_names'][sheet][:5])}")
            if len(info['column_names'][sheet]) > 5:
                result.append(f"      and {len(info['column_names'][sheet]) - 5} more columns...")
    
    return "\n".join(result)

def search_in_excel_files(query: str) -> str:
    """
    Search for a specific term across all Excel files.
    
    This tool searches through column names and data in all indexed Excel files
    to find matches for the specified query.
    
    Args:
        query: The term to search for in the Excel files
        
    Returns:
        A description of all matches found for the query.
    """
    # Get raw search results
    search_results_json = search_excel_files(query)
    search_results = json.loads(search_results_json)
    
    # Format into a readable response
    if not search_results:
        return f"No matches found for '{query}' in any Excel file."
    
    result = []
    result.append(f"Found matches for '{query}' in {len(search_results)} Excel files:")
    
    for filename, matches in search_results.items():
        result.append(f"\n## {filename}")
        
        # Group matches by sheet and type
        column_matches = {}
        data_matches = {}
        
        for match in matches:
            sheet = match['sheet']
            
            if match['type'] == 'column_match':
                if sheet not in column_matches:
                    column_matches[sheet] = []
                column_matches[sheet].extend(match['matching_columns'])
            
            elif match['type'] == 'data_match':
                if sheet not in data_matches:
                    data_matches[sheet] = []
                data_matches[sheet].append(match)
        
        # Report column matches
        if column_matches:
            result.append("  Column matches:")
            for sheet, cols in column_matches.items():
                # Remove duplicates and sort
                unique_cols = sorted(set(cols))
                result.append(f"  - Sheet '{sheet}' has matching columns: {', '.join(unique_cols)}")
                result.append(f"    To view this sheet, use: read_excel_sheet(filename='{filename}', sheet_name='{sheet}', max_rows=50)")
        
        # Report data matches
        if data_matches:
            result.append("  Data matches:")
            for sheet, matches in data_matches.items():
                result.append(f"  - Sheet '{sheet}' has {len(matches)} matching data points:")
                matches_by_col = {}
                for match in matches:
                    col = match['column']
                    if col not in matches_by_col:
                        matches_by_col[col] = []
                    matches_by_col[col].append(f"'{match['value']}'")
                
                # Show summary by column (more useful for analysis)
                for col, values in matches_by_col.items():
                    unique_values = list(set(values))[:5]  # Show up to 5 unique values
                    values_str = ", ".join(unique_values)
                    if len(unique_values) < len(values):
                        values_str += f" (and {len(values) - len(unique_values)} more)"
                    result.append(f"    - Column '{col}': {values_str}")
                
                result.append(f"    To view this sheet, use: read_excel_sheet(filename='{filename}', sheet_name='{sheet}', max_rows=50)")
    
    return "\n".join(result)

def get_excel_sheet_data(filename: str, sheet_name: str, max_rows: int) -> str:
    """
    Read data from a specific sheet in an Excel file.
    
    This tool reads the data from a specified sheet in an Excel file and returns
    it in a structured format.
    
    Args:
        filename: The name of the Excel file to read from
        sheet_name: The name of the sheet within the file
        max_rows: Maximum number of rows to return
        
    Returns:
        The data from the specified sheet in a formatted structure.
    """
    # Ensure max_rows is within a reasonable range
    max_rows = min(max(max_rows, 1), 500)  # Cap at 500 rows to avoid overwhelming responses
    
    # Get raw data
    sheet_data_json = read_excel_sheet(filename, sheet_name, max_rows)
    sheet_data = json.loads(sheet_data_json)
    
    if not sheet_data:
        return f"No data found or unable to read sheet '{sheet_name}' in file '{filename}'."
    
    # Format into a readable response
    result = []
    result.append(f"Data from sheet '{sheet_name}' in file '{filename}' (showing {len(sheet_data)} rows):")
    
    # Get column names from the first row
    if sheet_data:
        columns = list(sheet_data[0].keys())
        
        # Format as a table with headers
        result.append("\n| " + " | ".join(columns) + " |")
        result.append("| " + " | ".join(["---" for _ in columns]) + " |")
        
        # Add rows
        for row in sheet_data:
            row_values = []
            for col in columns:
                value = row.get(col, "")
                # Format the value for better readability
                if isinstance(value, (int, float)):
                    row_values.append(str(value))
                else:
                    # Truncate long strings and escape pipe characters
                    str_value = str(value).replace("|", "\\|")
                    if len(str_value) > 50:
                        str_value = str_value[:47] + "..."
                    row_values.append(str_value)
            
            result.append("| " + " | ".join(row_values) + " |")
    
    return "\n".join(result)

def refresh_excel_index() -> str:
    """
    Refresh the index of Excel files.
    
    This tool scans the Excel files directory and updates the index with any
    new or modified files. The index is stored in a JSON file for persistence.
    
    Returns:
        A message indicating the result of the refresh operation.
    """
    # Call the actual refresh function and get the changes as JSON
    changes_json = refresh_excel_index_impl()
    changes = json.loads(changes_json)
    
    # Format the response
    result = ["Excel file index has been refreshed."]
    
    if changes["added"]:
        result.append(f"\nNewly indexed files ({len(changes['added'])}):")
        for file in changes["added"]:
            result.append(f"- {file}")
    
    if changes["updated"]:
        result.append(f"\nUpdated files ({len(changes['updated'])}):")
        for file in changes["updated"]:
            result.append(f"- {file}")
    
    if changes["removed"]:
        result.append(f"\nFiles no longer available ({len(changes['removed'])}):")
        for file in changes["removed"]:
            result.append(f"- {file}")
    
    if not any([changes["added"], changes["updated"], changes["removed"]]):
        result.append("\nNo changes detected. Index is up to date.")
    
    # Get total count
    files_info_json = get_excel_files_info()
    files_info = json.loads(files_info_json)
    total_files = len(files_info) - 1 if "_changes" in files_info else len(files_info)
    result.append(f"\nTotal files indexed: {total_files}")
    
    return "\n".join(result) 