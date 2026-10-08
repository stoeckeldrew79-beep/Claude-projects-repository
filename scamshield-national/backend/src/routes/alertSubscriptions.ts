import { Router } from 'express';
import * as alertSubscriptionsController from '../controllers/alertSubscriptions';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/preferences', requireAuth, alertSubscriptionsController.getPreferences);
router.put('/preferences', requireAuth, alertSubscriptionsController.updatePreferences);
router.get('/watch-profiles', requireAuth, alertSubscriptionsController.listWatchProfiles);
router.post('/watch-profiles', requireAuth, alertSubscriptionsController.createWatchProfile);
router.delete('/watch-profiles/:id', requireAuth, alertSubscriptionsController.deleteWatchProfile);

export default router;
