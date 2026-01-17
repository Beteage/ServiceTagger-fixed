
import express from 'express';
import { getProfile, updateProfile, getUsers, createUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/me', getProfile);
router.put('/me', updateProfile);

// Admin Routes (Technician Management)
router.get('/', getUsers);
router.post('/', createUser);

export default router;
