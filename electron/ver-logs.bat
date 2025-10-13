@echo off
title Sistema EXMC - Logs de Debug
color 0A
echo.
echo ========================================
echo   SISTEMA EXMC - MODO DEBUG
echo ========================================
echo.
echo Este modo muestra todos los logs de la aplicacion
echo para ayudar a diagnosticar problemas.
echo.
echo Presiona Ctrl+C para cerrar en cualquier momento
echo.
echo ========================================
echo.

REM Ejecutar la aplicación y mantener la ventana abierta
"%~dp0Sistema EXMC.exe"

echo.
echo ========================================
echo La aplicacion se ha cerrado
echo ========================================
echo.
pause
