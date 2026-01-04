"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pricebookController_1 = require("../controllers/pricebookController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = express_1.default.Router();
const createItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().or(zod_1.z.string().transform(Number)), // Handle string input
        type: zod_1.z.enum(['service', 'material', 'labor']),
        category: zod_1.z.string().optional(),
        imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    }),
});
router.use(authMiddleware_1.authenticateToken);
router.get('/', pricebookController_1.getPricebookItems);
router.post('/', (0, validate_1.validate)(createItemSchema), pricebookController_1.createPricebookItem);
exports.default = router;
