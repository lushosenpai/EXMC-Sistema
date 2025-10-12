# 🚀 COMPILAR INSTALADOR .EXE - Guía Rápida

## ⚡ PREREQUISITOS

Antes de compilar el instalador, asegúrate de tener:

- [x] PostgreSQL portable en `postgres-portable/`
- [x] Íconos en `electron/assets/`
- [x] Backend y frontend compilados

---

## 📦 PASO 1: Verificar PostgreSQL Portable

### ✅ Verificar que existe:
```powershell
dir postgres-portable\bin\postgres.exe
```

**Debe mostrar:** `postgres.exe` encontrado

### ❌ Si NO existe:

**Opción A - Script automático:**
```powershell
.\download-postgres.ps1
```

**Opción B - Descarga manual:**
1. Ve a: https://www.enterprisedb.com/download-postgresql-binaries
2. Descarga: PostgreSQL 14+ Windows x86-64 binaries
3. Extrae el ZIP
4. Mueve carpeta `pgsql\` a `postgres-portable\`

### 📂 Estructura esperada:
```
postgres-portable/
├── bin/
│   ├── postgres.exe    ✅
│   ├── pg_ctl.exe      ✅
│   ├── initdb.exe      ✅
│   └── ...
├── lib/
└── share/
```

---

## 🔨 PASO 2: Compilar Backend y Frontend

### Compilar todo de una vez:
```powershell
npm run build:all
```

### O por separado:
```powershell
# Backend
cd backend
npm run build
cd ..

# Frontend  
cd frontend
npm run build
cd ..
```

### ✅ Verificar compilación:
```powershell
# Backend compilado
dir backend\dist\index.js

# Frontend compilado
dir frontend\dist\index.html
```

---

## 📦 PASO 3: Generar Instalador .EXE

### Comando principal:
```powershell
npm run electron:build:win
```

### Proceso (5-10 minutos):
```
1. ⚙️  Empaquetando aplicación...
2. 📦 Copiando PostgreSQL portable...
3. 🗜️  Comprimiendo archivos...
4. 📝 Generando instalador NSIS...
5. ✅ Instalador creado!
```

### ⏱️ Tiempo estimado:
- Primera compilación: **5-10 minutos**
- Compilaciones siguientes: **3-5 minutos**

---

## 📁 PASO 4: Ubicar el Instalador

### Archivo generado:
```
dist-electron/
└── Sistema EXMC-Setup-1.0.0.exe  (~300 MB)
```

### Verificar:
```powershell
dir dist-electron\*.exe
```

**Debe mostrar:**
```
Sistema EXMC-Setup-1.0.0.exe
```

---

## 🧪 PASO 5: Probar el Instalador

### Opción 1 - Ejecutar directamente:
```powershell
.\dist-electron\Sistema EXMC-Setup-1.0.0.exe
```

### Opción 2 - Copiar a otra PC:
1. Copia `Sistema EXMC-Setup-1.0.0.exe` a USB
2. Lleva a otra PC Windows
3. Ejecuta el instalador
4. Prueba la aplicación

### ✅ El instalador debe:
- [x] Abrir wizard de instalación
- [x] Permitir elegir carpeta
- [x] Crear accesos directos
- [x] Instalar PostgreSQL portable
- [x] Al finalizar, abrir aplicación
- [x] Login debe funcionar

---

## 🎯 COMANDOS RÁPIDOS

```powershell
# TODO EN UNO (si ya tienes PostgreSQL portable)
npm run build:all && npm run electron:build:win

# VERIFICAR PREREQUISITES
dir postgres-portable\bin\postgres.exe
dir electron\assets\icon.ico
dir backend\dist\index.js
dir frontend\dist\index.html

# LIMPIAR BUILD ANTERIOR
rmdir /s /q dist-electron
rmdir /s /q backend\dist
rmdir /s /q frontend\dist

# REBUILD COMPLETO
npm run build:all && npm run electron:build:win
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "PostgreSQL no encontrado"
```powershell
# Verificar
dir postgres-portable\bin\postgres.exe

# Si no existe
.\download-postgres.ps1
```

### Error: "Backend dist not found"
```powershell
cd backend
npm run build
cd ..
```

### Error: "Frontend dist not found"
```powershell
cd frontend
npm run build
cd ..
```

### Error: "electron-builder failed"
```powershell
# Reinstalar electron-builder
npm install electron-builder@24.9.1 --save-dev

# Intentar de nuevo
npm run electron:build:win
```

### Error: "Icon not found"
```powershell
# Verificar íconos
dir electron\assets\icon.ico
dir electron\assets\icon.png

# Si faltan, copiar de frontend
copy frontend\src\assets\EXMC.ico electron\assets\icon.ico
```

### Instalador muy grande (>500 MB)
**Normal:** ~300-350 MB
- PostgreSQL: ~200 MB
- Node.js runtime: ~100 MB
- Tu aplicación: ~50 MB

**Si es >500 MB:**
```powershell
# Limpiar postgres-portable de archivos innecesarios
cd postgres-portable
rmdir /s /q doc
rmdir /s /q include
cd ..
```

---

## 📊 TAMAÑOS ESPERADOS

| Componente | Tamaño |
|------------|--------|
| `postgres-portable/` | ~200 MB |
| `backend/dist/` | ~5 MB |
| `frontend/dist/` | ~10 MB |
| `node_modules/` (empaquetado) | ~50 MB |
| **Instalador final** | **~300 MB** |

---

## ✅ CHECKLIST PRE-BUILD

Antes de compilar, verifica:

- [ ] PostgreSQL portable descargado y en `postgres-portable/`
- [ ] Íconos en `electron/assets/` (icon.ico, icon.png, tray-icon.png)
- [ ] Backend compilado (`backend/dist/index.js` existe)
- [ ] Frontend compilado (`frontend/dist/index.html` existe)
- [ ] package.json actualizado con versión correcta
- [ ] Todas las dependencias instaladas (`npm install`)
- [ ] Git commit de cambios importantes (opcional pero recomendado)

---

## 🎊 SIGUIENTE PASO

Una vez compilado el instalador:

1. **Probar en tu PC:**
   ```powershell
   .\dist-electron\Sistema EXMC-Setup-1.0.0.exe
   ```

2. **Distribuir:**
   - Subir a Google Drive / Dropbox
   - Enviar por email / WhatsApp
   - Subir a tu servidor
   - GitHub Releases

3. **Actualizar versión:**
   - Cambiar versión en `package.json`
   - Recompilar con nuevo número de versión
   - Distribuir actualización

---

## 📞 AYUDA

Si tienes problemas:
1. Lee los mensajes de error completos
2. Verifica el checklist de arriba
3. Consulta `ELECTRON-README.md` para más detalles
4. Revisa los logs en `dist-electron/builder-debug.log`

---

**Desarrollado por:** Luciano Savoretti  
**Instagram:** [@devpuchito](https://www.instagram.com/devpuchito/)  
**GitHub:** [lushosenpai/EXMC-Sistema](https://github.com/lushosenpai/EXMC-Sistema)

---

¡Buena suerte con tu instalador! 🚀
