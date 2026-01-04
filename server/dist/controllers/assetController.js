"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsByCustomer = exports.createAsset = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAsset = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating asset', error });
    }
};
exports.createAsset = createAsset;
const getAssetsByCustomer = async (req, res) => {
    const { customerId } = req.params;
    try {
        const assets = await prisma.asset.findMany({
            where: { customerId },
        });
        res.json(assets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error });
    }
};
exports.getAssetsByCustomer = getAssetsByCustomer;
