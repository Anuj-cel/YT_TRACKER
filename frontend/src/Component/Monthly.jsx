// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { PieGraph } from '../Charts/PieGraph';
// import socket from '../socket';
// import PageWrapper from "../utils/PageWrapper";
// import '../App.css'

// function Monthly() {
//   const [monthlyData, setMonthlyData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/watchTime/monthly");
//         const merged = mergeSameDateEntries(res.data);
//         setMonthlyData(merged);
//       } catch (err) {
//         console.error("Failed to fetch monthly data", err);
//       }
//     };
//     fetchData();

//     socket.on("monthlyDataUpdated", (newData) => {
//       const merged = mergeSameDateEntries(newData);
//       setMonthlyData(merged);
//     });

//     return () => {
//       socket.off("monthlyDataUpdated");
//     };
//   }, []);

//   const mergeSameDateEntries = (data) => {
//     const mergedMap = {};

//     data.forEach(entry => {
//       const dateKey = entry.date;

//       if (!mergedMap[dateKey]) {
//         mergedMap[dateKey] = { ...entry, categories: [...entry.categories] };
//       } else {
//         entry.categories.forEach(cat => {
//           const existing = mergedMap[dateKey].categories.find(c => c.category === cat.category);
//           if (existing) {
//             existing.watchTime += cat.watchTime;
//           } else {
//             mergedMap[dateKey].categories.push({ ...cat });
//           }
//         });
//       }
//     });

//     return Object.values(mergedMap);
//   };

//   const formatMonth = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
//   };

//   return (
//     <PageWrapper>
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h2 className="text-3xl font-bold text-center mb-10 text-cyan-400">📆 Monthly Category Watch Time</h2>

//       <div 
//         className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
//       >
//         {monthlyData.slice().reverse().map((monthItem, index) => (
//           <div 
//             key={index}
//             className="bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
//           >
//             <h4 className="text-lg font-semibold text-gray-300 mb-4">
//               {formatMonth(monthItem.date)}
//             </h4>

//             <div className="w-44 h-44">
//               <PieGraph categories={monthItem.categories} />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     </PageWrapper>
//   );
// }

// export default Monthly;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from '../Charts/PieGraph';
import { Calendar } from 'lucide-react';
import socket from '../socket';
import PageWrapper from "../utils/PageWrapper";
import '../App.css';

function Monthly() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/watchTime/monthly");
        const merged = mergeSameDateEntries(res.data);
        setMonthlyData(merged);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch monthly data", err);
        setLoading(false);
      }
    };
    fetchData();
    socket.on("monthlyDataUpdated", (newData) => {
      const merged = mergeSameDateEntries(newData);
      setMonthlyData(merged);
    });
    return () => {
      socket.off("monthlyDataUpdated");
    };
  }, []);

  const mergeSameDateEntries = (data) => {
    const mergedMap = {};
    data.forEach(entry => {
      const dateKey = entry.date;
      if (!mergedMap[dateKey]) {
        mergedMap[dateKey] = { ...entry, categories: [...entry.categories] };
      } else {
        entry.categories.forEach(cat => {
          const existing = mergedMap[dateKey].categories.find(c => c.category === cat.category);
          if (existing) {
            existing.watchTime += cat.watchTime;
          } else {
            mergedMap[dateKey].categories.push({ ...cat });
          }
        });
      }
    });
    return Object.values(mergedMap);
  };

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading monthly data...</p>
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
                  Monthly Watch Time
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-lg">View your watch time trends month by month</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {monthlyData.slice().reverse().map((monthItem, index) => (
                <div 
                  key={index}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <h4 className="text-lg font-semibold text-gray-300 mb-4 text-center">
                    {formatMonth(monthItem.date)}
                  </h4>
                  <div className="w-44 h-44">
                    <PieGraph categories={monthItem.categories} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Monthly;