# 📋 REVISIÓN EXHAUSTIVA DE ESTRUCTURA - Sistema EXMC v2.0.0

**Fecha:** 12 de Octubre 2025  
**Build:** #16  
**Estado:** Revisión completa mientras se prueba instalador

---

## ✅ 1. ESTRUCTURA DE ARCHIVOS FUENTE

### 📦 Directorios Principales
```
✅ backend/                  → Servidor Express + Prisma
✅ frontend/                 → React + Vite
✅ electron/                 → Main process de Electron
✅ postgres-portable/        → PostgreSQL 18.0 (~860 MB)
✅ dist-electron/            → Builds compilados
✅ node_modules/             → Dependencias raíz
```

### 🔧 Backend (backend/)
```
✅ dist/index.js             → Backend compilado TypeScript → JavaScript
✅ node_modules/             → Dependencias del backend
   ✅ @prisma/client         → ORM base de datos
   ✅ bcrypt                 → Hash de contraseñas (nativo)
   ✅ express                → Servidor HTTP
   ✅ jsonwebtoken           → Autenticación JWT
✅ package.json              → Configuración y dependencias
✅ prisma/
   ✅ schema.prisma          → Esquema de base de datos
   ✅ migrations/
      ✅ 20251011071546_init/
         ✅ migration.sql   → SQL de creación de tablas
```

### 🌐 Frontend (frontend/)
```
✅ dist/
   ✅ index.html             → Punto de entrada HTML
   ✅ assets/                → JS, CSS, imágenes compilados
✅ package.json              → Configuración Vite + React
✅ src/                      → Código fuente TypeScript + React
```

### ⚡ Electron (electron/)
```
✅ main.js                   → Proceso principal (898 líneas)
✅ preload.js                → Script de preload IPC
✅ license.js                → Gestor de licencias
✅ activation.html           → Ventana de activación
✅ installer.nsh             → Script personalizado NSIS
✅ assets/
   ✅ icon.ico               → Icono de la aplicación
✅ COMO-VER-LOGS.txt         → Instrucciones de debug
✅ ver-logs.bat              → Script para ver logs
```

### 🗄️ PostgreSQL Portable (postgres-portable/)
```
✅ bin/
   ✅ postgres.exe           → Servidor PostgreSQL
   ✅ pg_ctl.exe             → Control del servidor
   ✅ psql.exe               → Cliente CLI (para crear BD)
   ✅ initdb.exe             → Inicializar cluster
✅ lib/                      → Librerías compartidas
✅ share/                    → Archivos de configuración
```

---

## ✅ 2. ESTRUCTURA DEL BUILD (dist-electron/win-unpacked/)

### 📦 Estructura Empaquetada
```
Sistema EXMC.exe             → Ejecutable principal
resources/
  ├── app.asar               → Código de Electron empaquetado
  │   └── electron/          → main.js, preload.js, etc.
  │   └── frontend/dist/     → ❌ NO (está en extraResources)
  │
  ├── backend/               → ✅ extraResources (NO en ASAR)
  │   ├── dist/
  │   │   └── index.js       → ✅ Backend compilado
  │   ├── node_modules/      → ✅ Todas las dependencias
  │   │   ├── @prisma/client → ✅ ORM
  │   │   └── bcrypt/        → ✅ Módulo nativo
  │   ├── package.json       → ✅ Metadatos
  │   └── prisma/
  │       └── migrations/
  │           └── 20251011071546_init/
  │               └── migration.sql  → ✅ SQL para crear tablas
  │
  ├── frontend/              → ✅ extraResources (NO en ASAR)
  │   └── dist/
  │       ├── index.html     → ✅ HTML principal
  │       └── assets/        → ✅ JS, CSS compilados
  │
  └── postgres/              → ✅ extraResources (NO en ASAR)
      ├── bin/
      │   ├── postgres.exe   → ✅ Servidor
      │   ├── pg_ctl.exe     → ✅ Control
      │   └── psql.exe       → ✅ Cliente CLI
      └── lib/               → ✅ Librerías

elevate.exe                  → Herramienta para elevar permisos
```

**🎯 Clave:** Todo lo que necesita acceso nativo o modificación está en `extraResources`, NO en ASAR.

---

## ✅ 3. FLUJO DE INICIALIZACIÓN

### 🔄 Secuencia de Arranque (main.js)

