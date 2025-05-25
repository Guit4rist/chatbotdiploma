from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    preferred_language: Optional[str] = "English"

class UserUpdate(BaseModel):
    password: Optional[str]
    preferred_language: Optional[str]

class UserOut(BaseModel):
    id: int
    username: str
    current_xp: int
    current_level: int
    preferred_language: Optional[str]

    class Config:
        orm_mode = True
