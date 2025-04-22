import "../App.css";
import axios from "axios";
import { useEffect, useState } from "react";
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
      <div className="text-center text-xl font-medium mt-10 text-gray-400">
        ⏳ Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="text-red-400 text-center text-lg mt-10">
           Error: {error.message}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-10 text-white">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-2 text-cyan-400">
            ⏰ Hourly Watch Time Analysis
          </h2>

          <p className="text-center text-gray-400 mb-6">📅 Today</p>

          <BarGraph hourData={hourData} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Hourly;