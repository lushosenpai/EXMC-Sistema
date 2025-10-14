# 🔧 Guía de Solución de Problemas - Sistema EXMC

## ❌ Error: "The table 'main.users' does not exist"

### Causa
El archivo `.env` no está configurado correctamente o la base de datos no está sincronizada.

### Solución
```bash
cd backend

# 1. Verificar que .env tenga la URL correcta
echo DATABASE_URL="file:./prisma/dev.db" > .env

# 2. Sincronizar la base de datos
npx prisma db push

# 3. Generar el cliente de Prisma
npx prisma generate

# 4. Crear datos iniciales
npx ts-node prisma/seed.ts

# 5. Recompilar
npm run build
```

---

## ❌ Error al iniciar sesión

### Causa
No hay usuarios en la base de datos o las credenciales son incorrectas.

### Solución
```bash
cd backend

# Recrear datos de prueba
npx ts-node prisma/seed.ts
```

**Credenciales por defecto:**
- Email: `admin@exmc.com`
- Password: `admin123`

---

## ❌ Backend no inicia / Puerto en uso

### Causa
El puerto 3001 está siendo usado por otro proceso.

### Solución Opción 1: Cambiar Puerto
Editar `backend/.env`:
```bash
PORT=3002
```

### Solución Opción 2: Liberar Puerto
```powershell
# Ver qué proceso usa el puerto 3001
netstat -ano | findstr :3001

# Matar el proceso (reemplazar <PID> con el número que aparece)
taskkill /PID <PID> /F
```

---

## ❌ Error: Cannot find module '@prisma/client'

### Causa
El cliente de Prisma no está generado.

### Solución
```bash
cd backend
npm install
npx prisma generate
```

---

## ❌ Frontend no conecta con el backend

### Causa
El frontend no tiene la URL correcta del backend.

### Solución
Verificar `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3001/api
```

Si el puerto del backend cambió, actualizar aquí también.

---

## ❌ Base de datos corrupta o con errores

### Causa
La base de datos SQLite puede estar corrupta.

### Solución
```bash
cd backend

# 1. Eliminar la base de datos actual
rm prisma/dev.db
rm prisma/dev.db-journal

# 2. Recrear desde cero
npx prisma db push
npx ts-node prisma/seed.ts
```

---

## ❌ Error: "Prisma schema loaded but datasource 'db' uses provider 'postgresql'"

### Causa
El archivo `schema.prisma` todavía apunta a PostgreSQL.

### Solución
Editar `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"    // ✅ Debe ser sqlite
  url      = env("DATABASE_URL")
}
```

Luego ejecutar:
```bash
npx prisma generate
npx prisma db push
```

---

## ❌ Electron no inicia o muestra pantalla en blanco

### Causa
El backend o frontend no están compilados correctamente.

### Solución
```bash
# Compilar backend
cd backend
npm run build

# Compilar frontend  
cd ../frontend
npm run build

# Iniciar Electron
cd ..
npm run dev
```

---

## ❌ Error: "Module parse failed" o errores de TypeScript

### Causa
Los archivos no están compilados.

### Solución
```bash
# Recompilar backend
cd backend
npm run build

# Limpiar caché de node_modules si es necesario
rm -rf node_modules
npm install
npm run build
```

---

## 🔄 Reiniciar Todo desde Cero

Si nada funciona, usar este proceso:

```bash
# 1. Backend
cd backend
rm -rf node_modules
rm -rf dist
rm prisma/dev.db
npm install
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts
npm run build

# 2. Frontend
cd ../frontend
rm -rf node_modules
rm -rf dist
npm install
npm run build

# 3. Raíz del proyecto
cd ..
rm -rf node_modules
npm install
```

---

## 📋 Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] `backend/.env` tiene `DATABASE_URL="file:./prisma/dev.db"`
- [ ] Existe el archivo `backend/prisma/dev.db`
- [ ] Existe el archivo `backend/dist/index.js`
- [ ] El backend inicia sin errores en `http://localhost:3001`
- [ ] `frontend/.env` tiene `VITE_API_URL=http://localhost:3001/api`
- [ ] No hay otro proceso usando el puerto 3001
- [ ] Las credenciales son correctas: `admin@exmc.com` / `admin123`

---

## 🛠️ Comandos Útiles

### Ver logs del backend
```bash
cd backend
node dist/index.js
```

### Ver qué puertos están en uso
```powershell
netstat -ano | findstr :3001
netstat -ano | findstr :5173
```

### Verificar contenido de la base de datos
```bash
cd backend
npx prisma studio
```
Esto abre una interfaz web en `http://localhost:5555` para ver y editar los datos.

### Resetear la base de datos
```bash
cd backend
npx prisma migrate reset --skip-seed
npx ts-node prisma/seed.ts
```

---

## 📞 Información de Debug

Si necesitas ayuda, proporciona esta información:

```bash
# Sistema operativo
echo $env:OS

# Versión de Node
node --version

# Versión de npm
npm --version

# Estado del backend
cd backend
cat .env | findstr DATABASE_URL
ls prisma/dev.db
ls dist/index.js

# Puertos en uso
netstat -ano | findstr :3001
```

---

**Última actualización:** 14 de octubre, 2025  
**Versión del sistema:** 2.0.0
