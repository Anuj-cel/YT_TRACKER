import React from 'react';
import formatTime from '../utils/formatTime';

function ShortsLobby({ shorts }) {
  if (!shorts || shorts.length === 0) return null;

  return (
    <div className=" mb-10 px-4">
     <h2 className="text-2xl font-bold text-gray-800 ">Shorts</h2>


      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        {shorts.map((short) => (
          <a
            key={short.id}
            href={`https://www.youtube.com/watch?v=${short.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[180px] max-w-[180px] flex-shrink-0 bg-zinc-900 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <div className="relative">
              <img
                src={short.thumbnail}
                alt={short.videoTitle}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                {formatTime(short.watchTime)==="0s"?"1s":formatTime(short.watchTime)}
              </span>
            </div>
            <div className="p-2">
              <h3 className="text-sm font-semibold text-white line-clamp-2">
                {short.videoTitle}
              </h3>
              <p className="text-xs text-gray-400">{short.channelTitle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default ShortsLobby;
