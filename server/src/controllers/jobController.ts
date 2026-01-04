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
            }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

import { io } from '../server';

export const updateJobStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const job = await prisma.job.update({
            where: { id },
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
