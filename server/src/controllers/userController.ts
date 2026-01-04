
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                // Add name if it exists in schema, otherwise we might need to rely on email or add it.
                // Checking schema earlier: User only has email, password, role, skills.
                // It does NOT have First/Last name. I should probably add them to schema or just use email for now.
                // For this MVP, I will assume we just display Email and maybe add "Name" to schema later if requested.
                // Wait, SettingsPage has inputs for First/Last Name. 
                // I will add a "name" field to User schema to make it real.
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const userId = (req as AuthRequest).user?.userId;
    const { email, password } = req.body; // Only allowing email/password update for now as schema is limited

    try {
        const data: any = {};
        if (email) data.email = email;
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: { id: true, email: true, role: true }
        });

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
