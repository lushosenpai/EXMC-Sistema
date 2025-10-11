@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║           🚀 SISTEMA EXMC - INSTALACIÓN AUTOMÁTICA           ║
echo ║                 Gestión Comercial Profesional                 ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo 📥 Por favor instala Node.js desde: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version
echo.

:: Verificar si PostgreSQL está instalado
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  ADVERTENCIA: PostgreSQL no detectado en PATH
    echo.
    echo 📝 Asegúrate de tener PostgreSQL instalado y la base de datos creada
    echo.
)

echo ══════════════════════════════════════════════════════════════
echo 📦 PASO 1/4: Instalando dependencias del BACKEND...
echo ══════════════════════════════════════════════════════════════
echo.

cd backend
if not exist "package.json" (
    echo ❌ ERROR: No se encontró package.json en backend
    pause
    exit /b 1
)

echo 🔧 Instalando paquetes de Node.js (esto puede tardar 2-3 minutos)...
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la instalación de dependencias del backend
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias del backend instaladas correctamente
echo.

echo ══════════════════════════════════════════════════════════════
echo 🗄️  PASO 2/4: Configurando BASE DE DATOS...
echo ══════════════════════════════════════════════════════════════
echo.

if not exist ".env" (
    echo 📝 Creando archivo .env desde plantilla...
    copy .env.example .env >nul
    echo ✅ Archivo .env creado
    echo.
    echo ⚠️  IMPORTANTE: Edita backend\.env con tus credenciales de PostgreSQL
    echo    DATABASE_URL="postgresql://usuario:password@localhost:5432/exmc_db"
    echo.
    pause
) else (
    echo ℹ️  Archivo .env ya existe, continuando...
    echo.
)

echo 🔄 Generando cliente de Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la generación del cliente de Prisma
    pause
    exit /b 1
)

echo.
echo 🗄️  Ejecutando migraciones de base de datos...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la migración de la base de datos
    echo.
    echo 💡 Posibles causas:
    echo    - La base de datos no existe (créala: CREATE DATABASE exmc_db;)
    echo    - Credenciales incorrectas en .env
    echo    - PostgreSQL no está corriendo
    echo.
    pause
    exit /b 1
)

echo.
echo 🌱 Cargando datos de ejemplo...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo ⚠️  Advertencia: Falló la carga de datos de ejemplo
    echo    El sistema funcionará pero sin datos iniciales
    echo.
)

echo.
echo ✅ Base de datos configurada correctamente
echo.

echo ══════════════════════════════════════════════════════════════
echo 📦 PASO 3/4: Instalando dependencias del FRONTEND...
echo ══════════════════════════════════════════════════════════════
echo.

cd ..\frontend
if not exist "package.json" (
    echo ❌ ERROR: No se encontró package.json en frontend
    pause
    exit /b 1
)

echo 🔧 Instalando paquetes de Node.js (esto puede tardar 2-3 minutos)...
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la instalación de dependencias del frontend
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias del frontend instaladas correctamente
echo.

if not exist ".env" (
    echo 📝 Creando archivo .env para frontend...
    copy .env.example .env >nul
    echo ✅ Archivo .env creado
    echo.
)

echo ══════════════════════════════════════════════════════════════
echo ✅ PASO 4/4: INSTALACIÓN COMPLETADA
echo ══════════════════════════════════════════════════════════════
echo.

cd ..

echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                  🎉 ¡INSTALACIÓN EXITOSA!                     ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 📝 PRÓXIMOS PASOS:
echo.
echo 1️⃣  Abre DOS terminales PowerShell
echo.
echo 2️⃣  En la primera terminal (BACKEND):
echo     cd backend
echo     npm run dev
echo.
echo 3️⃣  En la segunda terminal (FRONTEND):
echo     cd frontend
echo     npm run dev
echo.
echo 4️⃣  Abre tu navegador en: http://localhost:5173
echo.
echo 5️⃣  Inicia sesión con:
echo     📧 Email: admin@exmc.com
echo     🔑 Password: admin123
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo 💡 COMANDOS ÚTILES:
echo.
echo    Ver base de datos: cd backend; npx prisma studio
echo    Resetear DB:       cd backend; npx prisma migrate reset
echo    Ayuda completa:    Consulta INSTALACION.md
echo.
echo ══════════════════════════════════════════════════════════════
echo.

pause
