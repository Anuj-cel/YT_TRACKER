// (async () => {
//     if (typeof io === "undefined") {
//       await new Promise((resolve, reject) => {
//         const script = document.createElement("script");
//         script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
//         script.onload = resolve;
//         script.onerror = reject;
//         document.head.appendChild(script);
//       });
//     }
  
//     // Now that the script is loaded, you can use the io function
//     const socket = io("http://localhost:3000");
  
//     socket.on("limitExceeded", (data) => {
//       if (!document.getElementById("limit-popup")) {
//         createLimitPopup(data.category);
//       }
//     });
//   })(); // Notice the parentheses at the end
// function createLimitPopup(category) {
//     const popup = document.createElement("div");
//     popup.id = "limit-popup";
//     popup.style.cssText = `
//       position: fixed;
//       top: 20%;
//       left: 50%;
//       transform: translateX(-50%);
//       background: white;
//       border-radius: 12px;
//       box-shadow: 0 0 20px rgba(0,0,0,0.3);
//       z-index: 999999;
//       padding: 24px;
//       width: 350px;
//       font-family: 'Segoe UI', sans-serif;
//       text-align: center;
//       animation: fadeIn 0.3s ease-in-out;
//     `;

//     popup.innerHTML = `
//       <h2 style="color: red; font-size: 22px; margin-bottom: 10px;">🚫 Limit Exceeded</h2>
//       <p style="margin: 10px 0; font-size: 16px;">You've reached your limit for <strong>${category}</strong>.</p>
//       <button id="continue-btn" style="margin-right: 10px; background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Continue Anyway</button>
//       <button id="close-btn" style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close</button>
//     `;

//     document.body.appendChild(popup);

//     // Add fade-in animation
//     const style = document.createElement("style");
//     style.innerHTML = `
//       @keyframes fadeIn {
//         from { opacity: 0; transform: translateX(-50%) scale(0.9); }
//         to { opacity: 1; transform: translateX(-50%) scale(1); }
//       }
//     `;
//     document.head.appendChild(style);

//     // Close button
//     document.getElementById("close-btn").onclick = () => {
//         popup.remove();
//     };

//     // Continue Anyway button
//     document.getElementById("continue-btn").onclick = async () => {
//         try {
//             const response = await fetch("http://localhost:3000/clear-limits", { method: "POST" });
//             if (response.ok) {
//                 alert("✅ All limits have been removed. Enjoy responsibly!");
//                 popup.remove();
//             } else {
//                 alert("⚠️ Could not remove limits. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error clearing limits:", error);
//             alert("⚠️ Failed to remove limits. Check your connection.");
//         }
//     };
// }




// window.addEventListener('load', function () {


let startTime = 0;
let videoElement = null;
let currentVideoUrl = null;
let realStartTime = 0, realEndTime = 0;

function isShortsPage() {
    return window.location.href.includes("/shorts/");
}


// function handleShorts() {
//     // shortPlaying = true;
//     // if (shortPlaying) {
//     //     console.log("▶️ Shorts video detected as playing!");
//     //     startTime = performance.now();
//     //     console.log("This is shorts startTime ", startTime);
//     //     currentVideoUrl = window.location.href;
//     //     console.log("Shorts started ", currentVideoUrl);
//     // }
//     let shortsVideo = document.querySelector("ytd-reel-video-renderer video");
//     if (!shortsVideo) {
//         console.warn("❌ Shorts video not found");
//         return;
//     }

//     console.log("▶️ Tracking Shorts Video...");

//     shortsVideo.addEventListener("play", () => {
//         console.log("▶️ Shorts started playing!");
//         startTime = performance.now();
//         currentVideoUrl = window.location.href;
//     });

//     shortsVideo.addEventListener("pause", stopTracking);
//     shortsVideo.addEventListener("ended", stopTracking);
// }

// if (isShortsPage() && shortPlaying) {
//     document.querySelector('video').addEventListener("click", () => {
//         shortPlaying = false;
//         let endTime = performance.now();
//         let sessionTime = Math.max(0, (endTime - startTime) / 1000);
//         console.log(`Stopped watching: ${currentVideoUrl}`);
//         console.log(`Watched for ${sessionTime.toFixed(2)} sec`);
//         if (document.querySelector('video')) {
//             console.log('Sending message to background script');
//             try {
//                 chrome.runtime.sendMessage({
//                     action: 'sendWatchTime',
//                     duration: sessionTime,
//                     isShorts
//                 }, (response) => {
//                     console.log('Message sent to background, response:', response);
//                 });

//             } catch (err) {
//                 console.error('Error sending message:', err);
//             }
//         } else {
//             console.log('Video element no longer available, skipping message');
//         }

//     })
// }
// else if (isShortsPage() && !shortPlaying) {
//     handleShorts();
// }

// Function to start tracking the video watch time
function startTracking() {
    videoElement = document.querySelector('video');
    console.log("Started tracking but not playing")
    if (videoElement) {
 

        console.log("Started tracking with playing ");
        startTime = performance.now();
        realStartTime = new Date().getTime();
        currentVideoUrl = window.location.href;
        console.log(`Started watching: ${currentVideoUrl}`);


        videoElement.addEventListener('pause', stopTracking);
        videoElement.addEventListener('ended', stopTracking);

        videoElement.addEventListener('play', () => {
            startTime = performance.now();  // Reset start time
            currentVideoUrl = window.location.href;
            chrome.runtime.sendMessage({ action: "VIDEO_PLAYING" }, function (response) {
                console.log("successfully sent tabId", response);
            })
            console.log("▶️ Video resumed, restarting tracking! , tabId ", chrome.runtime.id, "  ", currentVideoUrl);

        });
    }
}

// Function to stop tracking when the video is paused, ended, or visibility changes
function stopTracking() {
    console.log('stopTracking called and startTime is ', startTime);

    if (startTime !== null && videoElement) {
        let endTime = performance.now();
        realEndTime = new Date().getTime();
        let sessionTime = Math.max(0, (endTime - startTime) / 1000); // Convert ms to sec

        console.log(`Stopped watching: ${currentVideoUrl}`);
        console.log(`Watched for ${sessionTime.toFixed(2)} sec`);

        // let isShorts = currentVideoUrl.includes('youtube.com/shorts');
        let isShorts = isShortsPage()
        // Ensure video element is still present before sending the message
        if (document.querySelector('video')) {
            console.log('Sending message to background script');
            try {
                chrome.runtime.sendMessage({
                    action: 'sendWatchTime',
                    duration: sessionTime,
                    realStartTime,
                    realEndTime,
                    isShorts,
                }, (response) => {
                    console.log('Message sent to background, response:', response);
                });

            } catch (err) {
                console.error('Error sending message:', err);
            }
        } else {
            console.log('Video element no longer available, skipping message');
        }
        // realStartTime=null;
        startTime = null;
    }
}


// MutationObserver for dynamically loaded Shorts videos
const observer = new MutationObserver(() => {


    let newUrl = window.location.href;
    if (newUrl !== currentVideoUrl && (newUrl.includes("youtube.com/watch") || newUrl.includes("youtube.com/shorts"))) {
        stopTracking();
        setTimeout(startTracking, 500);
    }
});

// Observe changes in the DOM to detect Shorts loading
observer.observe(document.body, { childList: true, subtree: true });
// window.addEventListener("load", startTracking);
// window.addEventListener("beforeunload", stopTracking);
startTracking();
// Start tracking when the page is loaded

