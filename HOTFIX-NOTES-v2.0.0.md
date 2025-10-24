# 🔥 HOTFIX v2.0.0 - Corrección Crítica del Instalador

## ❌ Problema Crítico Resuelto

Después de la instalación inicial de v2.0.0, algunos usuarios experimentaban errores que impedían el arranque de la aplicación:

```
❌ Error al iniciar servidor: Error: Command failed: npx prisma db push --accept-data-loss --skip-generate
❌ El servidor backend se cerró inesperadamente (código: 1)  
❌ ERR_CONNECTION_REFUSED en http://localhost:3001
```

## ✅ Solución Implementada

### 1. Script SQL de Inicialización Directa
- ✅ **Nuevo archivo**: `backend/prisma/init-database.sql`
- ✅ Crea todas las tablas SQLite sin necesidad de Prisma CLI
- ✅ Incluye usuario administrador por defecto (admin@exmc.com / admin123)
- ✅ Configuraciones iniciales del sistema
- ✅ Índices de rendimiento

### 2. Backend Sin Dependencias CLI
- ✅ **Modificado**: `backend/src/index.ts`
- ✅ Eliminada llamada a `npx prisma db push`
- ✅ Ejecuta SQL directo usando `Prisma.$executeRawUnsafe()`
- ✅ Manejo robusto de errores de base de datos

### 3. Mensajes de Error Mejorados
- ✅ **Modificado**: `electron/main.js`
- ✅ Errores más descriptivos y accionables
- ✅ Incluyen sugerencias de solución
- ✅ Timeout antes de mostrar errores para dar tiempo al backend

### 4. Configuración del Instalador
- ✅ **Modificado**: `package.json`
- ✅ Script SQL incluido en `extraResources`
- ✅ Migraciones de Prisma excluidas (no necesarias)

## 📦 Instalador Actualizado

El nuevo instalador (`Sistema EXMC-Setup-2.0.0.exe`) ya incluye estos cambios y funciona perfectamente desde la primera ejecución.

## 🧪 Cómo Actualizar

### Si ya tienes v2.0.0 instalado:

1. **Desinstala la versión anterior**:
   - Panel de Control → Programas → Sistema EXMC → Desinstalar

2. **Descarga e instala la nueva versión**:
   - [Sistema EXMC-Setup-2.0.0.exe](https://github.com/lushosenpai/EXMC-Sistema/releases/download/v2.0.0/Sistema.EXMC-Setup-2.0.0.exe)

3. **Tus datos se mantienen**:
   - La base de datos en `%APPDATA%\sistema-exmc\data\` NO se elimina

### Para nuevas instalaciones:

Simplemente descarga e instala. Todo funcionará desde el primer arranque.

## 🎯 Resultado

✅ **Sin errores** de "Error al iniciar servidor"  
✅ **Sin errores** de "Backend se cerró inesperadamente"  
✅ **Sin errores** de "ERR_CONNECTION_REFUSED"  
✅ **La aplicación carga perfectamente** en la primera ejecución  
✅ **Base de datos se crea automáticamente** sin intervención

## 📝 Archivos Cambiados

```
✅ backend/prisma/init-database.sql (NUEVO)
✅ backend/src/index.ts
✅ electron/main.js  
✅ package.json
✅ RELEASE-NOTES-v2.0.0.md
✅ CORRECCION-ERRORES-INSTALADOR.md (NUEVO)
```

## 🔍 Detalles Técnicos

**Commit**: f0b5d9c  
**Fecha**: 24 de Octubre, 2025  
**Archivos modificados**: 6  
**Líneas agregadas**: +909  
**Líneas eliminadas**: -22  

## 📚 Documentación

Ver documentación completa en:
- [RELEASE-NOTES-v2.0.0.md](RELEASE-NOTES-v2.0.0.md)
- [CORRECCION-ERRORES-INSTALADOR.md](CORRECCION-ERRORES-INSTALADOR.md)

## 🙏 Agradecimientos

Gracias a todos los que reportaron el problema. Este hotfix asegura que el instalador funcione perfectamente para todos.

---

**Si experimentas algún problema**, por favor abre un [issue](https://github.com/lushosenpai/EXMC-Sistema/issues) con los detalles.