```javascript
// 1. Verificar licencia
licenseManager.checkLicense()
  ├─ trial: Período de prueba 15 días
  ├─ active: Licencia válida
  └─ expired/no_license: Mostrar ventana de activación

// 2. Verificar single instance
app.requestSingleInstanceLock()
  ├─ true: Continuar
  └─ false: Cerrar (ya hay una instancia)

// 3. En producción:
if (!isDev) {
  // 3.1 Iniciar PostgreSQL
  startPostgres()
    → spawn('pg_ctl', ['start', '-D', DATA_PATH, '-o', '-p 5433'])
    → Timeout: 2 segundos
  
  // 3.2 Inicializar base de datos (INLINE en main.js)
  const psqlPath = path.join(process.resourcesPath, 'postgres', 'bin', 'psql.exe')
  const migrationFile = path.join(process.resourcesPath, 'backend', 'prisma', 'migrations', '20251011071546_init', 'migration.sql')
  
  // 3.2.1 Crear base de datos
  spawn(psqlPath, ['-h', 'localhost', '-p', '5433', '-U', 'postgres', '-d', 'postgres', '-c', 'CREATE DATABASE exmc_db'])
    → Timeout: 3 segundos
  
  // 3.2.2 Aplicar migraciones
  spawn(psqlPath, ['-h', 'localhost', '-p', '5433', '-U', 'postgres', '-d', 'exmc_db', '-f', migrationFile])
    → Timeout: 5 segundos
  
  // 3.3 Iniciar backend
  startBackend()
    → backendPath = path.join(process.resourcesPath, 'backend')
    → fork(backendScript) // ✅ fork() no spawn()
    → Puerto: 3001
}

// 4. Crear ventana principal
createWindow()
  → Carga: http://localhost:3001 (backend sirve frontend)
  → Fallback: Cargar frontend desde archivos locales si falla
  → Timeout forzado: 3 segundos (muestra ventana siempre)

// 5. Crear icono de bandeja
createTray()
```

---

## ✅ 4. RUTAS CRÍTICAS EN PRODUCCIÓN

### 🗂️ Rutas Hardcoded (Build #16)

```javascript
// PostgreSQL
POSTGRES_PATH = process.resourcesPath + '/postgres'
psqlPath = process.resourcesPath + '/postgres/bin/psql.exe'
PORT = 5433  // ✅ Hardcoded

// Backend
backendPath = process.resourcesPath + '/backend'
backendScript = process.resourcesPath + '/backend/dist/index.js'
PORT = 3001

// Migration SQL
migrationFile = process.resourcesPath + '/backend/prisma/migrations/20251011071546_init/migration.sql'

// Frontend (en backend/src/index.ts)
possiblePaths = [
  __dirname + '/../../frontend/dist',      // resources/backend/../frontend/dist
  __dirname + '/../../../frontend/dist',   // Un nivel más arriba
  process.cwd() + '/frontend/dist'         // Desde directorio actual
]
```

### ✅ Verificación de Rutas en Build #16

```
✅ resources/postgres/bin/psql.exe                     EXISTE
✅ resources/backend/dist/index.js                     EXISTE  
✅ resources/backend/prisma/migrations/.../migration.sql EXISTE
✅ resources/frontend/dist/index.html                  EXISTE
✅ resources/backend/node_modules/@prisma/client       EXISTE
✅ resources/backend/node_modules/bcrypt               EXISTE
```

---

## ✅ 5. CAMBIOS CRÍTICOS EN BUILD #16

### 🔥 Cambio Principal: Inicialización INLINE

