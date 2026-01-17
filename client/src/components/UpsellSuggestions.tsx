import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Adjust path if needed (e.g., ../../api/axios)
import { Lightbulb, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface UpsellSuggestionsProps {
    jobId: string;
    description: string; // Used to trigger rules
}

interface UpsellSuggestion {
    id: string; // Pricebook Item ID
    name: string;
    price: number;
    rule_id: string;
    acceptance_rate: number;
}

const UpsellSuggestions: React.FC<UpsellSuggestionsProps> = ({ jobId, description }) => {
    const [suggestions, setSuggestions] = useState<UpsellSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!jobId) return;

        // Mock fetching based on description (service type)
        // In reality: api.get(`/jobs/${jobId}/upsells`)
        // For MVP: We call a specialized mock endpoint or just a generic one
        // Let's call the one we are about to make
        setLoading(true);
        api.get(`/upsells/suggestions?service=${encodeURIComponent(description)}`)
            .then(res => setSuggestions(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

    }, [jobId, description]);

    const handleAddUpsell = async (suggestion: UpsellSuggestion) => {
        try {
            // In a real app: POST /jobs/:id/line-items
            // For MVP: We verify flow via toast
            // await api.post(`/jobs/${jobId}/line-items`, { ... });
            toast.success(`Added ${suggestion.name} (+$${suggestion.price})`);

            // Optimistically remove or mark as added
            setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        } catch (err) {
            toast.error("Failed to add upsell");
        }
    };

    if (loading) return <div className="p-4 text-center text-xs text-slate-400">Finding opportunities...</div>;
    if (suggestions.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100 shadow-sm mt-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                    <Lightbulb size={18} />
                </div>
                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">
                    Boost Revenue
                </h3>
            </div>

            <p className="text-xs text-emerald-800 mb-3 leading-relaxed">
                Customers getting <strong>{description || "Service"}</strong> often add these items:
            </p>

            <div className="space-y-2">
                {suggestions.map(suggestion => (
                    <div
                        key={suggestion.id}
                        className="flex items-center justify-between bg-white/80 backdrop-blur p-3 rounded-lg border border-emerald-100/50 hover:shadow-md hover:border-emerald-200 transition-all group"
                    >
                        <div className="flex-1 min-w-0 mr-3">
                            <div className="font-bold text-slate-800 text-sm truncate">
                                {suggestion.name}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium bg-slate-100 inline-block px-1.5 py-0.5 rounded mt-0.5">
                                {suggestion.acceptance_rate}% acceptance
                            </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                            <div className="font-bold text-emerald-700">
                                +${suggestion.price}
                            </div>
                            <button
                                onClick={() => handleAddUpsell(suggestion)}
                                className="h-8 w-8 flex items-center justify-center bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                                title="Add to Job"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpsellSuggestions;
