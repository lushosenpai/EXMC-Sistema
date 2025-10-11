# 📂 Estructura Completa del Proyecto EXMC

```
c:\xampp\htdocs\sitema-EXMC\
│
├── 📄 README.md                      # Documentación principal
├── 📄 INSTALACION.md                 # Guía de instalación detallada
├── 📄 INICIO-RAPIDO.md               # Comandos rápidos
├── 📄 CARACTERISTICAS.md             # Lista de funcionalidades
├── 📄 ESTRUCTURA.md                  # Este archivo
├── ⚙️ instalar.bat                   # Script de instalación automática
├── 🚀 iniciar.bat                    # Script de inicio rápido
│
├── 📁 backend/                       # Servidor Node.js + Express
│   │
│   ├── 📁 src/                       # Código fuente
│   │   │
│   │   ├── 📁 controllers/           # Lógica de negocio
│   │   │   ├── auth.controller.ts    # Login, logout, perfil
│   │   │   ├── product.controller.ts # CRUD productos
│   │   │   ├── supplier.controller.ts# CRUD proveedores
│   │   │   ├── customer.controller.ts# CRUD clientes
│   │   │   ├── sale.controller.ts    # Ventas y facturación
│   │   │   ├── dashboard.controller.ts # Estadísticas
│   │   │   ├── user.controller.ts    # Gestión de usuarios
│   │   │   └── config.controller.ts  # Configuración
│   │   │
│   │   ├── 📁 routes/                # Rutas API
│   │   │   ├── auth.routes.ts        # /api/auth/*
│   │   │   ├── product.routes.ts     # /api/products/*
│   │   │   ├── supplier.routes.ts    # /api/suppliers/*
│   │   │   ├── customer.routes.ts    # /api/customers/*
│   │   │   ├── sale.routes.ts        # /api/sales/*
│   │   │   ├── dashboard.routes.ts   # /api/dashboard/*
│   │   │   ├── user.routes.ts        # /api/users/*
│   │   │   └── config.routes.ts      # /api/config/*
│   │   │
│   │   ├── 📁 middleware/            # Middleware
│   │   │   └── auth.middleware.ts    # Autenticación JWT
│   │   │
│   │   ├── 📁 utils/                 # Utilidades
│   │   │   └── errors.ts             # Clases de error
│   │   │
│   │   └── 📄 index.ts               # Entrada principal
│   │
│   ├── 📁 prisma/                    # ORM Prisma
│   │   ├── schema.prisma             # Modelos de base de datos
│   │   ├── seed.ts                   # Datos de ejemplo
│   │   └── 📁 migrations/            # Migraciones SQL
│   │
│   ├── 📁 uploads/                   # Archivos subidos
│   │   └── products/                 # Imágenes de productos
│   │
│   ├── 📄 .env                       # Variables de entorno (PRIVADO)
│   ├── 📄 .env.example               # Plantilla de .env
│   ├── 📄 .gitignore                 # Archivos ignorados por git
│   ├── 📄 package.json               # Dependencias backend
│   ├── 📄 tsconfig.json              # Configuración TypeScript
│   └── 📄 nodemon.json               # Configuración Nodemon
│
└── 📁 frontend/                      # Aplicación React
    │
    ├── 📁 src/                       # Código fuente
    │   │
    │   ├── 📁 api/                   # Servicios API
    │   │   ├── client.ts             # Cliente Axios configurado
    │   │   ├── auth.ts               # API de autenticación
    │   │   ├── products.ts           # API de productos
    │   │   ├── sales.ts              # API de ventas
    │   │   ├── dashboard.ts          # API de dashboard
    │   │   └── index.ts              # Exportaciones (clientes, proveedores)
    │   │
    │   ├── 📁 components/            # Componentes React
    │   │   │
    │   │   ├── 📁 layout/            # Layouts
    │   │   │   ├── MainLayout.tsx    # Layout principal
    │   │   │   ├── AuthLayout.tsx    # Layout de login
    │   │   │   ├── Sidebar.tsx       # Menú lateral
    │   │   │   └── Navbar.tsx        # Barra superior
    │   │   │
    │   │   ├── 📁 common/            # Componentes reutilizables
    │   │   │   ├── Button.tsx        # Botón personalizado
    │   │   │   ├── Input.tsx         # Input personalizado
    │   │   │   ├── Modal.tsx         # Modal genérico
    │   │   │   ├── Table.tsx         # Tabla de datos
    │   │   │   ├── Card.tsx          # Tarjeta
    │   │   │   ├── Loading.tsx       # Spinner de carga
    │   │   │   └── Badge.tsx         # Insignia
    │   │   │
    │   │   ├── 📁 products/          # Componentes de productos
    │   │   │   ├── ProductList.tsx   # Lista de productos
    │   │   │   ├── ProductForm.tsx   # Formulario producto
    │   │   │   └── ProductCard.tsx   # Tarjeta de producto
    │   │   │
    │   │   ├── 📁 sales/             # Componentes de ventas
    │   │   │   ├── SaleList.tsx      # Lista de ventas
    │   │   │   ├── SaleForm.tsx      # Formulario de venta
    │   │   │   └── CartItem.tsx      # Item del carrito
    │   │   │
    │   │   └── 📁 dashboard/         # Componentes del dashboard
    │   │       ├── StatCard.tsx      # Tarjeta de estadística
    │   │       └── Chart.tsx         # Gráfico
    │   │
    │   ├── 📁 pages/                 # Páginas
    │   │   ├── LoginPage.tsx         # Página de login
    │   │   ├── DashboardPage.tsx     # Dashboard principal
    │   │   ├── ProductsPage.tsx      # Gestión de productos
    │   │   ├── SuppliersPage.tsx     # Gestión de proveedores
    │   │   ├── CustomersPage.tsx     # Gestión de clientes
    │   │   ├── SalesPage.tsx         # Historial de ventas
    │   │   └── NewSalePage.tsx       # Nueva venta (POS)
    │   │
    │   ├── 📁 store/                 # Estado global (Zustand)
    │   │   ├── authStore.ts          # Estado de autenticación
    │   │   └── cartStore.ts          # Estado del carrito
    │   │
    │   ├── 📁 hooks/                 # Custom hooks
    │   │   ├── useAuth.ts            # Hook de autenticación
    │   │   └── useProducts.ts        # Hook de productos
    │   │
    │   ├── 📁 utils/                 # Utilidades
    │   │   ├── formatters.ts         # Formato de moneda, fechas
    │   │   └── validators.ts         # Validaciones
    │   │
    │   ├── 📁 types/                 # Tipos TypeScript
    │   │   ├── product.ts            # Tipos de productos
    │   │   ├── sale.ts               # Tipos de ventas
    │   │   └── user.ts               # Tipos de usuario
    │   │
    │   ├── 📄 App.tsx                # Componente principal
    │   ├── 📄 main.tsx               # Entrada de React
    │   ├── 📄 index.css              # Estilos globales
    │   └── 📄 vite-env.d.ts          # Tipos de Vite
    │
    ├── 📁 public/                    # Archivos públicos
    │   ├── vite.svg                  # Logo de Vite
    │   └── favicon.ico               # Icono del sitio
    │
    ├── 📄 .env                       # Variables de entorno (PRIVADO)
    ├── 📄 .env.example               # Plantilla de .env
    ├── 📄 .gitignore                 # Archivos ignorados
    ├── 📄 index.html                 # HTML principal
    ├── 📄 package.json               # Dependencias frontend
    ├── 📄 tsconfig.json              # Config TypeScript
    ├── 📄 tsconfig.node.json         # Config TypeScript (Node)
    ├── 📄 vite.config.ts             # Configuración Vite
    ├── 📄 tailwind.config.js         # Configuración Tailwind
    ├── 📄 postcss.config.js          # Configuración PostCSS
    └── 📄 .eslintrc.cjs              # Configuración ESLint

```

