"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const tenants = await prisma.tenant.findMany();
    if (tenants.length === 0)
        return;
    const tenantId = tenants[0].id; // Seed for first tenant
    const items = [
        {
            tenantId,
            name: 'Furnace Tune-up',
            description: '21-point inspection and cleaning',
            price: 99.00,
            type: 'service',
            category: 'HVAC',
        },
        {
            tenantId,
            name: 'Capacitor (35/5)',
            description: 'Dual run capacitor',
            price: 45.00,
            type: 'material',
            category: 'Parts',
        },
        {
            tenantId,
            name: 'Drain Cleaning',
            description: 'Clear main line blockage',
            price: 150.00,
            type: 'service',
            category: 'Plumbing',
        }
    ];
    for (const item of items) {
        await prisma.pricebookItem.create({ data: item });
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
