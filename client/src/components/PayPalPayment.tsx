import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from '../api/axios';
import { toast } from 'sonner';

interface PayPalPaymentProps {
    amount: number;
    currency?: string;
    onSuccess: (details: any) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ amount, currency = "USD", onSuccess }) => {
    // Initial Options
    const initialOptions = {
        clientId: "test", // "test" is for sandbox. Replace with env var in production.
        currency: currency,
        intent: "capture",
    };

    const createOrder = async (_data: any, _actions: any) => {
        try {
            const response = await api.post('/payments/create-order', {
                amount: amount,
                currency: currency
            });
            return response.data.id;
        } catch (err) {
            console.error("Create Order Error:", err);
            toast.error("Failed to initiate PayPal payment");
            throw err;
        }
    };

    const onApprove = async (data: any, _actions: any) => {
        try {
            const response = await api.post('/payments/capture-order', {
                orderId: data.orderID
            });

            const details = response.data;
            toast.success(`Transaction completed by ${details.payer.name.given_name}`);
            onSuccess(details);
        } catch (err) {
            console.error("Capture Order Error:", err);
            toast.error("Payment failed during capture");
        }
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div className="z-0 relative">
                <PayPalButtons
                    style={{ layout: "vertical", shape: "rect" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default PayPalPayment;
