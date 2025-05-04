from app.models.badge import Badge
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.db.dependencies import get_db


router = APIRouter()

@router.get("/admin/")
def admin_home():
    return {"message": "Welcome to the admin panel! (Basic placeholder)"}

@router.post("/setup-default-badges/")
def setup_default_badges(db: Session = Depends(get_db)):
    default_badges = [
        {"name": "First 100 XP", "description": "You reached 100 XP!", "icon": "🏅"},
        {"name": "Chatterbox", "description": "You’ve sent 50 messages!", "icon": "💬"},
        {"name": "Level Up!", "description": "You reached your first new level!", "icon": "📈"},
    ]

    created = 0
    for badge_data in default_badges:
        exists = db.query(Badge).filter(Badge.name == badge_data["name"]).first()
        if not exists:
            db.add(Badge(**badge_data))
            created += 1

    db.commit()
    return {"message": f"{created} badges added successfully."}