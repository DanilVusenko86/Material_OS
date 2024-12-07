// Function to scan and display Bluetooth devices using Web Bluetooth API
async function scanForBluetoothDevices() {
    try {
        console.log('Requesting Bluetooth devices...');
        clearDeviceList(); // Clear the list before scanning

        // Request Bluetooth devices using Web Bluetooth API
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service'] // Example service
        });

        // Display found device
        const deviceName = device.name || 'Unnamed device';
        console.log(`Found device: ${deviceName}`);

        // Create a list item for the discovered device
        const deviceList = document.getElementById('device-list');
        const deviceItem = document.createElement('li');
        deviceItem.className = 'collection-item';
        deviceItem.textContent = `${deviceName} [${device.id}]`;

        // Add click listener to connect to the device
        deviceItem.addEventListener('click', async () => {
            try {
                console.log(`Connecting to ${deviceName}...`);
                const server = await device.gatt.connect();
                console.log(`Successfully connected to ${deviceName}`);
                document.getElementById('connection-status').textContent = `Connected to ${deviceName}`;

                // Example of reading battery level if the service is available
                const service = await server.getPrimaryService('battery_service');
                const characteristic = await service.getCharacteristic('battery_level');
                const batteryLevel = await characteristic.readValue();
                console.log(`Battery Level: ${batteryLevel.getUint8(0)}%`);
            } catch (error) {
                console.error('Connection failed:', error);
                document.getElementById('connection-status').textContent = `Failed to connect to ${deviceName}`;
            }
        });

        deviceList.appendChild(deviceItem);
    } catch (error) {
        console.error('Bluetooth error:', error);
    }
}

// Function to clear all items from the device list
function clearDeviceList() {
    const deviceList = document.getElementById('device-list');
    while (deviceList.firstChild) {
        deviceList.removeChild(deviceList.firstChild);
    }
}

// Toggle button for scanning and stopping Bluetooth
document.getElementById('bluetooth-switch').addEventListener('change', (event) => {
    if (event.target.checked) {
        console.log('Bluetooth is ON. Starting scan...');
        scanForBluetoothDevices();
    } else {
        console.log('Bluetooth is OFF. Stopping scan...');
        clearDeviceList();
    }
});

// Cleanup when the app is closed or reloaded
window.addEventListener('beforeunload', () => {
    if (navigator.bluetooth && navigator.bluetooth.gatt && navigator.bluetooth.gatt.connected) {
        navigator.bluetooth.gatt.disconnect();
    }
});
