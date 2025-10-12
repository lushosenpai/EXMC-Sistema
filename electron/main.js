const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = !app.isPackaged; // Mejor detección de modo desarrollo

let mainWindow;
let tray;
let backendProcess;
let postgresProcess;

const BACKEND_PORT = 3001;
const FRONTEND_PORT = 5173;

// Rutas portables
const APP_PATH = app.getAppPath();
const USER_DATA_PATH = app.getPath('userData');

// PostgreSQL está en resources cuando está empaquetado
const POSTGRES_PATH = isDev 
  ? path.join(APP_PATH, 'postgres')  // En dev, junto al código
  : path.join(process.resourcesPath, 'postgres'); // En producción, en resources

const DATA_PATH = path.join(USER_DATA_PATH, 'data');

// Asegurar que existan los directorios necesarios
if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
}

// Iniciar PostgreSQL portable
async function startPostgres() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(POSTGRES_PATH)) {
      console.log('PostgreSQL no encontrado en:', POSTGRES_PATH);
      // En producción, PostgreSQL debe estar incluido
      if (!isDev) {
        dialog.showErrorBox(
          'Error de PostgreSQL',
          'No se encontró PostgreSQL. Por favor reinstale la aplicación.'
        );
        app.quit();
        return;
      }
      resolve(); // En desarrollo, usar PostgreSQL del sistema
      return;
    }

    const pgBin = path.join(POSTGRES_PATH, 'bin', 'pg_ctl.exe');
    const pgData = path.join(DATA_PATH, 'pgdata');

    // Inicializar base de datos si no existe
    if (!fs.existsSync(pgData)) {
      console.log('Inicializando base de datos PostgreSQL...');
      const initdb = spawn(
        path.join(POSTGRES_PATH, 'bin', 'initdb.exe'),
        ['-D', pgData, '-U', 'postgres', '--encoding=UTF8'],
        { windowsHide: true }
      );

      initdb.on('close', (code) => {
        if (code === 0) {
          startPostgresServer(pgBin, pgData, resolve, reject);
        } else {
          reject(new Error('Error al inicializar PostgreSQL'));
        }
      });
    } else {
      startPostgresServer(pgBin, pgData, resolve, reject);
    }
  });
}

function startPostgresServer(pgBin, pgData, resolve, reject) {
  console.log('Iniciando servidor PostgreSQL...');
  
  postgresProcess = spawn(
    pgBin,
    ['start', '-D', pgData, '-o', '-p 5433 -k ""'],
    { windowsHide: true }
  );

  // Esperar a que PostgreSQL esté listo
  setTimeout(() => {
    console.log('PostgreSQL iniciado correctamente');
    resolve();
  }, 3000);

  postgresProcess.on('error', (err) => {
    console.error('Error al iniciar PostgreSQL:', err);
    reject(err);
  });
}

