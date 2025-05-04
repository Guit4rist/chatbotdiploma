import openai
import os
from dotenv import load_dotenv
from app.services.conversation_service import save_message
from app.db.database import SessionLocal
from contextlib import contextmanager

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@contextmanager
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_chatbot_response(message: str, user_id: int) -> str:
    try:
        with get_db_session() as db:
            # Save user's message
            save_message(db, user_id, "user", message)

            response = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": message}
                ]
            )
            bot_message = response.choices[0].message.content.strip()

            # Save bot's response
            save_message(db, user_id, "assistant", bot_message)

            return bot_message
    except Exception as e:
        return f"Error: {str(e)}"
