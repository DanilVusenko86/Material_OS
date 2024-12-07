document.addEventListener('DOMContentLoaded', () => {
    const { exec } = require('child_process');

    const wifiBTN = document.getElementById('wifi');
    const bluetoothBTN = document.getElementById('bluetooth');
    const settingsBTN = document.getElementById('settings');
    const saverBTN = document.getElementById('batterySaver');
    const functionsMenu = document.getElementById('functions-menu');
    const WifiMenu = document.getElementById('wifi-menu');
    const BluetoothMenu = document.getElementById('bluetooth-menu');
    
    const offBTNMain = document.querySelector('#control-panels #powerOff'); // Target power off button in the main functions panel
    const resetBTNMain = document.querySelector('#control-panels #restart'); // Target restart button in the main functions panel
    
    const offBTNLogin = document.querySelector('#login-screen #powerOff'); // Target power off button in the login screen
    const resetBTNLogin = document.querySelector('#login-screen #restart'); // Target restart button in the login screen

    const logoutPanelBTN = document.querySelector('#Avatar');

    const wifiClose = document.getElementById('close');
    const bluetoothClose = document.getElementById('bclose');
    
    const bodyThirt = document.body;
    const loginPanel = document.getElementById('login-screen');

    // Functions panel buttons
    if (wifiBTN) {
        wifiBTN.addEventListener('click', () => {
            functionsMenu.style.display = 'none';
            WifiMenu.style.display = 'block';
        });
    }

    if (bluetoothBTN) {
        bluetoothBTN.addEventListener('click', () => {
            functionsMenu.style.display = 'none';
            BluetoothMenu.style.display = 'block';
        });
    }

    if (wifiClose) {
        wifiClose.addEventListener('click', () => {
            WifiMenu.style.display = 'none';
            
        })
    }

    if (bluetoothClose) {
        bluetoothClose.addEventListener('click', () => {
           BluetoothMenu.style.display = 'none';  
        })
    }

    if (settingsBTN) {
        settingsBTN.addEventListener('click', () => {
            const settingsApp = apps.find(app => app.name === 'Settings');
            if (settingsApp) {
                openAppInWindow(settingsApp);
            }
        });
    }

    if (saverBTN) {
        saverBTN.addEventListener('click', () => {
            bodyThirt.style.filter = `brightness(49%)`;
        });
    }

    // Power Off and Restart in the Functions Panel
    if (offBTNMain) {
        offBTNMain.addEventListener('click', () => {
            exec('shutdown -h now', (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error shutting down: ${error.message}`);
                  return;
                }
                if (stderr) {
                  console.error(`Shutdown stderr: ${stderr}`);
                  return;
                }
                console.log(`Shutdown output: ${stdout}`);
              });
        });
    }

    if (resetBTNMain) {
        resetBTNMain.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Power Off and Restart in the Login Screen
    if (offBTNLogin) {
        offBTNLogin.addEventListener('click', () => {
            exec('shutdown -h now', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error shutting down: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Shutdown stderr: ${stderr}`);
                    return;
                }
                console.log(`Shutdown output: ${stdout}`);
            });
        });
    }

    if (resetBTNLogin) {
        resetBTNLogin.addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Logout to login screen
    if (logoutPanelBTN) {
        logoutPanelBTN.addEventListener('click', () => {
            loginPanel.style.display = 'flex';
        });
    }
});
