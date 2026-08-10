import { Router } from 'express';
import * as alertsController from '../controllers/alerts';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, alertsController.list);
router.post('/', requireAuth, requireRole('admin'), alertsController.create);

export default router;
