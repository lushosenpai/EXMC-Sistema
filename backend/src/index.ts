import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

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

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.',
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
  }
}

// Error handling middleware
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

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
