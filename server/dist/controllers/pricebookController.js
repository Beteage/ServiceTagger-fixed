"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPricebookItem = exports.getPricebookItems = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPricebookItems = async (req, res) => {
    const tenantId = req.user?.tenantId;
    try {
        const items = await prisma.pricebookItem.findMany({
            where: { tenantId }
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching pricebook', error });
    }
};
exports.getPricebookItems = getPricebookItems;
const createPricebookItem = async (req, res) => {
    const tenantId = req.user?.tenantId;
    const { name, description, price, type, category, imageUrl } = req.body;
    try {
        const item = await prisma.pricebookItem.create({
            data: {
                tenantId: tenantId,
                name,
                description,
                price: parseFloat(price),
                type,
                category,
                imageUrl
            }
        });
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
};
exports.createPricebookItem = createPricebookItem;
