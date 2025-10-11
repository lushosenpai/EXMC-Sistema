# 🐘 Descargar PostgreSQL Portable

## 📥 Instrucciones para Descargar

### Opción 1: Descarga Manual (Recomendado)

1. **Ir al sitio oficial:**
   https://www.enterprisedb.com/download-postgresql-binaries

2. **Seleccionar versión:**
   - Version: **PostgreSQL 14.x** (o superior)
   - Platform: **Windows x86-64**
   - Click en **Download**

3. **Extraer el archivo ZIP:**
   ```bash
   # Extraer en la carpeta del proyecto:
   # De: postgresql-14.x-windows-x64-binaries.zip
   # A:   c:\xampp\htdocs\sitema-EXMC\postgres-portable\
   ```

4. **Verificar estructura:**
   ```
   sitema-EXMC/
   └── postgres-portable/
       ├── bin/
       │   ├── postgres.exe    ✅
       │   ├── pg_ctl.exe      ✅
       │   ├── initdb.exe      ✅
       │   ├── psql.exe        ✅
       │   └── ...
       ├── lib/
       ├── share/
       └── include/
   ```

5. **Tamaño esperado:**
   - Carpeta completa: ~200 MB
   - Con datos: ~250-300 MB

---

### Opción 2: PowerShell Script (Automático)

Guarda este script como `download-postgres.ps1` y ejecútalo:

```powershell
# download-postgres.ps1
$ErrorActionPreference = "Stop"

Write-Host "📥 Descargando PostgreSQL 14 Portable..." -ForegroundColor Cyan

# URLs (actualizar según versión)
$pgVersion = "14.10"
$pgUrl = "https://get.enterprisedb.com/postgresql/postgresql-$pgVersion-1-windows-x64-binaries.zip"
$pgZip = "postgresql-binaries.zip"
$pgExtract = "postgres-portable"

# Crear directorio temporal
$tempDir = Join-Path $PSScriptRoot "temp"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Descargar
Write-Host "📦 Descargando desde: $pgUrl" -ForegroundColor Yellow
Invoke-WebRequest -Uri $pgUrl -OutFile (Join-Path $tempDir $pgZip) -UseBasicParsing

# Extraer
Write-Host "📂 Extrayendo archivos..." -ForegroundColor Yellow
Expand-Archive -Path (Join-Path $tempDir $pgZip) -DestinationPath $tempDir -Force

# Mover a carpeta final
Write-Host "📁 Moviendo a postgres-portable..." -ForegroundColor Yellow
$pgFolder = Get-ChildItem -Path $tempDir -Filter "pgsql" -Directory | Select-Object -First 1
Move-Item -Path $pgFolder.FullName -Destination (Join-Path $PSScriptRoot $pgExtract) -Force

# Limpiar
Write-Host "🧹 Limpiando archivos temporales..." -ForegroundColor Yellow
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "✅ PostgreSQL descargado correctamente!" -ForegroundColor Green
Write-Host "📂 Ubicación: $PSScriptRoot\$pgExtract" -ForegroundColor Green
```

**Ejecutar:**
```bash
powershell -ExecutionPolicy Bypass -File download-postgres.ps1
```

---

### Opción 3: Desde Chocolatey (si tienes Chocolatey instalado)

```bash
# Instalar Chocolatey primero si no lo tienes:
# https://chocolatey.org/install

# Descargar PostgreSQL portable
choco download postgresql --internalize

# Extraer binarios manualmente a postgres-portable/
```

---

## ✅ Verificar Instalación

Una vez descargado, verifica:

```bash
# Verificar que existe postgres.exe
dir postgres-portable\bin\postgres.exe

# Verificar versión
postgres-portable\bin\postgres.exe --version

# Debe mostrar: postgres (PostgreSQL) 14.x
```

---

## 📦 Tamaño y Requisitos

**Descarga:**
- Archivo ZIP: ~140 MB
- Extraído: ~200 MB

**Espacio en disco necesario:**
- PostgreSQL binaries: ~200 MB
- Base de datos (con uso): ~50-100 MB
- **Total:** ~300 MB

**RAM recomendada:**
- Mínimo: 512 MB
- Recomendado: 1 GB
- Óptimo: 2 GB

---

## 🔒 Seguridad

**PostgreSQL portable configurado para:**
- ✅ Solo conexiones locales (localhost)
- ✅ Sin contraseña (solo local)
- ✅ Puerto 5433 (no interfiere con instalaciones existentes)
- ✅ Datos en: `AppData\Roaming\exmc-sistema\data\pgdata\`

---

## 🚫 NO Incluir en Git

**Importante:** PostgreSQL portable NO debe subirse a Git.

Ya está en `.gitignore`:
```gitignore
postgres-portable/
```

**Razones:**
- Tamaño: 200 MB (GitHub tiene límite)
- Binarios: Pueden cambiar según versión
- Mejor: Cada desarrollador descarga su propia copia

---

## 📋 Checklist

Antes de compilar el instalador:

- [ ] PostgreSQL descargado
- [ ] Extraído en `postgres-portable/`
- [ ] Existe `postgres-portable/bin/postgres.exe`
- [ ] Existe `postgres-portable/bin/initdb.exe`
- [ ] Existe `postgres-portable/bin/pg_ctl.exe`
- [ ] Carpeta pesa ~200 MB
- [ ] NO está en Git (verificar .gitignore)

---

## 🆘 Solución de Problemas

### Error: "No se puede descargar"
```bash
# Descargar manualmente desde:
https://www.enterprisedb.com/download-postgresql-binaries

# O usar mirror alternativo:
https://sbp.enterprisedb.com/getfile.jsp?fileid=1258649
```

### Error: "Versión incorrecta"
```bash
# Verificar versión descargada
dir postgres-portable\bin\postgres.exe
postgres-portable\bin\postgres.exe --version

# Debe ser PostgreSQL 14 o superior
```

### Error: "Carpeta muy grande"
```bash
# Eliminar archivos innecesarios:
cd postgres-portable
rmdir /s /q doc        # Documentación
rmdir /s /q include    # Headers (no necesarios)
rmdir /s /q pgAdmin*   # pgAdmin (no necesario)
```

---

## 🎯 Siguiente Paso

Una vez que tengas PostgreSQL portable:

```bash
# Compilar el instalador
npm run electron:build:win
```

El instalador incluirá automáticamente PostgreSQL.

---

## 📞 Ayuda

Si tienes problemas descargando PostgreSQL, avísame y te ayudo a encontrar un mirror alternativo o te guío paso a paso.
