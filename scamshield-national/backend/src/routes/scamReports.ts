import { Router } from 'express';
import * as scamReportsController from '../controllers/scamReports';
import { requireAuth, requireRole } from '../middleware/auth';
import { reportSubmitLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/', reportSubmitLimiter, scamReportsController.create);
router.get('/', requireAuth, requireRole('admin'), scamReportsController.list);
router.post('/:id/promote', requireAuth, requireRole('admin'), scamReportsController.promote);
router.post('/:id/dismiss', requireAuth, requireRole('admin'), scamReportsController.dismiss);

export default router;
