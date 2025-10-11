import { Router } from 'express';
import { getConfig, updateConfig } from '../controllers/config.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getConfig);
router.put('/', authenticate, authorize('ADMIN'), updateConfig);

export default router;
