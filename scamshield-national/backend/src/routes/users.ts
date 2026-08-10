import { Router } from 'express';
import * as authController from '../controllers/auth';
import * as usersController from '../controllers/users';
import { authLimiter } from '../middleware/rateLimit';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/auth/register', authLimiter, authController.register);
router.post('/auth/login', authLimiter, authController.login);

router.get('/users/me', requireAuth, usersController.me);
router.put('/users/me', requireAuth, usersController.updateMe);
router.post('/users/me/sms-opt-in', requireAuth, usersController.smsOptIn);

export default router;
