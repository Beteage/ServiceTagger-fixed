
import { Router } from 'express';
import { checkTone, chat, getSchedulingSuggestions, predictParts, draftEstimate } from '../controllers/aiController';

const router = Router();

router.post('/tone-check', checkTone);
router.post('/chat', chat);

router.post('/schedule-suggestions', getSchedulingSuggestions);
router.post('/predict-parts', predictParts);
router.post('/draft-estimate', draftEstimate);

export default router;
