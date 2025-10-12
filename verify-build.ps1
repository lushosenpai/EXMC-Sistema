# Script para verificar el contenido del instalador
# Ejecutar después de compilar

Write-Host "`n=== VERIFICACIÓN DEL INSTALADOR ===" -ForegroundColor Cyan

$unpackedPath = "dist-electron\win-unpacked"

# Verificar que existe
if (!(Test-Path $unpackedPath)) {
    Write-Host "❌ No se encontró el directorio unpacked" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Directorio unpacked encontrado" -ForegroundColor Green

# Verificar estructura de archivos
$checks = @{
    "Ejecutable" = "$unpackedPath\Sistema EXMC.exe"
    "Backend_extraResources" = "$unpackedPath\resources\backend"
    "Backend_index_js" = "$unpackedPath\resources\backend\dist\index.js"
    "Backend_node_modules" = "$unpackedPath\resources\backend\node_modules"
    "Backend_bcrypt" = "$unpackedPath\resources\backend\node_modules\bcrypt"
    "Backend_prisma_client" = "$unpackedPath\resources\backend\node_modules\@prisma"
    "Backend_package_json" = "$unpackedPath\resources\backend\package.json"
    "PostgreSQL" = "$unpackedPath\resources\postgres"
    "PostgreSQL_pg_ctl" = "$unpackedPath\resources\postgres\bin\pg_ctl.exe"
    "App_ASAR" = "$unpackedPath\resources\app.asar"
    "Electron" = "$unpackedPath\electron.exe"
}

Write-Host "`n📦 Verificando archivos críticos:`n" -ForegroundColor Yellow

$allOk = $true
foreach ($check in $checks.GetEnumerator()) {
    $exists = Test-Path $check.Value
    if ($exists) {
        Write-Host "  ✅ $($check.Key)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($check.Key) - NO ENCONTRADO" -ForegroundColor Red
        Write-Host "     Ruta: $($check.Value)" -ForegroundColor DarkGray
        $allOk = $false
    }
}

# Verificar tamaño del backend
if (Test-Path "$unpackedPath\resources\backend") {
    $backendSize = (Get-ChildItem "$unpackedPath\resources\backend" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "`n📊 Tamaño del backend: $([math]::Round($backendSize, 2)) MB" -ForegroundColor Cyan
}

# Verificar tamaño de PostgreSQL
if (Test-Path "$unpackedPath\resources\postgres") {
    $postgresSize = (Get-ChildItem "$unpackedPath\resources\postgres" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "📊 Tamaño de PostgreSQL: $([math]::Round($postgresSize, 2)) MB" -ForegroundColor Cyan
}

# Verificar contenido del ASAR (frontend debe estar aquí)
if (Test-Path "$unpackedPath\resources\app.asar") {
    $asarSize = (Get-Item "$unpackedPath\resources\app.asar").Length / 1MB
    Write-Host "📊 Tamaño del app.asar: $([math]::Round($asarSize, 2)) MB" -ForegroundColor Cyan
    
    # Intentar listar contenido (requiere asar CLI)
    try {
        $asarContent = npx asar list "$unpackedPath\resources\app.asar" 2>$null
        if ($asarContent -like "*frontend*") {
            Write-Host "  ✅ Frontend encontrado en ASAR" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠️  No se pudo verificar contenido del ASAR (instalar: npm i -g asar)" -ForegroundColor Yellow
    }
}

# Verificar instalador final
$installerPath = "dist-electron\Sistema EXMC-Setup-2.0.0.exe"
if (Test-Path $installerPath) {
    $installerSize = (Get-Item $installerPath).Length / 1MB
    Write-Host "`n✅ Instalador generado: $([math]::Round($installerSize, 2)) MB" -ForegroundColor Green
    Write-Host "   Ruta: $installerPath" -ForegroundColor DarkGray
} else {
    Write-Host "`n❌ Instalador NO generado" -ForegroundColor Red
    $allOk = $false
}

# Resultado final
Write-Host "`n" -NoNewline
if ($allOk) {
    Write-Host "🎉 VERIFICACIÓN EXITOSA - Todo está listo!" -ForegroundColor Green
    Write-Host "`nPuedes subir el instalador a GitHub:" -ForegroundColor Cyan
    Write-Host "gh release upload v2.0.0 `"$installerPath`" --clobber" -ForegroundColor White
} else {
    Write-Host "⚠️  VERIFICACIÓN FALLÓ - Revisa los errores arriba" -ForegroundColor Red
    exit 1
}

Write-Host ""
