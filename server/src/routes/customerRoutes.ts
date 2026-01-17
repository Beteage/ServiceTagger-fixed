import express from 'express';
import { createCustomer, getCustomers, deleteCustomer } from '../controllers/customerController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.post('/', createCustomer);
router.get('/', getCustomers);
router.delete('/:id', deleteCustomer);

export default router;
