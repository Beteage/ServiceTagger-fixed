import express from 'express';
import { generateInvoice, getInvoices } from '../controllers/invoiceController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Changed to GET for simple download link (MVP)
// In production, should be POST with auth, handling blob on client
router.post('/generate', generateInvoice);
router.get('/', getInvoices);
// We need to change controller to accept query param if GET

export default router;
