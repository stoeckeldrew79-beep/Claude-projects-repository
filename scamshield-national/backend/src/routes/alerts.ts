import { Router } from 'express';
import * as alertsController from '../controllers/alerts';
import { requireAuth, requireRole } from '../middleware/auth';
import { requireSubscriber } from '../middleware/subscription';

const router = Router();

router.get('/', requireAuth, requireSubscriber, alertsController.list);
router.post('/', requireAuth, requireRole('admin'), alertsController.create);

export default router;
