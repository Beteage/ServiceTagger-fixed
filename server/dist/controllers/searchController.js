"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const search = async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json([]);
    }
    const query = q.toLowerCase();
    try {
        // Search Customers and Assets in parallel
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query } }, // Case insensitive usually depends on DB collation
                    { phone: { contains: query } },
                    { address: { contains: query } },
                ]
            },
            take: 5
        });
        const assets = await prisma.asset.findMany({
            where: {
                OR: [
                    { type: { contains: query } },
                    { serial: { contains: query } },
                    { make: { contains: query } },
                    { model: { contains: query } }
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
    }
    catch (error) {
        res.status(500).json({ message: 'Search error', error });
    }
};
exports.search = search;
