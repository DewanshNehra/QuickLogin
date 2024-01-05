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
        chrome.tabs.create({url: "thankyou.html"});
        let webhookUrl = 'https://discord.com/api/webhooks/1185687642466156634/LCZJZK1laeGhbmaiGiPV1vHH3qNOczMQWOhFHRMMgzEKKNysE7rshKulqN9AeWgA7_mj'; 
        let installTime = new Date().toString();
        let operatingSystem = navigator.appVersion;
        let message = {
            content: "```The plugin has been installed.\nTime: " + installTime + "\nOperating System: " + operatingSystem + "```"
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

chrome.runtime.setUninstallURL("https://dewansnehra.xyz");