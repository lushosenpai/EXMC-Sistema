const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const LicenseManager = require('./license');
const isDev = !app.isPackaged; // Mejor detección de modo desarrollo

let mainWindow;
let licenseWindow;
let tray;
let backendProcess;
let postgresProcess;
let licenseManager;
let isInitializing = false; // Flag para evitar inicializaciones múltiples
let appInitialized = false; // Flag para saber si ya se inicializó

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

// Inicializar el gestor de licencias
licenseManager = new LicenseManager();

// ============================================
// PREVENIR MÚLTIPLES INSTANCIAS
// ============================================

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log('Ya hay una instancia ejecutándose. Cerrando...');
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Alguien intentó ejecutar una segunda instancia, enfocamos nuestra ventana
    console.log('Se intentó abrir una segunda instancia');
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    } else if (licenseWindow) {
      if (licenseWindow.isMinimized()) licenseWindow.restore();
      licenseWindow.focus();
    }
  });
}

// ============================================
// SISTEMA DE LICENCIAS
// ============================================

// Crear ventana de activación
function createLicenseWindow() {
  // Si ya existe la ventana, no crear otra
  if (licenseWindow && !licenseWindow.isDestroyed()) {
    licenseWindow.focus();
    return;
  }

  licenseWindow = new BrowserWindow({
    width: 600,
    height: 850,
    minWidth: 550,
    minHeight: 800,
    resizable: true,
    frame: true,
    center: true,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'license-preload.js')
    }
  });

  licenseWindow.loadFile(path.join(__dirname, 'activation.html'));
  licenseWindow.setMenu(null);

  licenseWindow.on('closed', () => {
    licenseWindow = null;
    // Si cierra sin activar, cerrar la app
    if (!mainWindow) {
      app.quit();
    }
  });
}

// Verificar licencia al iniciar
async function checkLicenseStatus() {
  const status = licenseManager.checkLicense();
  
  console.log('License Status:', status);
  
  if (status.status === 'active' || status.status === 'trial') {
    // Licencia válida, iniciar aplicación normal
    return true;
  }
  
  if (status.status === 'expired' || status.status === 'trial_expired') {
    // Licencia expirada, mostrar ventana de activación
    dialog.showMessageBox({
      type: 'warning',
      title: 'Licencia Expirada',
      message: status.message,
      detail: 'Por favor activa tu licencia para continuar usando el sistema.',
      buttons: ['Activar']
    });
    return false;
  }
  
  // Sin licencia, mostrar ventana de activación
  return false;
}

// IPC Handlers para licencias
ipcMain.handle('check-license', async () => {
  return licenseManager.checkLicense();
});

ipcMain.handle('activate-license', async (event, code) => {
  const result = licenseManager.activateLicense(code);
  
  if (result.success) {
    // Cerrar ventana de licencia y abrir aplicación principal
    if (licenseWindow) {
      licenseWindow.close();
    }
    await initializeApp();
  }
  
  return result;
});

ipcMain.handle('start-trial', async () => {
  const result = licenseManager.startTrial();
  
  if (result.success) {
    // Cerrar ventana de licencia y abrir aplicación principal
    if (licenseWindow) {
      licenseWindow.close();
    }
    await initializeApp();
  }
  
  return result;
});

ipcMain.handle('get-machine-id', async () => {
  return licenseManager.getMachineIdForActivation();
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  if (licenseWindow) {
    licenseWindow.minimize();
  }
});

