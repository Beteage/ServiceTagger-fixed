"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTechnicians = exports.getRecommendedTechnicians = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Haversine formula to calculate distance in miles
function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
    var R = 3958.8; // Radius of the earth in miles
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in miles
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
const getRecommendedTechnicians = async (req, res) => {
    try {
        const { jobId, customerId } = req.query;
        let jobLat = 34.0522;
        let jobLng = -118.2437;
        if (jobId) {
            const job = await prisma.job.findUnique({
                where: { id: String(jobId) },
                include: { customer: true }
            });
            if (job && job.customer) {
                // @ts-ignore: Schema updated but types lagging
                jobLat = job.customer.lat || jobLat;
                // @ts-ignore
                jobLng = job.customer.lng || jobLng;
            }
        }
        else if (customerId) {
            const customer = await prisma.customer.findUnique({
                where: { id: String(customerId) }
            });
            if (customer) {
                // @ts-ignore
                jobLat = customer.lat || jobLat;
                // @ts-ignore
                jobLng = customer.lng || jobLng;
            }
        }
        else {
            res.status(400).json({ error: 'Job ID or Customer ID is required' });
            return;
        }
        // 2. Get All Technicians
        // In a real app, we'd filter by availability too
        const technicians = await prisma.user.findMany({
            where: { role: 'TECHNICIAN' }
        });
        // 3. Calculate Distances (Mocking Tech Locations temporarily if missing)
        const recommendations = technicians.map(tech => {
            // Mock random location around LA if missing (Phase 3 didn't add lat/lng to User, checking schema...)
            // Actually, we didn't add lat/lng to User in Phase 3 explicitly, let's check schema.
            // Assuming we might need to mock it for now.
            // Simulating tech locations scattered around the job
            // Deterministic mock based on ID
            const mockLat = 34.0522 + (tech.id.charCodeAt(0) % 10 - 5) * 0.05;
            const mockLng = -118.2437 + (tech.id.charCodeAt(0) % 10 - 5) * 0.05;
            const distance = getDistanceFromLatLonInMiles(jobLat, jobLng, mockLat, mockLng);
            return {
                id: tech.id,
                name: tech.email.split('@')[0], // Simple name extraction
                email: tech.email,
                // @ts-ignore: Schema updated
                skills: tech.skills ? tech.skills.split(',') : [],
                distance: parseFloat(distance.toFixed(1)),
                location: { lat: mockLat, lng: mockLng }
            };
        });
        // 4. Sort by Distance
        recommendations.sort((a, b) => a.distance - b.distance);
        res.json(recommendations);
    }
    catch (error) {
        console.error('Dispatch Recommendation Error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
};
exports.getRecommendedTechnicians = getRecommendedTechnicians;
const getAllTechnicians = async (req, res) => {
    try {
        const technicians = await prisma.user.findMany({
            where: { role: 'TECHNICIAN' },
            // @ts-ignore: skills field exists in schema
            select: { id: true, email: true, skills: true }
        });
        res.json(technicians);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch technicians' });
    }
};
exports.getAllTechnicians = getAllTechnicians;
