# backend/app/api/chat_session_routes.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.chat_session import ChatSessionCreate, ChatSessionResponse
from app.models.conversation import ChatSession as ChatSessionModel
from typing import List
import logging


router = APIRouter(prefix="/chat-sessions", tags=["Chat Sessions"])


@router.post("/", response_model=ChatSessionResponse)
def create_chat_session(session_data: ChatSessionCreate, db: Session = Depends(get_db)):
    new_session = ChatSessionModel(user_id=session_data.user_id, title=session_data.title or "New Chat")
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session


@router.get("/user/{user_id}", response_model=List[ChatSessionResponse])
def get_user_sessions(user_id: int, db: Session = Depends(get_db)):
    return db.query(ChatSessionModel).filter(ChatSessionModel.user_id == user_id).order_by(ChatSessionModel.created_at.desc()).all()


@router.delete("/{session_id}")
def delete_session(session_id: int, db: Session = Depends(get_db)):
    session = db.query(ChatSessionModel).filter(ChatSessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    db.delete(session)
    db.commit()
    return {"detail": "Chat session deleted successfully"}

logging.basicConfig(level=logging.DEBUG)
