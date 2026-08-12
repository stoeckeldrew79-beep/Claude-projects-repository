import { Router } from 'express';
import * as categoriesController from '../controllers/categories';

const router = Router();

router.get('/trends', categoriesController.trends);
router.get('/', categoriesController.list);
router.get('/:slug', categoriesController.getBySlug);

export default router;
