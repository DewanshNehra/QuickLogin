chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && (tab.url.includes('internet.lpu.in') || tab.url.includes('ums.lpu.in') || tab.url.includes('myclass.lpu.in'))) {
        console.log(`Tab with ID: ${tabId} has completed loading and is on the target site.`);
        chrome.storage.local.get(['activeUser', 'enabled'], (result) => {
            if (chrome.runtime.lastError) {
                console.log(`Error retrieving data from local storage: ${chrome.runtime.lastError.message}`);
            } else {
                if (result.enabled && result.activeUser) {
                    console.log(`Sending message to tab with ID: ${tabId}`);
                    chrome.tabs.sendMessage(tab.id, {text: 'page_loaded', username: result.activeUser.username, password: result.activeUser.password}, function(response) {
                        if (chrome.runtime.lastError) {
                            console.log(`Error sending message to tab with ID: ${tabId}: ${chrome.runtime.lastError.message}`);
                        } else {
                            console.log(`Received response from tab with ID: ${tabId}: ${response.message}`);
                        }
                    });
                } else {
                    console.log(`Extension is not enabled or there is no active user.`);
                }
            }
        });
    }
});

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        let webhookUrl = '<your_webhookUrl_here'; 
        let installTime = new Date().toString();
        let message = {
            content: "```The plugin has been installed.\nTime: " + installTime + "```"
        };
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        }).then(response => {
            if (!response.ok) {
                console.log(`Error sending message to Discord: ${response.statusText}`);
            }
        });
    }
});