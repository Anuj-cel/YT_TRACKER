// Event listener for when the extension is installed or updated
let activeTabId = null;
chrome.runtime.onInstalled.addListener(() => {
    reinjectContentScript();
});

// Reinjection function to inject the content script into all active YouTube tabs
function reinjectContentScript() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            if (tab.url && tab.url.includes('youtube.com')) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                }).then(() => {
                    console.log(`Content script reinjected into tab: ${tab.url}`);
                }).catch((err) => {
                    console.error('Error reinjecting content script:', err);
                });
            }
        });
    });
}

// Listen for messages from the content script (or popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "VIDEO_PLAYING") {
        activeTabId = sender.tab.id; // Update active tab
        console.log(`Tracking video on tab ${activeTabId}`);
    }
    console.log("Message received in background:", message);
    if (message && message.action === 'sendWatchTime') {

           if (sender.tab.id === activeTabId) {
            activeTabId = null;
        }
        console.log(`Watch time received: ${message.duration} sec (Shorts: ${message.isShorts})`);
        console.log("This is tabId ", message.tabId);
        // Send data to backend
        fetch('http://localhost:3000/watchtime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoUrl: message.videoUrl || sender.tab.url,  // Ensure video URL is sent
                duration: message.duration,
                isShorts: message.isShorts,
                // videoId: getYouTubeVideoId(message.videoUrl||sender.tab.url)-->this was making reponse undefined   ------->lesson
            })
        })
            .then(response => response.text())  // Get raw response first
            .then(data => {
                try {
                    let jsonData = JSON.parse(data);  // Try parsing JSON
                    console.log('Successfully sent watch time to backend:', jsonData);
                } catch (error) {
                    console.error('Error parsing JSON response:', error, 'Response:', data);
                }
            })
            .catch(error => {
                console.error('Error sending watch time to backend:', error);
            });

        sendResponse({ status: 'Watch time logged successfully' });
    }

    return true; // Keep the message channel open for async response
});