// ============================================
// FIN SISTEMA DE LICENCIAS
// ============================================

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
    console.log('✅ PostgreSQL debería estar listo (timeout 2s)');
    resolve();
  }, 2000); // Reducido a 2 segundos

  postgresProcess.on('error', (err) => {
    console.error('❌ Error al iniciar PostgreSQL:', err);
    // No rechazar, solo log - la app puede continuar
    console.log('Continuando sin PostgreSQL...');
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
      // En producción, el backend está en extraResources directamente
      backendPath = path.join(process.resourcesPath, 'backend');
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
    console.log('__dirname:', __dirname);
    
    // Listar contenido de directorios para debug
    if (!isDev) {
      console.log('\n=== DIRECTORY LISTING ===');
      const resourcesPath = process.resourcesPath;
      console.log('Resources path contents:', fs.readdirSync(resourcesPath));
      
      const unpackedPath = path.join(resourcesPath, 'app.asar.unpacked');
      if (fs.existsSync(unpackedPath)) {
        console.log('app.asar.unpacked contents:', fs.readdirSync(unpackedPath));
        if (fs.existsSync(path.join(unpackedPath, 'backend'))) {
          console.log('backend folder contents:', fs.readdirSync(path.join(unpackedPath, 'backend')));
        }
      }
    }

    if (!fs.existsSync(backendScript)) {
      const errorMsg = `❌ Backend script NO encontrado en: ${backendScript}`;
      console.error(errorMsg);
      
      // No mostrar error inmediatamente, dejar que continúe
      console.warn('⚠️ Continuando sin backend - se intentará cargar frontend directamente');
      reject(new Error(errorMsg));
      return;
    }
    
    console.log('✅ Backend script encontrado!');

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

    console.log('Iniciando backend...');

    // En Electron, usar fork para ejecutar scripts Node.js
    // Esto usa el Node.js embebido de Electron sin conflictos de instancia
    const { fork } = require('child_process');
    
    backendProcess = fork(backendScript, [], {
      cwd: backendPath,
      env,
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      silent: false
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

    // Timeout de seguridad - resolver después de 3 segundos si no hay respuesta
    setTimeout(() => {
      if (!backendReady) {
        console.log('⚠️ Backend timeout reached (3s), continuing anyway...');
        console.log('   El backend puede estar iniciando en segundo plano');
        resolve(); // Siempre resolver para que la app continúe
      }
    }, 3000); // Reducido a 3 segundos
  });
}

// Crear ventana principal
function createWindow() {
  // Si ya existe la ventana principal, no crear otra
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

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
  let startUrl = isDev
    ? `http://localhost:${FRONTEND_PORT}`
    : `http://localhost:${BACKEND_PORT}`;

  console.log('=== CARGANDO VENTANA PRINCIPAL ===');
  console.log('URL:', startUrl);
  console.log('isDev:', isDev);

  // Intentar cargar desde la URL del servidor
  mainWindow.loadURL(startUrl).catch(async err => {
    console.error('❌ Error al cargar URL desde servidor:', err);
    
    // FALLBACK: Intentar cargar frontend desde archivos locales
    if (!isDev) {
      console.log('⚠️ Intentando fallback: cargar frontend desde archivos locales...');
      
      // Buscar index.html del frontend
      const possiblePaths = [
        path.join(process.resourcesPath, 'app.asar.unpacked', 'frontend', 'dist', 'index.html'),
        path.join(process.resourcesPath, 'app', 'frontend', 'dist', 'index.html'),
        path.join(APP_PATH, 'frontend', 'dist', 'index.html'),
      ];
      
      let frontendIndexPath = null;
      for (const p of possiblePaths) {
        console.log('Verificando:', p, '→', fs.existsSync(p));
        if (fs.existsSync(p)) {
          frontendIndexPath = p;
          break;
        }
      }
      
      if (frontendIndexPath) {
        console.log('✅ Frontend encontrado en:', frontendIndexPath);
        try {
          await mainWindow.loadFile(frontendIndexPath);
          console.log('✅ Frontend cargado desde archivo local!');
          return;
        } catch (fileErr) {
          console.error('❌ Error al cargar desde archivo:', fileErr);
        }
      } else {
        console.error('❌ No se encontró index.html del frontend');
      }
    }
    
    // Si todo falla, mostrar error
    dialog.showErrorBox('Error de Carga', 
      `No se pudo cargar la aplicación desde ${startUrl}\n\n` +
      `Error: ${err.message}\n\n` +
      `Intente:\n` +
      `1. Reiniciar la aplicación\n` +
      `2. Reinstalar la aplicación\n` +
      `3. Verificar que el puerto ${BACKEND_PORT} esté disponible`
    );
  });

  // Timeout de seguridad: mostrar ventana después de 3 segundos SIEMPRE
  let windowShown = false;
  const showTimeout = setTimeout(() => {
    if (!windowShown) {
      console.log('⏰ Timeout de 3s alcanzado, mostrando ventana FORZADAMENTE...');
      mainWindow.show();
      mainWindow.maximize();
      windowShown = true;
      
      // Verificar si hay error de carga después de mostrar
      setTimeout(() => {
        mainWindow.webContents.executeJavaScript('document.body.innerHTML').then(html => {
          console.log('HTML length:', html ? html.length : 0);
          if (!html || html.trim().length < 100) {
            console.error('⚠️ La página parece estar vacía o no cargó');
            dialog.showMessageBox(mainWindow, {
              type: 'error',
              title: 'Error de Carga',
              message: 'La aplicación no se cargó correctamente',
              detail: `URL intentada: ${startUrl}\n\nVerifique que:\n- El backend esté funcionando\n- Puerto ${BACKEND_PORT} esté disponible\n- No haya firewalls bloqueando`,
              buttons: ['Reintentar', 'Cerrar']
            }).then(response => {
              if (response.response === 0) {
                mainWindow.reload();
              } else {
                app.quit();
              }
            });
          }
        }).catch(err => {
          console.error('Error al verificar contenido:', err);
        });
      }, 1000);
    }
  }, 3000); // Reducido a 3 segundos

  // Mostrar cuando esté listo
  mainWindow.once('ready-to-show', () => {
    if (!windowShown) {
      console.log('ready-to-show event - Mostrando ventana');
      mainWindow.show();
      mainWindow.maximize();
      windowShown = true;
    }
  });

  // Detectar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('did-fail-load:', errorCode, errorDescription);
    dialog.showErrorBox(
      'Error de Carga',
      `No se pudo cargar la aplicación.\n\nCódigo: ${errorCode}\nDescripción: ${errorDescription}\n\nURL: ${startUrl}`
    );
  });

  // Log cuando termine de cargar
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load - Página cargada correctamente');
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

