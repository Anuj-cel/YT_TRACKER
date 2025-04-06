console.log("Content script is running!");

// window.addEventListener('load', function () {
let startTime = 0;
let videoElement = null;
let currentVideoUrl = null;

function isShortsPage() {
    return window.location.href.includes("/shorts/");
}

// let shortPlaying = false;
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
            currentVideoUrl = window.location.href;
            console.log(`Started watching: ${currentVideoUrl}`);
        // Add event listeners for pause, end, and visibility change
        videoElement.addEventListener('pause', stopTracking);
        videoElement.addEventListener('ended', stopTracking);

        videoElement.addEventListener('play', () => {
            startTime = performance.now();  // Reset start time
            currentVideoUrl = window.location.href;
            chrome.runtime.sendMessage({action:"VIDEO_PLAYING"},function(response){
                console.log("successfully sent tabId" ,response);
            })
            console.log("▶️ Video resumed, restarting tracking! , tabId ",chrome.runtime.id,"  ",currentVideoUrl);

        });
        // document.addEventListener('visibilitychange', handleVisibilityChange);
    }
}

// Function to stop tracking when the video is paused, ended, or visibility changes
function stopTracking() {
    console.log('stopTracking called and startTime is ',startTime);

    if (startTime !== null && videoElement) {
        let endTime = performance.now();
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
                    isShorts
                }, (response) => {
                    console.log('Message sent to background, response:', response);
                });

            } catch (err) {
                console.error('Error sending message:', err);
            }
        } else {
            console.log('Video element no longer available, skipping message');
        }

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




