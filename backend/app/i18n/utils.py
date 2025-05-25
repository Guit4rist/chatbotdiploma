# app/i18n/utils.py

from app.i18n.errors import ERROR_MESSAGES

def get_error_message(key: str, language: str = "English") -> str:
    return ERROR_MESSAGES.get(key, {}).get(language, ERROR_MESSAGES.get(key, {}).get("English", "Unknown error"))
