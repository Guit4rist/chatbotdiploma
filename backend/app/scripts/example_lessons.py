# backend/app/scripts/seed_lessons.py

from sqlalchemy.orm import Session
from app.db import SessionLocal, engine
from app.models import lesson as models
from app.schemas.lesson import LessonType
from app.models.lesson import Base

# Make sure all tables are created
Base.metadata.create_all(bind=engine)

def seed_lessons(db: Session):
    if db.query(models.Lesson).count() > 0:
        print("Lessons already seeded.")
        return

    # 1. Scenario-based Lesson
    scenario_lesson = models.Lesson(
        title="Ordering at a Cafe",
        description="Practice ordering coffee at a French café.",
        type=LessonType.SCENARIO,
        context="You are visiting a café in Paris. Practice ordering a drink and snack."
    )

    # 2. Quiz with Context #1
    quiz1 = models.Lesson(
        title="Common Greetings",
        description="Test your knowledge of basic greetings in French.",
        type=LessonType.QUIZ,
        context="Choose the correct responses for common greetings."
    )
    quiz1.questions = [
        models.QuizQuestion(question="How do you say 'Good morning' in French?", correct_answer="Bonjour"),
        models.QuizQuestion(question="What is the informal way to say 'Hi'?", correct_answer="Salut"),
    ]

    # 3. Quiz with Context #2
    quiz2 = models.Lesson(
        title="Ordering Food",
        description="Identify correct food-related vocabulary.",
        type=LessonType.QUIZ,
        context="Match the phrases with food ordering situations."
    )
    quiz2.questions = [
        models.QuizQuestion(question="How do you say 'I would like a sandwich' in French?", correct_answer="Je voudrais un sandwich"),
        models.QuizQuestion(question="What does 'l'addition, s'il vous plaît' mean?", correct_answer="The bill, please"),
    ]

    db.add_all([scenario_lesson, quiz1, quiz2])
    db.commit()
    print("Lessons seeded successfully.")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_lessons(db)
    finally:
        db.close()
