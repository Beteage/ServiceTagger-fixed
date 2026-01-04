import express from 'express';
import { search } from '../controllers/searchController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.get('/', search);

export default router;
