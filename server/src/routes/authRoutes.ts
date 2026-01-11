import express from 'express';
import { register, login, quickAccess } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/authSchemas';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/quick-access', quickAccess);

export default router;
