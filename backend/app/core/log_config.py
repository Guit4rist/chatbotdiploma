import logging
import logging.handlers
from pythonjsonlogger import jsonlogger
import os

log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, "app.log")

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)

handler = logging.handlers.RotatingFileHandler(
    log_file, maxBytes=2 * 1024 * 1024, backupCount=5
)
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(name)s %(message)s')
handler.setFormatter(formatter)

logger.addHandler(handler)
