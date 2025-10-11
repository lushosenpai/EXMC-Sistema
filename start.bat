@echo off
chcp 65001 > nul
echo.
echo ═══════════════════════════════════════════════════
echo    🚀 Iniciando EXMC - Modo Automático
echo ═══════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/2] 🔧 Iniciando Backend...
start "EXMC Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] 🎨 Iniciando Frontend...
start "EXMC Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak > nul

echo.
echo ✅ Servidores iniciados
echo.
echo 🌐 Abriendo navegador en 3 segundos...
echo.

timeout /t 3 /nobreak > nul

start http://localhost:5173

echo.
echo ═══════════════════════════════════════════════════
echo    ✨ Sistema EXMC listo
echo ═══════════════════════════════════════════════════
echo.
echo 📝 Credenciales:
echo    Email: admin@exmc.com
echo    Pass:  admin123
echo.
echo ⚠️  NO cierres las ventanas "EXMC Backend" y "EXMC Frontend"
echo.
pause
