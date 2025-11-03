// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import formatTime from '../utils/formatTime';
// import ShortsLobby from './ShortsLobby';
// import "../App.css";
// import socket from '../socket';
// import ConfirmPopup from '../utils/ConfirmPopup';
// import PageWrapper from "../utils/PageWrapper";

// function WatchHistory() {
//   const [watchHistory, setWatchHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/watchhistory');
//         setWatchHistory(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching watch history:", error);
//         setError("No Data found for today!");
//         setLoading(false);
//       }
//     };

//     fetchData();

//     socket.on('watch-history', (data) => {
//       if (data) {
//         setWatchHistory(prev => {
//           const existingIndex = prev.findIndex(video => video.videoId === data.videoId);
//           if (existingIndex !== -1) {
//             const updated = [...prev];
//             updated[existingIndex] = data;
//             return updated;
//           } else {
//             return [...prev, data];
//           }
//         });
//       }
//     });

//     socket.on('error', (error) => {
//       console.error("Socket error:", error);
//       setError(error);
//     });

//     return () => {
//       socket.off('watch-history');
//       socket.off('error');
//     };
//   }, []);

//   const handleDelete = async (videoId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/watchhistory/${videoId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setWatchHistory(prev => prev.filter(video => video.videoId !== videoId));
//       } else {
//         console.error("Failed to delete video from watch history");
//       }
//     } catch (error) {
//       console.error("Error deleting video:", error);
//     }
//   };

//   const sortedHistory = watchHistory
//     ?.filter(video => !video.isShorts)
//     .slice()
//     .sort((a, b) => b.watchTime - a.watchTime);

//   return (
//     <PageWrapper>
//     <div className="bg-[#1E1E2F] text-white min-h-screen px-4 sm:px-6 lg:px-8 py-10">
//       <h1 className="text-3xl font-bold mb-8 text-center text-[#03A9F4]">📜 Watch History</h1>

//       <ShortsLobby
//         shorts={watchHistory.filter(video => video.isShorts)}
//         setWatchHistory={setWatchHistory}
//       />

//       {loading ? (
//         <div className="text-center text-gray-400 mt-10">Loading...</div>
//       ) : error ? (
//         <div className="text-center  mt-10"> {error}</div>
//       ) : sortedHistory?.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//           {sortedHistory.map((video, index) =>
//             video.videoId ? (
//               <div key={index} className="relative transition-transform transform hover:scale-105">
//                 <button
//                   onClick={() => setDeleteTarget(video.videoId)}
//                   className="absolute top-2 right-2 text-red-400 bg-[#2C2C3C] rounded-full px-2 py-1 shadow-md"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>

//                 {deleteTarget === video.videoId && (
//                   <ConfirmPopup
//                     onConfirm={() => {
//                       handleDelete(video.videoId);
//                       setDeleteTarget(null);
//                     }}
//                     onCancel={() => setDeleteTarget(null)}
//                     position="top-10 right-0"
//                   />
//                 )}

//                 <a
//                   href={`https://www.youtube.com/watch?v=${video.videoId}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <div className="bg-[#2C2C3C] rounded-xl shadow-lg p-3 h-64 flex flex-col">
//                     <img
//                       src={video.thumbnail}
//                       alt={video.videoTitle}
//                       className="w-full h-32 object-cover mb-3 rounded-md"
//                     />
//                     <div className="flex-1 overflow-hidden">
//                       <h3 className="text-sm font-semibold mb-1 truncate">{video.videoTitle}</h3>
//                       <p className="text-gray-400 text-xs">Watch time: {formatTime(video.watchTime)}</p>
//                       <p className="text-gray-400 text-xs">Category: {video.categoryName}</p>
//                     </div>
//                   </div>
//                 </a>
//               </div>
//             ) : null
//           )}
//         </div>
//       ) : (
//         <p className="text-gray-400 text-center mt-8">No watch history available.</p>
//       )}
//     </div>
//     </PageWrapper>
//   );
// }

// export default WatchHistory;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formatTime from '../utils/formatTime';
import ShortsLobby from './ShortsLobby';
import { History, Trash2, ExternalLink, Clock, Tag } from 'lucide-react';
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

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading your watch history...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
          <div className="bg-red-900/30 border-2 border-red-500 rounded-2xl p-8 max-w-md backdrop-blur-sm">
            <div className="text-red-400 text-5xl mb-4 text-center">⚠️</div>
            <p className="text-red-200 text-center text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header - matching Home page style */}
        <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 p-3 rounded-xl">
                <History className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Watch History
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg">Your recently watched videos and content</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Shorts Section */}
            <ShortsLobby
              shorts={watchHistory.filter(video => video.isShorts)}
              setWatchHistory={setWatchHistory}
            />

            {sortedHistory?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedHistory.map((video, index) =>
                  video.videoId ? (
                    <div 
                      key={index} 
                      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                    >
                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleteTarget(video.videoId)}
                        className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur-sm hover:bg-red-500/90 text-gray-400 hover:text-white rounded-full p-2 transition-all duration-200 shadow-lg"
                        aria-label="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Confirm Popup */}
                      {deleteTarget === video.videoId && (
                        <ConfirmPopup
                          onConfirm={() => {
                            handleDelete(video.videoId);
                            setDeleteTarget(null);
                          }}
                          onCancel={() => setDeleteTarget(null)}
                          position="top-14 right-0"
                        />
                      )}

                      {/* Video Link */}
                      <a
                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        {/* Thumbnail */}
                        <div className="relative overflow-hidden">
                          <img
                            src={video.thumbnail}
                            alt={video.videoTitle}
                            className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                          
                          {/* External Link Icon */}
                          <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-base font-semibold mb-3 line-clamp-2 leading-tight text-white group-hover:text-purple-400 transition-colors">
                            {video.videoTitle}
                          </h3>
                          
                          <div className="space-y-2">
                            {/* Watch Time */}
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{formatTime(video.watchTime)}</span>
                            </div>
                            
                            {/* Category */}
                            <div className="flex items-center gap-2 text-sm">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{video.categoryName}</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-16 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-3">No watch history yet</h2>
                <p className="text-gray-400">Videos you watch will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default WatchHistory;