import { Router } from 'express';
import * as globalSourcesController from '../controllers/globalSources';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', globalSourcesController.list);
router.post('/stats', requireAuth, requireRole('admin'), globalSourcesController.createStat);
router.delete('/stats/:id', requireAuth, requireRole('admin'), globalSourcesController.removeStat);

export default router;
