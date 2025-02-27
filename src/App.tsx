import React, { useState } from 'react';
import { Download, Youtube, CheckCircle, AlertCircle, Music, Video, Film } from 'lucide-react';

function App() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('high');
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const triggerDownload = (fileId: string, format: string) => {
    const downloadUrl = `http://127.0.0.1:8000/download/${fileId}?format=${format}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setStatus('error');
      setStatusMessage('Please enter a valid YouTube URL');
      return;
    }

    setIsDownloading(true);
    setStatus(null);
    setProgress(0);

    try {
      const response = await fetch('http://127.0.0.1:8000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          format: format,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start download');
      }

      const data = await response.json();
      const { download_link, format: fileFormat } = data;

      // Poll the backend to check if the download is complete
      const pollDownloadStatus = async () => {
        const startTime = Date.now();
        const timeout = 300000; // 5 minutes timeout

        while (true) {
          if (Date.now() - startTime > timeout) {
            throw new Error('Download timed out');
          }

          const statusResponse = await fetch(download_link);
          if (statusResponse.ok) {
            setProgress(100);
            setIsDownloading(false);
            setStatus('success');
            setStatusMessage('Download completed successfully!');
            triggerDownload(download_link.split('/').pop(), fileFormat); // Pass fileFormat to triggerDownload
            break;
          } else if (statusResponse.status === 404) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before polling again
          } else {
            throw new Error('Download failed');
          }
        }
      };

      await pollDownloadStatus();
    } catch (error) {
      setIsDownloading(false);
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 animate-pulse"></div>

        {/* Animated Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        {/* Animated Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01] relative z-10">
        {/* Header */}
        <div className="bg-gray-700/90 p-6 flex items-center gap-3">
          <Youtube className="text-red-500" size={28} />
          <h1 className="text-2xl font-bold">YouTube Downloader</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleDownload} className="p-6 space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300">
              Video URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Format & Quality Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Format</label>
              <div className="bg-gray-700/80 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setFormat('mp4')}
                    className={`flex items-center justify-center py-2 px-3 text-sm transition-colors ${
                      format === 'mp4' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'
                    }`}
                  >
                    <Video size={16} className="mr-1" />
                    MP4
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('webm')}
                    className={`flex items-center justify-center py-2 px-3 text-sm transition-colors ${
                      format === 'webm' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'
                    }`}
                  >
                    <Film size={16} className="mr-1" />
                    WEBM
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('audio')}
                    className={`flex items-center justify-center py-2 px-3 text-sm transition-colors ${
                      format === 'audio' ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'
                    }`}
                  >
                    <Music size={16} className="mr-1" />
                    Audio
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Quality</label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                disabled={format === 'audio'}
              >
                <option value="low">Low (360p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="high">High (1080p)</option>
                {format !== 'audio' && <option value="very-high">Very High (4K)</option>}
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Downloading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700/80 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              status === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
            }`}>
              {status === 'success' ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <p className="text-sm">{statusMessage}</p>
            </div>
          )}

          {/* Download Button */}
          <button
            type="submit"
            disabled={isDownloading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors duration-200 ${
              isDownloading ? 'opacity-70 cursor-not-allowed' : ''
            } relative overflow-hidden group`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center justify-center gap-2">
              <Download size={18} className="group-hover:animate-bounce" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-700/60 p-4 text-center text-sm text-gray-400">
          For educational purposes only. Respect copyright laws.
        </div>
      </div>
    </div>
  );
}

export default App;