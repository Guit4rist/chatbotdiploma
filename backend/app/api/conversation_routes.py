from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import SessionLocal
from app.services.conversation_service import save_message, get_user_conversations_by_session
from app.models.conversation import ConversationHistory
from app.models.conversation import ChatSession

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------- Save a message under a session --------
@router.post("/save/")
def save_conversation(
    user_id: int,
    chat_session_id: int,
    role: str,
    message: str,
    db: Session = Depends(get_db)
):
    # Optional: Validate chat_session belongs to user
    session = db.query(ChatSession).filter_by(id=chat_session_id, user_id=user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found or doesn't belong to the user.")
    
    conversation = save_message(db, user_id, role, message, chat_session_id)
    return {"message": "Message saved successfully", "data": conversation}

# -------- Get conversation history (either all or by session) --------
@router.get("/history/{user_id}")
def get_conversation_history(
    user_id: int,
    chat_session_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    if chat_session_id:
        messages = db.query(ConversationHistory)\
            .filter_by(user_id=user_id, chat_session_id=chat_session_id)\
            .order_by(ConversationHistory.timestamp.asc())\
            .all()
        return messages

    # If no session ID is provided, return all sessions and their messages
    sessions = db.query(ChatSession).filter_by(user_id=user_id).all()
    session_data = []

    for session in sessions:
        messages = db.query(ConversationHistory)\
            .filter_by(chat_session_id=session.id)\
            .order_by(ConversationHistory.timestamp.asc())\
            .all()
        session_data.append({
            "chat_session_id": session.id,
            "session_name": session.name,
            "created_at": session.created_at,
            "messages": messages
        })

    if not session_data:
        raise HTTPException(status_code=404, detail="No conversation sessions found for this user.")
    
    return session_data