// Función para inicializar la aplicación principal
async function initializeApp() {
  // Evitar inicializaciones múltiples
  if (isInitializing || appInitialized) {
    console.log('App ya está inicializando o inicializada, saltando...');
    return;
  }
  
  isInitializing = true;
  console.log('Iniciando Sistema EXMC...');
  console.log('Modo:', isDev ? 'DESARROLLO' : 'PRODUCCIÓN');
  
  try {
    // En desarrollo, backend y frontend se inician con concurrently
    // Solo iniciamos backend automáticamente en producción
    if (!isDev) {
      // 1. Iniciar PostgreSQL portable (SOLO EN PRODUCCIÓN)
      console.log('📊 Iniciando PostgreSQL portable...');
      try {
        await startPostgres();
        console.log('✅ PostgreSQL iniciado correctamente');
      } catch (err) {
        console.error('❌ Error al iniciar PostgreSQL:', err.message);
        console.warn('⚠️ Continuando sin PostgreSQL...');
      }
      
      // 2. Inicializar base de datos INLINE (crear exmc_db y ejecutar migraciones)
      console.log('🔧 Inicializando base de datos...');
      try {
        const psqlPath = path.join(process.resourcesPath, 'postgres', 'bin', 'psql.exe');
        const migrationFile = path.join(process.resourcesPath, 'backend', 'prisma', 'migrations', '20251011071546_init', 'migration.sql');
        
        console.log('📁 psql:', psqlPath, '→', fs.existsSync(psqlPath));
        console.log('📄 migration:', migrationFile, '→', fs.existsSync(migrationFile));
        
        if (fs.existsSync(psqlPath) && fs.existsSync(migrationFile)) {
          // Crear base de datos si no existe
          console.log('🗄️ Creando base de datos exmc_db...');
          const createDb = spawn(psqlPath, [
            '-h', 'localhost',
            '-p', '5433',
            '-U', 'postgres',
            '-d', 'postgres',
            '-c', 'CREATE DATABASE exmc_db'
          ], {
            env: { ...process.env, PGPASSWORD: 'postgres' },
            windowsHide: true
          });
          
          await new Promise((resolve) => {
            createDb.on('close', () => {
              console.log('✅ Base de datos creada (o ya existe)');
              resolve();
            });
            createDb.on('error', () => resolve());
            setTimeout(resolve, 3000); // timeout
          });
          
          // Ejecutar migraciones
          console.log('📊 Aplicando migraciones SQL...');
          const migrationSql = fs.readFileSync(migrationFile, 'utf8');
          const migrate = spawn(psqlPath, [
            '-h', 'localhost',
            '-p', '5433',
            '-U', 'postgres',
            '-d', 'exmc_db',
            '-f', migrationFile
          ], {
            env: { ...process.env, PGPASSWORD: 'postgres' },
            windowsHide: true
          });
          
          await new Promise((resolve) => {
            migrate.on('close', (code) => {
              if (code === 0) {
                console.log('✅ Migraciones aplicadas correctamente');
              } else {
                console.log('⚠️ Migraciones con errores (posiblemente ya aplicadas)');
              }
              resolve();
            });
            migrate.on('error', () => resolve());
            setTimeout(resolve, 5000); // timeout
          });
          
          // Ejecutar fix de schema (agregar campos faltantes)
          console.log('🔧 Aplicando correcciones de schema...');
          const fixSchemaFile = path.join(process.resourcesPath, 'backend', 'prisma', 'fix-schema.sql');
          
          if (fs.existsSync(fixSchemaFile)) {
            const fixSchema = spawn(psqlPath, [
              '-h', 'localhost',
              '-p', '5433',
              '-U', 'postgres',
              '-d', 'exmc_db',
              '-f', fixSchemaFile
            ], {
              env: { ...process.env, PGPASSWORD: 'postgres' },
              windowsHide: true
            });
            
            await new Promise((resolve) => {
              fixSchema.on('close', (code) => {
                if (code === 0) {
                  console.log('✅ Schema actualizado correctamente');
                } else {
                  console.log('⚠️ Schema con advertencias (posiblemente ya actualizado)');
                }
                resolve();
              });
              fixSchema.on('error', () => resolve());
              setTimeout(resolve, 3000);
            });
          }
          
          // Ejecutar seed completo (usuarios, productos, clientes, ventas de prueba)
          console.log('🌱 Cargando datos de prueba (tienda de ropa)...');
          const seedCompleteFile = path.join(process.resourcesPath, 'backend', 'prisma', 'seed-complete.sql');
          
          if (fs.existsSync(seedCompleteFile)) {
            const seedComplete = spawn(psqlPath, [
              '-h', 'localhost',
              '-p', '5433',
              '-U', 'postgres',
              '-d', 'exmc_db',
              '-f', seedCompleteFile
            ], {
              env: { ...process.env, PGPASSWORD: 'postgres' },
              windowsHide: true
            });
            
            await new Promise((resolve) => {
              seedComplete.on('close', (code) => {
                if (code === 0) {
                  console.log('✅ Datos de prueba cargados: 3 usuarios, 4 proveedores, 20 productos, 6 clientes, 5 ventas');
                  console.log('   👤 Usuarios: admin@exmc.com, vendedor@exmc.com, consulta@exmc.com (password: admin123)');
                } else {
                  console.log('⚠️ Algunos datos ya existen (normal en reinicios)');
                }
                resolve();
              });
              seedComplete.on('error', () => resolve());
              setTimeout(resolve, 5000);
            });
          } else {
            console.log('⚠️ Archivo seed-complete.sql no encontrado');
          }
        } else {
          console.warn('⚠️ psql o migration.sql no encontrado, saltando inicialización BD');
        }
        
        console.log('✅ Base de datos inicializada');
      } catch (err) {
        console.error('❌ Error al inicializar base de datos:', err.message);
        console.warn('⚠️ Continuando sin inicialización de BD...');
      }
      
      // 3. Iniciar servidor backend
      console.log('🚀 Intentando iniciar backend...');
      try {
        await startBackend();
        console.log('✅ Backend iniciado correctamente');
      } catch (err) {
        console.error('❌ Error al iniciar backend:', err.message);
        console.warn('⚠️ Continuando sin backend - se usará fallback a archivos locales');
      }
    } else {
      console.log('Modo desarrollo: Backend y Frontend gestionados por concurrently');
      console.log('Usando PostgreSQL instalado en el sistema (puerto 5432)');
    }

    // 4. Crear ventana principal
    console.log('Creando ventana principal...');
    createWindow();
    console.log('Ventana principal creada');

    // 5. Crear icono de bandeja
    console.log('Creando icono de bandeja...');
    createTray();
    console.log('Icono de bandeja creado');

    appInitialized = true;
    console.log('✅ Sistema EXMC inicializado correctamente');
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    
    // Mostrar error pero intentar abrir ventana de todas formas
    dialog.showMessageBox({
      type: 'error',
      title: 'Error de Inicio',
      message: 'Hubo un error al iniciar algunos componentes',
      detail: `Error: ${error.message}\n\nLa aplicación intentará abrirse de todas formas.`,
      buttons: ['Continuar', 'Salir']
    }).then(response => {
      if (response.response === 1) {
        app.quit();
      } else {
        // Intentar crear ventana de todas formas
        if (!mainWindow) {
          console.log('Intentando crear ventana después del error...');
          createWindow();
        }
      }
    });
  } finally {
    isInitializing = false;
  }
}

