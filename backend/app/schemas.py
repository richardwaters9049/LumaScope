# backend/app/schemas.py

from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UploadCreate(BaseModel):
    filename: str
    upload_time: str
    user_id: int
