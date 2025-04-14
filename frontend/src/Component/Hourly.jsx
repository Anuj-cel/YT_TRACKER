import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import BarGraph from "../Charts/BarGraph";
import socket from "../socket";

const Hourly = () => {
  const [hourData, setHourData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/watchTime/hourly");
        setHourData(response.data);
        console.log("This is hourly data ",response.data);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    socket.on("hourlyDataUpdated",(newData)=>setHourData(newData))
  }, []);

  if (loading) {
    return <div className="text-center text-xl font-medium mt-10">⏳ Loading data...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-lg mt-10">
        ❌ Error: {error.message}
      </div>
    );
  }


  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-center mb-2 text-blue-600">
  ⏰ Hourly Watch Time Analysis
</h2>

<p className="text-center text-gray-500 mb-6">📅 Today</p>

        <BarGraph hourData={hourData} />
      </div>
    </div>
  );
};

export default Hourly;
