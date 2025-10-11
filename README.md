# 🚀 Sistema EXMC - Gestión Comercial Profesional

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Sistema integral de gestión comercial con arquitectura full-stack moderna**

[🚀 Inicio Rápido](#-inicio-rápido) • [📖 Documentación](#-documentación) • [✨ Características](#-características) • [🛠️ Tecnologías](#️-tecnologías)

</div>

---

## 📋 Descripción

**EXMC** es un sistema completo de gestión comercial diseñado para pequeñas y medianas empresas. Incluye gestión de inventario, ventas, clientes, proveedores, facturación y reportes en tiempo real.

### 🎯 Características Principales

✅ **Punto de Venta (POS)** - Sistema de ventas rápido e intuitivo  
✅ **Gestión de Inventario** - Control total de productos y stock  
✅ **Facturación PDF** - Generación automática de facturas  
✅ **Dashboard Analytics** - Estadísticas y gráficos en tiempo real  
✅ **Multi-usuario** - Sistema de roles (Admin, Vendedor, Consulta)  
✅ **Cuenta Corriente** - Gestión de créditos de clientes  
✅ **Alertas de Stock** - Notificaciones de productos bajos  
✅ **Tema Oscuro** - Interfaz moderna y profesional  

---

## � Inicio Rápido

### ⚡ Instalación Automática (Windows)

**La forma más rápida de comenzar:**

1. **Doble clic en `instalar.bat`**
   - Instala todas las dependencias
   - Configura la base de datos
   - Carga datos de ejemplo

2. **Doble clic en `iniciar.bat`**
   - Inicia backend y frontend automáticamente
   - Abre el navegador

3. **¡Listo!** 🎉

### � Instalación Manual

#### Prerrequisitos
```bash
Node.js >= 18
PostgreSQL >= 14
npm o yarn
```

#### 1️⃣ Crear base de datos PostgreSQL
```sql
CREATE DATABASE exmc_db;
```

#### 2️⃣ Configurar Backend
```powershell
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

#### 3️⃣ Configurar Frontend (Nueva terminal)
```powershell
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### 4️⃣ Acceder
Abrir navegador: **http://localhost:5173**

**Credenciales de prueba:**
- Admin: `admin@exmc.com` / `admin123`
- Vendedor: `vendedor@exmc.com` / `vendedor123`

---

## 📖 Documentación

| Documento | Descripción |
|-----------|-------------|
| [📘 INSTALACION.md](INSTALACION.md) | Guía de instalación detallada paso a paso |
| [⚡ INICIO-RAPIDO.md](INICIO-RAPIDO.md) | Comandos útiles y soluciones rápidas |
| [✨ CARACTERISTICAS.md](CARACTERISTICAS.md) | Lista completa de funcionalidades |
| [📂 ESTRUCTURA.md](ESTRUCTURA.md) | Estructura del proyecto y archivos |

---

## ✨ Características

### 🔐 Autenticación y Seguridad
- Sistema JWT con tokens seguros
- 3 roles de usuario con permisos diferenciados
- Passwords hasheados con bcrypt
- Rate limiting contra ataques
- Protección CORS configurada

### 📦 Gestión de Productos
- CRUD completo con imágenes
- Código de barras único
- Control de stock con alertas
- Precio de costo y venta
- Cálculo automático de márgenes
- Historial de movimientos
- Búsqueda y filtros avanzados

### 💰 Punto de Venta
- Interface rápida e intuitiva
- Búsqueda de productos en tiempo real
- Carrito de compras
- Múltiples métodos de pago:
  - Efectivo
  - Transferencia
  - Tarjeta de crédito/débito
  - Cuenta corriente
- Cálculo automático de IVA y totales
- Descuentos y recargos
- Generación de facturas PDF

### 👥 Gestión de Clientes
- Fichas completas de clientes
- Cuenta corriente con límites
- Historial de compras
- Datos fiscales (CUIT/DNI)
- Seguimiento de saldos

### 🏢 Gestión de Proveedores
- Base de datos de proveedores
- Información de contacto
- Relación con productos
- Estado activo/inactivo

### 📊 Dashboard y Reportes
- KPIs en tiempo real:
  - Ventas del día
  - Ventas del mes
  - Stock crítico
  - Clientes activos
- Gráficos interactivos:
  - Ventas diarias (últimos 7 días)
  - Top productos vendidos
  - Ventas por método de pago
- Reportes exportables

### 🎨 Diseño UI/UX
- Tema oscuro profesional
- 100% responsive (mobile, tablet, desktop)
- Animaciones fluidas
- Notificaciones toast
- Loading states
- Iconografía moderna

---

## 🛠️ Tecnologías

### Backend
```
Node.js + Express + TypeScript
Prisma ORM + PostgreSQL
JWT Authentication
Multer (file upload)
PDFKit (invoice generation)
Bcrypt (password hashing)
Zod (validation)
```

### Frontend
```
React 18 + Vite
TypeScript
TailwindCSS
Zustand (state management)
React Query (data fetching)
React Router (navigation)
Axios (HTTP client)
Framer Motion (animations)
Recharts (charts)
React Hot Toast (notifications)
```

### DevOps
```
Prisma migrations
TypeScript strict mode
ESLint
Git
Nodemon (hot reload)
```

---

## 📁 Estructura del Proyecto

```
sitema-EXMC/
├── 📁 backend/          # API Node.js + Express
│   ├── src/
│   │   ├── controllers/ # Lógica de negocio
│   │   ├── routes/      # Rutas API
│   │   ├── middleware/  # Auth, validaciones
│   │   └── utils/       # Utilidades
│   ├── prisma/
│   │   └── schema.prisma # Modelos DB
│   └── uploads/         # Archivos subidos
│
└── 📁 frontend/         # App React
    ├── src/
    │   ├── api/         # Servicios API
    │   ├── components/  # Componentes React
    │   ├── pages/       # Páginas
    │   ├── store/       # Estado global
    │   └── hooks/       # Custom hooks
    └── public/          # Archivos estáticos
```

---

## 🎯 Casos de Uso

### Para Tiendas de Barrio
- Control de stock simple
- Ventas rápidas
- Cuenta corriente de clientes
- Generación de comprobantes

### Para Distribuidoras
- Gestión de múltiples proveedores
- Control de inventario extenso
- Reportes de ventas
- Múltiples usuarios

### Para Peluquerías/Estéticas
- Productos y servicios
- Clientes frecuentes
- Control de insumos
- Estadísticas de ventas

---

## 📊 Base de Datos

### Modelos Implementados
- **Users** - Usuarios del sistema
- **Products** - Catálogo de productos
- **Suppliers** - Proveedores
- **Customers** - Clientes
- **Sales** - Ventas realizadas
- **SaleItems** - Detalle de ventas
- **Payments** - Pagos
- **StockMovements** - Movimientos de inventario
- **Config** - Configuración del sistema

---

## 🔒 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Passwords hasheados con bcrypt (salt rounds: 10)
- ✅ Validación de inputs en backend
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min)
- ✅ Sanitización de datos
- ✅ HTTPS ready

