import express from 'express';
import { getMarketPricing } from '../controllers/pricingController';

const router = express.Router();

router.get('/market', getMarketPricing);

export default router;
