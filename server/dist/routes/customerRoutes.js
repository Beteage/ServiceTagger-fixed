"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateToken); // Protect all routes
router.post('/', customerController_1.createCustomer);
router.get('/', customerController_1.getCustomers);
router.delete('/:id', customerController_1.deleteCustomer);
exports.default = router;