// Inicialización de la aplicación con verificación de licencia
app.on('ready', async () => {
  // Solo ejecutar si tenemos el lock (no es segunda instancia)
  if (!gotTheLock) {
    console.log('No tenemos el lock, saliendo...');
    return;
  }
  
  // Evitar ejecución múltiple del evento ready
  if (isInitializing || appInitialized) {
    console.log('Ya se está inicializando o ya está inicializado');
    return;
  }
  
  console.log('=== Sistema EXMC ===');
  console.log('Verificando licencia...');
  
  // En modo desarrollo, saltar verificación de licencia
  if (isDev) {
    console.log('Modo desarrollo: Saltando verificación de licencia');
    await initializeApp();
    return;
  }
  
  // Verificar estado de la licencia
  const hasValidLicense = await checkLicenseStatus();
  
  if (hasValidLicense) {
    // Licencia válida, iniciar aplicación
    const status = licenseManager.checkLicense();
    console.log(`Licencia válida: ${status.message}`);
    
    if (status.daysRemaining && status.daysRemaining <= 7) {
      // Advertencia si quedan pocos días
      dialog.showMessageBox({
        type: 'warning',
        title: 'Aviso de Licencia',
        message: `Tu ${status.status === 'trial' ? 'período de prueba' : 'licencia'} expira en ${status.daysRemaining} días`,
        detail: 'Contacta al desarrollador para renovar tu licencia.',
        buttons: ['Entendido']
      });
    }
    
    await initializeApp();
  } else {
    // Sin licencia o expirada, mostrar ventana de activación
    console.log('Licencia no válida o expirada. Mostrando ventana de activación...');
    createLicenseWindow();
  }
});

