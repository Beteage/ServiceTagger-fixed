
import { Router } from 'express';
import { checkTone, chat } from '../controllers/aiController';

const router = Router();

router.post('/tone-check', checkTone);
router.post('/chat', chat);

export default router;
