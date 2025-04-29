# backend/app/main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database
from fastapi.middleware.cors import CORSMiddleware

# Setup DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency for DB
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "LumaScope backend running!"}


@app.post("/register_user", response_model=schemas.UserCreate)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.create_user(db, user)
    return user


@app.post("/upload_file", response_model=schemas.UploadCreate)
def upload_file(upload: schemas.UploadCreate, db: Session = Depends(get_db)):
    db_upload = crud.create_upload(db, upload)
    return upload
