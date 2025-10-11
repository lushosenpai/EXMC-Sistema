# 🚀 INICIO RÁPIDO - Sistema EXMC

## ⚡ Instalación Express (Primera vez)

### 1. Backend (Terminal 1)
```powershell
cd c:\xampp\htdocs\sitema-EXMC\backend
npm install
cp .env.example .env
# ⚠️ EDITAR .env con tus credenciales de PostgreSQL
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 2. Frontend (Terminal 2)
```powershell
cd c:\xampp\htdocs\sitema-EXMC\frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Acceder
Abrir navegador: **http://localhost:5173**

Credenciales: `admin@exmc.com` / `admin123`

---

## 🔄 Inicio Diario (después de instalación)

### Terminal 1 - Backend:
```powershell
cd c:\xampp\htdocs\sitema-EXMC\backend
npm run dev
```

### Terminal 2 - Frontend:
```powershell
cd c:\xampp\htdocs\sitema-EXMC\frontend
npm run dev
```

---

## 🗄️ Configuración PostgreSQL Rápida

### Crear base de datos:
```sql
CREATE DATABASE exmc_db;
```

### En backend/.env cambiar:
```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/exmc_db"
```

---

## 🆘 Comandos de Emergencia

### Resetear base de datos:
```powershell
cd backend
npx prisma migrate reset
npx prisma db seed
```

### Regenerar Prisma Client:
```powershell
cd backend
npx prisma generate
```

### Ver base de datos (Prisma Studio):
```powershell
cd backend
npx prisma studio
```

### Limpiar caché y reinstalar:
```powershell
# Backend
cd backend
rm -r -fo node_modules
rm package-lock.json
npm install

# Frontend
cd ..\frontend
rm -r -fo node_modules
rm package-lock.json
npm install
```

---

## ✅ URLs Importantes

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health
- **Prisma Studio:** http://localhost:5555

---

## 👥 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@exmc.com | admin123 |
| Vendedor | vendedor@exmc.com | vendedor123 |
| Consulta | consulta@exmc.com | consulta123 |

---

## 🔥 Soluciones Rápidas

### Backend no inicia:
```powershell
cd backend
npx prisma generate
npm run dev
```

### Frontend no carga:
```powershell
cd frontend
rm -r -fo node_modules
npm install
npm run dev
```

### Puerto ocupado:
```powershell
# Ver qué usa el puerto 3001
netstat -ano | findstr :3001

# Matar proceso (reemplazar PID)
taskkill /PID [número] /F
```

---

## 📦 Tecnologías Incluidas

**Backend:**
- ✅ Node.js + Express + TypeScript
- ✅ Prisma ORM + PostgreSQL
- ✅ JWT Authentication
- ✅ Upload de imágenes
- ✅ Generación de PDF
- ✅ Validaciones con Zod

**Frontend:**
- ✅ React 18 + Vite
- ✅ TailwindCSS (tema oscuro)
- ✅ Zustand (estado global)
- ✅ React Query (data fetching)
- ✅ React Router (navegación)
- ✅ Framer Motion (animaciones)
- ✅ Recharts (gráficos)
- ✅ React Hot Toast (notificaciones)

---

**¿Dudas?** Consulta `INSTALACION.md` para la guía completa.

**¡Sistema listo para usar!** 🎉
