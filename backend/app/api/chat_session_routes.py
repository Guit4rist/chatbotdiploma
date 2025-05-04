# backend/app/api/chat_session_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.user import User
from app.models.conversation import ChatSession
from app.schemas.chat_session import ChatSessionCreate, ChatSession
from typing import List

router = APIRouter(prefix="/chat-sessions", tags=["Chat Sessions"])


@router.post("/", response_model=ChatSession)
def create_chat_session(session_data: ChatSessionCreate, db: Session = Depends(get_db)):
    new_session = ChatSession(user_id=session_data.user_id, title=session_data.title or "New Chat")
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session


@router.get("/user/{user_id}", response_model=List[ChatSession])
def get_user_sessions(user_id: int, db: Session = Depends(get_db)):
    return db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc()).all()


@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    db.delete(session)
    db.commit()
    return {"detail": "Chat session deleted successfully"}
