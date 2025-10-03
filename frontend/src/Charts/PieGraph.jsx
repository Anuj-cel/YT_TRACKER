import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { useState, useEffect } from "react";
import formatTime from "../utils/formatTime.js";

ChartJS.register(Tooltip, Legend, ArcElement);

export const PieGraph = ({ categories }) => {
  const [totalTime, setTotalTime] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6B7280", 
          font: {
            size: 14,
            family: "Inter, sans-serif",
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.dataset.data[tooltipItem.dataIndex];
            const time = formatTime(value);
            return `${tooltipItem.label}: ${time}`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const labels = categories.map((cat) => cat.category);
    const data = categories.map((cat) => cat.watchTime);
    const total = data.reduce((sum, val) => sum + val, 0);

    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4CAF50",
            "#FF4500",
            "#9C27B0",
            "#3F51B5",
            "#FF0000",
          ],
        },
      ],
    });

    setTotalTime(total);
  }, [categories]);

  return (
    <div className="w-full">
      <h3 className="text-center text-sm text-gray-600 mb-2">
        Total:{" "}
        <span className="text-blue-600 font-semibold">{formatTime(totalTime)}</span>
      </h3>
      <div className="flex justify-center">
        <div className="max-w-sm w-full">
          {console.log("This is home DATA ",chartData)}
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};