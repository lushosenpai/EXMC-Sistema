import { Router } from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), getUsers);
router.post('/', authenticate, authorize('ADMIN'), createUser);
router.put('/:id', authenticate, authorize('ADMIN'), updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);
router.post('/:id/reset-password', authenticate, authorize('ADMIN'), resetPassword);

export default router;
