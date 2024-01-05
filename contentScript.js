// contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text === 'page_loaded') {
        chrome.storage.local.get([ 'users', 'internetCheckbox', 'umsCheckbox', 'myclassCheckbox'], function(result) {
            let users = result.users;
            let internetCheckbox = result.internetCheckbox;
            let umsCheckbox = result.umsCheckbox;
            let myclassCheckbox = result.myclassCheckbox;
            
            const site = window.location.href;
            let user;
            if (site.includes("internet.lpu.in") && internetCheckbox) {
                user = users.find(user => user.enabledForInternet);
            } else if (site.includes("ums.lpu.in/lpuums/") && umsCheckbox) {
                user = users.find(user => user.enabledForUms);
            } else if (site.includes("myclass.lpu.in") && myclassCheckbox) {
                user = users.find(user => user.enabledForMyclass);
            }
            if (user) {
                if (site.includes("internet.lpu.in") && internetCheckbox && user.enabledForInternet ) {
                    var usernameElement = document.evaluate("/html/body/form/div/table/tbody/tr/td/div[1]/div/div[2]/div[2]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var passwordElement = document.evaluate("/html/body/form/div/table/tbody/tr/td/div[1]/div/div[2]/div[3]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (usernameElement && passwordElement) {
                        usernameElement.value = user.username;
                        passwordElement.value = user.password;

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

                if (site.includes("ums.lpu.in/lpuums/") && umsCheckbox && user.enabledForUms) {
                    var usernameElement = document.evaluate("/html/body/div[2]/div/div/div[2]/div[2]/form/div[3]/div[1]/div[2]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var passwordElement = document.evaluate("/html/body/div[2]/div/div/div[2]/div[2]/form/div[3]/div[1]/div[3]/input", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (usernameElement && passwordElement) {
                        usernameElement.value = user.username;
                        passwordElement.value = user.password;

                        setTimeout(function () {
                            document.getElementsByClassName("btn btn-primary btn-lg btn-theme")[0].click();
                        }, 1000);
                    }
                }

                if (site.includes("myclass.lpu.in") && myclassCheckbox && user.enabledForMyclass) {
                    var usernameElement = document.evaluate("/html/body/div[2]/div/form/div[7]/input[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    var passwordElement = document.evaluate("/html/body/div[2]/div/form/div[7]/input[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                    if (usernameElement && passwordElement) {
                        usernameElement.value = user.username;
                        passwordElement.value = user.password;

                        setTimeout(function () {
                            document.getElementsByClassName("ghost-round full-width")[0].click();
                        }, 1000);
                    }
                }
            }
        });
    }
});



console.log("Made by Dewans Nehra");
console.log('Visit my website: %chttps://dewansnehra.xyz', 'color: blue; text-decoration: underline;');