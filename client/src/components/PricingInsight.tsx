import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CheckCircle, TrendingUp, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface PricingInsightProps {
    serviceType: string;
    currentPrice: number;
    zipCode: string;
    onUpdatePrice: (newPrice: number) => void;
}

interface MarketData {
    avg_price: number;
    low_price: number;
    high_price: number;
    sample_size: number;
}

const PricingInsight: React.FC<PricingInsightProps> = ({ serviceType, currentPrice, zipCode, onUpdatePrice }) => {
    const [pricing, setPricing] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!serviceType) return;

        setLoading(true);
        // Using the mock endpoint we will create
        api.get(`/pricing/market?service=${encodeURIComponent(serviceType)}&zip=${zipCode}`)
            .then(res => setPricing(res.data))
            .catch(err => console.error("Failed to fetch market data", err))
            .finally(() => setLoading(false));
    }, [serviceType, zipCode]);

    if (loading) return <div className="animate-pulse h-24 bg-slate-100 rounded-lg"></div>;
    if (!pricing || !pricing.avg_price) return null;

    const isUnderpriced = currentPrice < pricing.avg_price * 0.9; // 10% below market
    const potentialGain = pricing.avg_price - currentPrice;

    return (
        <div className={cn(
            "p-4 rounded-xl border-2 transition-all mt-4",
            isUnderpriced ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
        )}>
            <div className="flex items-start gap-3">
                <div className={cn(
                    "p-2 rounded-full",
                    isUnderpriced ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                )}>
                    {isUnderpriced ? <TrendingUp size={20} /> : <CheckCircle size={20} />}
                </div>

                <div className="flex-1">
                    {isUnderpriced ? (
                        <>
                            <h4 className="font-bold text-amber-900 flex items-center gap-2">
                                💰 Revenue Opportunity
                                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Price Too Low</span>
                            </h4>
                            <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                                Based on <strong className="font-bold">{pricing.sample_size} jobs</strong> in {zipCode},
                                the average price for <u>{serviceType}</u> is <strong className="text-lg">${pricing.avg_price}</strong>.
                                <br />
                                You are currently charging <strong className="text-amber-700">${currentPrice}</strong>.
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => {
                                        onUpdatePrice(pricing.avg_price);
                                        toast.success(`Price updated to market rate: $${pricing.avg_price}`);
                                    }}
                                    className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
                                >
                                    Update to ${pricing.avg_price}
                                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">+${potentialGain.toFixed(0)} gain</span>
                                </button>
                                <span className="text-xs text-amber-700 font-medium flex items-center gap-1 bg-amber-100/50 px-2 py-1 rounded">
                                    <Info size={12} />
                                    Market range: ${pricing.low_price} - ${pricing.high_price}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                                ✓ Competitive Pricing
                            </h4>
                            <p className="text-sm text-emerald-800 mt-1">
                                Your price (<strong className="text-emerald-700">${currentPrice}</strong>) is perfectly in line with the market average (<strong className="text-emerald-700">${pricing.avg_price}</strong>). Good job!
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingInsight;
