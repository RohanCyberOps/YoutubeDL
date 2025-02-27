// src/app/components/DownloadForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const DownloadForm = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [downloadLink, setDownloadLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/download', {
        url,
        format,
      });
      setDownloadLink(response.data.download_link);
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">YouTube URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="format">Format:</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="mp4">MP4</option>
            <option value="webm">WEBM</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <button type="submit">Download</button>
      </form>
      {downloadLink && (
        <div>
          <a href={downloadLink} download>
            Download your file
          </a>
        </div>
      )}
    </div>
  );
};

export default DownloadForm;