// popup.js
// Function to save a checkbox state to local storage
function saveCheckboxStateAndReload(id) {
    let checkbox = document.getElementById(id);
    chrome.storage.local.set({[id]: checkbox.checked}, function() {
        if (chrome.runtime.lastError) {
            console.log(`Error saving checkbox state to local storage: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Checkbox state saved to local storage: ${id} = ${checkbox.checked}`);
            // Get the current tab and reload it
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        }
    });
}

// Add 'change' event listeners to the checkboxes
document.getElementById('internetCheckbox').addEventListener('change', () => saveCheckboxStateAndReload('internetCheckbox'));
document.getElementById('umsCheckbox').addEventListener('change', () => saveCheckboxStateAndReload('umsCheckbox'));
document.getElementById('myclassCheckbox').addEventListener('change', () => saveCheckboxStateAndReload('myclassCheckbox'));

// Load the checkbox states from local storage when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['internetCheckbox', 'umsCheckbox', 'myclassCheckbox'], function(result) {
        document.getElementById('internetCheckbox').checked = result.internetCheckbox;
        document.getElementById('umsCheckbox').checked = result.umsCheckbox;
        document.getElementById('myclassCheckbox').checked = result.myclassCheckbox;
        console.log("Checkbox statuses loaded from local storage");
    });
});
document.getElementById('save').addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let internetCheckbox = document.getElementById('internetCheckbox').checked;
    let umsCheckbox = document.getElementById('umsCheckbox').checked;
    let myclassCheckbox = document.getElementById('myclassCheckbox').checked;
    if (!username || !password) {
        alert("Please enter a username and password before saving.");
        return;
    }
   
    chrome.storage.local.set({internetCheckbox: internetCheckbox, umsCheckbox: umsCheckbox, myclassCheckbox: myclassCheckbox}, function() {
        if (chrome.runtime.lastError) {
            console.log(`Error saving checkbox statuses to local storage: ${chrome.runtime.lastError.message}`);
        } else {
            console.log("Checkbox statuses saved to local storage");
        }
    });
    // Get the current users array and userId counter from local storage
    chrome.storage.local.get(['users', 'userIdCounter'], function(result) {
        if (chrome.runtime.lastError) {
            console.log(`Error retrieving data from local storage: ${chrome.runtime.lastError.message}`);
        } else {
            let users = result.users || [];
            let userIdCounter = result.userIdCounter || 0;

            let newUser = {userId: userIdCounter, username: username, password: password};
            users.push(newUser); // Add the new user to the users array

            // Increment the userId counter
            userIdCounter++;

            // Save the updated users array and userId counter back to local storage
            chrome.storage.local.set({users: users, userIdCounter: userIdCounter}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error saving new user to local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("New user saved to local storage");

                    // Change the button text to "Saved"
                    document.getElementById('save').textContent = "Saved";

                    // Refresh the popup
                    setTimeout(function() {
                        window.location.reload();
                    }, 100);
                }
            });
        }
    });
});

