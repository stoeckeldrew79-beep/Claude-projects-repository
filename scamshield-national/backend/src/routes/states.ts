import { Router } from 'express';
import * as statesController from '../controllers/states';

const router = Router();

router.get('/', statesController.list);
// Must stay last: a literal route added later has to precede this or the
// slug pattern will swallow it.
router.get('/:slug', statesController.getBySlug);

export default router;
