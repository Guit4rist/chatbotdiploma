# app/api/router.py

from fastapi import APIRouter
from .auth_routes import router as auth_router
from .chat_routes import router as chat_router
from .user_routes import router as user_router
from .conversation_routes import router as conversation_router
from .chat_session_routes import router as chat_session_router
from app.admin.admin_setup import router as admin_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(chat_router)
router.include_router(user_router)
router.include_router(conversation_router)
router.include_router(chat_session_router)
router.include_router(admin_router)
