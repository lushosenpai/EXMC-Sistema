@echo off
SETLOCAL EnableDelayedExpansion

echo ========================================
echo   COMPILADOR DE INSTALADOR - Sistema EXMC
echo ========================================
echo.

cd /d "c:\xampp\htdocs\sitema-EXMC"

echo [1/2] Verificando archivos compilados...
if not exist "backend\dist\index.js" (
    echo ERROR: Backend no compilado
    pause
    exit /b 1
)

if not exist "frontend\dist\index.html" (
    echo ERROR: Frontend no compilado
    pause
    exit /b 1
)

echo OK - Archivos compilados encontrados
echo.

echo [2/2] Creando instalador con electron-builder...
call npx electron-builder --win --config.compression=store --config.nsis.oneClick=false

if errorlevel 1 (
    echo.
    echo ERROR al crear instalador
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALADOR CREADO EXITOSAMENTE!
echo ========================================
echo.
echo Ubicacion: dist-electron\Sistema EXMC-Setup-2.0.0.exe
echo.

pause
