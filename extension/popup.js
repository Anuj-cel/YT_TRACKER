// // // Event listener for when the extension is installed or updated
// // chrome.runtime.onInstalled.addListener(() => {
// //     // Call reinjection function when the extension is installed or updated
// //     reinjectContentScript();
// // });

// // // Reinjection function to inject the content script into all active tabs
// // function reinjectContentScript() {
// //     // Query all open tabs to inject content script if necessary
// //     chrome.tabs.query({}, function(tabs) {
// //         tabs.forEach(tab => {
// //             // Ensure we're injecting the content script into YouTube pages only
// //             if (tab.url && tab.url.includes('youtube.com')) {
// //                 chrome.scripting.executeScript({
// //                     target: { tabId: tab.id },
// //                     files: ['content.js'] // Make sure this path matches your content script
// //                 }).then(() => {
// //                     console.log(`Content script reinjected into tab: ${tab.url}`);
// //                 }).catch((err) => {
// //                     console.error('Error reinjecting content script:', err);
// //                 });
// //             }
// //         });
// //     });
// // }

// // // Listen for any message from the content script (or popup) and forward it
// // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// //     console.log("Message received in background:", message);

// //     // Handle specific messages and respond if necessary
// //     if (message && message.action === 'sendWatchTime') {
// //         // Handle watch time message and forward to backend or log it
// //         console.log('Watch time received:', message.duration, 'Seconds');
        
// //         // Optionally send to your backend API (if required)
// //         fetch('http://localhost:3000/watchtime', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             },
// //             body: JSON.stringify({
// //                 videoUrl: message.videoUrl,
// //                 duration: message.duration,
// //                 isShorts: message.isShorts
// //             })
// //         })
// //         .then(response => response.json())
// //         .then(data => {
// //             console.log('Successfully sent watch time to backend:', data);
// //         })
// //         .catch(error => {
// //             console.error('Error sending watch time to backend:', error);
// //         });

// //         sendResponse({ status: 'Watch time logged successfully' });
// //     }
// //     // Return true to indicate you will send a response asynchronously
// //     return true;
// // });
// document.getElementById('track').addEventListener('click', function () {
//     console.log('Track button clicked!');
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         const currentTab = tabs[0];
//         const currentUrl = currentTab.url;

//         // Ensure the URL is a valid YouTube video URL
//         if (currentUrl && currentUrl.includes('youtube.com/watch')) {
//             console.log('Injecting content script...');
//             chrome.scripting.executeScript({
//                 target: { tabId: currentTab.id },
//                 files: ['content.js']
//             }).then(() => {
//                 console.log('Content script injected successfully.');
//             }).catch((error) => {
//                 console.error('Error injecting content script:', error);
//             });
//         } else {
//             alert('Please open a YouTube video to start tracking.');
//         }
//     });
// });

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
    if(seconds===NaN)
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
            totalTimeDisplay.textContent =formatTime(data.totalWatchTime);
            watchTimeDisplay.textContent = formatTime(data.totalWatchTime-data.totalShorts);
            shortsTimeDisplay.textContent = formatTime(data.totalShorts);
        })
        .catch(error => console.error("❌ Error fetching watch time:", error));
});

document.getElementById("dashboard-btn").addEventListener("click", () => {
    chrome.tabs.create({ url: " http://localhost:5173/" }); // Change this URL later if deployed
});



// Why This Works?

//     Backend servers (Express, Node.js, etc.) won’t serve manifest.json, but React/Vite will.

//     It ensures only the React frontend is detected, avoiding confusion with backend servers.


