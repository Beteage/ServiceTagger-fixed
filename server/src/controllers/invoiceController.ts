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
                const pbItem = await prisma.pricebookItem.findUnique({ where: { id: item.pricebookItemId } });
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

    } catch (error) {
        console.error(error);
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

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ message: 'Stripe API key not configured' });
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        // 1. Create or retrieve customer
        let customerId = job.customer.stripeCustomerId;

        if (!customerId) {
            // Search by email if exists, otherwise create
            if (job.customer.email) {
                const customers = await stripe.customers.list({ email: job.customer.email, limit: 1 });
                if (customers.data.length > 0) {
                    customerId = customers.data[0].id;
                }
            }

            if (!customerId) {
                const customer = await stripe.customers.create({
                    email: job.customer.email || undefined,
                    name: job.customer.name,
                    description: 'ServiceTagger Customer'
                });
                customerId = customer.id;
            }

            // Save Stripe Customer ID
            await prisma.customer.update({
                where: { id: job.customer.id },
                data: { stripeCustomerId: customerId }
            });
        }

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
                // stripeHostedUrl: finalizedInvoice.hosted_invoice_url,
                // Note: items are not detailed here in local DB for this flow, could improve later
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
