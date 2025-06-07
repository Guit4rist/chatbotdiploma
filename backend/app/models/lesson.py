# backend/app/models/lesson.py

from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class LessonType(str, enum.Enum):
    SCENARIO = "scenario"
    QUIZ = "quiz"

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    type = Column(Enum(LessonType), nullable=False)
    context = Column(Text, nullable=True)  # For scenario or quiz context

    questions = relationship("QuizQuestion", back_populates="lesson", cascade="all, delete-orphan")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    question = Column(Text, nullable=False)
    correct_answer = Column(String, nullable=False)

    lesson = relationship("Lesson", back_populates="questions")
