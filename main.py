import yt_dlp

url = input("Enter the YouTube video URL: ")

ydl_opts = {
    'format': 'best',  # Download the best quality available
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    print("Download complete!")
except Exception as e:
    print(f"An error occurred: {e}")
