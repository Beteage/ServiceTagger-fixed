"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJobById = exports.updateJobStatus = exports.getJobs = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const emailService_1 = require("../services/emailService");
const createJob = async (req, res) => {
    const { customerId, scheduledStart, description, technicianId } = req.body;
    const tenantId = req.user?.tenantId;
    try {
        const job = await prisma.job.create({
            data: {
                scheduledStart: new Date(scheduledStart),
                customerId,
                tenantId: tenantId,
                technicianId, // Assign technician
                status: 'Draft',
            },
            include: { customer: true, technician: true } // Include relations
        });
        // Send Notification if technician assigned
        if (job.technician && job.technician.email) {
            (0, emailService_1.sendJobAssignmentEmail)(job.technician.email, job);
        }
        res.status(201).json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating job', error });
    }
};
exports.createJob = createJob;
const getJobs = async (req, res) => {
    const tenantId = req.user?.tenantId;
    const { date } = req.query;
    try {
        const jobs = await prisma.job.findMany({
            where: {
                tenantId: tenantId,
                // Add date filtering logic if needed later
            },
            include: {
                customer: true,
                technician: true
            }
        });
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};
exports.getJobs = getJobs;
const server_1 = require("../server");
const updateJobStatus = async (req, res) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const { status } = req.body;
    try {
        const job = await prisma.job.update({
            where: { id, tenantId: tenantId },
            data: { status },
            include: { customer: true }
        });
        // Emit real-time event
        server_1.io.emit('job_update', job);
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};
exports.updateJobStatus = updateJobStatus;
const getJobById = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    try {
        const job = await prisma.job.findFirst({
            where: { id, tenantId: tenantId },
            include: { customer: true, technician: true }
        });
        if (!job)
            return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};
exports.getJobById = getJobById;
const updateJob = async (req, res) => {
    const { id } = req.params;
    const { description, technicianId, scheduledStart, status } = req.body;
    const tenantId = req.user?.tenantId;
    try {
        const job = await prisma.job.update({
            where: { id, tenantId: tenantId },
            data: {
                technicianId,
                scheduledStart: scheduledStart ? new Date(scheduledStart) : undefined,
                status
            },
            include: { customer: true, technician: true }
        });
        // Emit update
        server_1.io.emit('job_update', job);
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    const { id } = req.params;
    const tenantId = req.user?.tenantId;
    try {
        const job = await prisma.job.findFirst({
            where: { id, tenantId: tenantId }
        });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        // Delete related invoices first
        await prisma.invoiceItem.deleteMany({ where: { invoice: { jobId: id } } });
        await prisma.invoice.deleteMany({ where: { jobId: id } });
        // Delete Job
        await prisma.job.delete({ where: { id } });
        // Emit delete event if needed
        server_1.io.emit('job_deleted', { id });
        res.json({ message: 'Job deleted successfully' });
    }
    catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ message: 'Error deleting job', error });
    }
};
exports.deleteJob = deleteJob;
