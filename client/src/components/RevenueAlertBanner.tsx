import React, { useState } from 'react';
import { AlertTriangle, X, ChevronRight } from 'lucide-react';

const RevenueAlertBanner: React.FC = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 p-3 relative animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto flex items-center gap-3 pr-8">
                <div className="bg-orange-100 p-1.5 rounded-full text-orange-600 shrink-0">
                    <AlertTriangle size={16} />
                </div>

                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-orange-900 font-bold text-sm tracking-wide">
                        MISSED REVENUE DETECTED
                    </span>
                    <span className="text-orange-800 text-sm truncate">
                        You missed <strong className="font-bold text-orange-900">$1,250</strong> in potential Maintenance Plans last week.
                    </span>
                </div>

                <button
                    className="whitespace-nowrap bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-700 hover:shadow-md transition-all flex items-center gap-1 shadow-sm"
                    onClick={() => alert("Redirecting to Campaign Manager...")}
                >
                    Recover Now <ChevronRight size={14} />
                </button>

                <button
                    onClick={() => setVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-orange-400 hover:text-orange-700 hover:bg-orange-100 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default RevenueAlertBanner;
