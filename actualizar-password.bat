@echo off
chcp 65001 > nul
echo.
echo ===============================================
echo 🔧 ACTUALIZAR CONTRASEÑA EN .ENV
echo ===============================================
echo.
echo Este script te ayudará a actualizar la contraseña
echo de PostgreSQL en el archivo .env
echo.
set /p password="Ingresa tu contraseña de PostgreSQL: "
echo.
echo Actualizando archivo backend\.env...
echo.

powershell -Command "(Get-Content 'backend\.env') -replace 'DATABASE_URL=\"postgresql://postgres:.*@localhost:5432/exmc_db\"', 'DATABASE_URL=\"postgresql://postgres:%password%@localhost:5432/exmc_db\"' | Set-Content 'backend\.env'"

echo.
echo ✅ Contraseña actualizada en backend\.env
echo.
echo 📝 Línea actualizada:
echo DATABASE_URL="postgresql://postgres:%password%@localhost:5432/exmc_db"
echo.
echo ===============================================
echo 🚀 Ahora puedes ejecutar: .\instalar.bat
echo ===============================================
echo.
pause
