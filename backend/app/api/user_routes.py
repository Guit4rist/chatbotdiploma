# app/api/user_routes.py

from fastapi import APIRouter, Depends
from app.models.user import User
from app.api.auth_routes import get_current_user

router = APIRouter(prefix="", tags=["Users"])

@router.get("/protected/")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.username}! You have access to this protected route."}