---

## 📈 Roadmap

### v1.1 (Próximo)
- [ ] Módulo de caja diaria
- [ ] Impresión de tickets
- [ ] Backup automático de base de datos
- [ ] Soporte multi-sucursal

### v1.2 (Futuro)
- [ ] App móvil (React Native)
- [ ] Integración con Mercado Pago
- [ ] Reportes avanzados Excel
- [ ] Sistema de notificaciones email
- [ ] API pública REST documentada

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 💡 Soporte

### ¿Problemas?

1. **Revisa la documentación** en `INSTALACION.md`
2. **Comandos útiles** en `INICIO-RAPIDO.md`
3. **Estructura del proyecto** en `ESTRUCTURA.md`
4. **Verifica logs** de consola backend/frontend
5. **Reinicia servidores** y PostgreSQL

### Comandos Útiles

```powershell
# Ver base de datos visualmente
cd backend
npx prisma studio

# Resetear base de datos
cd backend
npx prisma migrate reset

# Ver salud de la API
http://localhost:3001/api/health

# Limpiar caché
rm -r node_modules
npm install
```

---

## 👥 Credenciales de Prueba

| Rol | Email | Password | Permisos |
|-----|-------|----------|----------|
| **Admin** | admin@exmc.com | admin123 | Todos |
| **Vendedor** | vendedor@exmc.com | vendedor123 | Ventas, productos |
| **Consulta** | consulta@exmc.com | consulta123 | Solo lectura |

