let activeTabId = null;
chrome.runtime.onInstalled.addListener(() => {
    reinjectContentScript();
});

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "VIDEO_PLAYING") {
        activeTabId = sender.tab.id; 
    }
    console.log("Message received in background:", message);
    if (message && message.action === 'sendWatchTime') {

           if (sender.tab.id === activeTabId) {
            activeTabId = null;
        }
        console.log(`Watch time received: ${message.duration} sec (Shorts: ${message.isShorts}) StartTime ${message.startTime} EndTime ${message.endTime}`);
        fetch('https://yt-tracker.onrender.com/watchtime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                videoUrl: message.videoUrl || sender.tab.url,  
                duration: message.duration,
                isShorts: message.isShorts,
                realStartTime:message.realStartTime,
                realEndTime:message.realEndTime,
            })
        })
            .then(response => response.text())  
            .then(data => {
                try {
                    let jsonData = JSON.parse(data);  //parsing JSON
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
