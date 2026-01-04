import express from 'express';
import { createAsset, getAssetsByCustomer } from '../controllers/assetController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = express.Router();

const createAssetSchema = z.object({
    body: z.object({
        customerId: z.string().uuid(),
        type: z.string().min(1),
        make: z.string().optional(),
        model: z.string().optional(),
        serial: z.string().optional(),
        installDate: z.string().datetime().optional().or(z.string().optional()), // Allow string date
    }),
});

router.use(authenticateToken);
router.post('/', validate(createAssetSchema), createAsset);
router.get('/customer/:customerId', getAssetsByCustomer);

export default router;
