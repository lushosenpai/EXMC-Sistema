# 🔄 Alternativa: Usar MySQL con XAMPP

Si no quieres instalar PostgreSQL, puedes usar MySQL que ya viene con XAMPP.

## 🚀 Pasos para cambiar a MySQL:

### 1️⃣ Modificar `backend/prisma/schema.prisma`

Cambiar la línea 8:
```prisma
// DE ESTO:
provider = "postgresql"

// A ESTO:
provider = "mysql"
```

### 2️⃣ Modificar `backend/.env`

Cambiar la línea 10:
```env
# DE ESTO:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/exmc_db"

# A ESTO (sin contraseña por defecto en XAMPP):
DATABASE_URL="mysql://root@localhost:3306/exmc_db"

# O con contraseña si la configuraste:
DATABASE_URL="mysql://root:tu_password@localhost:3306/exmc_db"
```

### 3️⃣ Crear base de datos en XAMPP

1. Iniciar XAMPP y activar MySQL
2. Abrir phpMyAdmin: http://localhost/phpmyadmin
3. Crear nueva base de datos llamada: `exmc_db`
4. Collation: `utf8mb4_general_ci`

### 4️⃣ Reinstalar y migrar

```powershell
cd c:\xampp\htdocs\sitema-EXMC\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### ⚠️ Diferencias MySQL vs PostgreSQL:

- MySQL no tiene tipos `JSONB` (usa `JSON`)
- Algunas funciones avanzadas pueden variar
- El 95% del sistema funcionará igual

### ✅ Ventajas de usar MySQL con XAMPP:

- Ya lo tienes instalado
- Interfaz gráfica con phpMyAdmin
- Más familiar si usas XAMPP
- Configuración más rápida

### 📝 Nota:

El código está optimizado para PostgreSQL pero Prisma hace la conversión automática a MySQL sin problemas.
