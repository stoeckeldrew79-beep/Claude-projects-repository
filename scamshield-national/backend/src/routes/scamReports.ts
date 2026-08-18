import { Router } from 'express';
import * as scamReportsController from '../controllers/scamReports';
import * as reportFilingsController from '../controllers/reportFilings';
import { requireAuth, requireRole } from '../middleware/auth';
import { reportSubmitLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/', reportSubmitLimiter, scamReportsController.create);
router.get('/', requireAuth, requireRole('admin'), scamReportsController.list);
router.get('/:id/status', scamReportsController.status);
router.post('/:id/promote', requireAuth, requireRole('admin'), scamReportsController.promote);
router.post('/:id/dismiss', requireAuth, requireRole('admin'), scamReportsController.dismiss);

router.get('/:id/filings/suggestions', requireAuth, requireRole('admin'), reportFilingsController.suggestions);
router.get('/:id/filings', requireAuth, requireRole('admin'), reportFilingsController.list);
router.post('/:id/filings', requireAuth, requireRole('admin'), reportFilingsController.create);
router.patch('/:id/filings/:filingId', requireAuth, requireRole('admin'), reportFilingsController.update);

export default router;
