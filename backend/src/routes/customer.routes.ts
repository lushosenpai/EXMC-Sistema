import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerAccountSummary,
} from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getCustomers);
router.get('/:id', authenticate, getCustomerById);
router.get('/:id/account-summary', authenticate, getCustomerAccountSummary);
router.post('/', authenticate, authorize('ADMIN', 'VENDEDOR'), createCustomer);
router.put('/:id', authenticate, authorize('ADMIN', 'VENDEDOR'), updateCustomer);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCustomer);

export default router;
