# 🚀 BUILD #20 - Solución GENÉRICA para cualquier PC

## 🎯 Problemas resueltos

### ✅ 1. Puerto PostgreSQL dinámico
**Antes:** Puerto fijo 5433 causaba conflictos
**Ahora:** Si el puerto 5433 está ocupado, intenta:
1. Detener instancia previa
2. Usar puerto alternativo 5434
3. Actualizar DATABASE_URL automáticamente

### ✅ 2. Mejor detección de errores
- Verifica disponibilidad del puerto ANTES de iniciar
- Logs detallados de pg_ctl (stdout/stderr)
- Timeout aumentado a 3 segundos para PCs lentos
- No falla si PostgreSQL no inicia (modo degradado)

### ✅ 3. Inicialización mejorada
- Espera 2 segundos adicionales antes de crear DB
- Flags de inicialización: `--locale=C` para compatibilidad
- Variables de entorno propagadas correctamente

---

## 📋 Qué hace automáticamente

1. **Detecta puerto ocupado:**
   ```
   🔍 Verificando disponibilidad del puerto 5433...
   ⚠️ Puerto 5433 ocupado, intentando detener instancia previa...
   🔄 Intentando puerto alternativo 5434...
   ```

2. **Configura firewall (NSIS installer):**
   ```
   netsh advfirewall firewall add rule name="Sistema EXMC"...
   netsh advfirewall firewall add rule name="Sistema EXMC Backend"...
   netsh advfirewall firewall add rule name="Sistema EXMC PostgreSQL"...
   ```

3. **Crea base de datos:**
   ```
   🗄️ Creando base de datos exmc_db...
   📊 Aplicando migraciones SQL...
   🔧 Aplicando correcciones de schema...
   🌱 Cargando datos de prueba (tienda de ropa)...
   ```

---

## 🛡️ Windows Defender - SOLUCIÓN

### Opción 1: Permitir durante instalación
1. Windows SmartScreen aparece
2. Clic en **"Más información"**
3. Clic en **"Ejecutar de todas formas"**

### Opción 2: Agregar exclusión ANTES de instalar
```powershell
# Ejecutar PowerShell como Administrador
Add-MpPreference -ExclusionPath "C:\Users\$env:USERNAME\Downloads\Sistema EXMC-Setup-2.0.0.exe"
Add-MpPreference -ExclusionPath "C:\Users\$env:USERNAME\AppData\Local\Programs\Sistema EXMC"
```

### Opción 3: Desactivar temporalmente
1. Abrir **Windows Security**
2. **Protección contra virus y amenazas**
3. **Administrar configuración**
4. Desactivar **Protección en tiempo real** (temporalmente)
5. Instalar el sistema
6. Reactivar protección

---

## 🔥 Firewall - SOLUCIÓN

### El instalador agrega reglas automáticamente

**NO necesitas hacer nada manualmente.**

El script NSIS ejecuta:
```batch
netsh advfirewall firewall add rule name="Sistema EXMC" dir=in action=allow program="$INSTDIR\Sistema EXMC.exe" enable=yes profile=any
netsh advfirewall firewall add rule name="Sistema EXMC Backend" dir=in action=allow protocol=TCP localport=3001 profile=any
netsh advfirewall firewall add rule name="Sistema EXMC PostgreSQL" dir=in action=allow protocol=TCP localport=5433 profile=any
```

### Si aún así aparece el popup:
1. Clic en **"Permitir acceso"**
2. Seleccionar **"Redes privadas"** ✅
3. NO seleccionar "Redes públicas" ❌

---

## 🐛 Solución de problemas

### ❌ "Can't reach database server at localhost:5433"

**Posibles causas:**
1. PostgreSQL no inició por puerto ocupado
2. Antivirus bloqueó pg_ctl.exe
3. Permisos insuficientes en AppData

**Solución:**
1. Cerrar el sistema completamente
2. Verificar en Task Manager que no quede `postgres.exe`
3. Si existe, matar proceso:
   ```powershell
   taskkill /F /IM postgres.exe
   ```
4. Reabrir el sistema

### ❌ "Error al inicializar PostgreSQL"

**El sistema DEBE continuar de todas formas.**

Revisa los logs:
```
Menu Inicio > Sistema EXMC > Ver Logs (Debug)
```

Busca líneas como:
```
❌ Error al ejecutar initdb: ...
PostgreSQL stderr: ...
```

**Solución temporal:** Usar PostgreSQL instalado en el sistema
1. Instalar PostgreSQL 15+ manualmente
2. Crear base de datos `exmc_db`
3. Usuario: `postgres` / Password: `postgres`
4. Puerto: `5432`

---

## 📊 Logs importantes

El sistema ahora muestra:
- `🔍 Verificando disponibilidad del puerto 5433...`
- `🔌 Puerto PostgreSQL: 5433` (o 5434)
- `⏳ Esperando a PostgreSQL...`
- `PostgreSQL stdout: server starting`
- `PostgreSQL stderr: ...` (si hay errores)

---

## 🔑 Credenciales (Build #20)

- **Admin:** `admin@exmc.com` / `admin123`
- **Vendedor:** `vendedor@exmc.com` / `admin123`
- **Consulta:** `consulta@exmc.com` / `admin123`

---

## 📦 Datos de prueba incluidos

✅ 20 productos (ropa y calzado)
✅ 6 clientes (5 reales + 1 consumidor final)
✅ 5 ventas (últimos 7 días)
✅ 4 proveedores
✅ 3 usuarios con diferentes roles

---

## 🚀 Instalación paso a paso

1. **Descargar** `Sistema EXMC-Setup-2.0.0.exe`
   - Desde: https://github.com/lushosenpai/EXMC-Sistema/releases/tag/v2.0.0

2. **Permitir en Windows Defender** (si bloquea)
   - "Más información" → "Ejecutar de todas formas"

3. **Instalar normalmente**
   - Elegir carpeta de instalación
   - El instalador configura firewall automáticamente

4. **Primera ejecución**
   - Elegir "Prueba por 15 días" o ingresar licencia
   - Login: `admin@exmc.com` / `admin123`

5. **Si no funciona a la primera:**
   - Cerrar completamente (Ctrl+Alt+Supr → Finalizar tarea si es necesario)
   - Abrir de nuevo
   - Ahora SÍ debe aparecer el popup de firewall (permitir acceso)

---

## 📞 Soporte

**Desarrollador:** Luciano Savoretti (@devpuchito)
**Instagram:** https://instagram.com/devpuchito
**WhatsApp:** +54 2657580979

**Si tienes problemas:**
1. Toma captura del error
2. Envía los logs (Menu Inicio > Ver Logs)
3. Contacta por WhatsApp con las capturas

---

*Build #20 - Octubre 2025*
