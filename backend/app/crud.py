# app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError

# Setup the password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(db: Session, user: schemas.UserCreate):
    # Hash the user's password before saving it
    hashed_password = pwd_context.hash(user.password)

    db_user = models.User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
    )

    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        return None  # User with the same email/username might already exist
