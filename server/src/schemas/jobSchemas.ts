import { z } from 'zod';

export const createJobSchema = z.object({
    body: z.object({
        customerId: z.string().uuid(),
        scheduledStart: z.string().datetime(), // ISO 8601
        description: z.string().optional(),
        technicianId: z.string().optional(),
    }),
});