---

## 🌟 Características Destacadas

<table>
<tr>
<td width="50%">

### 💼 Profesional
- Arquitectura escalable
- Código limpio y documentado
- TypeScript en todo el stack
- Buenas prácticas aplicadas

</td>
<td width="50%">

### 🚀 Moderno
- React 18 + Vite
- Prisma ORM
- Diseño responsive
- Animaciones fluidas

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Seguro
- JWT authentication
- Roles y permisos
- Validaciones robustas
- Rate limiting

</td>
<td width="50%">

### 📊 Completo
- Dashboard analytics
- Reportes PDF
- Gráficos interactivos
- Multi-usuario

</td>
</tr>
</table>

---

## 📞 Contacto

Para consultas comerciales o soporte técnico:

- 📧 Email: soporte@exmc.com
- 🌐 Web: www.exmc.com
- 📱 WhatsApp: +54 341 555-0000

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

---

Desarrollado con ❤️ para la gestión comercial moderna

**EXMC © 2025**

</div>
```

Iniciar aplicación frontend:
```bash
npm run dev
```

### 4️⃣ Acceder al sistema

Abrir navegador en: **http://localhost:5173**

**Credenciales por defecto:**
- **Admin:** admin@exmc.com / admin123
- **Vendedor:** vendedor@exmc.com / vendedor123
- **Consulta:** consulta@exmc.com / consulta123

## 📁 Estructura del Proyecto

```
sitema-EXMC/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas/Vistas
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Zustand stores
│   │   ├── api/             # Servicios API
│   │   ├── utils/           # Utilidades
│   │   └── styles/          # Estilos globales
│   ├── public/              # Archivos estáticos
│   └── package.json
│
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Middleware
│   │   ├── services/       # Lógica de negocio
│   │   ├── utils/          # Utilidades
│   │   └── types/          # Tipos TypeScript
│   ├── prisma/             # Schema y migraciones
│   ├── uploads/            # Archivos subidos
│   └── package.json
│
└── README.md
```

## 🔑 Roles y Permisos

| Módulo | Admin | Vendedor | Consulta |
|--------|-------|----------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Productos | ✅ CRUD | ✅ Ver | ✅ Ver |
| Proveedores | ✅ CRUD | ✅ Ver | ✅ Ver |
| Clientes | ✅ CRUD | ✅ CRUD | ✅ Ver |
| Ventas | ✅ | ✅ | ❌ |
| Reportes | ✅ | ✅ Ver | ✅ Ver |
| Usuarios | ✅ CRUD | ❌ | ❌ |

## 🎨 Características de UI

- ⚫ **Tema oscuro profesional** (gris grafito/negro/azul)
- 🎭 **Animaciones suaves** con Framer Motion
- 📱 **100% Responsive** (Desktop, Tablet, Mobile)
- 🔔 **Notificaciones toast** elegantes
- 🖼️ **Preview de imágenes** en modales
- 📊 **Gráficos interactivos** con Recharts
- ⚡ **Carga optimizada** con React Query
- 🔍 **Búsqueda y filtros** en tiempo real

## 📊 Funcionalidades de Ventas

1. **Búsqueda inteligente** de productos por nombre o código
2. **Carrito dinámico** con cálculo automático
3. **Descuento de stock** en tiempo real
4. **Múltiples métodos de pago**:
   - Efectivo
   - Transferencia
   - Tarjeta (crédito/débito)
   - Cuenta corriente
5. **Generación automática de facturas PDF**
6. **Historial completo** con filtros por fecha y cliente
7. **Cálculo de IVA** y totales automáticos
8. **Porcentaje adicional** configurable

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev          # Modo desarrollo con nodemon
npm run build        # Compilar TypeScript
npm start            # Iniciar en producción
npm run prisma:studio # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev          # Modo desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 🔒 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Passwords hasheados con bcrypt
- ✅ Validación de datos con Zod
- ✅ Protección contra SQL injection (Prisma)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Sanitización de inputs

## 📝 Licencia

Proyecto privado - Todos los derechos reservados © 2025

## 👨‍💻 Soporte

Para consultas o soporte técnico, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ por el equipo EXMC**