// Iniciar servidor backend
async function startBackend() {
  return new Promise((resolve, reject) => {
    // En producción, los archivos están en diferentes ubicaciones
    let backendPath;
    let backendScript;
    
    if (isDev) {
      backendPath = path.join(__dirname, '..', 'backend');
      backendScript = path.join(backendPath, 'dist', 'index.js');
    } else {
      // En producción, buscar en app.asar.unpacked primero, luego en resources
      const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend');
      const asarPath = path.join(process.resourcesPath, 'app', 'backend');
      
      if (fs.existsSync(path.join(unpackedPath, 'dist', 'index.js'))) {
        backendPath = unpackedPath;
      } else if (fs.existsSync(path.join(asarPath, 'dist', 'index.js'))) {
        backendPath = asarPath;
      } else {
        // Último intento: buscar en la estructura de recursos
        backendPath = path.join(APP_PATH, 'backend');
      }
      
      backendScript = path.join(backendPath, 'dist', 'index.js');
    }

    console.log('=== BACKEND DEBUG ===');
    console.log('isDev:', isDev);
    console.log('backendPath:', backendPath);
    console.log('backendScript:', backendScript);
    console.log('script exists:', fs.existsSync(backendScript));
    console.log('process.resourcesPath:', process.resourcesPath);
    console.log('APP_PATH:', APP_PATH);
    console.log('process.execPath:', process.execPath);

    if (!fs.existsSync(backendScript)) {
      const errorMsg = `Backend script no encontrado en: ${backendScript}`;
      console.error(errorMsg);
      dialog.showErrorBox('Error de Backend', errorMsg);
      reject(new Error(errorMsg));
      return;
    }

    // Variables de entorno para el backend
    const env = {
      ...process.env,
      NODE_ENV: 'production',
      PORT: BACKEND_PORT.toString(),
      DATABASE_URL: isDev
        ? process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/exmc_db'
        : `postgresql://postgres:postgres@localhost:5433/exmc_db`,
      JWT_SECRET: process.env.JWT_SECRET || 'exmc-secret-key-change-in-production',
    };

    console.log('Iniciando backend con:', process.execPath);

    // Usar process.execPath que apunta al ejecutable de Electron que incluye Node.js
    backendProcess = spawn(process.execPath, [backendScript], {
      cwd: backendPath,
      env,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let backendReady = false;

    backendProcess.stdout?.on('data', (data) => {
      const message = data.toString();
      console.log(`Backend stdout: ${message}`);
      // Resolver cuando el servidor esté listo
      if (!backendReady && (message.includes('Server running') || message.includes('listening') || message.includes('started'))) {
        backendReady = true;
        console.log('Backend ready!');
        resolve();
      }
    });

    backendProcess.stderr?.on('data', (data) => {
      const message = data.toString();
      console.error(`Backend stderr: ${message}`);
      
      // Si es un error crítico, mostrar diálogo
      if (message.includes('Error:') || message.includes('Cannot find module')) {
        dialog.showErrorBox(
          'Error del Servidor Backend',
          `No se pudo iniciar el servidor backend:\n\n${message.substring(0, 200)}\n\nPor favor reinstale la aplicación.`
        );
      }
    });

    backendProcess.on('error', (err) => {
      console.error('Backend process error:', err);
      dialog.showErrorBox(
        'Error del Servidor',
        `No se pudo iniciar el servidor backend:\n${err.message}\n\nPor favor reinicie la aplicación.`
      );
      reject(err);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
      if (code !== 0 && code !== null && !backendReady) {
        dialog.showErrorBox(
          'Error del Backend',
          `El servidor backend se cerró inesperadamente (código: ${code})`
        );
      }
    });

    // Timeout de seguridad - resolver después de 5 segundos si no hay respuesta
    setTimeout(() => {
      if (!backendReady) {
        console.log('Backend timeout reached, continuing anyway...');
        resolve();
      }
    }, 5000);
  });
}

// Crear ventana principal
function createWindow() {
  // Usar .ico en Windows para mejor calidad
  const windowIcon = path.join(__dirname, 'assets', 'icon.ico');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0f172a',
    icon: fs.existsSync(windowIcon) ? windowIcon : undefined, // Ícono opcional
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false, // No mostrar hasta que esté listo
  });

  // Remover menú por defecto
  mainWindow.setMenuBarVisibility(false);

  // Cargar la aplicación
  const startUrl = isDev
    ? `http://localhost:${FRONTEND_PORT}`
    : `http://localhost:${BACKEND_PORT}`;

  mainWindow.loadURL(startUrl);

  // Mostrar cuando esté listo
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  // Abrir DevTools en desarrollo
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Minimizar a bandeja en lugar de cerrar
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Crear icono de bandeja
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'tray-icon.png');
  
  // Verificar si existe el ícono
  if (!fs.existsSync(iconPath)) {
    console.log('⚠️  Ícono de bandeja no encontrado, saltando creación del tray');
    console.log('   Para agregar ícono, ver: electron/ICONOS.md');
    return; // Salir si no existe el ícono
  }
  
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar EXMC',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: 'Acerca de',
      click: () => {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Sistema EXMC',
          message: 'Sistema EXMC v1.0.0',
          detail:
            'Sistema de Gestión Comercial\n\nDesarrollado por:\nLuciano Savoretti\nDev / Sistemas / Web\n\nInstagram: @devpuchito',
          buttons: ['OK'],
        });
      },
    },
    { type: 'separator' },
    {
      label: 'Salir',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Sistema EXMC - Gestión Comercial');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Inicialización de la aplicación
app.on('ready', async () => {
  console.log('Iniciando Sistema EXMC...');
  console.log('Modo:', isDev ? 'DESARROLLO' : 'PRODUCCIÓN');
  
  try {
    // En desarrollo, backend y frontend se inician con concurrently
    // Solo iniciamos backend automáticamente en producción
    if (!isDev) {
      // 1. Iniciar PostgreSQL portable (SOLO EN PRODUCCIÓN)
      console.log('Iniciando PostgreSQL portable...');
      await startPostgres();
      
      // 2. Iniciar servidor backend
      await startBackend();
    } else {
      console.log('Modo desarrollo: Backend y Frontend gestionados por concurrently');
      console.log('Usando PostgreSQL instalado en el sistema (puerto 5432)');
    }

    // 3. Crear ventana principal
    createWindow();

    // 4. Crear icono de bandeja
    createTray();

    console.log('Sistema EXMC iniciado correctamente');
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    dialog.showErrorBox(
      'Error de Inicio',
      'No se pudo iniciar la aplicación. Por favor contacte con soporte.'
    );
    app.quit();
  }
});

// Cerrar todo al salir
app.on('before-quit', () => {
  app.isQuitting = true;

  // Cerrar procesos
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (postgresProcess) {
    postgresProcess.kill();
  }
});

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

// IPC Handlers
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('get-user-data-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('show-message', (event, { type, title, message }) => {
  return dialog.showMessageBox(mainWindow, {
    type,
    title,
    message,
    buttons: ['OK'],
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Error Inesperado', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
