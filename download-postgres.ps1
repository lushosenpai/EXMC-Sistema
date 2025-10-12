# Script para descargar PostgreSQL Portable
# Sistema EXMC - Luciano Savoretti

$ErrorActionPreference = "Stop"

Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  📥 DESCARGANDO POSTGRESQL PORTABLE" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Configuración
$pgVersion = "16.6-1"  # Versión más reciente estable
$pgUrl = "https://get.enterprisedb.com/postgresql/postgresql-$pgVersion-windows-x64-binaries.zip"
$tempDir = Join-Path $PSScriptRoot "temp-postgres"
$targetDir = Join-Path $PSScriptRoot "postgres-portable"
$zipFile = Join-Path $tempDir "postgresql-binaries.zip"

try {
    # Crear directorio temporal
    Write-Host "📁 Creando directorio temporal..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
    
    # Descargar PostgreSQL
    Write-Host "📦 Descargando PostgreSQL $pgVersion (~140 MB)..." -ForegroundColor Yellow
    Write-Host "   URL: $pgUrl" -ForegroundColor Gray
    Write-Host "   Esto puede tomar varios minutos..." -ForegroundColor Gray
    Write-Host ""
    
    # Usar WebClient para mostrar progreso
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($pgUrl, $zipFile)
    $webClient.Dispose()
    
    Write-Host "✅ Descarga completada!" -ForegroundColor Green
    
    # Verificar tamaño del archivo
    $fileSize = (Get-Item $zipFile).Length / 1MB
    Write-Host "   Tamaño: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor Gray
    
    # Extraer ZIP
    Write-Host "`n📂 Extrayendo archivos..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath $tempDir -Force
    
    # Buscar carpeta pgsql
    $pgsqlFolder = Get-ChildItem -Path $tempDir -Filter "pgsql" -Directory -Recurse | Select-Object -First 1
    
    if ($pgsqlFolder) {
        # Mover a postgres-portable
        Write-Host "📁 Moviendo a postgres-portable/..." -ForegroundColor Yellow
        
        if (Test-Path $targetDir) {
            Write-Host "   ⚠️  La carpeta postgres-portable ya existe. Eliminando..." -ForegroundColor Yellow
            Remove-Item -Path $targetDir -Recurse -Force
        }
        
        Move-Item -Path $pgsqlFolder.FullName -Destination $targetDir -Force
        
        # Verificar estructura
        Write-Host "`n✅ PostgreSQL portable instalado correctamente!" -ForegroundColor Green
        Write-Host "   📂 Ubicación: $targetDir" -ForegroundColor Gray
        
        # Verificar binarios
        $postgresExe = Join-Path $targetDir "bin\postgres.exe"
        if (Test-Path $postgresExe) {
            Write-Host "   ✅ postgres.exe encontrado" -ForegroundColor Green
            
            # Obtener versión
            $version = & $postgresExe --version 2>$null
            Write-Host "   📌 Versión: $version" -ForegroundColor Gray
        }
        
        # Mostrar tamaño final
        $totalSize = (Get-ChildItem -Path $targetDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   📊 Tamaño total: $([Math]::Round($totalSize, 2)) MB" -ForegroundColor Gray
        
    } else {
        throw "No se encontró la carpeta 'pgsql' en el archivo descargado"
    }
    
    # Limpiar archivos temporales
    Write-Host "`n🧹 Limpiando archivos temporales..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
    
    Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  ✅ POSTGRESQL PORTABLE LISTO" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
    
    Write-Host "📋 SIGUIENTE PASO:" -ForegroundColor Yellow
    Write-Host "   Ahora puedes compilar el instalador .exe con:" -ForegroundColor White
    Write-Host "   npm run build:all" -ForegroundColor Cyan
    Write-Host "   npm run electron:build:win`n" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n📋 SOLUCIÓN ALTERNATIVA:" -ForegroundColor Yellow
    Write-Host "   1. Descarga manual desde:" -ForegroundColor White
    Write-Host "      https://www.enterprisedb.com/download-postgresql-binaries" -ForegroundColor Gray
    Write-Host "   2. Extrae el ZIP" -ForegroundColor White
    Write-Host "   3. Mueve la carpeta 'pgsql' a:" -ForegroundColor White
    Write-Host "      $targetDir`n" -ForegroundColor Gray
    
    # Limpiar en caso de error
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    exit 1
}
