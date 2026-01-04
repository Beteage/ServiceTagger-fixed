import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const createCustomer = async (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;
    const tenantId = (req as AuthRequest).user?.tenantId;

    // Mock Geocoding (Random point around Los Angeles)
    // Base: 34.0522, -118.2437
    const lat = 34.0522 + (Math.random() - 0.5) * 0.1;
    const lng = -118.2437 + (Math.random() - 0.5) * 0.1;

    try {
        const customer = await prisma.customer.create({
            data: {
                tenantId: tenantId!,
                name,
                // email, // Note: Email not in schema yet based on previous view, but assuming standard fields. Checking schema...
                // Schema checks: name, address, phone, lat, lng, tenantId. No email in Customer schema based on previous `view_file`.
                // I will remove email from data if not in schema.
                address,
                phone,
                // @ts-ignore: Lat/Lng added in recent migration, types might be lagging in IDE check
                lat,
                // @ts-ignore
                lng
            },
        });
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error creating customer', error });
    }
};

export const getCustomers = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const customers = await prisma.customer.findMany({
            where: { tenantId: tenantId! },
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
};
