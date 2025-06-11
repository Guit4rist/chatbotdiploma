# app/api/user_routes.py

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Body
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut, UserResponse
from app.services.auth import hash_password as get_password_hash, get_current_user
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
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
        hashed_password=get_password_hash(user.password),
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
        user.hashed_password = get_password_hash(update_data.pop("password"))

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

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "preferred_language": current_user.preferred_language,
        "language_level": current_user.language_level,
        "current_level": current_user.current_level,
        "experience_points": current_user.experience_points,
        "avatar_url": current_user.avatar_url,
        "bio": current_user.bio,
        "interface_language": current_user.interface_language,
        "timezone": current_user.timezone,
        "total_sessions": current_user.total_sessions,
        "total_messages": current_user.total_messages
    }


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.post("/profile/change-password/")
def change_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.services.auth import verify_password

    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.put("/{user_id}/profile")
async def update_profile(
    user_id: int,
    profile_data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user fields
    for field, value in profile_data.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/{user_id}/change-password")
async def change_password(
    user_id: int,
    password_data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to change this password")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Hash and update password
    user.hashed_password = get_password_hash(password_data["new_password"])
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