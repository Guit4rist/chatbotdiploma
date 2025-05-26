# app/models/user.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    # Core account fields
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Language-related
    language_level = Column(String)
    preferred_language = Column(String, default="English")

    # Admin privileges
    is_admin = Column(Boolean, default=False)

    # Gamification
    experience_points = Column(Integer, default=0)
    current_level = Column(String, default="Beginner")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")


    # Relationships
    conversations = relationship("ConversationHistory", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    conversation_history = relationship("ConversationHistory", back_populates="user", cascade="all, delete-orphan")

    # NEW — Profile info
    display_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)

    # NEW — Localization preferences
    interface_language = Column(String, default="en")  # e.g. "en", "es"
    timezone = Column(String, nullable=True)  # e.g. "UTC", "Europe/Berlin"

    # NEW — Usage tracking
    last_login = Column(DateTime, nullable=True)
    total_sessions = Column(Integer, default=0)
    total_messages = Column(Integer, default=0)
    is_banned = Column(Boolean, default=False)
