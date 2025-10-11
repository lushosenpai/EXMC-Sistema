# 🚀 Quick Start - Electron Desktop App

## ⚡ Desarrollo Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run electron:dev
```

¡Eso es todo! La aplicación se abrirá automáticamente.

---

## 📦 Compilar Instalador

```bash
# 1. Descargar PostgreSQL portable (solo primera vez)
# Ver: DESCARGAR-POSTGRES.md

# 2. Compilar todo
npm run build:all

# 3. Generar instalador .exe
npm run electron:build:win

# 4. Instalador generado en:
# dist-electron/Sistema EXMC-Setup-1.0.0.exe
```

---

## 📚 Documentación Completa

- **[ELECTRON-README.md](./ELECTRON-README.md)** - Documentación completa
- **[DESCARGAR-POSTGRES.md](./DESCARGAR-POSTGRES.md)** - Cómo descargar PostgreSQL
- **[electron/ICONOS.md](./electron/ICONOS.md)** - Crear íconos personalizados

---

## 🎯 Estructura del Proyecto

```
sitema-EXMC/
├── electron/           # Aplicación Electron
├── backend/            # API Express
├── frontend/           # React App
├── postgres-portable/  # PostgreSQL (no en git)
└── dist-electron/      # Instalador .exe (generado)
```

---

## ✅ Estado Actual

- ✅ Estructura Electron creada
- ✅ Scripts de desarrollo configurados
- ✅ Scripts de build configurados
- ⏳ Pendiente: Descargar PostgreSQL portable
- ⏳ Pendiente: Crear íconos (opcional)

---

## 🔥 Comandos Útiles

```bash
# Desarrollo
npm run electron:dev          # Iniciar app en desarrollo
npm run dev:backend           # Solo backend
npm run dev:frontend          # Solo frontend

# Build
npm run build:backend         # Compilar backend
npm run build:frontend        # Compilar frontend
npm run build:all             # Compilar todo

# Electron
npm run electron:build        # Build para todas las plataformas
npm run electron:build:win    # Build solo para Windows
```

---

## 📞 Soporte

**Desarrollador:** Luciano Savoretti  
**Instagram:** [@devpuchito](https://www.instagram.com/devpuchito/)  

---

**Siguiente paso:** Lee [ELECTRON-README.md](./ELECTRON-README.md) para más detalles
