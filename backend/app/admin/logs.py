from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import json
from app.api.auth_routes import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/admin/logs")
def get_logs(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        return JSONResponse(status_code=403, content={"detail": "Not authorized"})

    logs = []
    try:
        with open("logs/app.log", "r") as f:
            for line in f:
                try:
                    logs.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        return []

    return logs
