import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as scamCheckController from '../controllers/scamCheck';

const router = Router();

// Each check can reach an AI model, so it gets its own tighter budget than
// the general API limit: plenty for a person, not enough to farm.
const checkLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

router.post('/check', checkLimiter, scamCheckController.check);

export default router;
