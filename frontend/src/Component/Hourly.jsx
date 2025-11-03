// import "../App.css";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import BarGraph from "../Charts/BarGraph";
// import socket from "../socket";
// import PageWrapper from "../utils/PageWrapper";

// const Hourly = () => {
//   const [hourData, setHourData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/watchTime/hourly");
//         if (response.status !== 200) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         setHourData(response.data);
//         console.log("This is hourly data ", response.data);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();

//     const handleHourlyDataUpdated = (newData) => setHourData(newData);
//     socket.on("hourlyDataUpdated", handleHourlyDataUpdated);

//     return () => {
//       socket.off("hourlyDataUpdated", handleHourlyDataUpdated);
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-xl font-medium mt-10 text-gray-400">
//         ⏳ Loading data...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <PageWrapper>
//         <div className="text-red-400 text-center text-lg mt-10">
//            Error: {error.message}
//         </div>
//       </PageWrapper>
//     );
//   }

//   return (
//     <PageWrapper>
//       <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-10 text-white">
//         <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6">
//           <h2 className="text-2xl font-semibold text-center mb-2 text-cyan-400">
//             ⏰ Hourly Watch Time Analysis
//           </h2>

//           <p className="text-center text-gray-400 mb-6">📅 Today</p>

//           <BarGraph hourData={hourData} />
//         </div>
//       </div>
//     </PageWrapper>
//   );
// };

// export default Hourly;


import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import BarGraph from "../Charts/BarGraph";
import socket from "../socket";
import PageWrapper from "../utils/PageWrapper";

const Hourly = () => {
  const [hourData, setHourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/watchTime/hourly");
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setHourData(response.data);
        console.log("This is hourly data ", response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleHourlyDataUpdated = (newData) => setHourData(newData);
    socket.on("hourlyDataUpdated", handleHourlyDataUpdated);

    return () => {
      socket.off("hourlyDataUpdated", handleHourlyDataUpdated);
    };
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
            <p className="text-white text-xl font-medium">Loading hourly data...</p>
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
            <p className="text-red-200 text-center text-lg font-medium">{error.message}</p>
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Hourly Analysis
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Today</span>
              </div>
            </div>
            <p className="text-gray-400 text-lg">Track your watch time throughout the day</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold text-center mb-2 text-white">
                ⏰ Hourly Watch Time Analysis
              </h2>
              <p className="text-center text-gray-400 mb-6">📅 Today</p>
              <BarGraph hourData={hourData} />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Hourly;