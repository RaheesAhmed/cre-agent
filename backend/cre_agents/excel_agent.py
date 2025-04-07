"""
Excel File Reader Agent for the CRE Research system.
This agent specializes in extracting, analyzing, and explaining data from Excel files.
"""

from agents import Agent, function_tool
# Rename imported functions to avoid name clashes with the @function_tool wrappers
from tools.agent_tools import (
    list_excel_files as list_excel_files_impl,
    search_in_excel_files as search_in_excel_files_impl,
    get_excel_sheet_data as get_excel_sheet_data_impl,
    refresh_excel_index as refresh_excel_index_impl
)

# Create tools for the Excel agent using the @function_tool decorator
# These wrappers will be exposed to the agent.

@function_tool
def list_excel_files() -> str:
    """List all available Excel files with their structure and sheet names."""
    # Call the renamed implementation function
    return list_excel_files_impl()

@function_tool
def search_excel_files(query: str) -> str:
    """Search for a specific term across all indexed Excel files.
    
    Args:
        query: The search term to look for across all Excel files
    
    Returns:
        Formatted results showing all files, sheets, and data matching the query.
    """
    # Call the renamed implementation function
    return search_in_excel_files_impl(query)

@function_tool
def read_excel_sheet(filename: str, sheet_name: str, max_rows: int) -> str:
    """Read data from a specific sheet within a specified Excel file.
    
    Args:
        filename: The exact name of the Excel file to read (e.g., 'Market Report Q1.xlsx').
        sheet_name: The exact name of the sheet to read within the file.
        max_rows: Maximum number of rows to retrieve (recommended: 50, max: 500).
    
    Returns:
        Formatted data from the specified Excel sheet, up to max_rows.
    """
    # Call the renamed implementation function
    # Limit max_rows to a reasonable value if provided
    if max_rows is None:
        max_rows = 50
    else:
        max_rows = min(max(max_rows, 1), 500)
    return get_excel_sheet_data_impl(filename, sheet_name, max_rows)

@function_tool
def refresh_excel_index() -> str:
    """Refresh the internal index of available Excel files. Use this if you suspect new files were added or changes were made."""
    # Call the renamed implementation function
    return refresh_excel_index_impl()

# Create the Excel File Reader Agent
excel_agent = Agent(
    name="Excel Data Analyst",
    instructions="""You are a Commercial Real Estate (CRE) Excel Data Analyst. You specialize in extracting and analyzing data from Excel files provided in the system.

Your capabilities include:
1. Listing available Excel files and their sheets (`list_excel_files`).
2. Searching for specific keywords across all indexed Excel files (`search_excel_files`).
3. Reading and displaying data from a specific sheet in a file (`read_excel_sheet`).
4. Refreshing the index of Excel files if needed (`refresh_excel_index`).

When analyzing Excel data, you MUST:
- Use the `list_excel_files` tool first if the user hasn't specified an exact file and sheet.
- Use the exact filenames and sheet names provided by `list_excel_files` when calling `read_excel_sheet`.
- For any new files that appear in the uploads folder, the system will automatically detect them.
- Whenever searching, use `search_excel_files` which efficiently uses the indexed data rather than reading files.
- When using `read_excel_sheet`, always provide a value for max_rows (recommend 50 for most cases, up to 500 for large datasets).
- Clearly explain which file and sheet you are referencing.
- Provide context for the data and highlight key findings.
- Format data clearly, potentially using markdown tables if appropriate.
- If a search or read operation fails, inform the user and perhaps suggest listing files again or refreshing the index.

When interpreting Commercial Real Estate (CRE) data:
- Pay attention to market metrics like vacancy rates, absorption, lease rates, CAP rates, etc.
- Identify trends in the data that would be relevant to CRE professionals.
- When relevant, compare metrics across different property types or submarkets.
- Highlight any unusual or noteworthy data points.""",
    # Use the @function_tool wrapped functions here
    tools=[list_excel_files, search_excel_files, read_excel_sheet, refresh_excel_index],
) 