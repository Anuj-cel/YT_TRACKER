import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from '../Charts/PieGraph';
import "../App.css";
import socket from '../socket';
import PageWrapper from "../utils/PageWrapper";

function Weekly() {
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/watchTime/weekly");
        const mergedData = mergeByDate(res.data);
        setWeekly(mergedData);
      } catch (err) {
        console.log(err);
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

  return (
    <PageWrapper>
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold text-center mb-10 text-cyan-400">
        📅 Weekly Category Watch Time
      </h2>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {weekly.map((data, index) => {
          const formattedDate = new Date(data.date).toDateString();
          return (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
            >
              <h4 className="text-lg font-semibold text-gray-300 mb-4">
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
    </PageWrapper>
  );
}

export default Weekly;