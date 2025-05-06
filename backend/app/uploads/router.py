import os
import shutil
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

from app.database import get_db
from app.models import Upload, User

load_dotenv()

router = APIRouter()

# Constants
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "files")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# 🔒 Decode token and get current user
def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token or expired token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Accept both /upload and /upload/ without redirecting
@router.post("", include_in_schema=True)
@router.post("/", include_in_schema=False)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    filename = file.filename
    file_location = os.path.join(UPLOAD_FOLDER, filename)

    try:
        # Save file
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Record in database
        upload_record = Upload(
            filename=filename,
            file_path=file_location,
            user_id=current_user.id,
            upload_time=datetime.utcnow(),
        )
        db.add(upload_record)
        db.commit()
        db.refresh(upload_record)

        return {
            "status": "success",
            "message": "File saved and recorded successfully",
            "upload_id": upload_record.id,
            "file": {
                "filename": upload_record.filename,
                "path": upload_record.file_path,
                "user_id": upload_record.user_id,
                "upload_time": upload_record.upload_time,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
