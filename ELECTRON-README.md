# 📦 Sistema EXMC - Versión Electron (Aplicación de Escritorio)

## 🎯 Resumen

Este proyecto convierte el Sistema EXMC en una **aplicación de escritorio nativa para Windows** usando Electron + PostgreSQL portable.

**El resultado es un instalador `.exe` profesional que incluye:**
- ✅ Aplicación de escritorio completa
- ✅ PostgreSQL portable (sin necesidad de instalación externa)
- ✅ Servidor backend integrado
- ✅ Instalación con un solo clic
- ✅ Ícono de bandeja del sistema
- ✅ Auto-inicio del backend y base de datos

---

## 📋 Requisitos Previos

### Para Desarrollo:
```bash
Node.js 18+ (https://nodejs.org/)
PostgreSQL 14+ (para desarrollo local)
npm o pnpm
```

### Para Build (Compilar el .exe):
```bash
Windows 10/11
Node.js 18+
400 MB de espacio libre (para PostgreSQL portable)
```

---

## 🚀 Instalación para Desarrollo

### 1. Instalar dependencias del proyecto root:
```bash
cd c:\xampp\htdocs\sitema-EXMC
npm install
```

Esto instalará:
- Electron
- electron-builder (para compilar)
- concurrently (ejecutar múltiples procesos)
- wait-on (esperar a que servicios estén listos)

### 2. Las dependencias de backend y frontend se instalan automáticamente
El script `postinstall` las instala automáticamente.

---

## 💻 Desarrollo con Electron

### Modo desarrollo (hot-reload):
```bash
npm run electron:dev
```

Este comando hace:
1. ✅ Inicia el backend en `http://localhost:3001`
2. ✅ Inicia el frontend en `http://localhost:5173`
3. ✅ Espera a que ambos estén listos
4. ✅ Abre la aplicación Electron

**Ventajas:**
- Hot-reload automático del frontend (Vite)
- Reinicio automático del backend (nodemon)
- DevTools abierto por defecto

---

## 📦 Compilar Instalador .exe

### 1. Descargar PostgreSQL Portable

**Opción A: Descarga manual**
1. Ve a: https://www.enterprisedb.com/download-postgresql-binaries
2. Descarga: **PostgreSQL 14.x Windows x86-64 binaries**
3. Extrae el contenido en: `c:\xampp\htdocs\sitema-EXMC\postgres-portable\`

**Estructura esperada:**
```
sitema-EXMC/
└── postgres-portable/
    ├── bin/
    │   ├── postgres.exe
    │   ├── pg_ctl.exe
    │   ├── initdb.exe
    │   └── ...
    ├── lib/
    └── share/
