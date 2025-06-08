from fastapi import FastAPI
from app.models.user import Base 
from app.db.database import engine
from app.api.router import router
from app.models.conversation import ConversationHistory 


from app.config.limiter import limiter
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles



# Rate limiter instance
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Language Learning Platform with Chatbot")
app.state.limiter = limiter

app.mount("/static", StaticFiles(directory="static"), name="static")


# Middleware to handle rate limit exceptions
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please slow down."}
    )

# Allow CORS (optional, but good for frontend dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://languagechatbot.onrender.com"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
Base.metadata.create_all(bind=engine)
