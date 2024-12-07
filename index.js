// index.js
const { app, BrowserWindow, ipcMain, session, dialog } = require('electron');
const { exec } = require('child_process');
const wifi = require('node-wifi');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Initialize node-wifi
wifi.init({
  iface: null, // use default interface
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    devTools: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      media: true,
      webSecurity: false,
      contextIsolation: false,
      enableBlinkFeatures: 'ExperimentalWebPlatformFeatures',
    }
  });

  mainWindow.setMenuBarVisibility(false);

  // Remove 'X-Frame-Options' to allow iframes from any domain
  mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: ["*://*/*"] },
    (d, c) => {
      if (d.responseHeaders['X-Frame-Options']) {
        delete d.responseHeaders['X-Frame-Options'];
      } else if (d.responseHeaders['x-frame-options']) {
        delete d.responseHeaders['x-frame-options'];
      }
      c({ cancel: false, responseHeaders: d.responseHeaders });
    }
  );


  // Load the URL (replace with your actual URL if needed)
  mainWindow.loadURL('http://localhost:8000');

  // Disable F11 (Full Screen) and Alt+F4 (Close) key actions
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11') {
      event.preventDefault(); // Prevent Fullscreen (F11)
    }
    if (input.key === 'F4' && input.alt) {
      event.preventDefault(); // Prevent Closing via Alt+F4
    }
  });

  // Set permission request handler for geolocation
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'geolocation') {
      callback(true); // Allow geolocation permission
    } else {
      callback(false); // Deny other permissions
    }
  });

  // Handle Wi-Fi scan
  ipcMain.handle('scan-wifi', async () => {
    return await wifi.scan();
  });

  // Handle Wi-Fi connect
  ipcMain.handle('connect-wifi', async (event, ssid, password) => {
    try {
      await wifi.connect({ ssid, password });
      return { success: true, message: `Connected to ${ssid}` };
    } catch (error) {
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  });

  // Handle Wi-Fi on/off toggle
  ipcMain.handle('toggle-wifi', async (event, isEnabled) => {
    try {
      await wifi.disconnect();
      if (isEnabled) {
        // Reconnect after enabling
        await wifi.init({ iface: null });
      }
      return { success: true, message: `Wi-Fi ${isEnabled ? 'enabled' : 'disabled'}` };
    } catch (error) {
      return { success: false, message: `Error toggling Wi-Fi: ${error.message}` };
    }
  });
}

ipcMain.on('read-directory', (event, dirPath) => {
  fs.readdir(dirPath, { withFileTypes: true }, (err, items) => {
    if (err) return console.error(err);

    const files = items.map(item => ({
      name: item.name,
      path: path.join(dirPath, item.name),
      isDirectory: item.isDirectory(),
    }));

    event.reply('update-file-list', files);
    event.reply('update-breadcrumb', dirPath.split(path.sep));
  });
});

ipcMain.on('create-folder', (event, folderPath) => {
  fs.mkdir(folderPath, (err) => {
    if (err) console.error(err);
    event.reply('read-directory', path.dirname(folderPath));
  });
});

ipcMain.on('create-file', (event, filePath) => {
  fs.writeFile(filePath, '', (err) => {
    if (err) console.error(err);
    event.reply('read-directory', path.dirname(filePath));
  });
});

ipcMain.on('list-disks', (event) => {
  const platform = os.platform();

  if (platform === 'win32') {
    // For Windows
    exec('wmic logicaldisk get name', (error, stdout) => {
      if (error) {
        console.error(error);
        return;
      }
      const disks = stdout.split('\r\n').filter(line => /^[A-Z]:/.test(line.trim()));
      event.reply('disks', disks);
    });
  } else if (platform === 'linux') {
    // For Linux
    exec('lsblk -o MOUNTPOINT,TYPE | grep "part$" | awk \'{print $1}\'', (error, stdout) => {
      if (error) {
        console.error(error);
        return;
      }
      const disks = stdout.split('\n').filter(line => line.trim() !== '');
      event.reply('disks', disks);
    });
  } else if (platform === 'darwin') {
    // For macOS
    exec('df -H | grep Volumes', (error, stdout) => {
      if (error) {
        console.error(error);
        return;
      }
      const disks = stdout.split('\n').map(line => line.split(' ').filter(Boolean).pop());
      event.reply('disks', disks.filter(Boolean));
    });
  } else {
    event.reply('disks', ['/']);
  }
});

ipcMain.handle('show-dialog', async (event, options) => {
  return await dialog.showMessageBox(options);
});




// Create the main window when the app is ready
app.whenReady().then(() => {
  createWindow();

  // Listen for 'close-app' event from the renderer process and quit the app
  ipcMain.on('close-app', () => {
    app.quit();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create a window if the app is activated and no other windows are open (for macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
