import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const seedData = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    try {
        // 1. Create Customers
        const customers = await Promise.all([
            prisma.customer.create({
                data: {
                    tenantId,
                    name: 'Beverly Hills Hotel',
                    address: '9641 Sunset Blvd, Beverly Hills, CA 90210',
                    phone: '310-276-2251',
                    email: 'concierge@beverlyhillshotel.com',
                    lat: 34.0816,
                    lng: -118.4137
                }
            }),
            prisma.customer.create({
                data: {
                    tenantId,
                    name: 'Santa Monica Pier Mgmt',
                    address: '200 Santa Monica Pier, Santa Monica, CA 90401',
                    phone: '310-458-8901',
                    email: 'ops@santamonicapier.com',
                    lat: 34.0092,
                    lng: -118.4976
                }
            }),
            prisma.customer.create({
                data: {
                    tenantId,
                    name: 'Griffith Observatory',
                    address: '2800 E Observatory Rd, Los Angeles, CA 90027',
                    phone: '213-473-0800',
                    email: 'facility@griffith.org',
                    lat: 34.1184,
                    lng: -118.3004
                }
            }),
            prisma.customer.create({
                data: {
                    tenantId,
                    name: 'Staples Center Ops',
                    address: '1111 S Figueroa St, Los Angeles, CA 90015',
                    phone: '213-742-7100',
                    email: 'hvac@cryptoarena.com',
                    lat: 34.0430,
                    lng: -118.2673
                }
            })
        ]);

        // 2. Create Jobs
        const now = new Date();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);

        await prisma.job.create({
            data: {
                tenantId,
                customerId: customers[0].id,
                status: 'Scheduled',
                scheduledStart: tomorrow,
                // description: 'Main Chiller Maintenance' // Re-enabling description if schema fixed or just omit for now
            }
        });

        await prisma.job.create({
            data: {
                tenantId,
                customerId: customers[1].id,
                status: 'EnRoute',
                scheduledStart: now,
            }
        });

        await prisma.job.create({
            data: {
                tenantId,
                customerId: customers[2].id,
                status: 'Draft',
                scheduledStart: tomorrow,
            }
        });

        await prisma.job.create({
            data: {
                tenantId,
                customerId: customers[3].id,
                status: 'Done',
                scheduledStart: yesterday,
            }
        });

        res.json({ message: 'Seeding complete', customers: customers.length, jobs: 4 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Seeding failed', error });
    }
};

export const clearData = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;
    if (!tenantId) return res.status(400).json({ message: 'Tenant ID required' });

    try {
        // Delete in order to respect potential constraints (though Cascade might handle it, manual is safer)
        // 1. Invoices
        await prisma.invoiceItem.deleteMany({ where: { invoice: { job: { tenantId } } } }); // Deep relation
        await prisma.invoice.deleteMany({ where: { job: { tenantId } } });

        // 2. Jobs
        await prisma.job.deleteMany({ where: { tenantId } });

        // 3. Assets
        await prisma.asset.deleteMany({ where: { customer: { tenantId } } });

        // 4. Customers
        await prisma.customer.deleteMany({ where: { tenantId } });

        // 5. Pricebook
        await prisma.pricebookItem.deleteMany({ where: { tenantId } });

        res.json({ message: 'All data cleared successfully' });
    } catch (error) {
        console.error('Clear data error:', error);
        res.status(500).json({ message: 'Failed to clear data', error });
    }
};
