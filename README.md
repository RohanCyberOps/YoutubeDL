
# YouTube Downloader API

This project is a YouTube Downloader API built with FastAPI for the backend and React for the frontend. It allows users to download YouTube videos in various formats.

## Features

- Download YouTube videos in different formats (audio/video).
- Serve downloaded files via HTTP.
- React frontend for user interaction.
- CORS enabled for frontend-backend communication.

## Technologies Used

- **Backend**: FastAPI, Python, yt-dlp
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (for future enhancements)
- **CI/CD**: GitHub Actions

## Prerequisites

- Python 3.11
- Node.js 18
- npm
- PostgreSQL (for future enhancements)

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/RohanCyberOps/YoutubeDL.git
    cd YoutubeDL
    ```

2. **Set up the backend**:
    ```sh
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    pip install -r src/server/requirements.txt
    ```

3. **Set up the frontend**:
    ```sh
    cd src/app
    npm install
    ```

## Running the Application

1. **Start the backend server**:
    ```sh
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    uvicorn src/server/main:app --host 127.0.0.1 --port 8000
    ```

2. **Start the frontend server**:
    ```sh
    cd src/app
    npm run dev
    ```

## API Endpoints

- `GET /`: Welcome message.
- `POST /download`: Download a YouTube video.
- `GET /download/{file_id}`: Serve the downloaded file.

## Example Request

To download a video, send a POST request to `/download` with the following JSON body:
```json
{
  "url": "https://youtu.be/your_video_id",
  "format": "video"
}
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/main.yml`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For any inquiries, please contact [RohanCyberOps](https://github.com/RohanCyberOps).
