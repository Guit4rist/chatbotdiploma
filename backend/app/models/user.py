from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship 
from app.models.conversation import ConversationHistory


Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    language_level = Column(String)
    preferred_language = Column(String, default="English")

    
    badges = relationship("UserBadge", backref="user")

    experience_points = Column(Integer, default=0)
    current_level = Column(String, default="Beginner")

    conversations = relationship("ConversationHistory", back_populates="user")

    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    conversation_history = relationship("ConversationHistory", back_populates="user", cascade="all, delete-orphan")
