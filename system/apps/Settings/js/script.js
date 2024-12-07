const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Function to delete a directory and its contents
function deleteDirectory(dirPath) {
    // Read the directory contents
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        // Array of deletion promises
        const deletionPromises = files.map(file => {
            const filePath = path.join(dirPath, file);
            return new Promise((resolve, reject) => {
                // Check if the current file is a directory
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        reject(err);
                    } else if (stats.isDirectory()) {
                        // Recursively delete the directory
                        deleteDirectory(filePath);
                        resolve();
                    } else {
                        // Delete the file
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            });
        });

        // Wait for all deletions to finish
        Promise.all(deletionPromises)
            .then(() => {
                // Now delete the empty directory
                fs.rmdir(dirPath, (err) => {
                    if (err) {
                        console.error('Error deleting the directory:', err);
                    } else {
                        console.log('Directory deleted successfully!');
                    }
                });
            })
            .catch(err => console.error('Error during deletion:', err));
    });
}

const accountAvatar = JSON.parse(localStorage.getItem('avatar-account'));
const accountData = JSON.parse(localStorage.getItem('os-account'));

const avatar = document.getElementById('avatar');
const apps = [];
const appsFolder = '../';
const avatars = [];

/* Item Buttons */

const wifiBtn = document.getElementById('wifiBtn');
const bluetoothBtn = document.getElementById('bluetoothBtn');
const accountBtn = document.getElementById('accountBtn');
const displayBtn = document.getElementById('displayBtn');
const updateBtn = document.getElementById('updateBtn');
const aboutBtn = document.getElementById('aboutBtn');
const updateDataBtn = document.getElementById('updateDataBtn');
const Wallpapersbtn = document.getElementById('Wallpapers');

/* panels */

const wifi = document.getElementById('wifi');
const bluetooth = document.getElementById('bluetooth');
const account = document.getElementById('account');
const display = document.getElementById('display');
const update = document.getElementById('update');
const about = document.getElementById('about');

const appListElement = document.getElementById('app-list');

const versionNum = document.getElementById('versionNum');

avatar.innerHTML = `<img id="avatar" src="../${accountAvatar}"></img>`;
document.getElementById('accountName').placeholder = `${accountData.username}`;

/* Buttons */

updateDataBtn.addEventListener('click', () => {

    const username = document.getElementById('accountName').value;
    const password = document.getElementById('accountPassword').value;

    if (username.trim() === '') {
        M.toast({html: 'Account name is required!'});
        return;
    }

    const userData = { username, password };

    // Save account details to localStorage
    localStorage.setItem('os-account', JSON.stringify(userData));

});

document.getElementById('avatarSelector').addEventListener('change', function() {
    const fileInput = document.getElementById('avatarSelector');

    // Show the full file path (may not work in all browsers for security reasons)
    if (fileInput.files.length > 0) {
        const fullPath = fileInput.value;  // This gives you the file path
        console.log(fullPath);
        
        localStorage.setItem('avatar-account', JSON.stringify(fullPath));

    } else {
        const avatar = '../../img/avatars/avatar.png';
        localStorage.setItem('avatar-account', JSON.stringify(avatar));
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const loadAppsFromJson = async () => {
        try {
            const response = await fetch(`${appsFolder}/apps-list.json`);
            const folders = await response.json();
    
            for (const folder of folders) {
                try {
                    const manifestResponse = await fetch(`${appsFolder}/${folder}/app.manifest`);
    
                    if (!manifestResponse.ok) {
                        console.error(`Failed to fetch manifest for ${folder}`);
                        continue;
                    }
    
                    const manifest = await manifestResponse.json();
                    apps.push({ ...manifest, folder });
                } catch (error) {
                    console.error(`Error loading manifest for ${folder}:`, error);
                }
            }
    
            renderAppList();
        } catch (error) {
            console.error('Failed to load apps list:', error);
        }
    };

    const loadAvatarsFromJson = async () => {
        try {
            const response = await fetch(`../../img/avatars/avatars.json`);
            const avatarList = await response.json(); // Change to avatarList to avoid conflict
        
            for (const avatarFilename of avatarList) { // Change loop variable to avatarFilename
                try {
                    const avatarResponse = await fetch(`../../img/avatars/${avatarFilename}`);
        
                    if (!avatarResponse.ok) {
                        console.error(`Failed to fetch avatar: ${avatarFilename}`);
                        continue;
                    }
        
                    avatars.push(avatarFilename); // Add the avatar filename to avatars array
                } catch (error) {
                    console.error(`Error loading avatar ${avatarFilename}:`, error);
                }
            }
        
            renderAvatarsList();
        } catch (error) {
            console.error('Failed to load avatars list:', error);
        }
    };
    
    const renderAppList = () => {
        appListElement.innerHTML = '';
    
        apps.forEach(app => {
            const type = app?.type ?? null;
            const li = document.createElement('li');
            li.classList.add('app-items');
            li.classList.add('z-depth-1');
            li.innerHTML = `
                <img class="apps-img" src="${appsFolder}/${app.folder}/${app.icon}" alt="${app.name}"><br>
                <span>${app.name}</span>
                <a class="modal-trigger" style="
                position: absolute;
                right: 41px;
                display: flex;
                align-content: center;
                justify-content: center;
            " id="informer" href="#modal1"><i class="material-icons grey-text text-darken-3">settings</i></a>
            `;
            li.querySelector('#informer').addEventListener('click', () => {
                document.getElementById('appIcon').src = `${appsFolder}/${app.folder}/${app.icon}`;
                document.getElementById('appNameInfo').textContent = `${app.name}`;
                document.getElementById('description').textContent = `${app.description}`;
            })
            document.getElementById('unistall').addEventListener('click', () => {
                if (type === null) {
                    let directoryToDelete = path.join('materialos/system/apps', app.folder);
                    deleteDirectory(directoryToDelete);
                    M.toast({html: 'App Deleted'});
                    updateJSON()
                } else if(app.type === 'system') {
                    M.toast({html: 'This is system app'});
                }
            });
            appListElement.appendChild(li);
        });
    };

    // Function to update JSON
    async function updateJSON() {
        const directoryPath = path.join('materialos', 'system', 'apps');

        fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            const folders = files
            .filter(file => file.isDirectory())
            .map(folder => folder.name);

            console.log('Folders:', folders);

            const jsonFilePath = path.join(directoryPath, 'apps-list.json');
            fs.writeFile(jsonFilePath, JSON.stringify(folders, null, 2), (err) => {
                if (err) {
                    console.error('Error writing JSON file:', err);
                    return;
                }
                console.log('Folders written to JSON file successfully!');
            });
        });
    }

    const renderAvatarsList = () => {
        const AvatarsListElement = document.getElementById('avatarsList');
        AvatarsListElement.innerHTML = ''; // Clear the avatars list before rendering
    
        avatars.forEach(avatarFilename => {
            const li = document.createElement('li');
            li.classList.add('avatarItem');
            li.classList.add('z-depth-1');
            li.innerHTML = `
                <img class="avatars-img" src="../../img/avatars/${avatarFilename}" alt="${avatarFilename}">
            `;
            li.addEventListener('click', () => {
                const avatar = `../img/avatars/${avatarFilename}`;

                // Save account img to localStorage
                localStorage.setItem('avatar-account', JSON.stringify(avatar));
            });
            AvatarsListElement.appendChild(li);
        });
    };

    loadAppsFromJson();
    loadAvatarsFromJson();
});
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});



