# CORRECCIÓN DE ERRORES DEL INSTALADOR

## Problemas Identificados y Resueltos

### 🐛 Problema Principal
Después de instalar la aplicación, se producían los siguientes errores:

1. **Error al iniciar servidor backend**: El comando `npx prisma db push` fallaba
2. **Backend se cerraba inesperadamente** (código: 1)
3. **ERR_CONNECTION_REFUSED** en puerto 3001 porque el backend no estaba corriendo
4. **La aplicación no se cargaba correctamente**

### 🔍 Causa Raíz
El backend intentaba ejecutar comandos de Prisma CLI (`npx prisma db push`) en producción, pero estos comandos:
- No están disponibles en el entorno del instalador
- Requieren dependencias que no se empaquetan
- Fallan en el contexto de una aplicación Electron empaquetada

### ✅ Solución Implementada

#### 1. Script SQL de Inicialización
Se creó el archivo `backend/prisma/init-database.sql` que contiene:
- Creación de todas las tablas de SQLite
- Índices para mejorar el rendimiento
- Usuario administrador por defecto (admin@exmc.com / admin123)
- Configuraciones iniciales del sistema

#### 2. Modificación del Backend
Se modificó `backend/src/index.ts` para:
- Ejecutar el script SQL directamente usando Prisma Client
- Eliminar la dependencia de comandos CLI externos
- Mejorar el manejo de errores con mensajes más descriptivos

#### 3. Mejoras en el Manejo de Errores
Se actualizó `electron/main.js` para:
- Mostrar mensajes de error más claros y útiles
- Dar tiempo al backend para iniciar antes de mostrar errores
- Incluir sugerencias de solución en los mensajes de error

#### 4. Configuración del Instalador
Se actualizó `package.json` para:
- Incluir correctamente el script SQL en el instalador
- Excluir las migraciones de Prisma que no son necesarias

## 📦 Instalador Actualizado

El nuevo instalador se encuentra en:
```
dist-electron\Sistema EXMC-Setup-2.0.0.exe
```

## 🧪 Cómo Probar

### 1. Desinstalar Versión Anterior (si existe)
1. Ve a **Panel de Control** > **Programas y características**
2. Busca "Sistema EXMC"
3. Desinstala completamente
4. Opcionalmente, elimina la carpeta de datos: `%APPDATA%\sistema-exmc`

### 2. Instalar Nueva Versión
1. Ejecuta `Sistema EXMC-Setup-2.0.0.exe`
2. Sigue el asistente de instalación
3. Marca "Ejecutar Sistema EXMC" al finalizar

### 3. Primera Ejecución
Al abrir la aplicación por primera vez:

1. **Ventana de Activación**: Aparecerá la pantalla de licencia
   - Puedes activar con un código de licencia
   - O iniciar un período de prueba de 30 días

2. **Inicialización Automática**: La aplicación:
   - Creará la base de datos SQLite automáticamente
   - Iniciará el servidor backend
   - Abrirá la interfaz frontend

3. **Login**: Usa las credenciales por defecto:
   - Email: `admin@exmc.com`
   - Password: `admin123`

### 4. Verificar que Todo Funciona
- ✅ La ventana principal debe cargarse sin errores
- ✅ Debes poder iniciar sesión
- ✅ El dashboard debe mostrar datos
- ✅ Todas las secciones deben ser accesibles

## 🔧 Si Aún Hay Problemas

### Ver Logs del Sistema
Puedes ver los logs de la aplicación en:
```
%APPDATA%\sistema-exmc\logs\
```

O ejecutar el script incluido:
```
electron\ver-logs.bat
```

### Errores Comunes y Soluciones

#### "Puerto 3001 ocupado"
- Cierra cualquier otra instancia de la aplicación
- O reinicia Windows para liberar el puerto

#### "Error de permisos"
- Ejecuta el instalador como Administrador
- Verifica que no haya antivirus bloqueando

#### "Base de datos no se crea"
- Verifica permisos en `%APPDATA%`
- Intenta ejecutar la aplicación como Administrador

#### "Backend no inicia"
- Verifica los logs en consola (Ctrl+Shift+I en desarrollo)
- Asegúrate de que Node.js está incluido en Electron
- Verifica que `backend/prisma/init-database.sql` existe

## 📝 Cambios Técnicos Realizados

### Archivos Modificados
1. ✅ `backend/prisma/init-database.sql` - **NUEVO**: Script SQL de inicialización
2. ✅ `backend/src/index.ts` - Usa SQL directo en lugar de CLI
3. ✅ `electron/main.js` - Mejores mensajes de error
4. ✅ `package.json` - Configuración actualizada del instalador

### Archivos Compilados
1. ✅ `backend/dist/index.js` - Backend compilado con cambios
2. ✅ `dist-electron/Sistema EXMC-Setup-2.0.0.exe` - Nuevo instalador

## 🎯 Resultado Esperado

Después de instalar y ejecutar:
1. ✅ **Sin errores** de "Error al iniciar servidor"
2. ✅ **Sin errores** de "Backend se cerró inesperadamente"
3. ✅ **Sin errores** de "ERR_CONNECTION_REFUSED"
4. ✅ **La aplicación carga correctamente** y es completamente funcional

## 📞 Soporte Adicional

Si después de seguir estos pasos aún hay problemas:
1. Revisa los logs en `%APPDATA%\sistema-exmc\logs\`
2. Verifica la consola del desarrollador (Ctrl+Shift+I)
3. Toma capturas de los errores exactos
4. Documenta los pasos que llevaron al error

---

**Fecha de corrección**: ${new Date().toLocaleDateString('es-AR')}
**Versión**: 2.0.0
**Estado**: ✅ SOLUCIONADO
