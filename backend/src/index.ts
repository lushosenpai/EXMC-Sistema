import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

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

// Función para inicializar la base de datos
async function initializeDatabase() {
  console.log('📦 Inicializando base de datos SQLite...');
  
  const prisma = new PrismaClient();
  
  try {
    // Intentar verificar si la tabla users existe
    await prisma.user.findFirst();
    console.log('✅ Base de datos ya inicializada correctamente');
    await prisma.$disconnect();
  } catch (error: any) {
    console.log('⚠️ Base de datos sin inicializar, creando tablas...');
    
    // Cerrar conexión antes de ejecutar db push
    await prisma.$disconnect();
    
    try {
      // Ejecutar script SQL directamente para crear las tablas
      const backendPath = path.join(__dirname, '..');
      const sqlScriptPath = path.join(backendPath, 'prisma', 'init-database.sql');
      
      if (!fs.existsSync(sqlScriptPath)) {
        console.error('❌ No se encontró script de inicialización:', sqlScriptPath);
        throw new Error('Script de inicialización SQL no encontrado');
      }
      
      console.log('📄 Script SQL encontrado, creando base de datos...');
      
      // Leer el script SQL
      const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
      
      // Crear nueva instancia de Prisma para ejecutar el script
      const prismaInit = new PrismaClient();
      
      try {
        // Dividir el script en comandos individuales (separados por punto y coma)
        const commands = sqlScript
          .split(';')
          .map(cmd => cmd.trim())
          .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
        
        console.log(`Ejecutando ${commands.length} comandos SQL...`);
        
        // Ejecutar cada comando
        for (const command of commands) {
          if (command.trim()) {
            await prismaInit.$executeRawUnsafe(command);
          }
        }
        
        console.log('✅ Tablas creadas exitosamente');
        await prismaInit.$disconnect();
      } catch (sqlError: any) {
        console.error('❌ Error al ejecutar script SQL:', sqlError.message);
        await prismaInit.$disconnect();
        throw sqlError;
      }
    } catch (pushError: any) {
      console.error('❌ Error al crear tablas:', pushError.message);
      throw pushError;
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