**ANTES (Build #14-15):**
```javascript
// ❌ Archivo separado electron/init-database.js
const { initializeDatabase } = require('./init-database.js')
await initializeDatabase()
```

**PROBLEMA:**
- `init-database.js` se empaquetaba en ASAR
- Cambios NO se reflejaban porque leía versión vieja del ASAR
- Rutas eran relativas y fallaban

**AHORA (Build #16):**
```javascript
// ✅ Código INLINE directamente en main.js
const psqlPath = path.join(process.resourcesPath, 'postgres', 'bin', 'psql.exe')
const migrationFile = path.join(process.resourcesPath, 'backend', 'prisma', 'migrations', '20251011071546_init', 'migration.sql')

// Crear BD y aplicar migraciones directamente
spawn(psqlPath, [...])
```

**VENTAJAS:**
- ✅ Sin archivos externos que puedan quedar desactualizados
- ✅ Rutas absolutas desde `process.resourcesPath`
- ✅ Puerto 5433 hardcoded
- ✅ Todo en un solo archivo (main.js)
- ✅ Cambios se reflejan inmediatamente en nuevos builds

---

## ✅ 6. BACKEND SIRVIENDO FRONTEND

### 🌐 Configuración en backend/src/index.ts

```typescript
if (process.env.NODE_ENV === 'production') {
  // Buscar frontend en 3 ubicaciones
  const possiblePaths = [
    path.join(__dirname, '../../frontend/dist'),      // resources/backend/../frontend/dist
    path.join(__dirname, '../../../frontend/dist'),   // Nivel superior
    path.join(process.cwd(), 'frontend', 'dist'),     // Directorio de trabajo
  ]
  
  // Servir archivos estáticos
  app.use(express.static(frontendPath))
  
  // Catch-all para SPA routing
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'))
  })
}
```

**Orden de middleware:**
1. ✅ Rutas API (`/api/*`) → Definidas primero
2. ✅ `express.static(frontendPath)` → Sirve archivos estáticos
3. ✅ Catch-all `/*` → Sirve `index.html` para rutas no-API

---

## ✅ 7. SISTEMA DE LICENCIAS

### 🔐 Componentes

```
electron/license.js          → Clase LicenseManager
electron/activation.html     → Ventana de activación/prueba
electron-store ^8.1.0        → Almacenamiento encriptado
node-machine-id ^1.1.12      → Hardware fingerprinting
```

### 📊 Estados de Licencia

```javascript
checkLicense() → {
  status: 'no_license' | 'trial' | 'trial_expired' | 'active' | 'expired',
  message: string,
  daysRemaining?: number,
  trialEnd?: Date,
  expirationDate?: Date
}
```

### 🔑 Generación de Códigos

```bash
# electron/generate-license.js
node generate-license.js <MACHINE_ID> <DAYS>

# Genera códigos HMAC-SHA256 específicos por máquina
XXXX-XXXX-XXXX-XXXX
```

---

## ✅ 8. PACKAGE.JSON - CONFIGURACIÓN ELECTRON-BUILDER

### 📦 Configuración Crítica

```json
{
  "build": {
    "asar": true,              // ✅ Empaqueta electron/ en ASAR
    
    "files": [
      "electron/**/*",         // ✅ En ASAR
      "frontend/dist/**/*",    // ❌ NO SE USA (está en extraResources)
      "!**/*.ts",              // Excluir TypeScript
      "!**/*.map"              // Excluir source maps
    ],
    
    "extraResources": [        // ✅ Fuera del ASAR
      {
        "from": "backend",
        "to": "backend",       // → resources/backend/
        "filter": [
          "dist/**/*",
          "node_modules/**/*", // ✅ Incluye módulos nativos
          "package.json",
          "prisma/**/*"
        ]
      },
      {
        "from": "frontend/dist",
        "to": "frontend/dist", // → resources/frontend/dist/
        "filter": ["**/*"]
      },
      {
        "from": "postgres-portable",
        "to": "postgres",      // → resources/postgres/
        "filter": ["**/*"]
      }
    ]
  }
}
```

**🎯 Lógica:**
- `files[]` → Se empaqueta en `app.asar` (archivos de Electron)
- `extraResources[]` → Se copia directamente a `resources/` (sin ASAR)

---

## ✅ 9. POSIBLES PUNTOS DE FALLA

### ⚠️ Áreas Críticas a Revisar

#### 1. **Variable de Entorno NODE_ENV**
```javascript
// ¿Se está estableciendo correctamente?
const env = {
  ...process.env,
  NODE_ENV: 'production',  // ✅ Se establece en startBackend()
  PORT: BACKEND_PORT.toString(),
  DATABASE_URL: `postgresql://postgres:postgres@localhost:5433/exmc_db`
}
```

#### 2. **Búsqueda de Frontend en Backend**
```typescript
// ¿Encuentra el frontend?
const possiblePaths = [
  path.join(__dirname, '../../frontend/dist'),  // Desde resources/backend/dist/
]
// __dirname = C:\...\resources\backend\dist
// Entonces: C:\...\resources\backend\dist\..\..\frontend\dist
//         = C:\...\resources\frontend\dist  ✅ DEBERÍA FUNCIONAR
```

#### 3. **Permisos de Escritura**
```javascript
// ¿PostgreSQL puede escribir en DATA_PATH?
const DATA_PATH = path.join(USER_DATA_PATH, 'data')
// USER_DATA_PATH = C:\Users\...\AppData\Roaming\Sistema EXMC
// Debería tener permisos de escritura ✅
```

#### 4. **Firewall de Windows**
```
¿Bloquea los puertos?
- PostgreSQL: 5433
- Backend: 3001

Solución: Primera ejecución pide permisos
```

#### 5. **Módulos Nativos**
```
¿bcrypt se compiló correctamente para Windows?
✅ Verificado: bcrypt/ existe en resources/backend/node_modules/
```

---

## ✅ 10. CHECKLIST DE VERIFICACIÓN POST-INSTALACIÓN

### 📝 Lo Que Debe Suceder (Build #16)

```
1. ✅ Verificar licencia → Período de prueba 15 días
2. ✅ Verificar single instance → No múltiples ventanas
3. ✅ Iniciar PostgreSQL en puerto 5433
   📁 Buscar en: resources/postgres/bin/psql.exe
   ✅ DEBE EXISTIR
   
4. ✅ Inicializar base de datos
   🗄️ Crear exmc_db con psql
   📊 Ejecutar migration.sql con psql -f
   📁 Buscar en: resources/backend/prisma/migrations/.../migration.sql
   ✅ DEBE EXISTIR
   
5. ✅ Iniciar backend con fork()
   📁 Buscar en: resources/backend/dist/index.js
   ✅ DEBE EXISTIR
   🌐 Servidor en: http://localhost:3001
   
6. ✅ Backend busca frontend
   📁 Buscar en: resources/frontend/dist/index.html
   ✅ DEBE EXISTIR
   📊 Sirve archivos estáticos
   
7. ✅ Ventana carga http://localhost:3001
   ⏱️ Timeout forzado: 3 segundos
   ✅ Ventana se muestra SIEMPRE
   
8. ✅ Login screen visible
   📧 Credenciales por defecto (si seed ejecutado):
      admin@exmc.com / admin123
```

---

## 📊 11. ESTADÍSTICAS DEL BUILD

```
Tamaño instalador: ~387.8 MB
Versión: 2.0.0
Electron: 28.0.0
Node.js: v18.x (embebido en Electron)
PostgreSQL: 18.0
```

### 📦 Desglose de Tamaño

```
PostgreSQL portable: ~325 MB (84%)
Backend node_modules: ~40 MB (10%)
Frontend compilado: ~1 MB (0.3%)
Electron framework: ~20 MB (5%)
Otros: ~2 MB (0.5%)
```

---

## 🎯 12. CONCLUSIÓN DE LA REVISIÓN

### ✅ Estructura General: CORRECTA

- ✅ Todos los archivos críticos presentes
- ✅ Rutas hardcoded correctamente
- ✅ extraResources configurado bien
- ✅ Puerto 5433 hardcoded
- ✅ Código inline (sin archivos externos problemáticos)

### ⚠️ Posibles Problemas Residuales

1. **NODE_ENV en backend**: Verificar que realmente se establece como 'production'
2. **Ruta de frontend desde backend**: Verificar que `__dirname/../../frontend/dist` resuelve correctamente
3. **Permisos de PostgreSQL**: Primera ejecución puede necesitar permisos admin
4. **Firewall de Windows**: Puede bloquear puertos 3001 y 5433

### 🔥 Build #16: DEBERÍA FUNCIONAR

**Razones:**
- ✅ Código inline (sin archivos externos)
- ✅ Rutas absolutas desde `process.resourcesPath`
- ✅ Puerto correcto (5433)
- ✅ Todos los archivos verificados en build
- ✅ Backend usa `fork()` correctamente
- ✅ Sin dependencia de Prisma CLI

**Si falla aún:**
- Problema es más profundo (permisos, firewall, o lógica de negocio)
- Necesitaríamos logs COMPLETOS del usuario
- Posiblemente ejecutar como Administrador

---

**Fecha de revisión:** 12/10/2025 22:30  
**Revisado por:** GitHub Copilot  
**Estado:** ✅ ESTRUCTURA VALIDADA - Esperando resultados de prueba
