import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  getCustomerPayments,
  createCustomerPayment,
  deleteCustomerPayment,
  getCustomerAccountSummary,
} from '../controllers/customerPayment.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de pagos de cuenta corriente
router.get('/:customerId/payments', getCustomerPayments);
router.post('/:customerId/payments', authorize('ADMIN', 'VENDEDOR'), createCustomerPayment);
router.delete('/:customerId/payments/:paymentId', authorize('ADMIN'), deleteCustomerPayment);
router.get('/:customerId/account-summary', getCustomerAccountSummary);

export default router;
