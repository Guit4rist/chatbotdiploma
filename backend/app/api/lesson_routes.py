from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.models.user import User
from app.services.auth import get_current_user
from app.db.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/lessons", tags=["lessons"])

class LessonResponse(BaseModel):
    id: int
    title: str
    description: str
    type: str  # "dialog" or "quiz"
    content: dict

class QuizAnswer(BaseModel):
    lesson_id: int
    question_id: int
    answer: str
    user_id: int

# Sample lessons data
LESSONS = [
    {
        "id": 1,
        "title": "Coffee Shop Conversation",
        "description": "Practice ordering coffee and having a casual conversation at a coffee shop",
        "type": "dialog",
        "content": {
            "scenario": "You're at a coffee shop. The barista greets you.",
            "bot_role": "barista",
            "initial_message": "Hi there! Welcome to our coffee shop. What can I get for you today?",
            "feedback_after_messages": 5
        }
    },
    {
        "id": 2,
        "title": "Basic Grammar Quiz",
        "description": "Test your knowledge of basic grammar rules",
        "type": "quiz",
        "content": {
            "questions": [
                {
                    "id": 1,
                    "question": "Which sentence is grammatically correct?",
                    "options": [
                        "I am going to the store yesterday",
                        "I went to the store yesterday",
                        "I going to the store yesterday",
                        "I goes to the store yesterday"
                    ],
                    "correct_answer": "I went to the store yesterday"
                },
                {
                    "id": 2,
                    "question": "Choose the correct article: ___ apple is red.",
                    "options": ["a", "an", "the", "none"],
                    "correct_answer": "an"
                },
                {
                    "id": 3,
                    "question": "Which is the correct past tense of 'go'?",
                    "options": ["goed", "went", "gone", "going"],
                    "correct_answer": "went"
                }
            ]
        }
    },
    {
        "id": 3,
        "title": "Vocabulary Quiz",
        "description": "Test your knowledge of common vocabulary",
        "type": "quiz",
        "content": {
            "questions": [
                {
                    "id": 1,
                    "question": "What is the opposite of 'hot'?",
                    "options": ["warm", "cold", "cool", "freezing"],
                    "correct_answer": "cold"
                },
                {
                    "id": 2,
                    "question": "Which word means 'very happy'?",
                    "options": ["sad", "angry", "delighted", "tired"],
                    "correct_answer": "delighted"
                },
                {
                    "id": 3,
                    "question": "What is a synonym for 'big'?",
                    "options": ["small", "tiny", "huge", "little"],
                    "correct_answer": "huge"
                }
            ]
        }
    }
]

LEARNING_TIPS = [
    "Practice speaking every day, even if it's just for a few minutes",
    "Watch movies and TV shows in the language you're learning",
    "Use language learning apps to build vocabulary",
    "Find a language exchange partner to practice with",
    "Read books and articles in the target language",
    "Listen to podcasts and music in the language",
    "Keep a vocabulary notebook",
    "Set specific, achievable goals",
    "Don't be afraid to make mistakes",
    "Immerse yourself in the language as much as possible"
]

@router.get("/", response_model=List[LessonResponse])
async def get_lessons(
    current_user: User = Depends(get_current_user)
):
    return LESSONS

@router.get("/tips")
async def get_learning_tips(
    current_user: User = Depends(get_current_user)
):
    return {"tips": LEARNING_TIPS}

@router.post("/quiz/check")
async def check_quiz_answer(
    answer: QuizAnswer,
    current_user: User = Depends(get_current_user)
):
    if current_user.id != answer.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to submit answers for this user"
        )

    # Find the lesson and question
    lesson = next((l for l in LESSONS if l["id"] == answer.lesson_id), None)
    if not lesson or lesson["type"] != "quiz":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found or not a quiz"
        )

    question = next((q for q in lesson["content"]["questions"] if q["id"] == answer.question_id), None)
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )

    # Check if the answer is correct
    is_correct = answer.answer == question["correct_answer"]
    
    return {
        "is_correct": is_correct,
        "correct_answer": question["correct_answer"] if not is_correct else None
    } 