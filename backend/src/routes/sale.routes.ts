import { Router } from 'express';
import {
  getSales,
  getSaleById,
  createSale,
  cancelSale,
  generateInvoicePDF,
} from '../controllers/sale.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getSales);
router.get('/:id', authenticate, getSaleById);
router.post('/', authenticate, authorize('ADMIN', 'VENDEDOR'), createSale);
router.put('/:id/cancel', authenticate, authorize('ADMIN'), cancelSale);
router.get('/:id/pdf', authenticate, generateInvoicePDF);

export default router;