## 📊 Estadísticas del Proyecto

### Backend
- **Controladores:** 8 archivos
- **Rutas:** 8 archivos
- **Middleware:** 1 archivo
- **Modelos Prisma:** 10 tablas
- **Total líneas:** ~5,000

### Frontend
- **Páginas:** 7 componentes
- **Componentes Layout:** 4 archivos
- **Componentes comunes:** 7+ archivos
- **Stores:** 2 archivos
- **APIs:** 6 archivos
- **Total líneas:** ~10,000

### Total Proyecto
- **Archivos TypeScript:** 60+
- **Líneas de código:** ~15,000
- **Dependencias:** 50+
- **Endpoints API:** 30+

## 🎯 Archivos Clave

### Configuración Backend
| Archivo | Descripción |
|---------|-------------|
| `backend/.env` | Variables de entorno (DB, JWT, etc.) |
| `backend/prisma/schema.prisma` | Definición de modelos de datos |
| `backend/src/index.ts` | Punto de entrada del servidor |
| `backend/package.json` | Dependencias del backend |

### Configuración Frontend
| Archivo | Descripción |
|---------|-------------|
| `frontend/.env` | URL de la API |
| `frontend/src/main.tsx` | Punto de entrada de React |
| `frontend/src/App.tsx` | Rutas principales |
| `frontend/tailwind.config.js` | Tema oscuro personalizado |

### Scripts de Utilidad
| Archivo | Descripción |
|---------|-------------|
| `instalar.bat` | Instalación automática completa |
| `iniciar.bat` | Inicio rápido de servidores |
| `INSTALACION.md` | Guía paso a paso |
| `INICIO-RAPIDO.md` | Comandos útiles |

## 🚀 Flujo de Datos

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  React Frontend     │ ← http://localhost:5173
│  (Vite + Tailwind) │
└─────────┬───────────┘
          │ HTTP/REST
          ▼
┌─────────────────────┐
│  Express Backend    │ ← http://localhost:3001/api
│  (Node.js + TS)    │
└─────────┬───────────┘
          │ Prisma ORM
          ▼
┌─────────────────────┐
│   PostgreSQL DB     │ ← localhost:5432/exmc_db
│  (10 tablas)       │
└─────────────────────┘
```

## 📦 Dependencias Principales

### Backend
- `express` - Framework web
- `@prisma/client` - ORM para base de datos
- `jsonwebtoken` - Autenticación JWT
- `bcrypt` - Hash de contraseñas
- `multer` - Upload de archivos
- `pdfkit` - Generación de PDF
- `zod` - Validación de esquemas

### Frontend
- `react` - Librería UI
- `vite` - Build tool
- `tailwindcss` - Framework CSS
- `zustand` - Estado global
- `@tanstack/react-query` - Data fetching
- `react-router-dom` - Navegación
- `axios` - Cliente HTTP
- `framer-motion` - Animaciones
- `recharts` - Gráficos
- `react-hot-toast` - Notificaciones

## 🔐 Seguridad

### Archivos Sensibles (NO subir a Git)
```
backend/.env          # Credenciales de DB y JWT
frontend/.env         # URL de API
backend/uploads/      # Archivos subidos
node_modules/         # Dependencias
dist/                 # Builds
*.log                 # Logs
```

### Archivos de Plantilla (SÍ en Git)
```
backend/.env.example
frontend/.env.example
.gitignore
```

---

**Proyecto desarrollado con arquitectura profesional y buenas prácticas** ✨
