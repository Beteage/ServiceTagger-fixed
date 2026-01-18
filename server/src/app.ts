import express from 'express';
import path from 'path';
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
import pricingRoutes from './routes/pricingRoutes';
import upsellRoutes from './routes/upsellRoutes';
import seedRoutes from './routes/seedRoutes';
import userRoutes from './routes/userRoutes';
import webhookRoutes from './routes/webhookRoutes';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const prisma = new PrismaClient();

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Webhook Route (Raw Body required for verification)
// Must be defined BEFORE express.json()
app.use('/api/webhook', express.raw({ type: 'application/json', verify: (req: any, res, buf) => { req.rawBody = buf; } }), webhookRoutes);

app.use(express.json());

// CORS Configuration
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173'] : ['http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        // Allow no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) { // Allow local + configured + vercel preview
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

// Basic Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected', timestamp: new Date() });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).json({ status: 'error', database: 'disconnected', error: String(error), timestamp: new Date() });
    }
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
app.use('/api/pricing', pricingRoutes);
app.use('/api/upsells', upsellRoutes);
app.use('/api/seed', seedRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Catch-all route to serve index.html for any route not handled by API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

export default app;
