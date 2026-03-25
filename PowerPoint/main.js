const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    },
    title: 'PowerPoint - Office',
    show: false
  });

  // Load the Word Cloud URL
  mainWindow.loadURL('https://powerpoint.cloud.microsoft');

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Configure autoUpdater for differential updates
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info);
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`;
  if (progressObj.bytesPerSecond && progressObj.percent) {
    console.log(logMessage);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info);
  // Wait 5 seconds before installing to give user time to save work
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});