import { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe with env var or dummy for dev
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

export const createPaymentIntent = async (req: Request, res: Response) => {
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
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment intent', error });
    }
};
