"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobSchema = void 0;
const zod_1 = require("zod");
exports.createJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().uuid(),
        scheduledStart: zod_1.z.string().datetime(), // ISO 8601
        description: zod_1.z.string().optional(),
        technicianId: zod_1.z.string().optional(),
    }),
});
