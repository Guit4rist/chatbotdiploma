# app/api/user_routes.py

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Body
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.user import User
from app.services.auth import get_current_user, hash_password
from app.schemas.user import UserCreate, UserUpdate, UserOut
from pydantic import BaseModel
import shutil
import os
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter_by(username=user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
        preferred_language=user.preferred_language,
        language_level=user.language_level,
        display_name=user.display_name,
        interface_language=user.interface_language,
        timezone=user.timezone,
        avatar_url=user.avatar_url,
        bio=user.bio
    )
    db.add(new_user) 
    db.commit()
    db.refresh(new_user)
    return new_user


@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = update.dict(exclude_unset=True)

    if "password" in update_data:
        user.hashed_password = hash_password(update_data.pop("password"))

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user

AVATAR_UPLOAD_DIR = "static/avatars"

@router.post("/profile/upload-avatar/")
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    filename = f"user_{current_user.id}_{file.filename}"
    filepath = os.path.join(AVATAR_UPLOAD_DIR, filename)

    os.makedirs(AVATAR_UPLOAD_DIR, exist_ok=True)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    current_user.avatar_url = f"/static/avatars/{filename}"
    db.commit()
    return {"avatar_url": filepath}

@router.post("/profile/set-language/")
def set_language(
    preferred_language: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.preferred_language = preferred_language
    db.commit()
    return {"message": "Language updated", "preferred_language": preferred_language}

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("/me", response_model=UserOut)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/{user_id}/profile")
async def update_profile(
    user_id: int,
    update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    update_data = update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/{user_id}/change-password")
async def change_password(
    user_id: int,
    password_data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to change this password")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Hash and update password
    user.hashed_password = hash_password(password_data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.post("/{user_id}/upload-avatar")
async def upload_avatar(
    user_id: int,
    avatar: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this avatar")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{user_id}_{timestamp}_{avatar.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await avatar.read()
        buffer.write(content)
    
    # Update user's avatar URL
    user.avatar_url = f"/uploads/avatars/{filename}"
    db.commit()
    
    return {"message": "Avatar uploaded successfully", "avatar_url": user.avatar_url}