import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export const generateInvoice = async (req: Request, res: Response) => {
    const jobId = (req.query.jobId as string) || req.body.jobId;
    const items = req.body.items; // Only works for POST, fallback for GET (items will be undefined)

    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { customer: true, tenant: true },
        });

        if (!job) return res.status(404).json({ message: 'Job not found' });

        // Calculate Items
        let invoiceItemsData = [];
        let totalAmount = 0;

        if (items && items.length > 0) {
            for (const item of items) {
                let pbItem = null;
                if (item.pricebookItemId) {
                    pbItem = await prisma.pricebookItem.findUnique({ where: { id: item.pricebookItemId } });
                }

                if (pbItem) {
                    const total = pbItem.price * item.quantity;
                    invoiceItemsData.push({
                        description: pbItem.name,
                        quantity: item.quantity,
                        unitPrice: pbItem.price,
                        total: total,
                        pricebookItemId: pbItem.id
                    });
                    totalAmount += total;
                } else {
                    // Fallback to provided data
                    const price = Number(item.price) || 0;
                    const total = price * item.quantity;
                    invoiceItemsData.push({
                        description: item.name || 'Item',
                        quantity: item.quantity,
                        unitPrice: price,
                        total: total,
                        // No pricebook ID
                    });
                    totalAmount += total;
                }
            }
        } else {
            // Fallback for MVP if no items passed
            invoiceItemsData.push({
                description: 'Service Call',
                quantity: 1,
                unitPrice: 150.00,
                total: 150.00
            });
            totalAmount = 150.00;
        }

        // Create Invoice Record
        const invoice = await prisma.invoice.create({
            data: {
                jobId: job.id,
                amount: totalAmount,
                status: 'Draft',
                items: {
                    create: invoiceItemsData
                }
            },
            include: { items: true }
        });

        // Generate PDF
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);

        doc.pipe(res);

        doc.fontSize(25).text(job.tenant?.name || 'Service Company', 100, 80);
        doc.fontSize(12).text('Invoice', 100, 120);
        doc.text(`Invoice ID: ${invoice.id.substring(0, 8)}`, 100, 140);
        doc.text(`Customer: ${job.customer.name}`, 100, 160);
        doc.text(`Date: ${new Date().toDateString()}`, 100, 180);

        doc.moveDown();
        doc.text('Items:', 100, 220);

        let y = 240;
        invoice.items.forEach((item: any) => {
            doc.text(`${item.description} x${item.quantity} - $${item.total.toFixed(2)}`, 100, y);
            y += 20;
        });

        doc.moveDown();
        doc.fontSize(14).text(`Total: $${invoice.amount.toFixed(2)}`, 100, y + 20);

        doc.end();

    } catch (error: any) {
        console.error(error);
        const fs = require('fs');
        fs.writeFileSync('error.log', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating invoice', error });
        }
    }
};

export const createStripeInvoice = async (req: Request, res: Response) => {
    const { jobId, amount, description, dueDays } = req.body;

    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { customer: true },
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Enforce Tenant Isolation
        const tenantId = (req as AuthRequest).user?.tenantId;
        if (job.tenantId !== tenantId) {
            return res.status(403).json({ message: 'Unauthorized access to this job' });
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ message: 'Stripe API key not configured' });
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        // 1. Create or retrieve customer
        // Note: Using dummy Customer ID for now as schema support was reverted due to DB connection issues
        let customerId = 'cus_dummy';

        /* 
        // Logic requires schema update
        let customerId = job.customer.stripeCustomerId; 
          ... 
        */

        // 2. Create invoice item
        await stripe.invoiceItems.create({
            customer: customerId,
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            description: description || 'Service Job',
        });

        // 3. Create invoice
        const invoice = await stripe.invoices.create({
            customer: customerId,
            collection_method: 'send_invoice',
            days_until_due: dueDays || 30,
        });

        // 4. Finalize invoice
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

        // 5. Send invoice
        await stripe.invoices.sendInvoice(invoice.id);

        // 6. DB Record
        const localInvoice = await prisma.invoice.create({
            data: {
                jobId: job.id,
                amount: amount,
                status: 'Sent', // Initial status
                // stripeInvoiceId: invoice.id,
            }
        });

        res.json({
            success: true,
            invoiceId: localInvoice.id,
            stripeInvoiceId: invoice.id,
            invoiceUrl: finalizedInvoice.hosted_invoice_url,
            message: 'Stripe invoice created and sent'
        });

    } catch (error: any) {
        console.error('Stripe Invoice Error:', error);
        res.status(500).json({ message: 'Error creating Stripe invoice', error: error.message });
    }
};

