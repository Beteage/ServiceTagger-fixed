
import { Router } from 'express';
import { getRecommendedTechnicians, getAllTechnicians } from '../controllers/dispatchController';

const router = Router();

router.get('/recommend', getRecommendedTechnicians);
router.get('/technicians', getAllTechnicians);

export default router;
