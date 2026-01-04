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
            where: { id: jobId }, // Fixed: where: { id: jobId } not where: { jobId }
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
