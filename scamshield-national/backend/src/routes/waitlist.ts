import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as waitlistController from '../controllers/waitlist';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

const joinLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.post('/', joinLimiter, waitlistController.join);
router.get('/', requireAuth, requireRole('admin'), waitlistController.list);

export default router;