function updateListItems(users) {
    let userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(function(user, index) {
        let li = document.createElement('li');
        li.textContent = user.username + ': ' ;
        li.className = (user.username  && user.password ) ? 'bg-gray-900 p-2 py-3 mb-1' :   'bg-green-400 p-2 py-3 mb-1 text-black'  ;
        // li.className = (user.username  && user.password ) ? 'bg-green-400 p-2 py-3 mb-1 text-black':'bg-gray-900 p-2 py-3 mb-1';
        let deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<div class="tooltip">
        <img src="icons/trash.svg" width="20px" height="20px"></img>
        <span class="tooltiptext">Delete</span>
        </div> `;
        deleteButton.className = 'ml-2 p-1 bg-red-500 text-white cursor-pointer hover:bg-red-400 rounded';
        deleteButton.addEventListener('click', function() {
            users.splice(index, 1);
            chrome.storage.local.set({users: users}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error deleting user from local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("User deleted from local storage");
                    updateListItems(users);
                }
            });
        });
        //Create the new button
        let umsButton = document.createElement('button');
        umsButton.innerHTML = `<div class="tooltip">
            <img src="icons/ums.svg" width="20px" height="20px"></img>
            <span class="tooltiptext">UMS Login</span>
            </div>`;
        umsButton.className = user.enabledForUms ? 'ml-2 p-1 bg-green-500 text-white cursor-pointer hover:bg-green-400 rounded' : 'ml-2 p-1 bg-gray-800 text-white cursor-pointer hover:bg-green-400 rounded';
        umsButton.addEventListener('click', function() {
            // Toggle the 'enabledForUms' property and update the user list in local storage
            user.enabledForUms = !user.enabledForUms;
            umsButton.textContent = user.enabledForUms ? 'U' : 'U';
            umsButton.className = user.enabledForUms ? 'ml-2 p-1 bg-green-500 text-white cursor-pointer hover:bg-green-400 rounded' : 'ml-2 p-1 bg-gray-800 text-white cursor-pointer hover:bg-green-400 rounded';
            chrome.storage.local.set({users: users}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error updating user in local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("User updated in local storage");
                    updateListItems(users); // Update the list to reflect the changes
                }
            });
        });
        // Create the MyClass button
        let myclassButton = document.createElement('button');
        myclassButton.innerHTML = `<div class="tooltip">
            <img src="icons/myclass.svg" width="20px" height="20px"></img>
            <span class="tooltiptext">MyClass Login</span>
            </div>`;
        myclassButton.className = user.enabledForMyclass ? 'ml-2 p-1 bg-green-500 text-white cursor-pointer hover:bg-green-400 rounded' : 'ml-2 p-1 bg-gray-800 text-white cursor-pointer hover:bg-green-400 rounded';
        myclassButton.addEventListener('click', function() {
            // Toggle the 'enabledForMyclass' property and update the user list in local storage
            user.enabledForMyclass = !user.enabledForMyclass;
            myclassButton.textContent = user.enabledForMyclass ? 'M' : 'M';
            myclassButton.className = user.enabledForMyclass ? 'ml-2 p-1 bg-green-500 text-white cursor-pointer hover:bg-green-400 rounded' : 'ml-2 p-1 bg-gray-800 text-white cursor-pointer hover:bg-green-400 rounded';
            chrome.storage.local.set({users: users}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error updating user in local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("User updated in local storage");
                    updateListItems(users); // Update the list to reflect the changes
                }
            });
        });

        // Create the Internet button
        let internetButton = document.createElement('button');
        internetButton.innerHTML = `<div class="tooltip">
            <img src="icons/wifi.svg" width="20px" height="20px"></img>
            <span class="tooltiptext">Internet Login</span>
            </div>`;
        internetButton.className = user.enabledForInternet ? 'ml-2 p-1 bg-green-500 text-white cursor-pointer hover:bg-green-400 rounded' : 'ml-2 p-1 bg-gray-800 text-white cursor-pointer hover:bg-green-400 rounded';
        internetButton.addEventListener('click', function() {
            // Toggle the 'enabledForInternet' property and update the user list in local storage
            user.enabledForInternet = !user.enabledForInternet;
            internetButton.textContent = user.enabledForInternet ? 'I' : 'I';
            internetButton.className = user.enabledForInternet ? 'ml-2 p-1 bg-green-500 text-white cursor-pointer hover:bg-green-400 rounded' : 'ml-2 p-1 bg-gray-800 text-white cursor-pointer hover:bg-green-400 rounded';
            chrome.storage.local.set({users: users}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error updating user in local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("User updated in local storage");
                    updateListItems(users); // Update the list to reflect the changes
                }
            });
        });

        li.appendChild(internetButton);
        li.appendChild(umsButton);
        li.appendChild(myclassButton);
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

chrome.storage.local.get(['users'], function(result) {
    if (chrome.runtime.lastError) {
        console.log(`Error retrieving data from local storage: ${chrome.runtime.lastError.message}`);
    } else {
        let users = result.users || [];
        updateListItems(users);
    }
});


document.getElementById('toggleExtension').addEventListener('change', (event) => {
    chrome.storage.local.set({enabled: event.target.checked}, function() {
        if (chrome.runtime.lastError) {
            console.log(`Error setting extension enabled state in local storage: ${chrome.runtime.lastError.message}`);
        } else {
            console.log("Extension enabled state set in local storage");
        }
    });
});

// Load the checkbox state when the popup is opened
chrome.storage.local.get(['enabled'], (result) => {
    if (chrome.runtime.lastError) {
        console.log(`Error retrieving extension enabled state from local storage: ${chrome.runtime.lastError.message}`);
    } else {
        document.getElementById('toggleExtension').checked = result.enabled;
    }
});