export const getInvoices = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const invoices = await prisma.invoice.findMany({
            where: {
                job: {
                    tenantId: tenantId!
                }
            },
            include: {
                job: {
                    include: {
                        customer: true
                    }
                },
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error });
    }
};



// Simplified PayPal logic: Just create local record and let frontend handle the redirect
import { createPayPalInvoice, sendPayPalInvoiceByKey, getPayPalInvoice } from '../services/paypalService';

export const sendPayPalInvoice = async (req: Request, res: Response) => {
    const { jobId, items } = req.body;

    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: { customer: true },
        });

        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (!job.customer.email) return res.status(400).json({ message: 'Customer has no email' });

        // Calculate Items
        let invoiceItemsData = [];
        let totalAmount = 0;

        if (items && items.length > 0) {
            for (const item of items) {
                // If item has pricebookId, fetch details, else use provided
                // For simplicity, trusting frontend passed { name, price, quantity, description } or we fetch again.
                // The modal passes: { pricebookItemId, name, price, quantity }
                invoiceItemsData.push({
                    name: item.name,
                    description: item.name, // or fetch description
                    quantity: item.quantity,
                    price: item.price
                });
                totalAmount += (item.price * item.quantity);
            }
        } else {
            // Fallback
            invoiceItemsData.push({ name: 'Service Call', description: 'Standard Service', quantity: 1, price: 150 });
            totalAmount = 150;
        }

        // Prepare PayPal Data
        const nameParts = job.customer.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        const ppData = {
            customer: {
                email: job.customer.email,
                firstName,
                lastName
            },
            items: invoiceItemsData,
            reference: `JOB-${job.id.substring(0, 6)}`
        };

        // 1. Create Draft
        const draft = await createPayPalInvoice(ppData);
        // 2. Send
        await sendPayPalInvoiceByKey(draft.id);
        // 3. Get Details (for link)
        const details = await getPayPalInvoice(draft.id);
        const payerLink = details.detail?.metadata?.recipient_view_url || `https://www.sandbox.paypal.com/invoice/p/${draft.id}`;
        // Note: recipient_view_url might be available in 'detail' or 'links' depending on exact API response. 
        // Usually `detail.metadata.recipient_view_url`.

        // 4. Save to DB
        const localInvoice = await prisma.invoice.create({
            data: {
                jobId: job.id,
                amount: totalAmount,
                status: 'Sent',
                items: {
                    create: invoiceItemsData.map(i => ({
                        description: i.name,
                        quantity: i.quantity,
                        unitPrice: i.price,
                        total: i.price * i.quantity
                    }))
                }
            }
        });

        res.json({
            success: true,
            invoiceId: localInvoice.id,
            paypalId: draft.id,
            link: payerLink,
            message: 'PayPal Invoice Sent!'
        });

    } catch (error) {
        const fs = require('fs');
        fs.writeFileSync('paypal_error.log', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
        console.error('PayPal Controller Error:', error.message);
        res.status(500).json({ message: 'Error sending PayPal invoice', error: error.message });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const invoice = await prisma.invoice.findFirst({
            where: {
                id,
                job: { tenantId: tenantId! } // Guard via job relation
            }
        });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        // Delete Items
        await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

        // Delete Invoice
        await prisma.invoice.delete({ where: { id } });

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Delete invoice error:', error);
        res.status(500).json({ message: 'Error deleting invoice', error });
    }
};
