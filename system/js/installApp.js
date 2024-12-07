const path = require('path');
const fs = require('fs');
const JSZip = require('jszip'); // Ensure you include JSZip in your project

// Function to install an app
async function installApp(manifest) {
    const { name, patch, developer } = manifest;

    const installPanel = document.getElementById('install-panel');
    const installHeader = document.getElementById('install-header');
    const installButton = document.getElementById('install-button');
    const closeButton = document.getElementById('close-button');

    installHeader.textContent = `Do you want to install this app?`;
    document.getElementById('app-name').textContent = `App Name: ${name}`;
    document.getElementById('app-developer').textContent = `Developer: ${developer}`;

    installPanel.style.display = 'flex';

    closeButton.onclick = () => {
        installPanel.style.display = 'none';
    };

    installButton.onclick = async () => {
        try {
            console.log(`Starting installation of app: ${name}`);
            await downloadAndUnzipApp(patch, name);
            await updateJSON();
            installPanel.style.display = 'none';
            sendToastToOS('download_done', 'App Installed!');
        } catch (error) {
            console.error('Failed to install the app:', error);
            sendToastToOS('file_download_off', 'App Install Failed');
        }
    };
}

// Function to download and unzip the app
async function downloadAndUnzipApp(zipUrl, appName) {
    console.log(`Downloading app from: ${zipUrl}`);

    try {
        const response = await fetch(zipUrl);
        if (!response.ok) throw new Error(`Failed to download zip file: ${response.statusText} (Status: ${response.status})`);

        const reader = response.body.getReader();
        const unzipper = new JSZip();

        let chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const blob = new Blob(chunks);
        console.log('Large zip file downloaded in chunks');

        const zip = await unzipper.loadAsync(blob);

        for (const fileName of Object.keys(zip.files)) {
            const file = zip.files[fileName];

            if (file.dir) {
                await saveDirectoryToAppsDirectory(appName, fileName);
            } else {
                const fileContent = await file.async('blob');
                await saveFileToAppsDirectory(appName, fileName, fileContent);
            }
        }

        console.log(`App ${appName} unzipped and saved`);
    } catch (error) {
        console.error('Failed to download or unzip the app:', error);
        throw error;
    }
}

// Function to save a directory
async function saveDirectoryToAppsDirectory(appName, dirName) {
    try {
        const appDir = path.join('materialos', 'system', 'apps', appName);
        const dirPath = path.join(appDir, dirName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Directory created: ${dirPath}`);
        }
    } catch (error) {
        console.error('Failed to create directory:', error);
        throw error;
    }
}

// Function to save a file
async function saveFileToAppsDirectory(appName, fileName, fileContent) {
    try {
        const appDir = path.join('materialos', 'system', 'apps', appName);
        const fileSavePath = path.join(appDir, fileName);

        const dirPath = path.dirname(fileSavePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Directory created: ${dirPath}`);
        }

        fs.writeFileSync(fileSavePath, Buffer.from(await fileContent.arrayBuffer()));
        console.log(`File saved: ${fileSavePath}`);
    } catch (error) {
        console.error('Failed to save file:', error);
        throw error;
    }
}

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

// Function to send a toast message to the OS
function sendToastToOS(icon, message) {
    window.parent.postMessage({
        type: 'toast',
        icon: icon,
        message: message
    }, '*');
}

// Event listener for install requests
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'installApp') {
        const manifest = event.data.manifest;
        console.log('Received installApp request:', manifest);
        installApp(manifest);
    }
});
