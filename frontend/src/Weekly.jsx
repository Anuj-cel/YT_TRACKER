import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieGraph } from './Charts/PieGraph';

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
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>📅 Weekly Category Watch Time</h2>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {weekly.map((data, index) => {
          const formattedDate = new Date(data.date).toDateString();
          return (
            <div 
              key={index}
              style={{
                backgroundColor: '#ffffff',
                padding: '10px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>{formattedDate}</h4>
              <div style={{ width: '180px', height: '180px', margin: '0 auto' }}>
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
