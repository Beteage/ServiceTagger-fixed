import { Request, Response } from 'express';
import { createPayout } from '../services/paypalService';

export const sendPayout = async (req: Request, res: Response) => {
    const { email, amount, note } = req.body;

    if (!email || !amount) {
        return res.status(400).json({ message: 'Email and amount are required' });
    }

    try {
        const payout = await createPayout(email, Number(amount), note);
        res.json({ success: true, payout });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
