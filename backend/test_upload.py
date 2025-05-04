import requests

# Replace this path with the actual path to your test image file
TEST_IMAGE_PATH = "test_smear.jpg"

# Optionally, generate a simple test image if it doesn't exist
from PIL import Image
import os

if not os.path.exists(TEST_IMAGE_PATH):
    img = Image.new("RGB", (100, 100), color=(155, 0, 0))  # A red square
    img.save(TEST_IMAGE_PATH)
    print(f"Generated test image: {TEST_IMAGE_PATH}")

# Upload the image to the FastAPI backend
url = "http://localhost:8000/upload"
with open(TEST_IMAGE_PATH, "rb") as file:
    files = {"file": (TEST_IMAGE_PATH, file, "image/jpeg")}
    response = requests.post(url, files=files)

# Print the backend response
try:
    data = response.json()
    print("Response JSON:")
    print(data)
except Exception:
    print("Failed to parse JSON:")
    print(response.text)
