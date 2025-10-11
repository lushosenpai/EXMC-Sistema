# 🚀 Guía de Instalación y Configuración - Sistema EXMC

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior ([Descargar](https://nodejs.org/))
- **PostgreSQL** versión 14 o superior ([Descargar](https://www.postgresql.org/download/))
- **npm** o **yarn** (viene con Node.js)
- Un editor de código (recomendado: VS Code)

## 🗄️ Paso 1: Configurar PostgreSQL

### 1.1 Crear la base de datos

Abre **pgAdmin** o usa la terminal de PostgreSQL:

```sql
CREATE DATABASE exmc_db;
```

### 1.2 Crear usuario (opcional)

Si quieres un usuario específico para la aplicación:

```sql
CREATE USER exmc_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE exmc_db TO exmc_user;
```

## 🔧 Paso 2: Configurar Backend

### 2.1 Navegar a la carpeta backend

```powershell
cd c:\xampp\htdocs\sitema-EXMC\backend
```

### 2.2 Instalar dependencias

```powershell
npm install
```

**Nota:** Este proceso puede tardar 2-3 minutos. Si aparecen warnings, puedes ignorarlos.

### 2.3 Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```powershell
cp .env.example .env
```

Luego edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/exmc_db"
JWT_SECRET="clave_secreta_super_segura_cambiar_en_produccion_2025"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Importante:** Reemplaza `tu_password` con la contraseña de tu PostgreSQL.

### 2.4 Generar cliente de Prisma

```powershell
npx prisma generate
```

### 2.5 Ejecutar migraciones de base de datos

```powershell
npx prisma migrate dev --name init
```

Este comando creará todas las tablas en la base de datos.

### 2.6 Cargar datos de ejemplo (seed)

```powershell
npx prisma db seed
```

Esto creará:
- 3 usuarios (admin, vendedor, consulta)
- 3 proveedores
- 15 productos de ejemplo
- 5 clientes
- Configuración inicial del sistema

### 2.7 Iniciar servidor backend

```powershell
npm run dev
```

Si todo está correcto, verás:

```
🚀 Server running on port 3001
📡 API URL: http://localhost:3001/api
🌍 Environment: development
```

**¡Deja esta terminal abierta! El backend debe estar corriendo.**

## ⚛️ Paso 3: Configurar Frontend

### 3.1 Abrir nueva terminal PowerShell

Abre una **segunda** terminal y navega a la carpeta frontend:

```powershell
cd c:\xampp\htdocs\sitema-EXMC\frontend
```

### 3.2 Instalar dependencias

```powershell
npm install
```

Este proceso también tarda 2-3 minutos.

### 3.3 Configurar variables de entorno

Crea un archivo `.env` en la carpeta `frontend/`:

```powershell
cp .env.example .env
```

El contenido por defecto es correcto:

```env
VITE_API_URL=http://localhost:3001/api
```

### 3.4 Iniciar aplicación frontend

```powershell
npm run dev
```

Verás algo como:

```
  VITE v5.0.11  ready in 850 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 🎉 Paso 4: Acceder al Sistema

### 4.1 Abrir navegador

Abre tu navegador preferido (Chrome, Edge, Firefox) y ve a:

```
http://localhost:5173
```

### 4.2 Iniciar sesión

Usa una de estas credenciales de prueba:

**Administrador:**
- Email: `admin@exmc.com`
- Contraseña: `admin123`

**Vendedor:**
- Email: `vendedor@exmc.com`
- Contraseña: `vendedor123`

**Consulta:**
- Email: `consulta@exmc.com`
- Contraseña: `consulta123`

## 🛠️ Comandos Útiles

### Backend

```powershell
# Ver la base de datos con Prisma Studio (interfaz visual)
npx prisma studio

# Reiniciar base de datos (⚠️ CUIDADO: borra todo)
npx prisma migrate reset

# Ver logs del servidor
npm run dev

# Compilar para producción
npm run build
npm start
```

### Frontend

```powershell
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview

# Ejecutar linter
npm run lint
```

## 🔍 Verificar Instalación

### Checklist de verificación:

- [ ] PostgreSQL está corriendo
- [ ] Base de datos `exmc_db` fue creada
- [ ] Backend responde en `http://localhost:3001/api/health`
- [ ] Frontend carga en `http://localhost:5173`
- [ ] Puedes iniciar sesión con las credenciales de prueba
- [ ] El dashboard muestra datos

### Probar endpoint de salud del backend:

Abre tu navegador y ve a:
```
http://localhost:3001/api/health
```

Deberías ver:
```json
{"status":"ok","message":"Server is running"}
```

## ❌ Solución de Problemas Comunes

### Error: "Cannot connect to PostgreSQL"

**Solución:**
1. Verifica que PostgreSQL está corriendo
2. Comprueba la URL de conexión en `backend/.env`
3. Verifica usuario y contraseña

### Error: "Port 3001 already in use"

**Solución:**
```powershell
# Encuentra el proceso usando el puerto
netstat -ano | findstr :3001

# Mata el proceso (reemplaza PID con el número que aparece)
taskkill /PID [PID] /F

# O cambia el puerto en backend/.env
PORT=3002
```

### Error: "Module not found"

**Solución:**
```powershell
# Borra node_modules y reinstala
rm -r node_modules
rm package-lock.json
npm install
```

### Error: "Prisma Client not generated"

**Solución:**
```powershell
cd backend
npx prisma generate
```

### Frontend no carga estilos

**Solución:**
```powershell
cd frontend
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm run dev
```

### Error de CORS en el frontend

**Solución:**
Verifica que `FRONTEND_URL` en `backend/.env` sea:
```
FRONTEND_URL=http://localhost:5173
```

## 📝 Estructura de Archivos Importantes

```
sitema-EXMC/
├── backend/
│   ├── .env                    # Configuración de backend
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos de base de datos
│   │   └── seed.ts             # Datos de ejemplo
│   ├── src/
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── routes/             # Rutas de API
│   │   └── middleware/         # Autenticación, etc.
│   └── package.json
│
└── frontend/
    ├── .env                    # Configuración de frontend
    ├── src/
    │   ├── api/                # Servicios API
    │   ├── pages/              # Páginas de la aplicación
    │   ├── components/         # Componentes React
    │   ├── store/              # Estado global (Zustand)
    │   └── App.tsx             # Componente principal
    └── package.json
```

## 🔒 Seguridad

### Para producción:

1. **Cambia el JWT_SECRET** en `backend/.env`
2. **Usa HTTPS** (certificado SSL)
3. **Cambia las contraseñas** por defecto
4. **Configura un firewall**
5. **Habilita rate limiting** (ya incluido)
6. **Usa variables de entorno** seguras
7. **Actualiza dependencias** regularmente

## 📚 Recursos Adicionales

- [Documentación de Prisma](https://www.prisma.io/docs/)
- [React Query](https://tanstack.com/query/latest)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand/)

## 💡 Próximos Pasos

Una vez instalado, puedes:

1. **Explorar el dashboard** - Ver estadísticas en tiempo real
2. **Agregar productos** - Ir a Productos > Nuevo Producto
3. **Crear clientes** - Gestionar tu base de clientes
4. **Realizar una venta** - Ir a Ventas > Nueva Venta
5. **Generar reportes** - Ver historial y descargar PDFs

## 🤝 Soporte

Si encuentras problemas:

1. Revisa esta guía completa
2. Verifica los logs de la consola
3. Comprueba que ambos servidores estén corriendo
4. Reinicia ambos servidores
5. Verifica la conexión a PostgreSQL

---

**¡Felicidades! Tu sistema EXMC está listo para usar.** 🎉

*Desarrollado con ❤️ para gestión comercial profesional*
