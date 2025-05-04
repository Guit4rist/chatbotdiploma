# app/services/title_generator.py

from app.services.chatbot_service import get_chatbot_response

async def generate_title_from_message(message: str, user_id: int, language: str = "English") -> str:
    prompt = (
        f"You are an assistant that generates short, natural conversation titles.\n"
        f"Language: {language}\n"
        f"Tone: Friendly and natural\n"
        f"Message: \"{message}\"\n"
        f"Respond ONLY with the title, no quotes or extra text."
    )
    title = await get_chatbot_response(prompt, user_id)
    return title.strip().replace('"', '')
