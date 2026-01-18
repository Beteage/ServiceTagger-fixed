"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.getCustomers = exports.createCustomer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCustomer = async (req, res) => {
    const { name, email, phone, address } = req.body;
    const tenantId = req.user?.tenantId;
    // Mock Geocoding (Random point around Los Angeles)
    // Base: 34.0522, -118.2437
    const lat = 34.0522 + (Math.random() - 0.5) * 0.1;
    const lng = -118.2437 + (Math.random() - 0.5) * 0.1;
    try {
        const customer = await prisma.customer.create({
            data: {
                tenantId: tenantId,
                name,
                email,
                address,
                phone,
                lat,
                lng
            },
        });
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating customer', error });
    }
};
exports.createCustomer = createCustomer;
const getCustomers = async (req, res) => {
    const tenantId = req.user?.tenantId;
    try {
        const customers = await prisma.customer.findMany({
            where: { tenantId: tenantId },
        });
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
};
exports.getCustomers = getCustomers;
const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    try {
        // Enforce tenant isolation
        const customer = await prisma.customer.findFirst({
            where: { id, tenantId: tenantId }
        });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        // Cascading delete
        // 1. Delete Invoices linked to Jobs linked to this Customer
        await prisma.invoiceItem.deleteMany({ where: { invoice: { job: { customerId: id } } } }); // Deepest level first
        await prisma.invoice.deleteMany({ where: { job: { customerId: id } } });
        // 2. Delete Jobs
        await prisma.job.deleteMany({ where: { customerId: id } });
        // 3. Delete Assets
        await prisma.asset.deleteMany({ where: { customerId: id } });
        // 4. Delete Customer
        await prisma.customer.delete({ where: { id } });
        res.json({ message: 'Customer and related data deleted successfully' });
    }
    catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ message: 'Error deleting customer', error });
    }
};
exports.deleteCustomer = deleteCustomer;
