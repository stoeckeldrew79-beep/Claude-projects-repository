import { Router } from 'express';
import * as stateAgSourcesController from '../controllers/stateAgSources';

const router = Router();

router.get('/', stateAgSourcesController.list);

export default router;
