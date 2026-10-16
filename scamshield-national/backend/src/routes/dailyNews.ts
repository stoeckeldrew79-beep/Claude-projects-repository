import { Router } from 'express';
import * as dailyNewsController from '../controllers/dailyNews';

const router = Router();

router.get('/count', dailyNewsController.count);
router.get('/', dailyNewsController.list);
router.get('/states', dailyNewsController.states);
router.get('/latest-by-state', dailyNewsController.latestByState);
router.get('/ag-status', dailyNewsController.agStatus);

export default router;
