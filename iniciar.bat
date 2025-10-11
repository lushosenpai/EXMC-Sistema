@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║              🚀 SISTEMA EXMC - INICIO RÁPIDO                  ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Verificando instalación...
echo.

:: Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js no encontrado. Ejecuta primero: instalar.bat
    pause
    exit /b 1
)

:: Verificar si backend está instalado
if not exist "backend\node_modules\" (
    echo ❌ Backend no instalado. Ejecuta primero: instalar.bat
    pause
    exit /b 1
)

:: Verificar si frontend está instalado
if not exist "frontend\node_modules\" (
    echo ❌ Frontend no instalado. Ejecuta primero: instalar.bat
    pause
    exit /b 1
)

echo ✅ Todo listo para iniciar
echo.
echo ══════════════════════════════════════════════════════════════
echo 🚀 Iniciando servidores...
echo ══════════════════════════════════════════════════════════════
echo.

echo 📝 INSTRUCCIONES:
echo.
echo ▶️  Se abrirán 2 ventanas de terminal:
echo    1. Backend  (API en puerto 3001)
echo    2. Frontend (Web en puerto 5173)
echo.
echo ⚠️  NO CIERRES LAS VENTANAS DE TERMINAL
echo.
echo 🌐 Cuando ambos inicien, abre:
echo    http://localhost:5173
echo.
echo 🔑 Credenciales:
echo    Email: admin@exmc.com
echo    Pass:  admin123
echo.

pause
echo.
echo 🔥 Iniciando servidores...
echo.

:: Iniciar backend en nueva ventana
start "🔧 EXMC Backend API" cmd /k "cd backend && echo ╔════════════════════════════════════════════════╗ && echo ║         EXMC BACKEND - Puerto 3001           ║ && echo ╚════════════════════════════════════════════════╝ && echo. && npm run dev"

:: Esperar 3 segundos para que backend inicie primero
timeout /t 3 /nobreak >nul

:: Iniciar frontend en nueva ventana
start "⚛️ EXMC Frontend" cmd /k "cd frontend && echo ╔════════════════════════════════════════════════╗ && echo ║         EXMC FRONTEND - Puerto 5173          ║ && echo ╚════════════════════════════════════════════════╝ && echo. && npm run dev"

echo.
echo ✅ Servidores iniciados en ventanas separadas
echo.
echo 💡 Cuando veas el mensaje "ready", abre tu navegador en:
echo    👉 http://localhost:5173
echo.
echo ❌ Para detener: Cierra las ventanas de terminal o presiona Ctrl+C
echo.

timeout /t 8 /nobreak >nul

:: Abrir navegador automáticamente
start http://localhost:5173

echo.
echo 🌐 Navegador abierto automáticamente
echo.
echo Puedes cerrar esta ventana. Los servidores siguen corriendo.
echo.
pause
