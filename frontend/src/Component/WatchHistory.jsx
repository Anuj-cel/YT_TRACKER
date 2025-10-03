import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatTime from '../utils/formatTime';
import ShortsLobby from './ShortsLobby';
import "../App.css";
import socket from '../socket';
import ConfirmPopup from '../utils/ConfirmPopup';
import PageWrapper from "../utils/PageWrapper";

function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/watchhistory');
        setWatchHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching watch history:", error);
        setError("No data found ");
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

  const handleDelete = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:3000/watchhistory/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWatchHistory(prev => prev.filter(video => video.videoId !== videoId));
      } else {
        console.error("Failed to delete video from watch history");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const sortedHistory = watchHistory
    ?.filter(video => !video.isShorts)
    .slice()
    .sort((a, b) => b.watchTime - a.watchTime);

  return (
    <PageWrapper>
    <div className="bg-[#1E1E2F] text-white min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#03A9F4]">📜 Watch History</h1>

      <ShortsLobby
        shorts={watchHistory.filter(video => video.isShorts)}
        setWatchHistory={setWatchHistory}
      />

      {loading ? (
        <div className="text-center text-gray-400 mt-10">Loading...</div>
      ) : error ? (
        <div className="text-center  mt-10"> {error}</div>
      ) : sortedHistory?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedHistory.map((video, index) =>
            video.videoId ? (
              <div key={index} className="relative transition-transform transform hover:scale-105">
                <button
                  onClick={() => setDeleteTarget(video.videoId)}
                  className="absolute top-2 right-2 text-red-400 bg-[#2C2C3C] rounded-full px-2 py-1 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {deleteTarget === video.videoId && (
                  <ConfirmPopup
                    onConfirm={() => {
                      handleDelete(video.videoId);
                      setDeleteTarget(null);
                    }}
                    onCancel={() => setDeleteTarget(null)}
                    position="top-10 right-0"
                  />
                )}

                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-[#2C2C3C] rounded-xl shadow-lg p-3 h-64 flex flex-col">
                    <img
                      src={video.thumbnail}
                      alt={video.videoTitle}
                      className="w-full h-32 object-cover mb-3 rounded-md"
                    />
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm font-semibold mb-1 truncate">{video.videoTitle}</h3>
                      <p className="text-gray-400 text-xs">Watch time: {formatTime(video.watchTime)}</p>
                      <p className="text-gray-400 text-xs">Category: {video.categoryName}</p>
                    </div>
                  </div>
                </a>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-8">No watch history available.</p>
      )}
    </div>
    </PageWrapper>
  );
}

export default WatchHistory;
