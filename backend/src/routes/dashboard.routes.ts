import { Router } from 'express';
import { getDashboardStats, getSalesReport } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', authenticate, getDashboardStats);
router.get('/sales-report', authenticate, getSalesReport);

export default router;
