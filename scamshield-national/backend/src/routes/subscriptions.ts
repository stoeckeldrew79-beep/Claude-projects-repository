import { Router } from 'express';
import * as subscriptionsController from '../controllers/subscriptions';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/checkout', requireAuth, subscriptionsController.checkout);
router.post('/portal', requireAuth, subscriptionsController.portal);
// Stripe signs this payload; verify via STRIPE_WEBHOOK_SECRET before trusting it (Phase 2).
router.post('/webhook', subscriptionsController.webhook);
router.get('/status', requireAuth, subscriptionsController.status);

export default router;
