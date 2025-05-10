const POSSIBLE_PORTS = [5173, 3001, 5174, 5175, 3000]; 
async function getReactPort() {
    for (const port of POSSIBLE_PORTS) {
        try {
            
            const response = await fetch(`https://yt-tracker.onrender.com/manifest.json`, { mode: "no-cors" });
            console.log(`React dev server found on port: ${port}`);
            return port; 
        } catch (error) {
            continue; 
        }
    }
    return null;
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

let exampleWatchTime = 7500;
let exampleShortsTime = 180; 

updateDisplay(exampleWatchTime, exampleShortsTime);



document.addEventListener("DOMContentLoaded", () => {
    const watchTimeDisplay = document.getElementById("watchTime");
    const shortsTimeDisplay = document.getElementById("shortsTime");
    const totalTimeDisplay = document.getElementById("totalTime");

    fetch("https://yt-tracker.onrender.com/watchtime") 
        .then(response => response.json())
        .then(data => {
            console.log("This is data in popup 0 ",data);
            totalTimeDisplay.textContent =formatTime(data.totalWatchTime)||'0s';
            watchTimeDisplay.textContent = formatTime(data.totalWatchTime-data.totalShorts)||'0s';
            shortsTimeDisplay.textContent = formatTime(data.totalShorts)||"0s";
        })
        .catch(error => console.error(" Error fetching watch time:", error));
});

document.getElementById("dashboard-btn").addEventListener("click", () => {
    console.log("Request for data is done ");
    chrome.tabs.create({ url: "https://yt-tracker.onrender.com" }); 
});





