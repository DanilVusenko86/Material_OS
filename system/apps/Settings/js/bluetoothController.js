const noble = require('@abandonware/noble');

// Function to start or stop scanning for Bluetooth devices
function toggleBluetooth(isBluetoothOn) {
    if (isBluetoothOn) {
        console.log('Bluetooth is ON. Starting scan...');
        clearDeviceList(); // Clear the device list before starting a new scan
        noble.startScanning([], false); // Scanning for all devices
    } else {
        console.log('Bluetooth is OFF.');
        noble.stopScanning();
        clearDeviceList();
    }
}

// Function to clear all collection items from the device list
function clearDeviceList() {
    const deviceList = document.getElementById('device-list');
    while (deviceList.firstChild) {
        deviceList.removeChild(deviceList.firstChild);
    }
}

// When Bluetooth is powered on or off
noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
        console.log('Bluetooth is powered on');
    } else {
        console.log('Bluetooth is powered off');
    }
});

// When a Bluetooth device is discovered
noble.on('discover', (device) => {
    const deviceName = device.advertisement.localName || 'Unnamed device';
    console.log(`Found device: ${deviceName} [${device.address}]`);

    // Create a list item for the discovered device
    const deviceList = document.getElementById('device-list');
    const deviceItem = document.createElement('li');
    deviceItem.className = 'collection-item';
    deviceItem.textContent = `${deviceName} [${device.address}]`;
    
    // Add click listener to connect to the device
    deviceItem.addEventListener('click', async () => {
        try {
            console.log(`Connecting to ${deviceName}...`);
            await device.connectAsync();
            console.log(`Successfully connected to ${deviceName}!`);
            document.getElementById('connection-status').textContent = `Connected to ${deviceName}`;
        } catch (error) {
            console.error('Connection failed:', error);
            document.getElementById('connection-status').textContent = `Failed to connect to ${deviceName}`;
        }
    });

    deviceList.appendChild(deviceItem);
});

// Handle Bluetooth toggle switch
document.getElementById('bluetooth-switch').addEventListener('change', (event) => {
    toggleBluetooth(event.target.checked);
});

// Clean up and stop scanning when the app closes
process.on('exit', () => {
    noble.stopScanning();
});
