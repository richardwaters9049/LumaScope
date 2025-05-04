import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# Define upload folder path
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "files")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    return {
        "filename": file.filename,
        "status": "success",
        "message": f"File saved to {file_location}",
    }
