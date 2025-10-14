module.exports = {
  // Configuración de la aplicación
  app: {
    name: 'Sistema EXMC',
    description: 'Sistema de Gestión Comercial',
    version: '1.0.0',
    author: {
      name: 'Luciano Savoretti',
      role: 'Dev / Sistemas / Web',
      instagram: 'https://www.instagram.com/devpuchito/',
    },
  },

  // Puertos
  ports: {
    backend: 3001,
    frontend: 5173,
  },

  // Base de datos SQLite
  database: {
    type: 'sqlite',
    filename: 'exmc.db',
  },

  // Configuración de ventana
  window: {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0f172a',
  },

  // Características
  features: {
    autoUpdater: true,
    trayIcon: true,
    devTools: process.env.NODE_ENV === 'development',
    minimizeToTray: true,
  },
};
