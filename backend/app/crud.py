# backend/app/crud.py

from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return pwd_context.hash(password)


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username, email=user.email, hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_upload(db: Session, upload: schemas.UploadCreate):
    db_upload = models.Upload(
        filename=upload.filename, upload_time=upload.upload_time, user_id=upload.user_id
    )
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    return db_upload
