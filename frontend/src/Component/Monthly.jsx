import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from '../Charts/PieGraph';
import socket from '../socket';

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
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>📆 Monthly Category Watch Time</h2>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '20px',
        }}
      >
        {monthlyData.slice().reverse().map((monthItem, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: '#ffffff',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
              {formatMonth(monthItem.date)}
            </h4>

            <div style={{ width: '180px', height: '180px', margin: '0 auto' }}>
              <PieGraph categories={monthItem.categories} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Monthly;
