import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from '../Charts/PieGraph';
import "../App.css";
import socket from '../socket';
function Weekly() {
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/watchTime/weekly");
        setWeekly(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    socket.on("weeklyDataUpdated",(newData)=>setWeekly(newData))
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        📅 Weekly Category Watch Time
      </h2>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {weekly.map((data, index) => {
          const formattedDate = new Date(data.date).toDateString();
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center"
            >
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
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
  );
}

export default Weekly;
