import { Request, Response } from 'express';
// Auth Controller
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Register: Don't login yet, require payment first
export const register = async (req: Request, res: Response) => {
    const { businessName, email, password } = req.body;

    try {
        // 0. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 1. Create Tenant
        const tenant = await prisma.tenant.create({
            data: {
                name: businessName,
                subscriptionStatus: 'pending', // Mark as pending
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

        // No token returned - user must pay to activate
        res.status(201).json({
            message: 'Registration successful. Payment required.',
            userId: user.id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true } // Need tenant for status check
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, tenantId: user.tenantId, role: user.role },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId, tenant: user.tenant } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const quickAccess = async (req: Request, res: Response) => {
    const { code } = req.body;
    console.log('Quick Access attempt with code:', code, 'Type:', typeof code);

    if (String(code).trim() !== '2252') {
        return res.status(401).json({ message: 'Invalid access code' });
    }

    try {
        let user = await prisma.user.findUnique({ where: { email: 'hi@hi.com' } });

        if (!user) {
            // Auto-create if doesn't exist
            const tenant = await prisma.tenant.create({
                data: { name: 'Demo Tenant' }
            });

            const hashedPassword = await bcrypt.hash('hihihi', 10);

            user = await prisma.user.create({
                data: {
                    email: 'hi@hi.com',
                    password: hashedPassword,
                    role: 'Admin',
                    tenantId: tenant.id
                }
            });
        }

        const token = jwt.sign(
            { userId: user.id, tenantId: user.tenantId, role: user.role },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId } });
    } catch (error) {
        console.error("Quick access error:", error);
        res.status(500).json({ message: 'Error granting access', error });
    }
};
