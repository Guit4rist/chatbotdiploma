# backend/app/crud/lesson.py

from sqlalchemy.orm import Session
from app.models.lesson import Lesson, QuizQuestion
from app.schemas.lesson import LessonCreate

def create_lesson(db: Session, lesson_data: LessonCreate):
    db_lesson = Lesson(**lesson_data.dict(exclude={"questions"}))
    if lesson_data.questions:
        for q in lesson_data.questions:
            db_lesson.questions.append(QuizQuestion(**q.dict()))
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

def get_all_lessons(db: Session):
    return db.query(Lesson).all()

def get_lesson(db: Session, lesson_id: int):
    return db.query(Lesson).filter(Lesson.id == lesson_id).first()
