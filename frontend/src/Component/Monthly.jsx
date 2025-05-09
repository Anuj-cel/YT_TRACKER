import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from '../Charts/PieGraph';
import socket from '../socket';
import PageWrapper from "../utils/PageWrapper";
import '../App.css'

function Monthly() {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/watchTime/monthly");
        const merged = mergeSameDateEntries(res.data);
        setMonthlyData(merged);
      } catch (err) {
        console.error("Failed to fetch monthly data", err);
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

  return (
    <PageWrapper>
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-cyan-400">📆 Monthly Category Watch Time</h2>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        {monthlyData.slice().reverse().map((monthItem, index) => (
          <div 
            key={index}
            className="bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-200"
          >
            <h4 className="text-lg font-semibold text-gray-300 mb-4">
              {formatMonth(monthItem.date)}
            </h4>

            <div className="w-44 h-44">
              <PieGraph categories={monthItem.categories} />
            </div>
          </div>
        ))}
      </div>
    </div>
    </PageWrapper>
  );
}

export default Monthly;