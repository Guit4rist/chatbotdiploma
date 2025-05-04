from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.db.database import SessionLocal
from app.models.user import User
import os
from dotenv import load_dotenv

load_dotenv()

# -------------Database Dependency-------------
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# --------------JWT settings-----------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# -----------------Current user from JWT token---------------
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
            raise credentials_exception
    

    user = db.query(User).filter(User.email == email).first()
    if user is None:
         raise credentials_exception
    return user