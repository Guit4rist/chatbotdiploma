# app/api/chat_routes.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.conversation import ChatSession
from app.models.user import User
from app.services.chatbot_service import get_chatbot_response
from app.services.conversation_service import save_message
from app.services.gamification_service import handle_user_xp_and_level_up
from app.services.title_generator import generate_title_from_message  # GPT-based

router = APIRouter(prefix="", tags=["Chat"])

class MessageRequest(BaseModel):
    message: str
    user_id: int
    chat_session_id: int

@router.post("/chat")
async def chat_with_bot(data: MessageRequest, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter_by(id=data.chat_session_id, user_id=data.user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found or doesn't belong to user")

    user = db.query(User).filter_by(id=data.user_id).first()

    if not session.title:
        preferred_language = getattr(user, "preferred_language", "English")
        session.title = await generate_title_from_message(data.message, data.user_id, preferred_language)
        db.commit()

    save_message(db, data.user_id, "user", data.message, data.chat_session_id)
    bot_response = await get_chatbot_response(data.message, data.user_id)
    save_message(db, data.user_id, "assistant", bot_response, data.chat_session_id)

    user = db.query(User).filter_by(id=data.user_id).first()
    xp_earned = handle_user_xp_and_level_up(user, len(data.message), db)

    return {
        "response": bot_response,
        "xp_earned": xp_earned,
        "current_level": user.current_level
    }
