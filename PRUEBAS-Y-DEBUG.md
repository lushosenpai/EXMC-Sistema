# 🧪 Guía de Pruebas del Sistema EXMC

## ✅ Verificación de Funcionamiento

### 1️⃣ **Verificar Servidores**

#### Backend (Puerto 3001):
```powershell
# Probar health check
Invoke-WebRequest -Uri "http://localhost:3001/api/health"
# Debería devolver: {"status":"ok","message":"Server is running"}
```

#### Frontend (Puerto 5173):
```
Abrir en navegador: http://localhost:5173
```

---

### 2️⃣ **Probar Login**

#### Credenciales de Prueba:

| Rol | Email | Password |
|-----|-------|----------|
| **Admin** | admin@exmc.com | admin123 |
| **Vendedor** | vendedor@exmc.com | vendedor123 |
| **Consulta** | consulta@exmc.com | consulta123 |

#### Pasos:
1. Abrir http://localhost:5173
2. Ingresar email y password
3. Click en "Iniciar Sesión"
4. Deberías ser redirigido al Dashboard

---

### 3️⃣ **Probar API desde PowerShell**

#### Test de Login:
```powershell
$body = @{ 
    email = "admin@exmc.com"
    password = "admin123" 
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:3001/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response.Content | ConvertFrom-Json
```

#### Test de Productos (requiere token):
```powershell
# Primero obtener token del login anterior
$auth = ($response.Content | ConvertFrom-Json).data
$token = $auth.token

# Obtener productos
$products = Invoke-WebRequest `
    -Uri "http://localhost:3001/api/products" `
    -Headers @{Authorization="Bearer $token"}

$products.Content | ConvertFrom-Json
```

---

### 4️⃣ **Funciones del Dashboard**

Una vez dentro del sistema, prueba:

#### 📊 Dashboard
- ✅ Ver estadísticas del día
- ✅ Ver ventas del mes
- ✅ Ver productos con stock bajo
- ✅ Ver gráfico de ventas diarias
- ✅ Ver top 5 productos vendidos

#### 📦 Productos
- ✅ Ver lista de 15 productos precargados
- ✅ Buscar productos
- ✅ Ver detalles de un producto
- ✅ Crear nuevo producto (Admin)
- ✅ Editar producto (Admin/Vendedor)
- ✅ Eliminar producto (Admin)

#### 🏢 Proveedores
- ✅ Ver 3 proveedores precargados
- ✅ Crear nuevo proveedor
- ✅ Editar proveedor
- ✅ Eliminar proveedor

#### 👥 Clientes
- ✅ Ver 5 clientes precargados
- ✅ Ver saldo de cuenta corriente
- ✅ Crear nuevo cliente
- ✅ Editar cliente
- ✅ Ver historial de compras

#### 💰 Ventas
- ✅ Crear nueva venta
- ✅ Buscar productos en tiempo real
- ✅ Agregar al carrito
- ✅ Seleccionar cliente
- ✅ Elegir método de pago
- ✅ Generar factura PDF
- ✅ Ver listado de ventas

---

### 5️⃣ **Solución de Problemas Comunes**

#### ❌ "No puedo hacer login"
```powershell
# Resetear base de datos
cd c:\xampp\htdocs\sitema-EXMC\backend
npx prisma migrate reset --force
```

#### ❌ "El sistema no carga datos"
```powershell
# Verificar que el backend responda
Invoke-WebRequest -Uri "http://localhost:3001/api/health"

# Si no responde, reiniciar backend
cd c:\xampp\htdocs\sitema-EXMC\backend
npm run dev
```

#### ❌ "Error CORS en el navegador"
- Verificar que `.env` del backend tenga: `FRONTEND_URL=http://localhost:5173`
- Reiniciar backend después de cambiar `.env`

#### ❌ "Botones no funcionan / Formularios no responden"
1. Abrir DevTools (F12)
2. Ver la pestaña "Console"
3. Buscar errores rojos
4. Verificar la pestaña "Network" que las peticiones lleguen al backend

#### ❌ "Error 401 Unauthorized"
- Cerrar sesión y volver a entrar
- Limpiar localStorage: `localStorage.clear()`
- Verificar que el token no haya expirado

---

### 6️⃣ **Verificar Base de Datos**

```powershell
# Abrir Prisma Studio (interfaz visual)
cd c:\xampp\htdocs\sitema-EXMC\backend
npx prisma studio
# Se abre en http://localhost:5555
```

En Prisma Studio puedes:
- ✅ Ver todas las tablas
- ✅ Ver los datos
- ✅ Editar registros
- ✅ Verificar que los usuarios existan

---

### 7️⃣ **Logs y Debug**

#### Ver logs del Backend:
```powershell
# Terminal donde corre: npm run dev
# Verás todos los requests en tiempo real
```

#### Ver logs del Frontend:
1. Abrir DevTools (F12)
2. Pestaña "Console"
3. Ver errores de JavaScript/React

#### Ver requests HTTP:
1. DevTools (F12)
2. Pestaña "Network"
3. Filtrar por "Fetch/XHR"
4. Ver requests al backend

---

### 8️⃣ **Reinicio Completo**

Si todo falla, reinicia completamente:

```powershell
# 1. Detener todos los procesos
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Ir al proyecto
cd c:\xampp\htdocs\sitema-EXMC

# 3. Resetear base de datos
cd backend
npx prisma migrate reset --force

# 4. Iniciar backend
npm run dev
# (dejar corriendo en esta terminal)

# 5. Abrir NUEVA terminal e iniciar frontend
cd c:\xampp\htdocs\sitema-EXMC\frontend
npm run dev

# 6. Abrir navegador
start http://localhost:5173
```

---

### 9️⃣ **Comandos Útiles**

```powershell
# Ver estado de PostgreSQL
Get-Service -Name postgresql*

# Iniciar PostgreSQL
Start-Service postgresql-x64-18

# Ver procesos Node.js activos
Get-Process -Name node

# Matar todos los Node.js
Get-Process -Name node | Stop-Process -Force

# Limpiar caché npm
cd backend
npm cache clean --force
rm -r node_modules
npm install
```

---

### 🆘 **Checklist de Diagnóstico**

- [ ] PostgreSQL está corriendo
- [ ] Base de datos `exmc_db` existe
- [ ] Backend responde en http://localhost:3001/api/health
- [ ] Frontend carga en http://localhost:5173
- [ ] No hay errores en la consola del navegador
- [ ] El login devuelve un token
- [ ] Las peticiones al backend aparecen en Network
- [ ] Los datos se muestran en el Dashboard

---

## 📞 **Si Nada Funciona**

### Información a recopilar:

1. **Error exacto** que aparece
2. **Consola del navegador** (F12 → Console)
3. **Network tab** del navegador (F12 → Network)
4. **Logs del backend** (terminal donde corre npm run dev)
5. **Versión de Node.js**: `node --version`
6. **Versión de npm**: `npm --version`

Con esta información se puede diagnosticar el problema específico.
