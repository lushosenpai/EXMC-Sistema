# 🐛 GUÍA DE DEBUGGING - Sistema EXMC v2.0.0

## Problema Actual
❌ **ERR_CONNECTION_REFUSED en http://localhost:3001**
- La aplicación abre pero el backend no está ejecutándose

## Cambios en esta Versión

### 1. ✅ Logs Detallados
La aplicación ahora muestra información detallada en la consola:
- 📊 PostgreSQL: Estado de inicio
- 🚀 Backend: Rutas de archivos, existencia de scripts
- 🪟 Ventana: Proceso de carga, timeouts
- 📁 Directorios: Listado de contenidos en producción

### 2. ✅ Fallback a Archivos Locales
Si el backend falla al iniciar, la aplicación intentará:
1. Cargar desde `http://localhost:3001` (backend)
2. Si falla → Cargar desde archivos locales `frontend/dist/index.html`

### 3. ✅ Continuación ante Errores
- PostgreSQL falla → Continúa sin base de datos
- Backend falla → Continúa e intenta fallback
- La aplicación **SIEMPRE muestra la ventana**

## Cómo Debuggear

### Paso 1: Ver los Logs
1. Ejecutar la aplicación normalmente
2. Abrir PowerShell como Administrador
3. Ejecutar:
```powershell
cd "C:\Program Files\Sistema EXMC"
.\Sistema EXMC.exe
```
4. Los logs aparecerán en la consola

### Paso 2: Verificar Archivos Backend
```powershell
# Verificar que el backend esté en la ubicación correcta
cd "C:\Program Files\Sistema EXMC\resources"
dir app.asar.unpacked\backend\dist\index.js

# Si no existe, buscar en otras ubicaciones
dir app\backend\dist\index.js
```

### Paso 3: Verificar Frontend
```powershell
# Verificar que el frontend esté compilado
cd "C:\Program Files\Sistema EXMC\resources"
dir app.asar.unpacked\frontend\dist\index.html
```

### Paso 4: Verificar PostgreSQL
```powershell
# Verificar que PostgreSQL esté incluido
cd "C:\Program Files\Sistema EXMC\resources"
dir postgres\bin\pg_ctl.exe
```

## Logs Esperados

### ✅ Inicio Exitoso
```
=== BACKEND DEBUG ===
isDev: false
backendPath: C:\Program Files\Sistema EXMC\resources\app.asar.unpacked\backend
backendScript: C:\...\backend\dist\index.js
script exists: true
✅ Backend script encontrado!

🚀 Server running on port 3001

=== CARGANDO VENTANA PRINCIPAL ===
URL: http://localhost:3001
✅ Página cargada correctamente
```

### ⚠️ Backend Falla pero Frontend Carga
```
❌ Error al iniciar backend: Backend script NO encontrado
⚠️ Continuando sin backend - se usará fallback a archivos locales

=== CARGANDO VENTANA PRINCIPAL ===
URL: http://localhost:3001
❌ Error al cargar URL desde servidor
⚠️ Intentando fallback: cargar frontend desde archivos locales...
✅ Frontend encontrado en: C:\...\frontend\dist\index.html
✅ Frontend cargado desde archivo local!
```

### ❌ Todo Falla
```
❌ Error al iniciar PostgreSQL
❌ Error al iniciar backend
❌ No se pudo cargar desde servidor
❌ No se encontró index.html del frontend
```

## Posibles Soluciones

### Si el Backend No Inicia

#### Problema 1: Backend no está incluido en el .exe
**Solución:** Verificar `package.json` → `asarUnpack`
```json
"build": {
  "asarUnpack": [
    "backend/**/*"
  ]
}
```

#### Problema 2: Rutas incorrectas
**Solución:** Los logs dirán la ruta exacta. Verificar:
- `process.resourcesPath`
- Existencia de `app.asar.unpacked`

#### Problema 3: Node.js no ejecuta el backend
**Solución:** Verificar que `process.execPath` sea correcto
- Debería ser el ejecutable de Electron que incluye Node.js

### Si PostgreSQL No Inicia

#### Problema 1: No está en resources
**Solución:** Verificar `package.json` → `extraResources`
```json
"build": {
  "extraResources": [
    {
      "from": "postgres-portable",
      "to": "postgres"
    }
  ]
}
```

#### Problema 2: Permisos
**Solución:** Ejecutar instalador como Administrador

### Si el Frontend No Carga

#### Problema 1: No compilado
**Solución:** 
```bash
npm run build:frontend
```

#### Problema 2: Rutas de assets incorrectas
**Solución:** En `vite.config.ts`:
```typescript
export default defineConfig({
  base: './', // Importante para rutas relativas
})
```

## Herramientas de Debug

### Abrir DevTools en la App
Agregar al código en `electron/main.js`:
```javascript
mainWindow.webContents.openDevTools();
```

### Ver Logs en Tiempo Real
```powershell
# Ejecutar desde terminal
"C:\Program Files\Sistema EXMC\Sistema EXMC.exe"
```

### Verificar Puertos
```powershell
# Ver qué está usando el puerto 3001
netstat -ano | findstr :3001
```

## Contacto
- **WhatsApp:** +54 2657580979
- **Instagram:** @devpuchito
- **GitHub:** github.com/lushosenpai/EXMC-Sistema

---

**Versión:** 2.0.0  
**Fecha:** 12 de Octubre 2025  
**Autor:** Luciano Savoretti