// Evento cuando todas las ventanas se cierran
app.on('window-all-closed', () => {
  console.log('Todas las ventanas cerradas');
  // Cerrar la aplicación en todas las plataformas (excepto macOS si no estamos cerrando explícitamente)
  if (process.platform !== 'darwin' || app.isQuitting) {
    console.log('Cerrando aplicación...');
    app.quit();
  }
});

app.on('activate', async () => {
  // En macOS, recrear ventana cuando se hace clic en el icono del dock
  // Solo si no hay ventanas abiertas y ya se inicializó la app
  console.log('Evento activate disparado');
  
  if (BrowserWindow.getAllWindows().length === 0 && !isInitializing) {
    console.log('No hay ventanas, verificando si recrear...');
    
    if (appInitialized && mainWindow === null) {
      // Si la app ya se inicializó pero la ventana se cerró, solo recrear ventana
      console.log('Recreando ventana principal...');
      createWindow();
    } else if (!appInitialized) {
      // Si la app nunca se inicializó, verificar licencia
      console.log('App no inicializada, verificando licencia...');
      const hasValidLicense = await checkLicenseStatus();
      if (hasValidLicense) {
        await initializeApp();
      } else {
        createLicenseWindow();
      }
    }
  }
});

// Cerrar la aplicación correctamente
app.on('before-quit', async (event) => {
  console.log('before-quit event');
  app.isQuitting = true;
  
  try {
    // Cerrar backend
    if (backendProcess) {
      console.log('Cerrando servidor backend...');
      backendProcess.kill();
    }

    // Cerrar PostgreSQL si está corriendo
    if (postgresProcess) {
      console.log('Cerrando PostgreSQL...');
      const pgBin = path.join(POSTGRES_PATH, 'bin', 'pg_ctl.exe');
      const pgData = path.join(DATA_PATH, 'pgdata');
      
      if (fs.existsSync(pgBin)) {
        spawn(pgBin, ['stop', '-D', pgData, '-m', 'fast'], {
          windowsHide: true
        });
      }
    }
  } catch (error) {
    console.error('Error al cerrar procesos:', error);
  }
});

app.on('will-quit', () => {
  console.log('will-quit event');
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
