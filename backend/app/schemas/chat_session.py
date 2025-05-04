# backend/app/schemas/chat_session.py

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChatSessionBase(BaseModel):
    title: Optional[str] = "New Chat"


class ChatSessionCreate(ChatSessionBase):
    user_id: int


class ChatSession(ChatSessionBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
