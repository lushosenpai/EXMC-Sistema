const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la app
  getVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  
  // Diálogos
  showMessage: (type, title, message) =>
    ipcRenderer.invoke('show-message', { type, title, message }),
  
  // Información del entorno
  isElectron: true,
  platform: process.platform,
});
