"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capturePayment = exports.createPaymentIntent = void 0;
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const paypalClient_1 = require("../utils/paypalClient");
const createPaymentIntent = async (req, res) => {
    // For PayPal, we create an "Order" instead of a PaymentIntent
    const { amount, currency = 'USD' } = req.body;
    const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
                amount: {
                    currency_code: currency.toUpperCase(),
                    value: amount.toString()
                }
            }]
    });
    try {
        const order = await (0, paypalClient_1.client)().execute(request);
        res.json({ id: order.result.id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating PayPal order', error });
    }
};
exports.createPaymentIntent = createPaymentIntent;
const capturePayment = async (req, res) => {
    const { orderId } = req.body;
    const request = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    try {
        const capture = await (0, paypalClient_1.client)().execute(request);
        // Here you would find the Invoice and update status to PAID
        // const invoiceId = ... (need to pass checking logic)
        res.json(capture.result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error capturing PayPal order', error });
    }
};
exports.capturePayment = capturePayment;
