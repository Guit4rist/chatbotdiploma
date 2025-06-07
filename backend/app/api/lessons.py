# backend/app/api/lessons.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.dependencies import get_db
from app.schemas.lesson import Lesson, LessonCreate
from app.crud import lesson as crud_lesson

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.post("/", response_model=Lesson)
def create_lesson_endpoint(lesson: LessonCreate, db: Session = Depends(get_db)):
    return crud_lesson.create_lesson(db, lesson)

@router.get("/", response_model=List[Lesson])
def get_lessons(db: Session = Depends(get_db)):
    return crud_lesson.get_all_lessons(db)

@router.get("/{lesson_id}", response_model=Lesson)
def get_lesson_by_id(lesson_id: int, db: Session = Depends(get_db)):
    lesson = crud_lesson.get_lesson(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson
