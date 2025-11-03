// import React, { useState, useEffect } from 'react';
// import { PieGraph } from "../Charts/PieGraph";
// import socket from '../socket';
// import formatTime from '../utils/formatTime';
// import PageWrapper from "../utils/PageWrapper";

// function Home() {
//     const [watchTime, setWatchTime] = useState({
//         totalWatchTime: 0,
//         totalShorts: 0,
//         records: []
//     });
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const today = new Date().toISOString().split("T")[0];

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await fetch("http://localhost:3000/watchtime");
//                 if (!res.ok) {
//                     const errorData = await res.json();
//                     throw new Error(errorData.message);
//                 }
//                 const data = await res.json();
//                 console.log("This is OldData ",data)
//                 setWatchTime(data);
               
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();

//         socket.on("watchTimeDataUpdated", (newData) => {
//             setWatchTime(newData);
//             console.log("This is NewData ",newData)
//         });

//         return () => {
//             socket.off("watchTimeDataUpdated");
//         };
//     }, []);

//     const todayRecords = watchTime.records.filter(r => r.date === today);

//     const mergedCategories = {};
//     todayRecords.forEach(record => {
//         record.categories.forEach(cat => {
//             const key = cat.category; // Changed key to just category
//             if (!mergedCategories[key]) {
//                 mergedCategories[key] = {
//                     category: cat.category,
//                     watchTime: 0,
//                 };
//             }
//             mergedCategories[key].watchTime += cat.watchTime;
//         });
//     });

//     const todayCategoryData = Object.values(mergedCategories);

//     if (loading) return <p className="text-white text-center py-10 text-lg">Loading...</p>;
//     if (error) return <p className="text-red-400 text-center py-10">{error}</p>;

//     return (
//         <PageWrapper>
//         <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 sm:px-6 lg:px-8 py-10">
//     <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-cyan-400 drop-shadow-md">
//         📊 YouTube Watch Time Dashboard
//     </h1>

//     {watchTime.totalWatchTime > 0 ? (
//         <>
//             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
//                 <div className="bg-gray-800 border border-gray-700 text-gray-100 rounded-2xl shadow-xl p-6 w-full sm:w-1/2 max-w-xs text-center transition-transform hover:scale-105 duration-200">
//                     <h3 className="text-lg font-semibold mb-2 text-cyan-300">Total Video Time</h3>
//                     <p className="text-2xl font-bold">{formatTime(Math.max(watchTime.totalWatchTime - watchTime.totalShorts))}</p>
//                 </div>
//                 <div className="bg-gray-800 border border-gray-700 text-gray-100 rounded-2xl shadow-xl p-6 w-full sm:w-1/2 max-w-xs text-center transition-transform hover:scale-105 duration-200">
//                     <h3 className="text-lg font-semibold mb-2 text-pink-300">Total Shorts Time</h3>
//                     <p className="text-2xl font-bold">{formatTime(watchTime.totalShorts)}</p>
//                 </div>
//             </div>

//             {todayCategoryData.length > 0 ? (
//                 <div className="max-w-3xl mx-auto bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 style=height: 434px;overflow:hidden;">
//                     <PieGraph categories={todayCategoryData} />
//                 </div>
//             ) : (
//                 <p className="text-center text-gray-400">No category data available for today.</p>
//             )}
//         </>
//     ) : (
//         <p className="text-center text-gray-400">No Watch Time Data Available for Today.</p>
//     )}
// </div>
// </PageWrapper>
//     );
// }

// export default Home;



import React, { useState, useEffect } from 'react';
import { Clock, Video, Zap, TrendingUp, Calendar } from 'lucide-react';
import { PieGraph } from "../Charts/PieGraph";
import socket from '../socket';
import formatTime from '../utils/formatTime';
import PageWrapper from "../utils/PageWrapper";

function Home() {
  const [watchTime, setWatchTime] = useState({
    totalWatchTime: 0,
    totalShorts: 0,
    records: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 100);

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/watchtime");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message);
        }
        const data = await res.json();
        setWatchTime(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("watchTimeDataUpdated", (newData) => {
      setWatchTime(newData);
    });

    return () => {
      socket.off("watchTimeDataUpdated");
    };
  }, []);

  const todayRecords = watchTime.records.filter(r => r.date === today);
  const mergedCategories = {};
  
  todayRecords.forEach(record => {
    record.categories.forEach(cat => {
      const key = cat.category;
      if (!mergedCategories[key]) {
        mergedCategories[key] = {
          category: cat.category,
          watchTime: 0,
        };
      }
      mergedCategories[key].watchTime += cat.watchTime;
    });
  });

  const todayCategoryData = Object.values(mergedCategories);
  const videoTime = watchTime.totalWatchTime - watchTime.totalShorts;
  const totalTime = watchTime.totalWatchTime;

  // Loading state
  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading your stats...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Error state
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
        <div className={`transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Watch Time
                </h1>
                <div className="flex items-center gap-2 text-gray-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Today</span>
                </div>
              </div>
              <p className="text-gray-400 text-lg">Your YouTube activity dashboard</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
              {watchTime.totalWatchTime > 0 ? (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Total Time Card */}
                    <div className="group bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-500/20 p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                          <Clock className="w-6 h-6 text-purple-400" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-purple-400 opacity-60" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Total Time</p>
                      <p className="text-3xl font-bold text-white">{formatTime(totalTime)}</p>
                    </div>

                    {/* Video Time Card */}
                    <div className="group bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-cyan-500/20 p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                          <Video className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="text-xs font-semibold text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">
                          {totalTime > 0 ? Math.round((videoTime / totalTime) * 100) : 0}%
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Videos</p>
                      <p className="text-3xl font-bold text-white">{formatTime(videoTime)}</p>
                    </div>

                    {/* Shorts Time Card */}
                    <div className="group bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-pink-500/20 p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                          <Zap className="w-6 h-6 text-pink-400" />
                        </div>
                        <div className="text-xs font-semibold text-pink-400 bg-pink-500/20 px-2 py-1 rounded-full">
                          {totalTime > 0 ? Math.round((watchTime.totalShorts / totalTime) * 100) : 0}%
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Shorts</p>
                      <p className="text-3xl font-bold text-white">{formatTime(watchTime.totalShorts)}</p>
                    </div>

                    {/* Categories Card */}
                    <div className="group bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-500/20 p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                          <div className="text-2xl">📁</div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Categories</p>
                      <p className="text-3xl font-bold text-white">{todayCategoryData.length}</p>
                    </div>
                  </div>

                  {/* Chart Section */}
                  {todayCategoryData.length > 0 ? (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Category Breakdown</h2>
                        <p className="text-gray-400">See where you spent your time today</p>
                      </div>
                      <div className="bg-slate-900/50 rounded-2xl p-4 sm:p-6 overflow-hidden">
                        <PieGraph categories={todayCategoryData} />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <p className="text-xl text-gray-300 font-medium">No category data yet</p>
                      <p className="text-gray-400 mt-2">Start watching videos to see your breakdown</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-16 text-center">
                  <div className="text-7xl mb-6">🎬</div>
                  <h2 className="text-3xl font-bold text-white mb-3">No Data Yet</h2>
                  <p className="text-gray-400 text-lg max-w-md mx-auto">
                    Start watching YouTube videos and your watch time will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;