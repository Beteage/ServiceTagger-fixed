"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assetController_1 = require("../controllers/assetController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const router = express_1.default.Router();
const createAssetSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().uuid(),
        type: zod_1.z.string().min(1),
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        serial: zod_1.z.string().optional(),
        installDate: zod_1.z.string().datetime().optional().or(zod_1.z.string().optional()), // Allow string date
    }),
});
router.use(authMiddleware_1.authenticateToken);
router.post('/', (0, validate_1.validate)(createAssetSchema), assetController_1.createAsset);
router.get('/customer/:customerId', assetController_1.getAssetsByCustomer);
exports.default = router;
