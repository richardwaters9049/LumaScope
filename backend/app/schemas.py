# app/schemas.py
from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    password: str  # Plain password, to be hashed before storing

    class Config:
        orm_mode = (
            True  # This tells Pydantic to treat SQLAlchemy models as dictionaries
        )


class User(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    created_at: datetime

    class Config:
        orm_mode = True
