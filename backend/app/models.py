from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base  # Importing Base from the shared database module
from datetime import datetime


class Upload(Base):
    __tablename__ = "uploads"  # Table name in the database

    id = Column(
        Integer, primary_key=True, index=True
    )  # Primary key: Unique ID for each upload
    filename = Column(String, index=True)  # Name of the file
    file_path = Column(String)  # Path where the file is saved on the server
    upload_time = Column(
        DateTime, default=datetime.utcnow
    )  # Timestamp of when the file was uploaded
    user_id = Column(
        Integer, ForeignKey("users.id")
    )  # Foreign key: User who uploaded the file

    # Relationship with the User model (assuming there is a User model with id field)
    user = relationship(
        "User", back_populates="uploads"
    )  # Establish a relationship with the User model


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)

    # Relationship with the Upload model
    uploads = relationship(
        "Upload", back_populates="user"
    )  # This connects the User and Upload models
