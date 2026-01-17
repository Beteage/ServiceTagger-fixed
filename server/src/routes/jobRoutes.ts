import express from 'express';
import { createJob, getJobs, updateJobStatus, getJobById, updateJob, deleteJob } from '../controllers/jobController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createJobSchema } from '../schemas/jobSchemas';

const router = express.Router();

router.use(authenticateToken);
router.post('/', validate(createJobSchema), createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.patch('/:id/status', updateJobStatus);

export default router;
