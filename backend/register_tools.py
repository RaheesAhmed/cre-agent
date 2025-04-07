"""
Script to register our custom tools with the AI agent system.
Run this script to update the available tools for your AI.
"""

from cre_agents import Agent, function_tool
from tools.agent_tools import (
    list_excel_files,
    search_in_excel_files,
    get_excel_sheet_data,
    refresh_excel_index
)

# Register the Excel tools
@function_tool(name_override="list_excel_files")
def excel_files_tool() -> str:
    """
    List all available Excel files with their structure.
    
    This tool provides information about all Excel files that have been indexed,
    including their sheets, row counts, and column names.
    
    Use this tool when you need to know what Excel files are available or what 
    information they might contain.
    """
    return list_excel_files()

@function_tool(name_override="search_excel_files")
def excel_search_tool(query: str) -> str:
    """
    Search for a specific term across all Excel files.
    
    This tool helps find information related to a specific term in all Excel files.
    It searches through column names and actual data to find matches.
    
    Args:
        query: The search term to look for in Excel files
        
    Use this tool when you need to find specific information across multiple Excel files,
    such as finding properties in a certain location or with specific characteristics.
    """
    return search_in_excel_files(query)

@function_tool(name_override="read_excel_sheet")
def excel_read_tool(filename: str, sheet_name: str, max_rows: int = 20) -> str:
    """
    Read data from a specific sheet in an Excel file.
    
    This tool extracts and formats data from a specific sheet in an Excel file,
    allowing you to see the actual data in a tabular format.
    
    Args:
        filename: The name of the Excel file to read (e.g., "CostarExport (8).xlsx")
        sheet_name: The name of the sheet to read (e.g., "Sheet1")
        max_rows: Maximum number of rows to return (default: 20, max: 100)
        
    Use this tool when you need to see the actual data in a specific Excel sheet,
    such as detailed property information or market analysis data.
    """
    return get_excel_sheet_data(filename, sheet_name, max_rows)

@function_tool(name_override="refresh_excel_index")
def excel_refresh_tool() -> str:
    """
    Refresh the index of Excel files.
    
    This tool scans the Excel files directory and updates the index with any
    new or modified files.
    
    Use this tool when you're told that new Excel files have been uploaded and
    you need to make sure they're available for searching and reading.
    """
    return refresh_excel_index()

if __name__ == "__main__":
    # In a real implementation, you would register these tools with your agent
    print("Available Excel tools:")
    print("1. list_excel_files: List all available Excel files with their structure")
    print("2. search_excel_files: Search for a term across all Excel files")
    print("3. read_excel_sheet: Read data from a specific sheet in an Excel file")
    print("4. refresh_excel_index: Refresh the index of Excel files")
    
    print("\nThese tools are now available for the AI agent to use.")
    print("When uploading new Excel files, use refresh_excel_index to make them available.") 