import express from 'express';
import { generateInvoice, getInvoices, createStripeInvoice } from '../controllers/invoiceController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Changed to GET for simple download link (MVP)
// In production, should be POST with auth, handling blob on client
router.post('/generate', generateInvoice);
router.post('/stripe', createStripeInvoice); // New Stripe integration endpoint
router.get('/', getInvoices);

export default router;
