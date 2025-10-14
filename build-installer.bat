@echo off
cd /d "%~dp0"
echo Compilando instalador...
npx electron-builder --win
echo.
echo ===============================================
echo Proceso finalizado
echo ===============================================
pause
