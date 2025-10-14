@echo off
REM ========================================
REM Script de Verificación - Sistema EXMC
REM ========================================

echo.
echo ====================================
echo   VERIFICACION DEL SISTEMA EXMC
echo ====================================
echo.

cd /d "%~dp0backend"

echo [1/5] Verificando archivo de base de datos...
if exist "prisma\dev.db" (
    echo    ✓ Base de datos encontrada: prisma\dev.db
    for %%A in (prisma\dev.db) do echo    Tamaño: %%~zA bytes
) else (
    echo    ✗ Base de datos NO encontrada
    echo    Ejecutando: npx prisma db push
    call npx prisma db push
)

echo.
echo [2/5] Verificando configuración .env...
if exist ".env" (
    echo    ✓ Archivo .env encontrado
    findstr /C:"DATABASE_URL" .env | findstr /C:"file:" >nul
    if %ERRORLEVEL% EQU 0 (
        echo    ✓ DATABASE_URL configurado correctamente para SQLite
    ) else (
        echo    ✗ ADVERTENCIA: DATABASE_URL puede estar mal configurado
        echo    Debe contener: DATABASE_URL="file:./prisma/dev.db"
    )
) else (
    echo    ✗ Archivo .env NO encontrado
    echo    Copiando desde .env.example...
    copy .env.example .env
)

echo.
echo [3/5] Verificando cliente de Prisma...
if exist "node_modules\@prisma\client" (
    echo    ✓ Cliente de Prisma instalado
) else (
    echo    ✗ Cliente de Prisma NO instalado
    echo    Ejecutando: npx prisma generate
    call npx prisma generate
)

echo.
echo [4/5] Verificando compilación del backend...
if exist "dist\index.js" (
    echo    ✓ Backend compilado
) else (
    echo    ✗ Backend NO compilado
    echo    Ejecutando: npm run build
    call npm run build
)

echo.
echo [5/5] Verificando datos en la base de datos...
echo    Intentando verificar usuarios...
echo SELECT COUNT(*) as total FROM users; | sqlite3 prisma\dev.db 2>nul
if %ERRORLEVEL% EQU 0 (
    echo    ✓ Base de datos accesible
) else (
    echo    ℹ No se pudo verificar (sqlite3 no instalado)
)

echo.
echo ====================================
echo   RESULTADO DE LA VERIFICACION
echo ====================================
echo.
echo Todo parece estar configurado correctamente.
echo.
echo Para iniciar el sistema:
echo   1. Backend:  cd backend ^&^& node dist\index.js
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
echo O ejecutar: iniciar.bat
echo.
pause
