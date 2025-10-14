# 🔧 Corrección de Referencias a PostgreSQL

## ✅ Cambios Realizados

### 1. Archivo `.env` del Backend
**Problema:** El archivo `.env` todavía tenía configurada la URL de PostgreSQL
```bash
# ANTES (incorrecto)
DATABASE_URL="postgresql://postgres:lucho1996@localhost:5432/exmc_db"

# DESPUÉS (correcto)
DATABASE_URL="file:./prisma/dev.db"
```

### 2. Archivo `.env.example` del Backend
**Problema:** El ejemplo también tenía PostgreSQL
```bash
# ANTES (incorrecto)
DATABASE_URL="postgresql://usuario:password@localhost:5432/exmc_db"

# DESPUÉS (correcto)
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Archivo `seed.ts`
**Problema:** El seed usaba enums (Role, AccountType) que ya no existen en SQLite
```typescript
// ANTES (incorrecto)
import { PrismaClient, Role, AccountType } from '@prisma/client';
role: Role.ADMIN
accountType: AccountType.EFECTIVO

// DESPUÉS (correcto)
import { PrismaClient } from '@prisma/client';
role: 'ADMIN'
accountType: 'EFECTIVO'
```

### 4. Base de Datos Sincronizada
Se ejecutaron los siguientes comandos:
```bash
npx prisma db push      # Sincronizar esquema
npx prisma generate     # Regenerar cliente Prisma
npx ts-node prisma/seed.ts  # Crear datos iniciales
```

## 📝 Credenciales de Acceso

**Usuario Administrador:**
- Email: `admin@exmc.com`
- Password: `admin123`

**Usuario Vendedor:**
- Email: `vendedor@exmc.com`
- Password: `vendedor123`

**Usuario Consulta:**
- Email: `consulta@exmc.com`
- Password: `consulta123`

## 🚀 Cómo Iniciar la Aplicación

### Desarrollo:

1. **Backend:**
   ```bash
   cd backend
   node dist/index.js
   ```
   O con nodemon:
   ```bash
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Producción (Electron):

Simplemente ejecuta el instalador `.exe` que se genera con:
```bash
npm run build
```

## ✅ Verificación

El backend debe mostrar:
```
🚀 Server running on port 3001
📡 API URL: http://localhost:3001/api
🌍 Environment: development
```

## 🗄️ Ubicación de la Base de Datos

### Desarrollo:
- `backend/prisma/dev.db`

### Producción (Electron):
- Windows: `%APPDATA%/sistema-exmc/data/exmc.db`

## ⚠️ Importante

Ya NO necesitas:
- ❌ PostgreSQL instalado
- ❌ Crear bases de datos manualmente
- ❌ Configurar puertos de PostgreSQL
- ❌ Usuario/contraseña de base de datos

Todo funciona con SQLite que es un archivo local portable.

## 🔍 Archivos Modificados

1. `backend/.env` - Configuración de base de datos
2. `backend/.env.example` - Ejemplo de configuración
3. `backend/prisma/seed.ts` - Script de datos iniciales
4. Base de datos regenerada completamente

## 📌 Próximos Pasos

Si sigues viendo errores:
1. Cierra completamente la aplicación
2. Elimina `backend/prisma/dev.db`
3. Ejecuta nuevamente:
   ```bash
   cd backend
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```
4. Reinicia el backend

---

**Fecha de corrección:** 14 de octubre, 2025
**Estado:** ✅ Completado y verificado
