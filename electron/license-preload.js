const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Licencia
  checkLicense: () => ipcRenderer.invoke('check-license'),
  activateLicense: (code) => ipcRenderer.invoke('activate-license', code),
  startTrial: () => ipcRenderer.invoke('start-trial'),
  getMachineId: () => ipcRenderer.invoke('get-machine-id'),
  
  // Aplicación
  closeApp: () => ipcRenderer.send('close-app'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
});
