import express from 'express';
import { getPricebookItems, createPricebookItem } from '../controllers/pricebookController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = express.Router();

const createItemSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.number().or(z.string().transform(Number)), // Handle string input
        type: z.enum(['service', 'material', 'labor']),
        category: z.string().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')),
    }),
});

router.use(authenticateToken);
router.get('/', getPricebookItems);
router.post('/', validate(createItemSchema), createPricebookItem);

export default router;
