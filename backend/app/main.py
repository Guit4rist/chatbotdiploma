from fastapi import FastAPI
from app.models.user import Base 
from app.db.database import engine
from fastapi import FastAPI
from app.api.router import router

app = FastAPI(title="Language Learning Platform with Chatbot")
app.include_router(router)



Base.metadata.create_all(bind=engine)

