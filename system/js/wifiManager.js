const wifi = require('node-wifi');

// Initialize the wifi module
wifi.init({
    iface: null // Leave it null to let the system select the default network interface
});

// Function to get Wi-Fi status and update the HTML element
function updateWifiStatus() {
    wifi.getCurrentConnections((err, currentConnections) => {
        const wifiIcon = document.getElementById('wifiIcon');
        wifiIcon.className = ''; 

        if (err) {
            console.error('Error getting Wi-Fi status:', err);
            wifiIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">signal_wifi_off</i>';
        } else if (currentConnections.length > 0) {
            // Get the first connection's signal level (in dBm)
            const signalLevel = currentConnections[0].signal_level;
            
            // Check Wi-Fi signal strength and display appropriate icons
            if (signalLevel >= -50) { 
                wifiIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">network_wifi</i>'; // Strong signal
            } else if (signalLevel >= -70) {
                wifiIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">network_wifi_3_bar</i>'; // Medium signal
            } else if (signalLevel >= -80) {
                wifiIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">network_wifi_2_bar</i>'; // Weak signal
            } else {
                wifiIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">network_wifi_1_bar</i>'; // Very weak signal
            }
        } else {
            // No Wi-Fi connection
            wifiIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">signal_wifi_off</i>';
        }
    });
}

// Function to be called on load and to update the Wi-Fi status every 5 seconds
function onLoadWifiStatus() {
    // Call it immediately when the page is loaded
    updateWifiStatus();

    // Continuously check the status every 5 seconds to detect changes
    setInterval(updateWifiStatus, 5000); // Update every 5 seconds
}

// Ensure the function is called after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', onLoadWifiStatus);
