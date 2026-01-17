import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

import { sendJobAssignmentEmail } from '../services/emailService';

export const createJob = async (req: Request, res: Response) => {
    const { customerId, scheduledStart, description, technicianId } = req.body;
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const job = await prisma.job.create({
            data: {
                scheduledStart: new Date(scheduledStart),
                customerId,
                tenantId: tenantId!,
                technicianId, // Assign technician
                status: 'Draft',
            },
            include: { customer: true, technician: true } // Include relations
        });

        // Send Notification if technician assigned
        if (job.technician && job.technician.email) {
            sendJobAssignmentEmail(job.technician.email, job);
        }

        res.status(201).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating job', error });
    }
};

export const getJobs = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;
    const { date } = req.query;

    try {
        const jobs = await prisma.job.findMany({
            where: {
                tenantId: tenantId!,
                // Add date filtering logic if needed later
            },
            include: {
                customer: true,
                technician: true
            }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

import { io } from '../server';

export const updateJobStatus = async (req: Request, res: Response) => {
    const tenantId = (req as AuthRequest).user?.tenantId;
    const { id } = req.params;
    const { status } = req.body;

    try {
        const job = await prisma.job.update({
            where: { id, tenantId: tenantId! },
            data: { status },
            include: { customer: true }
        });

        // Emit real-time event
        io.emit('job_update', job);

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const job = await prisma.job.findFirst({
            where: { id, tenantId: tenantId! },
            include: { customer: true, technician: true }
        });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};

export const updateJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { description, technicianId, scheduledStart, status } = req.body;
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const job = await prisma.job.update({
            where: { id, tenantId: tenantId! },
            data: {
                technicianId,
                scheduledStart: scheduledStart ? new Date(scheduledStart) : undefined,
                status
            },
            include: { customer: true, technician: true }
        });

        // Emit update
        io.emit('job_update', job);

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tenantId = (req as AuthRequest).user?.tenantId;

    try {
        const job = await prisma.job.findFirst({
            where: { id, tenantId: tenantId! }
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
        io.emit('job_deleted', { id });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ message: 'Error deleting job', error });
    }
};
