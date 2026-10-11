import { Router } from 'express';
import * as statsController from '../controllers/stats';

const router = Router();

router.get('/', statsController.get);
router.get('/live', statsController.live);

export default router;
