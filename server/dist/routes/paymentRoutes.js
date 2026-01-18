"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const payoutController_1 = require("../controllers/payoutController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken);
router.post('/create-order', paymentController_1.createPaymentIntent);
router.post('/capture-order', authMiddleware_1.authenticateToken, paymentController_1.capturePayment);
router.post('/payouts', authMiddleware_1.authenticateToken, payoutController_1.sendPayout); // Permission check should be added here ideally
exports.default = router;
