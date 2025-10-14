# 📦 Guía de Compilación y Distribución - Sistema EXMC

## ✅ Estado Actual

La aplicación está funcionando correctamente en modo desarrollo con Electron.
Ahora vamos a compilarla para distribución en otros PCs.

## 🔧 Configuración para Máxima Compatibilidad

### Tecnologías Utilizadas:
- **Electron**: Aplicación de escritorio multiplataforma
- **SQLite**: Base de datos portable (no requiere instalación)
- **Node.js embebido**: Incluido en Electron (no requiere instalación)
- **ASAR**: Empaquetado de archivos para protección y performance

### Ventajas de Esta Configuración:
✅ **Un solo archivo .exe** - Instalador completo
✅ **No requiere dependencias** - Todo está incluido
✅ **Base de datos portable** - Se crea automáticamente
✅ **Sin configuración** - Funciona recién instalado
✅ **Compatible** - Windows 7, 8, 10, 11 (64-bit)
✅ **Actualizable** - Sistema de versiones integrado

## 📋 Pasos para Compilar

### 1. Compilar Backend y Frontend

```bash
cd c:\xampp\htdocs\sitema-EXMC

# Compilar todo (backend + frontend)
npm run build:all
```

Este comando ejecuta:
- `cd backend && npm run build` - Compila TypeScript a JavaScript
- `cd frontend && npm run build` - Compila React con Vite

### 2. Compilar el Instalador de Electron

```bash
# Compilar solo para Windows 64-bit
npm run electron:build:win
```

**Tiempo estimado**: 3-5 minutos (primera vez puede ser más)

**Resultado**:
- Instalador: `dist-electron/Sistema EXMC-Setup-2.0.0.exe`
- Tamaño aproximado: ~150-200 MB

## 📦 Qué Incluye el Instalador

El instalador `.exe` incluye:

1. **Aplicación Electron** (ventana de escritorio)
2. **Backend API** (servidor Express)
3. **Frontend React** (interfaz de usuario)
4. **Node.js embebido** (runtime de Electron)
5. **SQLite** (sistema de base de datos)
6. **Todas las dependencias** (node_modules)

## 💾 Ubicaciones en el PC del Usuario

### Instalación del Programa:
```
C:\Users\[Usuario]\AppData\Local\Programs\sistema-exmc\
```

### Datos de la Aplicación:
```
C:\Users\[Usuario]\AppData\Roaming\sistema-exmc\
├── data\
│   └── exmc.db          # Base de datos SQLite
├── logs\                 # Logs de la aplicación
└── licenses\             # Licencias de activación
```

### Accesos Directos:
- Escritorio: `Sistema EXMC.lnk`
- Menú Inicio: `Sistema EXMC`

## 🚀 Proceso de Instalación en Otro PC

### Requisitos del PC de Destino:
- ✅ Windows 7 / 8 / 10 / 11 (64-bit)
- ✅ ~500 MB de espacio en disco
- ✅ Sin otras dependencias necesarias

### Pasos de Instalación:

1. **Ejecutar el instalador**
   - Doble clic en `Sistema EXMC-Setup-2.0.0.exe`

2. **Seguir el asistente**
   - Elegir carpeta de instalación (opcional)
   - Crear acceso directo en escritorio (recomendado)
   - Instalar

3. **Primera Ejecución**
   - La aplicación se inicia automáticamente
   - Se crea la base de datos en `%APPDATA%`
   - Sistema de licencias verifica activación

4. **Activación** (si se requiere)
   - Ingresar código de licencia
   - O usar período de prueba

5. **Iniciar Sesión**
   - Email: `admin@exmc.com`
   - Password: `admin123`

## 🔑 Sistema de Licencias

### Tipos de Licencia:
- **Trial**: 30 días de prueba
- **Lifetime**: Licencia permanente

### Verificación:
La licencia se vincula al hardware del PC mediante:
- Machine ID único
- Almacenamiento encriptado local

## ⚙️ Configuración Avanzada

### Desactivar Sistema de Licencias:

