import os
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
# Import the router from your routes file
from routes import vectorstores
from routes import tools
from routes import agent
from routes import files # Import the new files router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="CRE Research API",
    description="API for managing OpenAI Vector Stores, Files, Excel data analysis, and AI Agent interactions",
    version="1.0.0",
)

#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "https://cre-backend-uk58.onrender.com/", "https://cre-two.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include the vector store router
# The prefix adds /api/v1 before all routes defined in vectorstores.router
app.include_router(vectorstores.router, prefix="/api/v1/vector-stores", tags=["Vector Stores & Files"])

# Include the Excel tools router
app.include_router(tools.router, prefix="/api/v1/tools", tags=["Excel Tools"])

# Include the Agent router
app.include_router(agent.router, prefix="/api/v1/agent", tags=["AI Agent"])

# Include the new Files router
app.include_router(files.router, prefix="/api/v1/files", tags=["OpenAI Files"])

@app.get("/api/v1")
async def read_root():
    return {
        "message": "Welcome to the CRE Research API",
        "endpoints": {
            "Vector Stores": "/api/v1/vector-stores/",
            "OpenAI Files": "/api/v1/files/", # Added new endpoint info
            "Excel Tools": "/api/v1/tools/excel/",
            "AI Agent": "/api/v1/agent/chat"
        }
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=os.getenv("PORT", 8000))
