import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import jobRoutes from './routes/jobRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import assetRoutes from './routes/assetRoutes';
import searchRoutes from './routes/searchRoutes';
import pricebookRoutes from './routes/pricebookRoutes';
import dispatchRoutes from './routes/dispatchRoutes';
import aiRoutes from './routes/aiRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({
    origin: "*", // Allow all for MVP
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Middleware to inject prisma
app.use((req, res, next) => {
    (req as any).prisma = prisma;
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/pricebook', pricebookRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/ai', aiRoutes);

export default app;
