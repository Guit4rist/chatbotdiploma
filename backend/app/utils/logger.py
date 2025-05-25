import logging
import os

# Ensure the logs directory exists
os.makedirs("logs", exist_ok=True)

# Configure the logger
title_logger = logging.getLogger("title_generator")
title_logger.setLevel(logging.INFO)

file_handler = logging.FileHandler("logs/title_generation.log")
formatter = logging.Formatter('%(asctime)s - USER_ID: %(user_id)s - MESSAGE: "%(message_text)s" - TITLE: "%(title)s"')
file_handler.setFormatter(formatter)

title_logger.addHandler(file_handler)

# Custom logging function with extra context
def log_title_generation(user_id: int, message_text: str, title: str):
    title_logger.info("Title generated", extra={
        "user_id": user_id,
        "message_text": message_text,
        "title": title
    })
