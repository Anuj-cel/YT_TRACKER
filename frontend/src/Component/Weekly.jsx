// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { PieGraph } from '../Charts/PieGraph';
// import "../App.css";
// import socket from '../socket';
// import PageWrapper from "../utils/PageWrapper";

// function Weekly() {
//   const [weekly, setWeekly] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/watchTime/weekly");
//         console.log("This is from weekly ",res)
//         const mergedData = mergeByDate(res.data);
//         setWeekly(mergedData);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchData();

//     socket.on("weeklyDataUpdated", (newData) => {
//       const mergedData = mergeByDate(newData);
//       setWeekly(mergedData);
//     });

//     return () => {
//       socket.off("weeklyDataUpdated");
//     };
//   }, []);

  
//   const mergeByDate = (data) => {
//     const map = {};

//     data.forEach((entry) => {
//       const date = entry.date;

//       if (!map[date]) {
//         map[date] = {
//           date: date,
//           categories: [...entry.categories]
//         };
//       } else {
//         entry.categories.forEach((cat) => {
//           const existing = map[date].categories.find(c => c.category === cat.category);
//           if (existing) {
//             existing.watchTime += cat.watchTime;
//           } else {
//             map[date].categories.push({ ...cat });
//           }
//         });
//       }
//     });

//     return Object.values(map);
//   };

//   return (
//     <PageWrapper>
//     <div className="p-6 bg-gray-900 min-h-screen text-white">
//       <h2 className="text-3xl font-bold text-center mb-10 text-cyan-400">
//         📅 Weekly Category Watch Time
//       </h2>
// {console.log("This is from weekly ",weekly)}
//       <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {weekly.length>0?weekly.map((data, index) => {
//           const formattedDate = new Date(data.date).toDateString();
//           return (
//             <div
//               key={index}
//               className="bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
//             >
//               <h4 className="text-lg font-semibold text-gray-300 mb-4">
//                 {formattedDate}
//               </h4>
//               <div className="w-44 h-44">
//                 <PieGraph categories={data.categories} />
//               </div>
//             </div>
//           );
//         }):(
//                 <p className="text-center text-gray-400">No weekly data available.</p>
//             )}
//       </div>
//     </div>
//     </PageWrapper>
//   );
// }

// export default Weekly;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from '../Charts/PieGraph';
import { Calendar } from 'lucide-react';
import "../App.css";
import socket from '../socket';
import PageWrapper from "../utils/PageWrapper";

function Weekly() {
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/watchTime/weekly");
        const mergedData = mergeByDate(res.data);
        setWeekly(mergedData);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
    socket.on("weeklyDataUpdated", (newData) => {
      const mergedData = mergeByDate(newData);
      setWeekly(mergedData);
    });
    return () => {
      socket.off("weeklyDataUpdated");
    };
  }, []);
  
  const mergeByDate = (data) => {
    const map = {};
    data.forEach((entry) => {
      const date = entry.date;
      if (!map[date]) {
        map[date] = {
          date: date,
          categories: [...entry.categories]
        };
      } else {
        entry.categories.forEach((cat) => {
          const existing = map[date].categories.find(c => c.category === cat.category);
          if (existing) {
            existing.watchTime += cat.watchTime;
          } else {
            map[date].categories.push({ ...cat });
          }
        });
      }
    });
    return Object.values(map);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading weekly data...</p>
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
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Weekly Watch Time
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg">Track your viewing habits across categories</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {weekly.map((data, index) => {
                const formattedDate = new Date(data.date).toDateString();
                return (
                  <div
                    key={index}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    <h4 className="text-lg font-semibold text-gray-300 mb-4 text-center">
                      {formattedDate}
                    </h4>
                    <div className="w-44 h-44">
                      <PieGraph categories={data.categories} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Weekly;