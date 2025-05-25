from pydantic import BaseModel
from datetime import datetime

class LogEntry(BaseModel):
    timestamp: datetime
    level: str
    event: str
    message: str
    user_id: int | None = None
    details: dict | None = None
