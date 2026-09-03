import { Router } from 'express';
import * as dailyNewsController from '../controllers/dailyNews';

const router = Router();

router.get('/', dailyNewsController.list);

export default router;
