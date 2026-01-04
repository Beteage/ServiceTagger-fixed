import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const createAsset = async (req: Request, res: Response) => {
    const { customerId, type, make, model, serial, installDate } = req.body;

    try {
        const asset = await prisma.asset.create({
            data: {
                customerId,
                type,
                make,
                model,
                serial,
                installDate: installDate ? new Date(installDate) : null,
            },
        });
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Error creating asset', error });
    }
};

export const getAssetsByCustomer = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        const assets = await prisma.asset.findMany({
            where: { customerId },
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error });
    }
};
