# CRE Research Agent - Backend

This directory contains the backend service for the Commercial Real Estate (CRE) Research Agent, built using FastAPI.

## Overview

The backend provides a RESTful API for managing:

- **AI Agents:** Orchestrating different research agents (Triage, RAG, Web, Excel) for various tasks.
- **Vector Stores:** Creating, managing, and searching OpenAI vector stores for RAG capabilities.
- **File Management:** Uploading, deleting, and managing files associated with vector stores and OpenAI assistants.
- **Tools:** Providing specialized tools for agents, such as interacting with Excel files.

## Project Structure

```
backend/
├── .venv/                  # Virtual environment
├── cre_agents/             # Agent implementations (triage, RAG, web, excel)
│   ├── __init__.py
│   ├── excel_agent.py
│   ├── rag_agent.py
│   ├── triage_agent.py
│   └── web_agent.py
├── data/                   # (Potentially) Data storage or fixtures
├── prompts/                # Agent prompts (currently empty)
├── routes/                 # FastAPI API endpoint definitions
│   ├── __init__.py
│   ├── agent.py            # Agent interaction endpoints
│   ├── files.py            # OpenAI File management endpoints
│   ├── tools.py            # Excel tool endpoints
│   └── vectorstores.py     # Vector store and associated file endpoints
├── tools/                  # Agent tool implementations
│   ├── __init__.py
│   ├── agent_tools.py      # General agent tools
│   └── read_xlsx_files.py  # Excel file reading tool
├── uploads/                # Directory for file uploads
├── vector_stores/          # Logic for interacting with OpenAI vector stores
│   ├── __init__.py
│   ├── create.py
│   ├── delete.py
│   ├── delete_file.py
│   ├── list.py
│   ├── list_all_files.py
│   └── search.py
├── .env                    # Environment variables (API keys, etc.) - **DO NOT COMMIT**
├── .gitignore              # Files/directories ignored by Git
├── main.py                 # FastAPI application entry point
├── register_tools.py       # (Potentially) Script for registering tools with agents
├── requirements.txt        # Python dependencies
└── run_agent.py            # Command-line script to run agents
```

## Getting Started

### Prerequisites

- Python 3.9+
- An OpenAI API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/RaheesAhmed/cre-backend.git
    cd cre-backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    # On Windows
    .venv\Scripts\activate
    # On macOS/Linux
    source .venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    - Create a `.env` file in the `backend` directory (you can copy `.env.example` if one exists).
    - Add your `OPENAI_API_KEY`:
      ```env
      OPENAI_API_KEY=your_openai_api_key_here
      ```
    - Add any other required environment variables (e.g., FRED_API_KEY if using the FRED tool).

### Running the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. You can access the auto-generated documentation at `http://localhost:8000/docs`.

### Running Agents via Command Line

You can test agent execution directly using the `run_agent.py` script:

```bash
python run_agent.py "Your research query here"
```

This script currently uses the `triage_agent` by default.

## API Endpoints

The API provides the following main groups of endpoints (prefixed with `/api/v1`):

- `/vector-stores/`: Manage OpenAI Vector Stores and associated files.
- `/files/`: Manage general OpenAI Files.
- `/tools/`: Access specialized tools (e.g., `/tools/excel/`).
- `/agent/`: Interact with the AI agents (e.g., `/agent/chat`).

Refer to the Swagger UI documentation (`/docs`) for detailed endpoint specifications and testing.

## Key Components

- **FastAPI (`main.py`):** The core web framework defining the application and routing.
- **Routers (`routes/`):** Define the specific API endpoints for different functionalities.
- **Agents (`cre_agents/`):** Implement the logic for different research agent types using the `openai-agents` library.
- **Vector Store Management (`vector_stores/`):** Handles interactions with the OpenAI Vector Store API.
- **Tools (`tools/`):** Contain functions that agents can call to perform specific actions (e.g., reading Excel files, searching the web - potentially via `agent_tools.py`).
- **Runner (`run_agent.py`, `agents/Runner` - likely defined within `openai-agents` or `cre_agents`):** Orchestrates the execution of agents based on user input.
