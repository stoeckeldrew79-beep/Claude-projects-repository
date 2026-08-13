import { Router } from 'express';
import * as scamsController from '../controllers/scams';
import { requireAuth, requireRole } from '../middleware/auth';
import { requireSubscriber } from '../middleware/subscription';

const router = Router();

router.get('/search', scamsController.search);
router.get('/nearby', requireAuth, requireSubscriber, scamsController.nearby);
router.get('/countries', scamsController.countries);
router.get('/by-country', scamsController.byCountry);
router.get('/', scamsController.list);
router.get('/:slug', scamsController.getBySlug);
router.post('/', requireAuth, requireRole('admin'), scamsController.create);
router.put('/:id', requireAuth, requireRole('admin'), scamsController.update);
router.delete('/:id', requireAuth, requireRole('admin'), scamsController.remove);

export default router;
