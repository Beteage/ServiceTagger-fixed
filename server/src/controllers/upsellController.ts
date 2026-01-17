import { Request, Response } from 'express';

export const getUpsellSuggestions = async (req: Request, res: Response) => {
    const { service } = req.query;
    const serviceLower = service?.toString().toLowerCase() || '';

    let suggestions: any[] = [];

    // Enhanced Rule Engine
    if (serviceLower.includes('ac') || serviceLower.includes('air') || serviceLower.includes('cool')) {
        suggestions = [
            { id: 'u1', name: 'Filter Replacement', price: 45, acceptance_rate: 68 },
            { id: 'u2', name: 'Coil Cleaning', price: 120, acceptance_rate: 42 },
            { id: 'u3', name: 'Smart Thermostat', price: 299, acceptance_rate: 15 }
        ];
    } else if (serviceLower.includes('heat') || serviceLower.includes('furnace')) {
        suggestions = [
            { id: 'u4', name: 'Carbon Monoxide Detector', price: 85, acceptance_rate: 72 },
            { id: 'u5', name: 'Burner Tune-Up', price: 145, acceptance_rate: 55 }
        ];
    } else {
        suggestions = [
            { id: 'u6', name: 'Service Club Membership', price: 199, acceptance_rate: 22 },
            { id: 'u7', name: 'System Safety Check', price: 89, acceptance_rate: 45 }
        ];
    }

    // Age-based Upsell Logic (System Replacement)
    // Pass 'age' in query param, e.g. ?service=ac&age=12
    const equipmentAge = parseInt(req.query.age as string) || 0;
    if (equipmentAge > 10) {
        suggestions.unshift({
            id: 'u_replace',
            name: '✨ High-Efficiency System Replacement',
            price: 4500, // Quote
            acceptance_rate: 10,
            reason: `Equipment is ${equipmentAge} years old (End of Life)`
        });
    }

    res.json(suggestions);
};
