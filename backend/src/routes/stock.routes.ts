import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getStockMovements,
  createStockMovement,
  getLowStockProducts,
  getProductStockHistory,
} from '../controllers/stock.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de movimientos de stock
router.get('/movements', getStockMovements);
router.post('/movements', authorize('ADMIN', 'VENDEDOR'), createStockMovement);
router.get('/low-stock', getLowStockProducts);
router.get('/products/:productId/history', getProductStockHistory);

export default router;
