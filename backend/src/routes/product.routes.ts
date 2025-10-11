import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  upload,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getProducts);
router.get('/low-stock', authenticate, getLowStockProducts);
router.get('/:id', authenticate, getProductById);
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'VENDEDOR'),
  upload.single('image'),
  createProduct
);
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'VENDEDOR'),
  upload.single('image'),
  updateProduct
);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

export default router;
