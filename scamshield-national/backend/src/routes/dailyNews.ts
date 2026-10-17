import { Router } from 'express';
import * as dailyNewsController from '../controllers/dailyNews';
import { microCache } from '../middleware/microCache';

const router = Router();

// The feed only changes when a scan runs (every 2-4 hours), so a minute of
// caching costs nothing in freshness and makes repeat loads instant.
router.use(microCache(60_000));

router.get('/count', dailyNewsController.count);
router.get('/', dailyNewsController.list);
router.get('/states', dailyNewsController.states);
router.get('/latest-by-state', dailyNewsController.latestByState);
router.get('/summary', dailyNewsController.summary);
router.get('/federal', dailyNewsController.federal);
router.get('/ag-status', dailyNewsController.agStatus);

export default router;
