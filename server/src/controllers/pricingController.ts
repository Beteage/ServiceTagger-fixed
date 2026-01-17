import { Request, Response } from 'express';

export const getMarketPricing = async (req: Request, res: Response) => {
    const { service, zip } = req.query;
    const serviceType = service?.toString().toLowerCase() || '';

    // Mock Algo: Deterministic but looks real
    // Base prices
    let basePrice = 250;
    if (serviceType.includes('install')) basePrice = 4500;
    else if (serviceType.includes('tune')) basePrice = 129;
    else if (serviceType.includes('mainten')) basePrice = 159;
    else if (serviceType.includes('leak')) basePrice = 350;

    // Zip code multiplier (Rich areas pay more)
    const zipNum = parseInt(zip?.toString() || '00000', 10);
    const multiplier = (zipNum % 10) * 0.05 + 1; // 1.0 to 1.45 variation

    const avg = Math.round(basePrice * multiplier);
    const low = Math.round(avg * 0.85);
    const high = Math.round(avg * 1.25);
    const sample = 20 + (zipNum % 50);

    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 600));

    res.json({
        service_type: service,
        zip_code: zip,
        avg_price: avg,
        low_price: low,
        high_price: high,
        sample_size: sample
    });
};
