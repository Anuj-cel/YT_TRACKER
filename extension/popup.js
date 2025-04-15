


const POSSIBLE_PORTS = [5173, 3001, 5174, 5175, 3000]; 
async function getReactPort() {
    for (const port of POSSIBLE_PORTS) {
        try {
            // Fetch `manifest.json`, which React/Vite always serves
            const response = await fetch(`http://localhost:${port}/manifest.json`, { mode: "no-cors" });
            console.log(`React dev server found on port: ${port}`);
            return port; // Return the first successful port
        } catch (error) {
            continue; // Try next port if fetch fails
        }
    }
    return null; // No React frontend found
}

function formatTime(seconds) {
    console.log("This is seconds from popup ",seconds);
    if(seconds===NaN|| seconds===undefined)
        seconds=0;
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = Math.floor(seconds % 60);

    let formattedTime = "";
    
    if (hrs > 0) formattedTime += `${hrs} hr `;
    if (mins > 0) formattedTime += `${mins} min `;
    if (secs > 0 || formattedTime === "") formattedTime += `${secs} sec`;

    return formattedTime.trim();
}



function updateDisplay(watchTime, shortsTime) {
    document.getElementById("watchTime").textContent = formatTime(watchTime);
    document.getElementById("shortsTime").textContent = formatTime(shortsTime);
    document.getElementById("totalTime").textContent = formatTime(watchTime + shortsTime);
}

// Example Usage (Replace this with actual watch time values)
let exampleWatchTime = 7500; // 7500 sec = 2 hr 5 min
let exampleShortsTime = 180; // 180 sec = 3 min

updateDisplay(exampleWatchTime, exampleShortsTime);



document.addEventListener("DOMContentLoaded", () => {
    const watchTimeDisplay = document.getElementById("watchTime");
    const shortsTimeDisplay = document.getElementById("shortsTime");
    const totalTimeDisplay = document.getElementById("totalTime");

    // Fetch watch time from the backend
    fetch("http://localhost:3000/watchtime") // Change port if needed
        .then(response => response.json())
        .then(data => {
            console.log("This is data in popup 0 ",data);
            totalTimeDisplay.textContent =formatTime(data.totalWatchTime)||'0s';
            watchTimeDisplay.textContent = formatTime(data.totalWatchTime-data.totalShorts)||'0s';
            shortsTimeDisplay.textContent = formatTime(data.totalShorts)||"0s";
        })
        .catch(error => console.error("❌ Error fetching watch time:", error));
});

document.getElementById("dashboard-btn").addEventListener("click", () => {
    console.log("Request for data is done ");
    chrome.tabs.create({ url: " http://localhost:5173/" }); // Change this URL later if deployed
});




// Why This Works?

//     Backend servers (Express, Node.js, etc.) won’t serve manifest.json, but React/Vite will.

//     It ensures only the React frontend is detected, avoiding confusion with backend servers.
