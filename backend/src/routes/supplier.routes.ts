import { Router } from 'express';
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplier.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getSuppliers);
router.get('/:id', authenticate, getSupplierById);
router.post('/', authenticate, authorize('ADMIN'), createSupplier);
router.put('/:id', authenticate, authorize('ADMIN'), updateSupplier);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteSupplier);

export default router;
