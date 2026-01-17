import express from 'express';
import { seedData, clearData } from '../controllers/seedController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.post('/', seedData);
router.delete('/', clearData);

export default router;
