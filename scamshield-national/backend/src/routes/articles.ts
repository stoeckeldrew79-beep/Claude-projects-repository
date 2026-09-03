import { Router } from 'express';
import * as articlesController from '../controllers/articles';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/drafts', requireAuth, requireRole('admin'), articlesController.listDrafts);
router.get('/', articlesController.list);
router.get('/:slug', articlesController.getBySlug);
router.post('/', requireAuth, requireRole('admin'), articlesController.create);
router.put('/:id', requireAuth, requireRole('admin'), articlesController.update);
router.delete('/:id', requireAuth, requireRole('admin'), articlesController.remove);

export default router;
