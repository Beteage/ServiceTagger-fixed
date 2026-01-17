import { Request, Response } from 'express';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { client } from '../utils/paypalClient';

export const createPaymentIntent = async (req: Request, res: Response) => {
    // For PayPal, we create an "Order" instead of a PaymentIntent
    const { amount, currency = 'USD' } = req.body;

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
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
        const order = await client().execute(request);
        res.json({ id: order.result.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating PayPal order', error });
    }
};

export const capturePayment = async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({} as any);

    try {
        const capture = await client().execute(request);
        // Here you would find the Invoice and update status to PAID
        // const invoiceId = ... (need to pass checking logic)

        res.json(capture.result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error capturing PayPal order', error });
    }
};
