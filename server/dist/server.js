"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Enable CORS for Mobile/Web
// Basic Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// Middleware to inject prisma
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const assetRoutes_1 = __importDefault(require("./routes/assetRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const pricebookRoutes_1 = __importDefault(require("./routes/pricebookRoutes"));
const dispatchRoutes_1 = __importDefault(require("./routes/dispatchRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/customers', customerRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/invoices', invoiceRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/assets', assetRoutes_1.default);
app.use('/api/search', searchRoutes_1.default);
app.use('/api/pricebook', pricebookRoutes_1.default);
app.use('/api/dispatch', dispatchRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all for MVP
        methods: ["GET", "POST"]
    }
});
exports.io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
// Start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
