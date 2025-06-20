import openai
import os
from dotenv import load_dotenv
from app.services.conversation_service import save_message
from app.db.database import SessionLocal
from contextlib import contextmanager
from app.schemas.user import UserOut
import asyncio

load_dotenv()

client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@contextmanager
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_chatbot_response(message: str, user_id: int, chat_session_id: int, language: str = "English") -> str:
    try:
        system_prompt = (
            f"You are a helpful language learning assistant. "
            f"Always respond in {language}, and make sure the tone is encouraging and educational."
        )
        with get_db_session() as db:
            # Save user's message
            save_message(db, user_id, "user", message, chat_session_id)

            # Create the chat completion asynchronously
            completion = await client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ]
            )
            
            # Extract the response text
            bot_message = completion.choices[0].message.content.strip()

            # Save bot's response
            save_message(db, user_id, "assistant", bot_message, chat_session_id)

            return bot_message
    except Exception as e:
        print(f"Error in get_chatbot_response: {str(e)}")  # Add logging
        return f"Error: {str(e)}"
