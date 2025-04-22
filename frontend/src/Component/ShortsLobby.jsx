import React, { useState } from 'react';
import ConfirmPopup from '../utils/ConfirmPopup';

function ShortsLobby({ shorts, setWatchHistory }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDelete = async (videoId) => {
    try {
      const response = await fetch(`http://localhost:3000/watchhistory/${videoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setWatchHistory((prev) => prev.filter((short) => short.videoId !== videoId));
      } else {
        console.error('Failed to delete short');
      }
    } catch (error) {
      console.error('Error deleting short:', error);
    }
  };

  if (!shorts || shorts.length === 0) return null;

  return (
    <div className="mb-10 px-4">
      <h2 className="text-2xl font-bold text-white mb-2">Shorts</h2>

      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {shorts.slice().reverse().map((short) => short.videoId==undefined?null:(
          <div
            key={short.id}
            className="relative min-w-[180px] max-w-[180px] flex-shrink-0 bg-zinc-900 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <a
              href={`https://www.youtube.com/watch?v=${short.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative">
                <img
                  src={short.thumbnail}
                  alt={short.videoTitle}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold text-white line-clamp-2">{short.videoTitle}</h3>
                <p className="text-xs text-gray-400">{short.channelTitle}</p>
              </div>
            </a>

            <button
              onClick={() => setDeleteTarget(short.videoId)}
              className="absolute top-2 right-2 text-red-600 bg-white rounded-full px-2 py-0.5 shadow"
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

            {deleteTarget === short.videoId && (
              <ConfirmPopup
                onConfirm={() => {
                  handleDelete(short.videoId);
                  setDeleteTarget(null);
                }}
                onCancel={() => setDeleteTarget(null)}
                position="top-12 right-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShortsLobby;
