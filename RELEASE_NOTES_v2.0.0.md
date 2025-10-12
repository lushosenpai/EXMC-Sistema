# 🚀 Sistema EXMC v2.0.0

## 🎯 Nueva Versión con Sistema de Licencias

### ✨ Características Principales

#### 🔐 Sistema de Licencias Completo
- **Período de Prueba:** 15 días gratuitos para probar todas las funciones
- **Activación con Código:** Sistema de códigos de activación por hardware
- **Machine ID:** Identificación única del equipo para seguridad
- **Licencias Personalizables:** Desde 30 días hasta 10 años
- **Interfaz Moderna:** Ventana de activación con tabs (Activar / Período de Prueba)
- **Contacto Directo:** Botones de WhatsApp e Instagram integrados

#### 💻 Aplicación de Escritorio Standalone
- **PostgreSQL Portable:** Base de datos incluida (~325 MB)
- **Backend Node.js:** Servidor Express integrado
- **Frontend React:** Interfaz moderna con Vite
- **Sin Instalaciones Extras:** Todo incluido en un instalador
- **Icono de Bandeja:** Minimiza al system tray
- **Una Sola Instancia:** Previene múltiples ejecuciones

#### 🛠️ Mejoras Técnicas (v2.0.0 - Build Latest)

##### 🐛 Fixes Críticos
- ✅ **Fix Backend:** Agregado fallback a archivos locales si el servidor falla
- ✅ **Logs Detallados:** Debug exhaustivo de rutas y archivos
- ✅ **Continuación ante Errores:** La app SIEMPRE muestra ventana
- ✅ **Pantalla Azul Resuelta:** Timeout forzado de 3 segundos
- ✅ **Infinite Loop:** Protección contra múltiples instancias

##### 📊 Sistema de Fallback
Si el backend no inicia:
1. Intenta cargar desde `http://localhost:3001`
2. Si falla → Carga frontend desde archivos locales
3. Muestra mensajes de error informativos
4. Ofrece opciones de "Reintentar" o "Cerrar"

##### 🔍 Debugging Mejorado
- Logs con emojis para fácil identificación (✅❌⚠️)
- Listado de directorios en producción
- Verificación de existencia de archivos
- Mensajes de error con guías de solución

### 📥 Instalación

1. **Descargar** `Sistema EXMC-Setup-2.0.0.exe` (~325 MB)
2. **Ejecutar** el instalador (puede requerir permisos de administrador)
3. **Esperar** que PostgreSQL se configure automáticamente
4. **Iniciar** desde el acceso directo del escritorio

### 🔧 Troubleshooting

Si encuentras problemas:
1. Consulta `DEBUGGING.md` en el repositorio
2. Ejecuta desde PowerShell para ver logs: `"C:\Program Files\Sistema EXMC\Sistema EXMC.exe"`
3. Verifica que el puerto 3001 esté disponible
4. Reinstala como Administrador si es necesario

### 📞 Contacto y Soporte

- **WhatsApp:** +54 2657580979
- **Instagram:** @devpuchito
- **GitHub:** github.com/lushosenpai/EXMC-Sistema

### 🎁 Obtener Código de Activación

Para activar tu licencia después del período de prueba:
1. Abre la aplicación
2. Copia tu **Machine ID** desde la ventana de activación
3. Contáctame por WhatsApp o Instagram con tu Machine ID
4. Recibirás tu código de activación personalizado

### 📋 Requisitos del Sistema

- **OS:** Windows 10/11 (64-bit)
- **RAM:** 4 GB mínimo
- **Espacio:** 500 MB libres
- **Puerto:** 3001 disponible

### 🔄 Cambios desde v1.0.0

- ➕ Sistema completo de licencias y activación
- ➕ Ventana de activación rediseñada (600x850)
- ➕ Contacto directo con desarrollador (WhatsApp/Instagram)
- ➕ Fallback a archivos locales si backend falla
- ➕ Logs exhaustivos para debugging
- ➕ Protección contra instancias múltiples
- ➕ Manejo robusto de errores
- ✅ Fix: Pantalla azul infinita
- ✅ Fix: Infinite loop al iniciar
- ✅ Fix: Backend no inicia correctamente
- ✅ Fix: Ventana nunca se muestra

---

**📦 Assets Incluidos:**
- `Sistema EXMC-Setup-2.0.0.exe` - Instalador completo para Windows
- `DEBUGGING.md` - Guía completa de troubleshooting

**⚠️ Nota:** Si actualizas desde v1.0.0, desinstala la versión anterior primero.

**🎉 ¡Gracias por usar Sistema EXMC!**
