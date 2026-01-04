import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.post('/create-payment-intent', createPaymentIntent);

export default router;
