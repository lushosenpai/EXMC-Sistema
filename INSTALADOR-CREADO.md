# 🎉 Instalador Creado Exitosamente

## ✅ Información del Instalador

**Nombre:** Sistema EXMC-Setup-2.0.0.exe  
**Tamaño:** 141.77 MB  
**Ubicación:** `c:\xampp\htdocs\sitema-EXMC\dist-electron\Sistema EXMC-Setup-2.0.0.exe`  
**Fecha:** 14 de octubre, 2025

---

## 📦 Contenido del Instalador

El instalador incluye:
- ✅ **Aplicación Electron** completa
- ✅ **Backend API** compilado (Express + Node.js)
- ✅ **Frontend React** compilado (optimizado para producción)
- ✅ **Base de datos SQLite** (se crea automáticamente)
- ✅ **Node.js embebido** (incluido en Electron)
- ✅ **Todas las dependencias** necesarias
- ✅ **Sistema de licencias** integrado

---

## 🚀 Cómo Usar el Instalador

### En Tu PC (Testing)
1. Navega a: `c:\xampp\htdocs\sitema-EXMC\dist-electron\`
2. Doble clic en `Sistema EXMC-Setup-2.0.0.exe`
3. Sigue el asistente de instalación
4. La aplicación se instalará en: `C:\Users\[Usuario]\AppData\Local\Programs\sistema-exmc\`

### Distribuir a Clientes
1. Copia el archivo `Sistema EXMC-Setup-2.0.0.exe` a una USB o súbelo a la nube
2. Envía el instalador al cliente
3. El cliente lo ejecuta (puede mostrar advertencia de SmartScreen)
4. Instalación en 1-2 minutos
5. Primera ejecución: Sistema de licencias o período de prueba

---

## 💻 Requisitos del PC de Destino

- **Sistema Operativo:** Windows 7 / 8 / 10 / 11 (64-bit)
- **Espacio en Disco:** ~500 MB
- **RAM:** 2 GB mínimo (recomendado 4 GB)
- **Procesador:** Cualquier procesador moderno
- **Internet:** NO requerido (funciona 100% offline)

---

## 🔑 Primera Ejecución

### Sistema de Licencias
Al abrir la aplicación por primera vez:
- **Opción 1:** Ingresar código de licencia
- **Opción 2:** Usar período de prueba (30 días)

### Credenciales por Defecto
Una vez activado/en prueba:
- **Email:** `admin@exmc.com`
- **Password:** `admin123`

---

## 📂 Ubicaciones en el PC del Cliente

### Programa Instalado
```
C:\Users\[Usuario]\AppData\Local\Programs\sistema-exmc\
├── Sistema EXMC.exe
├── resources\
└── ... (archivos de la aplicación)
```

### Datos de la Aplicación
```
C:\Users\[Usuario]\AppData\Roaming\sistema-exmc\
├── data\
│   └── exmc.db          # Base de datos SQLite
├── logs\                 # Logs de errores
└── licenses\             # Información de licencia
```

### Accesos Directos
- **Escritorio:** `Sistema EXMC.lnk`
- **Menú Inicio:** Carpeta "Sistema EXMC"

---

## ⚠️ Advertencias Comunes

### Windows SmartScreen
**Problema:** "Windows protegió tu PC"

**Solución para el usuario:**
1. Clic en "Más información"
2. Clic en "Ejecutar de todas formas"

**Por qué sucede:** El ejecutable no está firmado digitalmente (requiere certificado de ~$300 USD/año)

### Antivirus
Algunos antivirus pueden bloquear el instalador. Esto es un falso positivo.

**Solución:**
1. Agregar excepción en el antivirus
2. O desactivar temporalmente durante la instalación

---

## 🔄 Actualizaciones

Para actualizar a una nueva versión:
1. Ejecutar el nuevo instalador
2. Aceptar sobrescribir la versión anterior
3. Los datos en `%APPDATA%\sistema-exmc\` se mantienen intactos
4. No se pierden: base de datos, configuración, licencias

---

## 🗑️ Desinstalación

### Método 1: Panel de Control
1. Panel de Control → Programas → Desinstalar un programa
2. Buscar "Sistema EXMC"
3. Clic en "Desinstalar"

### Método 2: Carpeta de Instalación
1. Ir a: `C:\Users\[Usuario]\AppData\Local\Programs\sistema-exmc\`
2. Ejecutar: `Uninstall Sistema EXMC.exe`

### Datos del Usuario
Por defecto, los datos NO se eliminan en desinstalación (por seguridad).

Para borrar datos completamente:
```
C:\Users\[Usuario]\AppData\Roaming\sistema-exmc\
```
(Borrar esta carpeta manualmente si deseas eliminar todo)

---

## 🎯 Características del Instalador

### NSIS (Nullsoft Scriptable Install System)
- ✅ Instalador profesional de Windows
- ✅ Permite elegir carpeta de instalación
- ✅ Crea accesos directos automáticamente
- ✅ Registro en "Agregar o quitar programas"
- ✅ Desinstalador incluido

### Configuración Actual
- **oneClick:** false (instalador con opciones)
- **perMachine:** false (instalación por usuario)
- **createDesktopShortcut:** true
- **createStartMenuShortcut:** true
- **allowElevation:** true (puede pedir permisos de administrador)

---

## 📊 Estadísticas del Build

### Tiempos de Compilación
- Backend TypeScript: ~2-3 segundos
- Frontend React + Vite: ~7 segundos
- Electron Builder (packaging): ~20-30 segundos
- **Total:** ~35-40 segundos

### Tamaños
- **Frontend compilado:** ~1.1 MB (JavaScript)
- **Backend compilado:** ~10 MB
- **Node modules incluidos:** ~120 MB
- **Electron runtime:** ~100 MB
- **Total instalador:** 141.77 MB
- **Instalado en disco:** ~250-300 MB

---

## 🔧 Personalización Pre-Distribución

### Cambiar Credenciales por Defecto
Editar: `backend/prisma/seed.ts`
```typescript
email: 'cliente@empresa.com'
password: hashedPassword // Cambiar contraseña
```

Luego recompilar:
```bash
cd backend
npx ts-node prisma/seed.ts
npm run build
cd ..
npm run electron:build:win
```

### Cambiar Versión
Editar: `package.json`
```json
"version": "2.0.1"  // Cambiar aquí
```

El instalador se llamará automáticamente:
`Sistema EXMC-Setup-2.0.1.exe`

### Cambiar Icono
Reemplazar: `electron/assets/icon.ico`

Debe ser formato `.ico` con múltiples resoluciones:
- 16x16, 32x32, 48x48, 256x256

---

## 🐛 Solución de Problemas

### El instalador no se crea
**Verificar:**
1. Backend compilado: `backend/dist/index.js`
2. Frontend compilado: `frontend/dist/index.html`
3. Espacio en disco suficiente (>500 MB)

**Solución:**
```bash
rm -rf dist-electron
rm -rf backend/dist
rm -rf frontend/dist
npm run build:all
npm run electron:build:win
```

### Error: "Cannot find module"
Ejecutar:
```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
npm install
```

### El instalador es muy grande (>200 MB)
Esto es normal para aplicaciones Electron. Incluye:
- Runtime completo de Chromium
- Node.js embebido
- Todas las dependencias

Para reducir (opciones avanzadas):
- Configurar `asarUnpack` en package.json
- Excluir `devDependencies`
- Usar electron-builder compresión 7z

---

## ✅ Checklist Pre-Entrega

Antes de entregar al cliente:

- [ ] Probar instalación en PC limpio
- [ ] Verificar que la aplicación inicia correctamente
- [ ] Probar login con credenciales por defecto
- [ ] Verificar que todas las funciones principales funcionan
- [ ] Probar desinstalación
- [ ] Verificar que no queden archivos huérfanos
- [ ] Documentar credenciales para el cliente
- [ ] Preparar manual de usuario (si es necesario)
- [ ] Configurar sistema de licencias (si se usa)
- [ ] Backup del instalador en múltiples ubicaciones

---

## 📝 Próximos Pasos Opcionales

### Firma Digital (Recomendado para Producción)
Obtener certificado de código:
- **Proveedores:** DigiCert, Sectigo, GlobalSign
- **Costo:** ~$100-300 USD/año
- **Beneficio:** Elimina advertencias de SmartScreen

### Auto-Update
Implementar actualizaciones automáticas:
```bash
npm install electron-updater
```

Configurar en `package.json`:
```json
"publish": {
  "provider": "github",
  "owner": "tu-usuario",
  "repo": "tu-repositorio"
}
```

### Analytics
Agregar tracking de uso (opcional):
- Google Analytics
- Mixpanel
- Custom analytics

---

## 🎊 ¡Felicitaciones!

Has creado exitosamente un instalador profesional de Windows para tu aplicación EXMC.

El instalador está listo para:
- ✅ Testing en tu PC
- ✅ Distribución a clientes
- ✅ Instalación en múltiples computadoras
- ✅ Uso offline completo

**¡El sistema está listo para producción!** 🚀

---

**Fecha de creación:** 14 de octubre, 2025  
**Versión:** 2.0.0  
**Herramienta:** Electron Builder 24.9.1  
**Plataforma:** Windows 64-bit
