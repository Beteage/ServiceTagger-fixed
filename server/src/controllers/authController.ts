import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
    const { businessName, email, password } = req.body;

    try {
        // 1. Create Tenant
        const tenant = await prisma.tenant.create({
            data: {
                name: businessName,
            },
        });

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create Admin User
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'Admin',
                tenantId: tenant.id,
            },
        });

        res.status(201).json({ message: 'Registered successfully', tenantId: tenant.id, userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, tenantId: user.tenantId, role: user.role },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
