# backend/app/schemas/chat_session.py

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ChatSessionCreate(BaseModel):
    user_id: int
    title: str | None = None

class ChatSessionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime

    class Config:
        orm_mode = True
