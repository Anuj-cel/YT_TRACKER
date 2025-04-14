import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatTime from '../utils/formatTime';
import ShortsLobby from './ShortsLobby';
import "../App.css";
import socket from '../socket';

function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/watchhistory');
        setWatchHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching watch history:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();

    socket.on('watch-history', (data) => {
      if (data) {
        setWatchHistory(prev => {
          const existingIndex = prev.findIndex(video => video.videoId === data.videoId);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = data;
            return updated;
          } else {
            return [...prev, data];
          }
        });
      } else {
        console.error("Invalid socket data:", data);
      }
    });

    socket.on('error', (error) => {
      console.error("Socket error:", error);
      setError(error);
    });

    return () => {
      socket.off('watch-history');
      socket.off('error');
    };
  }, []);

  const sortedHistory = watchHistory
    ?.filter(video => !video.isShorts)
    .slice()
    .sort((a, b) => b.watchTime - a.watchTime);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Watch History</h1>

      <ShortsLobby shorts={watchHistory.filter(video => video.isShorts)} />

      {loading ? (
        <div className="text-center text-gray-500 mt-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 mt-10">Error: {error}</div>
      ) : sortedHistory?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedHistory.map((video, index) => (
            <a
              key={index}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform transform hover:scale-105"
            >
              <div className="bg-white rounded-xl shadow-lg p-3 h-64 flex flex-col">
                <img
                  src={video.thumbnail}
                  alt={video.videoTitle}
                  className="w-full h-32 object-cover mb-3 rounded-md"
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-sm font-semibold mb-1 truncate">{video.videoTitle}</h3>
                  <p className="text-gray-600 text-xs">Watch time: {formatTime(video.watchTime)}</p>
                  <p className="text-gray-600 text-xs">Category: {video.categoryName}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-8">No watch history available.</p>
      )}
    </div>
  );
}

export default WatchHistory;
