const fs = require('fs');
const path = require('path');
const https = require('https');

const mainAppContentPath = path.resolve('materialos/system');
const localVersionFile = path.join(mainAppContentPath, 'version.json');

// Initialize Materialize modals
document.addEventListener('DOMContentLoaded', function () {
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});

// Function to fetch JSON from server
async function fetchServerVersion() {
  const serverUrl = "https://materialmarket.netlify.app/update/version.json"; // Replace with your server URL
  return new Promise((resolve, reject) => {
    https.get(serverUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', (err) => reject(err));
  });
}

// Function to compare versions
async function checkForUpdate() {
  try {
    const serverVersionData = await fetchServerVersion();
    const localVersionData = JSON.parse(fs.readFileSync(localVersionFile, 'utf-8'));
    
    console.log('errnor')

    if (localVersionData.version >= serverVersionData.version) {
      // No update
      showModal('No Update Available', 'You already have the latest version.');
      console.log('worksNonUpdate')
    } else if (localVersionData.version < serverVersionData.version) {
      // Update available
      showUpdateModal(serverVersionData);
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
    showModal('Error', 'Failed to check for updates. Please try again later.');
  }
}

// Function to show modal
function showModal(title, content) {
  // Set modal title and content
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-content').innerHTML = content;

  // Get the modal element
  const modalElement = document.getElementById('update-modal');

  // Initialize the modal instance if it hasn't been initialized
  let modalInstance = M.Modal.getInstance(modalElement);
  if (!modalInstance) {
    modalInstance = M.Modal.init(modalElement);
  }

  // Open the modal
  modalInstance.open();
}

// Show update modal with a button to update
function showUpdateModal(serverVersionData) {
  document.getElementById('modal-title').innerText = 'Update Available';
  document.getElementById('modal-content').innerHTML = `A new version ${serverVersionData.version} is available.<br>`;
  document.getElementById('footer').innerHTML = `
    <button id="update-button" class="teal-text" style="
            float: right;
            border: none;
            background: none;
            margin-top: 15px;">Update</button>
  `;

  // Open the modal
  const modalElement = document.getElementById('update-modal');
  let modalInstance = M.Modal.getInstance(modalElement);
  if (!modalInstance) {
    modalInstance = M.Modal.init(modalElement);
  }
  modalInstance.open();

  // Add click event to the update button
  document.getElementById('update-button').addEventListener('click', () => {
    downloadAndUpdate(serverVersionData.zipUrl);
  });
}

// Download and extract update
async function downloadAndUpdate(zipUrl) {
  try {
    const zipData = await new Promise((resolve, reject) => {
      https.get(zipUrl, (res) => {
        let chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', (err) => reject(err));
      });
    });

    // Load ZIP with JSZip
    const JSZip = window.JSZip;
    const zip = await JSZip.loadAsync(zipData);

    for (const [filename, file] of Object.entries(zip.files)) {
      const filePath = path.join(mainAppContentPath, filename);

      if (file.dir) {
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
      } else {
        const fileContent = await file.async('nodebuffer');
        fs.writeFileSync(filePath, fileContent);
      }
    }

    showModal('Update Successful', 'The app has been updated. Please restart the application.');
  } catch (error) {
    console.error('Error during update:', error);
    showModal('Error', 'Failed to update the app. Please try again later.');
  }
}

document.getElementById('checkbtn').addEventListener('click', () => {
  // Start update check
  checkForUpdate();
});