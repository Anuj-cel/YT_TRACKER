import "../App.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const BarGraph = ({ hourData }) => {
  const [groupedData, setGroupedData] = useState(new Array(12).fill(0));
  const labels = [
    "12-2 am",
    "2-4 am",
    "4-6 am",
    "6-8 am",
    "8-10 am",
    "10-12 am",
    "12-2 pm",
    "2-4 pm",
    "4-6 pm",
    "6-8 pm",
    "8-10 pm",
    "10-12 pm",
  ];

  useEffect(() => {
    const processData = () => {
      try {
        const temp = new Array(12).fill(0);
        hourData.forEach(({ hour, duration }) => {
          const groupIndex = Math.floor(hour / 2);
          temp[groupIndex] += duration;
        });
        setGroupedData(temp);
      } catch (err) {
        console.error("Error processing hourly data:", err);
      }
    };
    processData();
  }, [hourData]);

  const data = {
    labels,
    datasets: [
      {
        label: "Watch Duration (min)",
        backgroundColor: "#6366F1", 
        borderRadius: 6,
        borderSkipped: false,
        data: groupedData,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#F9FAFB", 
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "#1F2937", 
        titleColor: "#F9FAFB", 
        bodyColor: "#F9FAFB",
        callbacks: {
          label: (ctx) => {
            const seconds = ctx.parsed.y;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secondsRemaining = Math.round(seconds % 60);

            let timeString = "";
            if (hours > 0) timeString += `${hours}h `;
            if (minutes > 0 || timeString !== "") timeString += `${minutes}m `;
            if (secondsRemaining > 0 || timeString === "") timeString += `${secondsRemaining}s`;

            return `${timeString.trim()} `;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#D1D5DB", 
          font: { size: 12 },
        },
        grid: {
          color: "#374151", 
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Watch Time (sec)",
          color: "#F9FAFB", 
          font: { size: 14 },
        },
        ticks: {
          color: "#D1D5DB", 
        },
        grid: {
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;