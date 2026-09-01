import { Router } from 'express';
import * as alertCandidatesController from '../controllers/alertCandidates';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requireRole('admin'), alertCandidatesController.listPending);
router.post('/:id/approve', requireAuth, requireRole('admin'), alertCandidatesController.approve);
router.post('/:id/dismiss', requireAuth, requireRole('admin'), alertCandidatesController.dismiss);

export default router;
