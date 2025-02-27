import logging
import os
import re
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from yt_dlp import YoutubeDL
import socket

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow React app to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to validate YouTube URLs
def is_valid_youtube_url(url: str) -> bool:
    youtube_regex = (
        r"(https?://)?(www\.)?"
        r"(youtube|youtu|youtube-nocookie)\.(com|be)/"
        r"(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})"
    )
    return re.match(youtube_regex, url) is not None

# Define request model
class DownloadRequest(BaseModel):
    url: str
    format: str

@app.get("/")
async def read_root():
    return {"message": "Welcome to the YouTube Downloader API"}

@app.post("/download")
async def download_video(request: DownloadRequest):
    try:
        # Validate YouTube URL
        if not is_valid_youtube_url(request.url):
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        ydl_opts = {
            'format': 'bestaudio/best' if request.format == 'audio' else 'best',
            'outtmpl': os.path.join(DOWNLOAD_DIR, f"{uuid.uuid4()}.%(ext)s"),
        }

        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(request.url, download=True)
            file_path = ydl.prepare_filename(info_dict)

        logger.info(f"Downloaded file saved to {file_path}")

        return {"download_link": f"http://127.0.0.1:8000/download/{os.path.basename(file_path)}", "format": request.format}
    except Exception as e:
        logger.error(f"Error downloading video: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{file_id}")
async def serve_file(file_id: str):
    file_path = os.path.join(DOWNLOAD_DIR, file_id)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
        return FileResponse(file_path)
    except ConnectionResetError as e:
        logger.error(f"Connection reset error: {e}")
        raise HTTPException(status_code=500, detail="Connection was reset by the client or server")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)