from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    preferred_language: Optional[str] = "English"
    language_level: Optional[str] = "Beginner"
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    interface_language: Optional[str] = "en"
    timezone: Optional[str] = None


class UserUpdate(BaseModel):
    password: Optional[str]
    preferred_language: Optional[str]
    language_level: Optional[str]
    display_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    interface_language: Optional[str]
    timezone: Optional[str]


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    display_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    preferred_language: Optional[str]
    language_level: Optional[str]
    current_level: Optional[str]
    experience_points: int
    total_sessions: int
    total_messages: int
    last_login: Optional[datetime]
    interface_language: Optional[str]
    timezone: Optional[str]
    is_admin: bool
    is_banned: bool

    class Config:
        from_attributes = True  # Pydantic v2; use `orm_mode = True` if on v1
