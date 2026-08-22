import { Router } from 'express';
import * as statsController from '../controllers/stats';

const router = Router();

router.get('/', statsController.get);
router.get('/breakdown', statsController.breakdown);

export default router;