```

**Opción B: Script automático** (próximamente)
```bash
npm run download:postgres
```

### 2. Build del backend y frontend
```bash
npm run build:all
```

Este comando:
- ✅ Compila TypeScript del backend → `backend/dist/`
- ✅ Compila React del frontend → `frontend/dist/`
- ✅ Optimiza assets y recursos

### 3. Compilar el instalador
```bash
npm run electron:build:win
```

Este comando:
- ✅ Empaqueta toda la aplicación
- ✅ Incluye PostgreSQL portable
- ✅ Incluye Node.js runtime
- ✅ Genera instalador NSIS
- ✅ Crea `dist-electron/Sistema EXMC-Setup-1.0.0.exe`

**Tiempo estimado:** 5-10 minutos
**Tamaño del instalador:** ~300 MB (incluye PostgreSQL)

---

## 📁 Estructura del Proyecto

```
sitema-EXMC/
├── electron/                    # Código de Electron
│   ├── main.js                 # Proceso principal (ventana, backend, DB)
│   ├── preload.js              # Bridge seguro para IPC
│   ├── config.js               # Configuración de la app
│   └── assets/                 # Íconos y recursos
│       ├── icon.png            # Ícono de la ventana (256x256)
│       ├── icon.ico            # Ícono del instalador
│       └── tray-icon.png       # Ícono de bandeja (16x16)
│
├── postgres-portable/           # PostgreSQL portable (no incluir en git)
│   ├── bin/
│   ├── lib/
│   └── share/
│
├── backend/                     # API Express + Prisma
├── frontend/                    # React + Vite
├── package.json                # Configuración de Electron + scripts
└── dist-electron/              # Salida del build (instalador .exe)
```

---

## 🎨 Personalización

### Cambiar íconos:

1. **Ícono de la ventana** (`icon.png`):
   - Tamaño: 256x256 px
   - Formato: PNG con transparencia
   - Ubicación: `electron/assets/icon.png`

2. **Ícono del instalador** (`icon.ico`):
   - Tamaño: 256x256 px (multi-resolución)
   - Formato: ICO
   - Ubicación: `electron/assets/icon.ico`
   - **Convertir PNG a ICO:** https://convertio.co/es/png-ico/

3. **Ícono de bandeja** (`tray-icon.png`):
   - Tamaño: 16x16 px (Windows estándar)
   - Formato: PNG
   - Ubicación: `electron/assets/tray-icon.png`

### Personalizar ventana de inicio:

Edita `electron/main.js`:
```javascript
const mainWindow = new BrowserWindow({
  width: 1400,        // Ancho inicial
  height: 900,        // Alto inicial
  minWidth: 1200,     // Ancho mínimo
  minHeight: 700,     // Alto mínimo
  backgroundColor: '#0f172a', // Color de fondo
  // ...
});
```

---

## 🔧 Configuración Avanzada

### Cambiar puertos:

Edita `electron/config.js`:
```javascript
ports: {
  backend: 3001,    // Puerto del backend
  frontend: 5173,   // Puerto del frontend (desarrollo)
  postgres: 5433,   // Puerto de PostgreSQL portable
}
```

### Habilitar/deshabilitar características:

```javascript
features: {
  autoUpdater: true,        // Actualizaciones automáticas
  trayIcon: true,           // Ícono en bandeja del sistema
  devTools: false,          // Herramientas de desarrollo
  minimizeToTray: true,     // Minimizar a bandeja en lugar de cerrar
}
```

---

## 🐛 Troubleshooting (Solución de Problemas)

### Problema: "PostgreSQL no encontrado"
**Solución:**
```bash
# Verificar que existe la carpeta
dir postgres-portable\bin\postgres.exe

# Si no existe, descargar de nuevo:
# https://www.enterprisedb.com/download-postgresql-binaries
```

### Problema: "Error al iniciar backend"
**Solución:**
```bash
# Compilar backend manualmente
cd backend
npm run build
cd ..

# Verificar que existe backend/dist/index.js
dir backend\dist\index.js
```

### Problema: "Port already in use" (Puerto en uso)
**Solución:**
```bash
# Cerrar procesos en puertos 3001 o 5433
netstat -ano | findstr :3001
netstat -ano | findstr :5433

# Matar proceso por PID
taskkill /PID <PID> /F
```

### Problema: El instalador es muy grande (>500 MB)
**Solución:**
- ✅ PostgreSQL portable pesa ~200 MB (normal)
- ✅ Node.js runtime ~100 MB (necesario)
- ✅ Tu aplicación ~50-100 MB
- ⚠️ Total esperado: ~300-400 MB

Para reducir tamaño:
```bash
# En package.json, cambiar target a portable (no instalador):
"win": {
  "target": "portable"  // ~100 MB menos
}
```

---

## 📤 Distribución

### Instalador generado:
```
dist-electron/
└── Sistema EXMC-Setup-1.0.0.exe  (~300 MB)
```

### Opciones de distribución:

**1. Subir a Google Drive / Dropbox**
```bash
# Crear link de descarga pública
# Usuarios descargan y ejecutan el instalador
```

**2. Hosting propio**
```bash
# Subir a tu servidor
# URL: https://tudominio.com/descargas/exmc-setup.exe
```

**3. GitHub Releases**
```bash
git tag v1.0.0
git push origin v1.0.0

