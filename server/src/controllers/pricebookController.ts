import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getPricebookItems = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const items = await prisma.pricebookItem.findMany({
            where: { tenantId }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pricebook', error });
    }
};

export const createPricebookItem = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;
    const { name, description, price, type, category, imageUrl } = req.body;

    try {
        const item = await prisma.pricebookItem.create({
            data: {
                tenantId: tenantId!,
                name,
                description,
                price: parseFloat(price),
                type,
                category,
                imageUrl
            }
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error creating item', error });
    }
};
