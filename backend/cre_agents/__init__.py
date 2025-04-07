"""
CRE Research Agent System
This package contains the agent system for the Commercial Real Estate (CRE) Research assistant.
"""

from agents import Agent, Runner

# Export the main components for easy access
from .triage_agent import triage_agent
from .excel_agent import excel_agent
from .rag_agent import rag_agent
from .web_agent import web_agent

# Define the main agent to be used by default
main_agent = triage_agent

__all__ = [
    'triage_agent',
    'excel_agent',
    'rag_agent',
    'web_agent',
    'main_agent',
    'AGENT_PREFIX',
    'format_data_as_markdown'
] 