Si quieres distribuir sin licencias, edita `electron/main.js`:

```javascript
// Comentar o modificar la función checkLicenseStatus
async function checkLicenseStatus() {
  // return true; // Siempre permitir acceso
  const status = licenseManager.checkLicense();
  // ... resto del código
}
```

### Cambiar Puerto del Backend:

Edita `electron/main.js`:

```javascript
const BACKEND_PORT = 3001; // Cambiar a otro puerto si es necesario
```

### Personalizar Base de Datos Inicial:

Edita `backend/prisma/seed.ts` para incluir datos específicos de tu cliente.

## 🐛 Solución de Problemas en PCs de Destino

### Problema: "Windows protegió tu PC"

**Causa**: Windows SmartScreen bloquea ejecutables sin firma digital.

**Solución para el usuario**:
1. Clic en "Más información"
2. Clic en "Ejecutar de todas formas"

**Solución para el desarrollador** (opcional):
- Firmar el ejecutable con certificado de código
- Costo: ~$100-300 USD/año
- Proveedores: DigiCert, Sectigo, GlobalSign

### Problema: Antivirus bloquea la instalación

**Causa**: Falso positivo por ejecutable sin firma.

**Solución**:
1. Agregar excepción en el antivirus
2. Firmar el ejecutable (recomendado para producción)

### Problema: "La aplicación no se inicia"

**Causa**: Conflicto de puertos o permisos.

**Solución**:
1. Ejecutar como administrador (primera vez)
2. Verificar firewall de Windows
3. Revisar logs en: `%APPDATA%\sistema-exmc\logs\`

## 📊 Tamaños de Archivos

### Durante Desarrollo:
- Backend compilado: ~10 MB
- Frontend compilado: ~5 MB
- node_modules: ~300 MB

### En Producción (Instalador):
- Instalador .exe: ~150-200 MB
- Instalado en disco: ~250-300 MB
- Base de datos vacía: ~100 KB

## 🔄 Actualizaciones

### Para Usuarios:
1. Descargar nuevo instalador
2. Ejecutar (sobrescribe la versión anterior)
3. Los datos se mantienen en `%APPDATA%`

### Sistema de Auto-Update (Opcional):

Para implementar actualizaciones automáticas:

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

## ✅ Checklist Pre-Distribución

Antes de enviar el instalador a clientes:

- [ ] Backend compilado sin errores
- [ ] Frontend compilado sin errores
- [ ] Base de datos funcional
- [ ] Sistema de licencias configurado
- [ ] Credenciales por defecto documentadas
- [ ] Icono de la aplicación correcto
- [ ] Versión actualizada en `package.json`
- [ ] Instalador probado en PC limpio
- [ ] Desinstalación funciona correctamente
- [ ] No quedan archivos huérfanos

## 📝 Personalización para Cliente

### Cambiar Credenciales por Defecto:

Edita `backend/prisma/seed.ts`:

```typescript
await prisma.user.create({
  data: {
    email: 'admin@cliente.com',  // Cambiar aquí
    password: hashedPassword,     // Hash de 'nuevapass123'
    name: 'Administrador Cliente',
    role: 'ADMIN',
  },
});
```

### Cambiar Nombre y Logo:

1. **Nombre**: `package.json` → `productName`
2. **Logo**: Reemplazar `electron/assets/icon.ico`
3. **Splash**: Reemplazar `electron/assets/logo.png`

### Cambiar URL de Ayuda/Soporte:

Edita los archivos en `frontend/src/` con las URLs del cliente.

## 🎯 Comandos Rápidos

```bash
# Desarrollo completo
npm run electron:dev

# Solo compilar backend
npm run build:backend

# Solo compilar frontend
npm run build:frontend

# Compilar instalador
npm run electron:build:win

# Limpiar todo y recompilar
rm -rf dist-electron
npm run build:all
npm run electron:build:win
```

---

**Fecha**: 14 de octubre, 2025  
**Versión**: 2.0.0  
**Compilador**: Electron Builder  
**Compatibilidad**: Windows 7+ (64-bit)
