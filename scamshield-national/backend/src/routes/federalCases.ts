import { Router } from 'express';
import * as federalCasesController from '../controllers/federalCases';

const router = Router();

router.get('/', federalCasesController.list);
router.get('/stats', federalCasesController.stats);

export default router;
