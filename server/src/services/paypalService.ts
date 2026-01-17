import axios from 'axios';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const API_URL = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

/**
 * Get Access Token from PayPal
 */
const getAccessToken = async () => {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error('PayPal credentials missing');
    }

    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post(
            `${API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error: any) {
        console.error('PayPal Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with PayPal');
    }
};

/**
 * Generate Next Invoice Number (Helper)
 */
const generateInvoiceNumber = () => {
    return 'INV-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
};

/**
 * Create Invoice Draft
 */
export const createPayPalInvoice = async (invoiceData: any) => {
    const accessToken = await getAccessToken();

    // PayPal API expects data in specific format.
    // invoiceData should have { customer: { email, firstName, lastName }, items: [{ name, price, quantity, description }] }

    const payload = {
        detail: {
            invoice_number: generateInvoiceNumber(),
            reference: invoiceData.reference || 'REF-001',
            invoice_date: new Date().toISOString().split('T')[0],
            currency_code: 'USD',
            note: 'Thank you for your business.',
            term: 'Due on receipt',
            payment_term: {
                term_type: "DUE_ON_RECEIPT"
            }
        },
        primary_recipients: [
            {
                billing_info: {
                    name: {
                        given_name: invoiceData.customer.firstName || 'Valued',
                        surname: invoiceData.customer.lastName || 'Customer'
                    },
                    email_address: invoiceData.customer.email
                }
            }
        ],
        items: invoiceData.items.map((item: any) => ({
            name: item.name,
            description: item.description ? item.description.substring(0, 100) : item.name,
            quantity: item.quantity,
            unit_amount: {
                currency_code: 'USD',
                value: item.price.toString()
            },
            unit_of_measure: 'QUANTITY'
        })),
        configuration: {
            partial_payment: {
                allow_partial_payment: false
            },
            allow_tip: true,
            tax_calculated_after_discount: true,
            tax_inclusive: false
        }
    };

    try {
        const response = await axios.post(
            `${API_URL}/v2/invoicing/invoices`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data; // Includes 'href' to self, 'id'
    } catch (error: any) {
        const details = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error('PayPal Create Invoice Error:', details);
        throw new Error(`Failed to create PayPal invoice: ${details}`);
    }
};

/**
 * Send Invoice
 */
export const sendPayPalInvoiceByKey = async (invoiceId: string) => {
    const accessToken = await getAccessToken();

    try {
        const response = await axios.post(
            `${API_URL}/v2/invoicing/invoices/${invoiceId}/send`,
            {
                send_to_recipient: true,
                send_to_invoicer: true
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('PayPal Send Error:', error.response?.data || error.message);
        throw new Error('Failed to send PayPal invoice');
    }
};

/**
 * Get Invoice Details
 */
export const getPayPalInvoice = async (invoiceId: string) => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios.get(
            `${API_URL}/v2/invoicing/invoices/${invoiceId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('PayPal Get Error:', error.response?.data || error.message);
        throw new Error('Failed to get PayPal invoice details');
    }
};

/**
 * Create Payout (Send Money)
 */
export const createPayout = async (email: string, amount: number, note: string = 'Payout from ServiceTagger') => {
    const accessToken = await getAccessToken();

    // Batch ID must be unique. Using timestamp + random.
    const senderBatchId = `al-batch-${Date.now()}`;

    const payload = {
        sender_batch_header: {
            sender_batch_id: senderBatchId,
            email_subject: "You have a payment",
            email_message: note
        },
        items: [
            {
                recipient_type: "EMAIL",
                amount: {
                    value: amount.toFixed(2),
                    currency: "USD"
                },
                note: note,
                sender_item_id: `item-${Date.now()}`,
                receiver: email,
                notification_language: "en-US"
            }
        ]
    };

    try {
        const response = await axios.post(
            `${API_URL}/v1/payments/payouts`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        const details = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        console.error('PayPal Payout Error:', details);
        throw new Error(`Failed to create payout: ${details}`);
    }
};
