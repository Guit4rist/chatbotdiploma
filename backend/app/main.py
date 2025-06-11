from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse
from app.models.user import Base 
from app.db.database import engine
from app.api.router import router
from app.models.conversation import ConversationHistory 
from app.config.limiter import limiter
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Language Learning Platform with Chatbot")

# Include API router
app.include_router(router)
app.state.limiter = limiter

# Serve static files
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Middleware to handle rate limit exceptions
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please slow down."}
    )

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # If the path starts with /api, let the API router handle it
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not found")
    
    # Check if the file exists in the frontend dist directory
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
    file_path = os.path.join(frontend_path, full_path)
    
    # If the file exists, serve it
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Otherwise, serve index.html
    index_path = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    # If index.html doesn't exist, return a 404
    raise HTTPException(status_code=404, detail="Frontend files not found")

# Create database tables
Base.metadata.create_all(bind=engine)
