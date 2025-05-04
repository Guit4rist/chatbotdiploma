from sqlalchemy.orm import Session
from app.models.conversation import ConversationHistory
from app.models.conversation import ChatSession
from datetime import datetime

# -------- Save a message under a specific chat session --------

def save_message(db: Session, user_id: int, role: str, message: str, chat_session_id: int):
    conversation = ConversationHistory(
        user_id=user_id,
        role=role,
        message=message,
        chat_session_id=chat_session_id
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

# -------- Fetch all messages for a specific session --------
def get_user_conversations_by_session(db: Session, user_id: int, chat_session_id: int):
    return db.query(ConversationHistory)\
        .filter_by(user_id=user_id, chat_session_id=chat_session_id)\
        .order_by(ConversationHistory.timestamp.asc())\
        .all()

# -------- Fetch all sessions for a user --------
def get_chat_sessions_for_user(db: Session, user_id: int):
    return db.query(ChatSession)\
        .filter_by(user_id=user_id)\
        .order_by(ChatSession.created_at.desc())\
        .all()

# -------- Create a new chat session --------
def create_chat_session(db: Session, user_id: int, title: str = None):
    session = ChatSession(user_id=user_id, title=title or "New Chat")
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

# -------- Delete a specific chat session and its messages --------
def delete_chat_session(db: Session, user_id: int, chat_session_id: int):
    # First delete messages in the session
    db.query(ConversationHistory).filter_by(user_id=user_id, chat_session_id=chat_session_id).delete()
    # Then delete the session itself
    db.query(ChatSession).filter_by(user_id=user_id, id=chat_session_id).delete()
    db.commit()

# -------- Get the latest message in a session --------
def get_latest_conversation_message(db: Session, user_id: int, chat_session_id: int):
    return db.query(ConversationHistory)\
        .filter_by(user_id=user_id, chat_session_id=chat_session_id)\
        .order_by(ConversationHistory.timestamp.desc())\
        .first()
