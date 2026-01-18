import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json([]);
    }

    console.log(`[Search] Request for: '${q}'`);
    const query = q.toLowerCase();

    try {
        // Search Customers and Assets in parallel
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { phone: { contains: query, mode: 'insensitive' } },
                    { address: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        });

        const assets = await prisma.asset.findMany({
            where: {
                OR: [
                    { type: { contains: query, mode: 'insensitive' } },
                    { serial: { contains: query, mode: 'insensitive' } },
                    { make: { contains: query, mode: 'insensitive' } },
                    { model: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: { customer: true },
            take: 5
        });

        // Format results
        const results = [
            ...customers.map(c => ({
                type: 'customer',
                id: c.id,
                title: c.name,
                subtitle: c.address,
                detail: c.phone,
                data: c
            })),
            ...assets.map(a => ({
                type: 'asset',
                id: a.id,
                title: `${a.type} - ${a.make} ${a.model || ''}`,
                subtitle: a.customer.name,
                detail: `Serial: ${a.serial}`,
                data: a.customer // Link back to customer for booking
            }))
        ];

        res.json(results);

    } catch (error) {
        res.status(500).json({ message: 'Search error', error });
    }
};
