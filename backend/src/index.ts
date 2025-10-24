import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import Database from 'better-sqlite3';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import supplierRoutes from './routes/supplier.routes';
import customerRoutes from './routes/customer.routes';
import saleRoutes from './routes/sale.routes';
import dashboardRoutes from './routes/dashboard.routes';
import configRoutes from './routes/config.routes';
// import customerPaymentRoutes from './routes/customerPayment.routes'; // TODO: Descomentar cuando Prisma Client incluya CustomerPayment
import stockRoutes from './routes/stock.routes';

dotenv.config();

// Función para inicializar la base de datos con better-sqlite3
async function initializeDatabase() {
  console.log('📦 Inicializando base de datos SQLite...');
  
  const databaseUrl = process.env.DATABASE_URL || '';
  let dbPath = '';
  
  // Extraer ruta del archivo de la URL
  if (databaseUrl.startsWith('file:')) {
    dbPath = databaseUrl.replace('file:', '');
  } else {
    dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  }
  
  console.log('📁 Ruta de base de datos:', dbPath);
  
  // Asegurar que el directorio existe
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('✅ Carpeta de datos creada:', dbDir);
  }
  
  try {
    // Primero verificar si la base de datos ya existe y tiene datos
    if (fs.existsSync(dbPath)) {
      console.log('📂 Base de datos encontrada, verificando estructura...');
      
      const prisma = new PrismaClient();
      try {
        // Verificar si las tablas existen intentando una consulta
        await prisma.user.findFirst();
        console.log('✅ Base de datos ya inicializada correctamente');
        await prisma.$disconnect();
        return;
      } catch (error: any) {
        console.log('⚠️ Base de datos existe pero necesita inicialización');
        await prisma.$disconnect();
      }
    }
    
    // Si llegamos aquí, necesitamos crear/inicializar la base de datos
    console.log('🔨 Creando estructura de base de datos...');
    
    // Buscar el script SQL
    const sqlScriptPath = path.join(__dirname, '..', 'prisma', 'init-database.sql');
    
    if (!fs.existsSync(sqlScriptPath)) {
      console.error('❌ No se encontró script de inicialización:', sqlScriptPath);
      throw new Error('Script de inicialización SQL no encontrado');
    }
    
    console.log('📄 Script SQL encontrado, ejecutando...');
    
    // Leer el script SQL
    const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
    
    // Usar better-sqlite3 para ejecutar el script completo
    const db = new Database(dbPath);
    
    try {
      // Habilitar foreign keys
      db.pragma('foreign_keys = ON');
      
      // Ejecutar el script completo
      db.exec(sqlScript);
      
      console.log('✅ Base de datos creada exitosamente');
      console.log('✅ Tablas creadas correctamente');
      console.log('✅ Usuario admin creado (admin@exmc.com / admin123)');
      
      db.close();
    } catch (dbError: any) {
      console.error('❌ Error al ejecutar script SQL:', dbError.message);
      db.close();
      throw dbError;
    }
    
    // Verificar que el archivo de base de datos existe
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      console.log(`✅ Base de datos creada: ${dbPath} (${stats.size} bytes)`);
    } else {
      throw new Error('La base de datos no se creó correctamente');
    }
    
  } catch (error: any) {
    console.error('❌ Error crítico al inicializar base de datos:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - Más permisivo en desarrollo
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 en desarrollo, 100 en producción
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes - IMPORTANTE: Definir ANTES del frontend estático
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/config', configRoutes);
// app.use('/api/customer-payments', customerPaymentRoutes); // TODO: Descomentar cuando Prisma Client incluya CustomerPayment
app.use('/api/stock', stockRoutes);

// Health check and system info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    version: '2.0.0',
    system: 'Sistema EXMC - Gestión Comercial',
    author: {
      name: 'Luciano Savoretti',
      role: 'Dev / Sistemas / Web',
      instagram: 'https://www.instagram.com/devpuchito/'
    }
  });
});

// En producción, servir el frontend desde el backend
if (process.env.NODE_ENV === 'production') {
  // Buscar el frontend en diferentes ubicaciones posibles
  const possiblePaths = [
    path.join(__dirname, '../../frontend/dist'),           // resources/backend/../frontend/dist
    path.join(__dirname, '../../../frontend/dist'),        // Si está más arriba
    path.join(process.cwd(), 'frontend', 'dist'),          // Desde el directorio de trabajo
  ];
  
  let frontendPath = '';
  for (const p of possiblePaths) {
    if (require('fs').existsSync(p)) {
      frontendPath = p;
      console.log('✅ Frontend encontrado en:', frontendPath);
      break;
    } else {
      console.log('❌ Frontend NO encontrado en:', p);
    }
  }
  
  if (frontendPath) {
    // Servir archivos estáticos del frontend
    app.use(express.static(frontendPath));
    
    // Catch-all: Todas las rutas no-API sirven index.html (para SPA routing)
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.error('⚠️ Frontend no encontrado en ninguna ubicación');
    // Si no hay frontend, al menos dar una respuesta en la raíz
    app.get('/', (_req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Sistema EXMC Backend API',
        version: '2.0.0',
        endpoints: {
          health: '/api/health',
          auth: '/api/auth/*',
          users: '/api/users/*',
          products: '/api/products/*',
          sales: '/api/sales/*',
          dashboard: '/api/dashboard/*'
        }
      });
    });
    
    // 404 para rutas no encontradas cuando no hay frontend
    app.use((_req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
      });
    });
  }
} else {
  // En desarrollo, solo responder en raíz
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Sistema EXMC Backend API - Development Mode',
      version: '2.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth/*',
        users: '/api/users/*',
        products: '/api/products/*',
        sales: '/api/sales/*',
        dashboard: '/api/dashboard/*'
      }
    });
  });
  
  // 404 handler para desarrollo
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
    });
  });
}

// Error handling middleware (debe estar después de todas las rutas)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
async function startServer() {
  try {
    // Inicializar base de datos antes de iniciar el servidor
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
startServer();

export default app;
