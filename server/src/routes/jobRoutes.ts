import express from 'express';
import { createJob, getJobs, updateJobStatus } from '../controllers/jobController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createJobSchema } from '../schemas/jobSchemas';

const router = express.Router();

router.use(authenticateToken);
router.post('/', validate(createJobSchema), createJob);
router.get('/', getJobs);
router.patch('/:id/status', updateJobStatus);

export default router;
