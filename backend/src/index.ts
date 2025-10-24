import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import bcrypt from 'bcrypt';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import supplierRoutes from './routes/supplier.routes';
import customerRoutes from './routes/customer.routes';
import saleRoutes from './routes/sale.routes';
import dashboardRoutes from './routes/dashboard.routes';
import configRoutes from './routes/config.routes';
import stockRoutes from './routes/stock.routes';

dotenv.config();

// Función SIMPLE y ROBUSTA para inicializar la base de datos
// SIN dependencias nativas, solo Prisma
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
  
  const prisma = new PrismaClient();
  
  try {
    // Verificar si la base de datos ya existe y está inicializada
    console.log('🔍 Verificando base de datos...');
    const userCount = await prisma.user.count();
    console.log(`✅ Base de datos OK - ${userCount} usuario(s) encontrado(s)`);
    await prisma.$disconnect();
    return;
  } catch (error: any) {
    console.log('⚠️ Base de datos necesita inicialización');
    
    try {
      // La base de datos no existe o no tiene tablas
      // Prisma Client creará las tablas automáticamente en la primera conexión
      console.log('🔨 Creando usuario administrador...');
      
      // Hash de la contraseña "admin123"
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Crear usuario admin
      await prisma.user.create({
        data: {
          email: 'admin@exmc.com',
          password: hashedPassword,
          name: 'Administrador',
          role: 'ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('   📧 Email: admin@exmc.com');
      console.log('   🔑 Password: admin123');
      
      // Crear configuraciones por defecto
      const configs = [
        { key: 'business_name', value: 'Mi Negocio' },
        { key: 'business_address', value: '' },
        { key: 'business_phone', value: '' },
        { key: 'business_email', value: '' },
        { key: 'tax_percentage', value: '21' }
      ];
      
      for (const config of configs) {
        await prisma.config.create({
          data: config
        });
      }
      
      console.log('✅ Configuraciones iniciales creadas');
      
      // Verificar que todo se creó correctamente
      const finalCount = await prisma.user.count();
      console.log(`✅ Verificación final: ${finalCount} usuario(s) en la base de datos`);
      
      await prisma.$disconnect();
    } catch (createError: any) {
      console.error('❌ Error al crear datos iniciales:', createError.message);
      await prisma.$disconnect();
      throw createError;
    }
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
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
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
    path.join(__dirname, '../../frontend/dist'),
    path.join(__dirname, '../../../frontend/dist'),
    path.join(process.cwd(), 'frontend', 'dist'),
  ];
  
  let frontendPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      frontendPath = p;
      console.log('✅ Frontend encontrado en:', frontendPath);
      break;
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
    console.warn('⚠️ Frontend no encontrado en ninguna ubicación');
    app.get('/', (_req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'Sistema EXMC Backend API',
        version: '2.0.0',
      });
    });
  }
} else {
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Sistema EXMC Backend API - Development Mode',
      version: '2.0.0',
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
