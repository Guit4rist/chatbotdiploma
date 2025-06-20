# app/api/router.py

from fastapi import APIRouter
from app.api.auth_routes import router as auth_router
from app.api.chat_routes import router as chat_router
from app.api.user_routes import router as user_router
from app.api.conversation_routes import router as conversation_router
from app.api.chat_session_routes import router as chat_session_router
from app.admin.admin_setup import router as admin_router
from app.api import admin_analytics_routes
from app.api.lesson_routes import router as lessons_router




router = APIRouter()
router.include_router(auth_router)
router.include_router(chat_router)
router.include_router(user_router)
router.include_router(conversation_router)
router.include_router(chat_session_router)
router.include_router(lessons_router)

#Admin functionality
router.include_router(admin_router)
router.include_router(admin_analytics_routes.router)

