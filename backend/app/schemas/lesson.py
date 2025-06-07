# backend/app/schemas/lesson.py

from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class LessonType(str, Enum):
    SCENARIO = "scenario"
    QUIZ = "quiz"

class QuizQuestionBase(BaseModel):
    question: str
    correct_answer: str

class QuizQuestionCreate(QuizQuestionBase):
    pass

class QuizQuestion(QuizQuestionBase):
    id: int
    class Config:
        orm_mode = True

class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: LessonType
    context: Optional[str] = None

class LessonCreate(LessonBase):
    questions: Optional[List[QuizQuestionCreate]] = None

class Lesson(LessonBase):
    id: int
    questions: List[QuizQuestion] = []
    class Config:
        orm_mode = True
