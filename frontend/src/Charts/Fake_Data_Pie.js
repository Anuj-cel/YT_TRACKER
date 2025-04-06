export const pieChartData = {
    labels: ["Anuj", "Adarsh", "Ravi", "Priya", "Sneha"],
    datasets: [{
        label: "Total Weekly Steps",
        data: [
            3000 + 5000 + 4500 + 6000 + 8000 + 7000 + 9000,  // Anuj
            3500 + 4000 + 4800 + 7000 + 2000 + 7000 + 7500,  // Adarsh
            4000 + 6000 + 5000 + 4500 + 5500 + 6500 + 7000,  // Ravi
            3200 + 4500 + 4700 + 5500 + 6800 + 7200 + 6900,  // Priya
            2900 + 4200 + 3800 + 5000 + 6200 + 6700 + 7100   // Sneha
        ],
        backgroundColor: [
            "rgb(75, 192, 192)",   // Anuj
            "rgb(192, 75, 75)",    // Adarsh
            "rgb(255, 205, 86)",   // Ravi
            "rgb(54, 162, 235)",   // Priya
            "rgb(153, 102, 255)"   // Sneha
        ]
    }]
};
