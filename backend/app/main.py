from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
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

# Include API router with prefix
app.include_router(router, prefix="/api")
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
    allow_origins=["https://languagechatbot.onrender.com"],  # Specify exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files 
frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Language Learning Platform</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #0d1b2a;
                    color: #E0E1DD;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                    background-color: #1B263B;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1 { margin-bottom: 1rem; }
                p { margin-bottom: 0.5rem; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Language Learning Platform</h1>
                <p>The frontend application is currently being built.</p>
                <p>Please try again in a few moments.</p>
            </div>
        </body>
        </html>
        """)

# Create database tables
Base.metadata.create_all(bind=engine)
