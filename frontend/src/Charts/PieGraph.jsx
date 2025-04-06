import "../App.css"
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { useState, useEffect } from "react";

ChartJS.register(Tooltip, Legend, ArcElement);

export const PieGraph = ({ categories }) => {
  // const options = {};
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.dataset.data[tooltipItem.dataIndex];
            const time = formatTime(value); // format time in hours, minutes, and seconds
            return `${tooltipItem.label}: ${time}`;
          },
        },
      },
    },
  };
  
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = Math.round(seconds % 60); // round to nearest second
  
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || timeString !== "") {
      timeString += `${minutes}m `;
    }
    if (secondsRemaining > 0 && timeString === "") {
      timeString += `${secondsRemaining}s`;
    }
    return timeString.trim();
  }
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  useEffect(() => {
    const labels = categories.map((category) => category.category);
    const data = categories.map((category) => category.watchTime);

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
            "#FF0000"
          ],
        },
      ],
    });
  }, [categories]);

  return (
    <>
      <div className="div1">
        <Pie options={options} data={chartData} />
      </div>
    </>
  );
};

// In this updated code:

//     We added the useEffect hook to update the chartData state when the categories prop changes.
//     We mapped the categories array to extract the labels and data for the pie chart.
//     We updated the chartData state with the new labels and data.
//     We passed the updated chartData state to the Pie component.

// This should render the pie chart with the data from the categories prop.