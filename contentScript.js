// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === 'page_loaded') {
        chrome.storage.local.get(['activeUser', 'internetCheckbox', 'umsCheckbox', 'myclassCheckbox'], function(result) {
            let activeUser = result.activeUser;
            let internetCheckbox = result.internetCheckbox;
            let umsCheckbox = result.umsCheckbox;
            let myclassCheckbox = result.myclassCheckbox;
            

            if (activeUser) {


                const site = window.location.href;
                if (site.includes("internet.lpu.in") && internetCheckbox ) {
                    var usernameElement = document.evaluate("/html/body/form/div/table/tbody/tr/td/div[1]/div/div[2]/div[2]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var passwordElement = document.evaluate("/html/body/form/div/table/tbody/tr/td/div[1]/div/div[2]/div[3]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (usernameElement && passwordElement) {
                        usernameElement.value = activeUser.username;
                        passwordElement.value = activeUser.password;

                        setTimeout(function () {
                            var agreePolicyCheckbox = document.getElementById("agreepolicy");
                            if (agreePolicyCheckbox) {
                                agreePolicyCheckbox.click(); // Trigger the click event to check the checkbox
                                document.getElementsByClassName("btn btn-primary btn-sm")[0].click();
                            } else {
                                console.log("agreepolicy checkbox not found.");
                            }
                        }, 1000);
                    }
                }

                if (site.includes("ums.lpu.in/lpuums/") && umsCheckbox) {
                    var usernameElement = document.evaluate("/html/body/div[2]/div/div/div[2]/div[2]/form/div[3]/div[1]/div[2]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var passwordElement = document.evaluate("/html/body/div[2]/div/div/div[2]/div[2]/form/div[3]/div[1]/div[3]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (usernameElement && passwordElement) {
                        usernameElement.value = activeUser.username;
                        passwordElement.value = activeUser.password;

                        setTimeout(function () {
                            document.getElementsByClassName("btn btn-primary btn-lg btn-theme")[0].click();
                        }, 1000);
                    }
                }

                if (site.includes("myclass.lpu.in") && myclassCheckbox) {
                    var usernameElement = document.evaluate("/html/body/div[2]/div/form/div[7]/input[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var passwordElement = document.evaluate("/html/body/div[2]/div/form/div[7]/input[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (usernameElement && passwordElement) {
                        usernameElement.value = activeUser.username;
                        passwordElement.value = activeUser.password;

                        setTimeout(function () {
                            document.getElementsByClassName("ghost-round full-width")[0].click();
                        }, 1000);
                    }
                }
            }
        });
    }
});



console.log("Content script loaded");

