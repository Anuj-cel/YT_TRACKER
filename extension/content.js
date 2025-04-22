
let startTime = 0;
let videoElement = null;
let currentVideoUrl = null;
let realStartTime = 0, realEndTime = 0;

function isShortsPage() {
    return window.location.href.includes("/shorts/");
}
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
            console.log("Video resumed, restarting tracking! , tabId ", chrome.runtime.id, "  ", currentVideoUrl);

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

      
        let isShorts = isShortsPage()
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
        startTime = null;
    }
}

const observer = new MutationObserver(() => {
    let newUrl = window.location.href;
    if (newUrl !== currentVideoUrl && (newUrl.includes("youtube.com/watch") || newUrl.includes("youtube.com/shorts"))) {
        stopTracking();
        setTimeout(startTracking, 500);
    }
});

observer.observe(document.body, { childList: true, subtree: true });
startTracking();

