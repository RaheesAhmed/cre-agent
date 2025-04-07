#!/usr/bin/env python
"""
CRE Research Agent Runner

This script provides a command-line interface to run the CRE Research agent system.
"""

import asyncio
import os
import sys

from agents import Runner
from cre_agents import triage_agent
from dotenv import load_dotenv

load_dotenv()

# Ensure OpenAI API key is set
if not os.environ.get("OPENAI_API_KEY"):
    print("Error: OPENAI_API_KEY environment variable not set.")
    print("Please set your OpenAI API key with:")
    print("    export OPENAI_API_KEY=your_api_key_here")
    sys.exit(1)

async def main():
    if len(sys.argv) < 2:
        print("Usage: python run_agent.py 'your question here'")
        sys.exit(1)
        
    query = sys.argv[1]
    result = await Runner.run(triage_agent, query)
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main()) 