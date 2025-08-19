import os
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
from app import auth
from app.uploads.router import router as uploads_router
from app.models import Base, User
from app.database import engine, SessionLocal

import bcrypt  # type: ignore
from . import auth, crud

# ---------------------------------------
# Database Configuration
# ---------------------------------------
Base.metadata.create_all(bind=engine)

# ---------------------------------------
# Pydantic schemas
# ---------------------------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str

    class Config:
        orm_mode = True


# ---------------------------------------
# FastAPI app
# ---------------------------------------
app = FastAPI()


def get_db():
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------
# Middleware & Routers
# ---------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add production URL when available
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "X-Total-Count"],
)

app.include_router(auth.router)
app.include_router(uploads_router, prefix="/upload", tags=["Upload"])


# ---------------------------------------
# User Registration Endpoint
# ---------------------------------------
@app.post("/users/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email) or crud.get_user_by_username(
        db, user.username
    ):
        raise HTTPException(status_code=400, detail="User already registered")

    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    new_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
