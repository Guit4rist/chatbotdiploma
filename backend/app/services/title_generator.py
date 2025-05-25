import logging
import os
from logging.handlers import RotatingFileHandler
import gzip
import shutil

from app.services.chatbot_service import get_chatbot_response

# Create logs directory if it doesn't exist
LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)
LOG_PATH = os.path.join(LOG_DIR, "title_generation.log")

# Supported languages list (you can expand this as needed)
SUPPORTED_LANGUAGES = {
    "English", "Spanish", "French", "German", "Chinese", "Arabic",
    "Japanese", "Korean", "Russian", "Portuguese", "Italian", "Turkish",
    "Polish", "Dutch", "Ukrainian", "Hindi"
}

# Custom RotatingFileHandler with gzip compression
class GZipRotatingFileHandler(RotatingFileHandler):
    def doRollover(self):
        super().doRollover()
        if self.backupCount > 0:
            log_filename = f"{self.baseFilename}.1"
            gz_filename = f"{log_filename}.gz"
            if os.path.exists(log_filename):
                with open(log_filename, 'rb') as f_in, gzip.open(gz_filename, 'wb') as f_out:
                    shutil.copyfileobj(f_in, f_out)
                os.remove(log_filename)

# Setup logger
logger = logging.getLogger("title_generator")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = GZipRotatingFileHandler(
        LOG_PATH,
        maxBytes=100_000,
        backupCount=5
    )
    formatter = logging.Formatter("[%(asctime)s] %(levelname)s: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)


# --- Title Generation Function with Fallback ---
async def generate_title_from_message(message: str, user_id: int, language: str = "English") -> str:
    # Language fallback
    original_language = language
    if language not in SUPPORTED_LANGUAGES:
        logger.warning(f"Unsupported language '{language}' for user_id={user_id}. Falling back to English.")
        language = "English"

    prompt = (
        f"You are an assistant that creates short, natural-sounding conversation titles.\n"
        f"Always reply in the user's language: {language}\n"
        f"Message: \"{message}\"\n"
        f"Respond ONLY with the title — no quotes, no extra text."
    )

    try:
        title = await get_chatbot_response(prompt, user_id, preferred_language=language)
        clean_title = title.strip().replace('"', '')

        logger.info(
            f"Generated title for user_id={user_id}, language={language} (original={original_language}):\n"
            f"  Original Message: {message}\n"
            f"  Title: {clean_title}"
        )

        return clean_title

    except Exception as e:
        logger.error(f"Title generation failed for user_id={user_id}: {str(e)}")
        raise
