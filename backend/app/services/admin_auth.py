# app/services/admin_auth.py

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.models.user import User

def verify_admin_user(user_id: int = 1, db: Session = Depends(get_db)):  # Hardcoded for now
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return True
