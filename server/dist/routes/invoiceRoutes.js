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
router.get('/generate', invoiceController_1.generateInvoice);
// We need to change controller to accept query param if GET
exports.default = router;
