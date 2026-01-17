import express from 'express';
import { createPaymentIntent, capturePayment } from '../controllers/paymentController';
import { sendPayout } from '../controllers/payoutController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);
router.post('/create-order', createPaymentIntent);
router.post('/capture-order', authenticateToken, capturePayment);
router.post('/payouts', authenticateToken, sendPayout); // Permission check should be added here ideally

export default router;
