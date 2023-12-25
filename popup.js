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

function updateListItems(users, activeUser) {
    let userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(function(user, index) {
        let li = document.createElement('li');
        li.textContent = user.username + ': ' ;
        li.className = (user.username === activeUser.username && user.password === activeUser.password) ? 'bg-green-400 p-2 py-3 text-black' : 'bg-gray-900 p-3';
        let toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle';
        toggleButton.className = (user.username === activeUser.username && user.password === activeUser.password) ?'ml-2 p-1 bg-black text-white cursor-pointer hover:bg-white hover:text-black rounded' : 'ml-2 p-1 bg-green-400 text-gray-900 cursor-pointer hover:bg-green-300 rounded';
        toggleButton.addEventListener('click', function() {
            chrome.storage.local.set({activeUser: user}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error setting active user in local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("Active user set in local storage");
                    updateListItems(users, user);
                }
            });
        });
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'ml-2 p-1 bg-red-500 text-white cursor-pointer hover:bg-red-400 rounded';
        deleteButton.addEventListener('click', function() {
            users.splice(index, 1);
            chrome.storage.local.set({users: users}, function() {
                if (chrome.runtime.lastError) {
                    console.log(`Error deleting user from local storage: ${chrome.runtime.lastError.message}`);
                } else {
                    console.log("User deleted from local storage");
                    updateListItems(users, activeUser);
                }
            });
        });
        li.appendChild(toggleButton);
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

chrome.storage.local.get(['users', 'activeUser'], function(result) {
    if (chrome.runtime.lastError) {
        console.log(`Error retrieving data from local storage: ${chrome.runtime.lastError.message}`);
    } else {
        let users = result.users || [];
        let activeUser = result.activeUser || {};
        updateListItems(users, activeUser);
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



