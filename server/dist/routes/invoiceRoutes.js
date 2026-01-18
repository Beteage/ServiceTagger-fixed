"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoiceController_1 = require("../controllers/invoiceController");
const router = express_1.default.Router();
// Changed to GET for simple download link (MVP)
// In production, should be POST with auth, handling blob on client
router.post('/generate', invoiceController_1.generateInvoice);
router.post('/stripe', invoiceController_1.createStripeInvoice); // New Stripe integration endpoint
router.post('/paypal', invoiceController_1.sendPayPalInvoice); // New PayPal integration endpoint
router.delete('/:id', invoiceController_1.deleteInvoice);
router.get('/', invoiceController_1.getInvoices);
exports.default = router;
