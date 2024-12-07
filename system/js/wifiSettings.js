const { ipcRenderer } = require('electron');

// Initialize Materialize components
document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
});

// Elements
const wifiList = document.getElementById('wifi-list');
const wifiSwitch = document.getElementById('wifi-switch');
let selectedSSID = '';

// Event listener for the Wi-Fi toggle switch
wifiSwitch.addEventListener('change', async () => {
  const isEnabled = wifiSwitch.checked;
  const response = await ipcRenderer.invoke('toggle-wifi', isEnabled);
  M.toast({ html: response.message });
  if (isEnabled) scanForWifi();
  else wifiList.innerHTML = '';
});

// Scan for available Wi-Fi networks
async function scanForWifi() {
  const networks = await ipcRenderer.invoke('scan-wifi');
  wifiList.innerHTML = '';
  networks.forEach(network => {
    const listItem = document.createElement('li');
    listItem.classList.add('collection-item');
    listItem.textContent = `${network.ssid} (${network.quality}%)`;
    listItem.addEventListener('click', () => connectToWifi(network));
    wifiList.appendChild(listItem);
  });
}

// Connect to Wi-Fi
async function connectToWifi(network) {
  selectedSSID = network.ssid;
  if (network.security.length === 0) {
    // Open network - no password required
    const response = await ipcRenderer.invoke('connect-wifi', selectedSSID);
    M.toast({ html: response.message });
  } else {
    // Secured network - prompt for password
    const passwordModal = M.Modal.getInstance(document.getElementById('password-modal'));
    passwordModal.open();
  }
}

// When 'Connect' button is clicked in the password modal
document.getElementById('connect-btn').addEventListener('click', async () => {
  const password = document.getElementById('password-input').value;
  const response = await ipcRenderer.invoke('connect-wifi', selectedSSID, password);
  M.toast({ html: response.message });
});
  
// Scan for Wi-Fi on load
scanForWifi();
