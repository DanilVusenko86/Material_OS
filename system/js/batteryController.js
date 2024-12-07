document.addEventListener('DOMContentLoaded', function () {
    if (navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            
            function updateBatteryStatus() {
                const percentage = battery.level * 100;
                const batteryIcon = document.getElementById('battery');

                batteryIcon.className = ''; 
                
                if (battery.charging) {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_charging_full</i>';
                } else if (percentage >= 90) {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_full</i>';
                } else if (percentage >= 75) {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_4_bar</i>';
                } else if (percentage >= 50) {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_3_bar</i>';
                } else if (percentage >= 25) {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_2_bar</i>';
                } else if (percentage <= 20) {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_1_bar</i>';
                    // Function to send a message to the OS
                    function sendToastToOS(icon, message) {
                        window.parent.postMessage({
                            type: 'toast',
                            icon: icon,
                            message: message
                        }, '*');
                    }
            
                    // Example usage
                    sendToastToOS('battery_alert', 'Please Connect Charger To Your Device !');
                } else {
                    batteryIcon.innerHTML = '<i class="material-icons" style="font-size: 22px">battery_alert</i>'; 
                }
            }
            
            updateBatteryStatus();

            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    }
});
