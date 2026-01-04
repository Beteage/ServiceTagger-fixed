"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
const register = async (req, res) => {
    const { businessName, email, password } = req.body;
    try {
        // 1. Create Tenant
        const tenant = await prisma.tenant.create({
            data: {
                name: businessName,
            },
        });
        // 2. Hash Password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, tenantId: user.tenantId, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId } });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
exports.login = login;
