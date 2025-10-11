# 🗄️ Crear Base de Datos para EXMC

## Opción 1: Usando pgAdmin 4 (Interfaz Gráfica)

### 1️⃣ Abrir pgAdmin 4
```
Buscar en Windows: "pgAdmin 4"
O desde: Menú Inicio → PostgreSQL → pgAdmin 4
```

### 2️⃣ Conectar al Servidor
- Al abrir te pedirá la **contraseña maestra** que configuraste durante la instalación
- Ingresa la contraseña de PostgreSQL

### 3️⃣ Crear Base de Datos
1. En el panel izquierdo, expandir: **Servers → PostgreSQL 16 (o la versión que instalaste)**
2. Click derecho en **"Databases"**
3. Seleccionar: **Create → Database...**
4. Llenar el formulario:
   - **Database name:** `exmc_db`
   - **Owner:** `postgres`
   - **Encoding:** `UTF8`
   - **Template:** `template0`
   - **Collation:** `C` (o dejar por defecto)
5. Click en **"Save"**

### ✅ ¡Base de datos creada!

---

## Opción 2: Usando SQL Shell (psql)

### 1️⃣ Abrir SQL Shell (psql)
```
Buscar en Windows: "SQL Shell (psql)"
O desde: Menú Inicio → PostgreSQL → SQL Shell
```

### 2️⃣ Conectar (presiona Enter en todo hasta password)
```
Server [localhost]: [ENTER]
Database [postgres]: [ENTER]  
Port [5432]: [ENTER]
Username [postgres]: [ENTER]
Password: [INGRESA TU CONTRASEÑA]
```

### 3️⃣ Crear base de datos
```sql
CREATE DATABASE exmc_db;
```

### 4️⃣ Verificar creación
```sql
\l
```
Deberías ver `exmc_db` en la lista.

### 5️⃣ Salir
```sql
\q
```

### ✅ ¡Base de datos creada!

---

## Opción 3: Desde PowerShell (Si psql está en PATH)

```powershell
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE exmc_db;

# Verificar
\l

# Salir
\q
```

---

## 🔍 Verificar que PostgreSQL esté corriendo

### Windows (Services)
```powershell
# Ver estado del servicio
Get-Service -Name postgresql*
```

O manualmente:
1. Presiona `Win + R`
2. Escribe: `services.msc`
3. Busca: "postgresql-x64-16" (o tu versión)
4. Estado debe ser: **"Running"** (En ejecución)

Si NO está corriendo:
- Click derecho → **"Start"** (Iniciar)

---

## 📝 Después de crear la base de datos

### 1️⃣ Verificar que el archivo .env tenga los datos correctos

Editar: `c:\xampp\htdocs\sitema-EXMC\backend\.env`

```env
# Cambiar "postgres:postgres" si tu usuario/password es diferente
DATABASE_URL="postgresql://postgres:TU_PASSWORD_AQUI@localhost:5432/exmc_db"
```

### 2️⃣ Ejecutar instalación

```powershell
cd c:\xampp\htdocs\sitema-EXMC
.\instalar.bat
```

---

## ❗ Solución de Problemas

### Error: "FATAL: password authentication failed"
**Solución:** Contraseña incorrecta en .env
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD_CORRECTA@localhost:5432/exmc_db"
```

### Error: "database 'exmc_db' does not exist"
**Solución:** No creaste la base de datos todavía, seguir pasos de arriba

### Error: "could not connect to server"
**Solución:** PostgreSQL no está corriendo
1. Abrir servicios: `services.msc`
2. Buscar: "postgresql"
3. Iniciar el servicio

---

## ✅ Checklist Final

- [ ] PostgreSQL instalado
- [ ] Servicio PostgreSQL corriendo
- [ ] Base de datos `exmc_db` creada
- [ ] Contraseña correcta en `.env`
- [ ] Listo para ejecutar `.\instalar.bat`

---

## 🆘 ¿Necesitas ayuda?

Revisa: `INSTALACION.md` para guía detallada completa
