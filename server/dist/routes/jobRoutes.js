"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const jobSchemas_1 = require("../schemas/jobSchemas");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
router.post('/', (0, validate_1.validate)(jobSchemas_1.createJobSchema), jobController_1.createJob);
router.get('/', jobController_1.getJobs);
router.get('/:id', jobController_1.getJobById);
router.put('/:id', jobController_1.updateJob);
router.delete('/:id', jobController_1.deleteJob);
router.patch('/:id/status', jobController_1.updateJobStatus);
exports.default = router;
