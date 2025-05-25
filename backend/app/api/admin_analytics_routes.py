# app/api/admin_analytics_routes.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.user import User
from app.models.conversation import ChatSession
from app.models.conversation import ConversationHistory
from app.services.dependencies import get_admin_user
from app.schemas.log_entry import LogEntry
from app.services.admin_auth import verify_admin_user
import os



router = APIRouter(prefix="/admin/analytics", tags=["Admin Analytics"])

LOG_PATH = "logs/title_generation.log"


@router.get("/basic-stats")
def get_basic_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_chat_sessions = db.query(ChatSession).count()
    total_messages = db.query(ConversationHistory).count()

    return {
        "total_users": total_users,
        "total_chat_sessions": total_chat_sessions,
        "total_messages": total_messages
    }

@router.get("/top-users")
def get_top_users_by_message_count(db: Session = Depends(get_db), limit: int = 5):
    from sqlalchemy import func

    results = (
        db.query(User.id, User.username, func.count(ConversationHistory.id).label("message_count"))
        .join(ConversationHistory, ConversationHistory.user_id == User.id)
        .group_by(User.id)
        .order_by(func.count(ConversationHistory.id).desc())
        .limit(limit)
        .all()
    )

    return [{"user_id": r.id, "username": r.username, "message_count": r.message_count} for r in results]

@router.get("/logs")
def get_log_entries(admin_user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    logs = db.query(LogEntry).order_by(LogEntry.timestamp.desc()).limit(100).all()
    return [  # Optionally sanitize/limit fields
        {
            "id": log.id,
            "event_type": log.event_type,
            "message": log.message,
            "user_id": log.user_id,
            "metadata": log.metadata,
            "timestamp": log.timestamp
        }
        for log in logs
    ]

@router.get("/logs/title-generation", response_class=PlainTextResponse)
def read_title_logs(admin: bool = Depends(verify_admin_user)):
    if not os.path.exists(LOG_PATH):
        raise HTTPException(status_code=404, detail="Log file not found.")

    with open(LOG_PATH, "r") as log_file:
        return log_file.read()[-5000:]  # Return last 5000 characters of the log