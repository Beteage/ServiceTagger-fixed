"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
// Initialize Stripe with env var or dummy for dev
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});
const createPaymentIntent = async (req, res) => {
    const { amount, currency = 'usd' } = req.body;
    try {
        // If no real key, simulate success for MVP demo
        if (!process.env.STRIPE_SECRET_KEY) {
            console.log('Mocking Payment Intent for:', amount);
            return res.json({ clientSecret: 'pi_mock_secret_12345' });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // cents
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating payment intent', error });
    }
};
exports.createPaymentIntent = createPaymentIntent;
