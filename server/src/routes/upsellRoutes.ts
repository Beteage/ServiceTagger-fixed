import express from 'express';
import { getUpsellSuggestions } from '../controllers/upsellController';

const router = express.Router();

router.get('/suggestions', getUpsellSuggestions);

export default router;