# Subir manualmente el .exe a:
# https://github.com/lushosenpai/EXMC-Sistema/releases/new
```

**4. Microsoft Store** (requiere cuenta de desarrollador)
```bash
# Convertir a MSIX con electron-builder
npm run electron:build:win -- --publish never
```

---

## 🚀 Instalación para el Usuario Final

### Proceso de instalación:

1. **Usuario descarga:** `Sistema EXMC-Setup-1.0.0.exe`
2. **Ejecuta el instalador**
3. **Wizard de instalación:**
   - ✅ Elegir carpeta de instalación
   - ✅ Crear acceso directo en escritorio
   - ✅ Crear acceso directo en menú inicio
   - ✅ Instalación automática de PostgreSQL portable
4. **Instalación completa** (2-3 minutos)
5. **Doble clic en el ícono** → ¡Listo!

### Primera ejecución:

1. ✅ Inicializa base de datos PostgreSQL
2. ✅ Ejecuta migraciones de Prisma
3. ✅ Inicia servidor backend
4. ✅ Abre ventana principal
5. ✅ Usuario ve login del Sistema EXMC

**Credenciales por defecto:**
- Email: `admin@exmc.com`
- Password: `admin123`

---

## 🔄 Actualizaciones Futuras

### Configurar auto-update:

1. Crear repositorio de releases (GitHub, S3, etc.)
2. Configurar en `package.json`:
```json
"publish": {
  "provider": "github",
  "owner": "lushosenpai",
  "repo": "EXMC-Sistema"
}
```

3. Build con publicación:
```bash
npm run electron:build:win -- --publish always
```

4. La app verificará actualizaciones al iniciar

---

## 📊 Comparación: Web vs Escritorio

| Característica | Web (Actual) | Electron (Desktop) |
|----------------|--------------|-------------------|
| Instalación | ❌ Compleja (XAMPP, PostgreSQL) | ✅ Un solo .exe |
| Dependencias | ❌ Requiere servidor web | ✅ Todo incluido |
| Experiencia | 🌐 Navegador | 🖥️ Aplicación nativa |
| Actualizaciones | 🔄 Manual | 🔄 Automáticas |
| Offline | ❌ No | ✅ Sí (datos locales) |
| Distribución | 📦 Múltiples archivos | 📦 Un instalador |
| Tamaño descarga | ~50 MB (código) | ~300 MB (todo incluido) |
| Usuarios objetivo | 👨‍💻 Técnicos | 👥 Cualquiera |

---

## 📞 Soporte

**Desarrollador:** Luciano Savoretti  
**Instagram:** [@devpuchito](https://www.instagram.com/devpuchito/)  
**GitHub:** [lushosenpai/EXMC-Sistema](https://github.com/lushosenpai/EXMC-Sistema)

---

## 📝 Notas Importantes

### ⚠️ IMPORTANTE: .gitignore

**NO subir a Git:**
```
postgres-portable/          # ~200 MB
dist-electron/              # Archivos compilados
node_modules/               # Dependencias
```

**Agregar a `.gitignore`:**
```gitignore
# Electron
dist-electron/
postgres-portable/

# Build outputs
backend/dist/
frontend/dist/
```

### 🔒 Seguridad

- ✅ JWT_SECRET debe ser único por instalación
- ✅ PostgreSQL sin contraseña (solo local)
- ✅ Backend solo accesible desde localhost
- ✅ No exponer puertos externamente

### 💾 Datos del Usuario

**Ubicación de datos:**
```
C:\Users\<Usuario>\AppData\Roaming\exmc-sistema\
├── data\
│   └── pgdata\              # Base de datos PostgreSQL
├── logs\                    # Logs de la aplicación
└── config.json              # Configuración de usuario
```

**Backup automático:** (próximamente)
```bash
# Se puede implementar backup automático diario
# Ubicación: C:\Users\<Usuario>\Documents\EXMC Backups\
```

---

## ✅ Checklist Pre-Release

Antes de distribuir el instalador:

- [ ] Compilar backend (`npm run build:backend`)
- [ ] Compilar frontend (`npm run build:frontend`)
- [ ] Descargar PostgreSQL portable
- [ ] Crear íconos (PNG, ICO)
- [ ] Probar en máquina limpia (sin dependencias)
- [ ] Verificar que se crea base de datos automáticamente
- [ ] Verificar login funciona
- [ ] Verificar todas las funcionalidades
- [ ] Probar desinstalación completa
- [ ] Actualizar número de versión en `package.json`
- [ ] Crear changelog (CHANGELOG.md)

---

## 🎉 ¡Listo!

Ahora tienes un sistema profesional de gestión comercial empaquetado como aplicación de escritorio.

**Siguiente paso:** [Generar el instalador](#-compilar-instalador-exe)
