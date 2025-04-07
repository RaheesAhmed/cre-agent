# CRE Agent

An AI-powered Commercial Real Estate assistant that helps agents analyze property data, generate content, and provide market insights.

## Project Overview

CRE Agent is a full-stack application with:

- **Frontend**: Next.js application with a modern UI
- **Backend**: Python FastAPI server with AI agent capabilities

## Features

- AI-powered chat interface
- Excel file analysis for property data
- Web browsing capabilities
- RAG (Retrieval Augmented Generation) for knowledge-based responses
- Vector store management for document storage
- Property data visualization
- Content generation tools for CRE professionals

## Project Structure

```
cre-agent/
├── frontend/        # Next.js frontend application
├── backend/         # Python FastAPI backend
```

## Installation

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create a virtual environment:

   ```
   python -m venv .venv
   ```

3. Activate the virtual environment:

   - Windows: `.venv\Scripts\activate`
   - Mac/Linux: `source .venv/bin/activate`

4. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables:

   - Copy `.env.example` to `.env` if available or create your own
   - Configure any required API keys

6. Start the backend server:
   ```
   python main.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local` if available
   - Configure backend API URL

4. Start the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Usage

### Admin Interface

Navigate to `/admin` to:

- Manage vector stores
- Upload files for analysis
- Configure agent settings

### Chat Interface

Navigate to `/chat` to:

- Interact with the AI assistant
- Ask questions about real estate properties
- Generate content for marketing
- Analyze uploaded property data

## Technologies

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI, LangChain
- **AI Components**: Vector databases, OpenAI integration

## License

[MIT](LICENSE)

## Contact

For support or inquiries, please open an issue on this repository.
