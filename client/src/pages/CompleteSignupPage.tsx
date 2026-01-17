import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';

const CompleteSignupPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    // Inject Lemon Squeezy Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://assets.lemonsqueezy.com/lemon.js';
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const checkoutUrl = userId
        ? `https://servicetagger.lemonsqueezy.com/checkout/buy/70d30a71-300e-487c-84af-1325707e9f54?embed=1&checkout[custom][user_id]=${userId}`
        : '#';

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500 font-medium">Invalid signup link. Please try registering again.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 text-center">

                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="ServiceTagger" className="h-16 w-auto object-contain mb-6 hover:scale-105 transition-transform duration-300" />
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Activate Your Account</h1>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        Complete your setup to unlock the full power of ServiceTagger.
                    </p>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center space-x-2 bg-blue-50 text-brand-dark px-4 py-2 rounded-full mb-8 mx-auto w-fit">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide uppercase">Secure Activation</span>
                </div>

                {/* Minimal Feature List */}
                <div className="text-left space-y-3 mb-10 px-2">
                    {[
                        'Unlimited Jobs & Invoices',
                        'AI-Powered Scheduling & Insights',
                        'Technician Dispatch Board',
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 text-[15px]">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <a
                    href={checkoutUrl}
                    className="lemonsqueezy-button group w-full flex items-center justify-center bg-brand text-slate-900 font-bold py-4 px-6 rounded-xl hover:bg-brand/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                    <span className="mr-2">Subscribe Now</span>
                    <svg className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-50">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-400 hover:text-gray-600 text-xs font-medium transition-colors"
                    >
                        Already completed payment? <span className="underline decoration-gray-300 underline-offset-2">Sign In</span>
                    </button>
                </div>
            </div>

            <p className="mt-8 text-gray-300 text-xs">
                © {new Date().getFullYear()} ServiceTagger. All rights reserved.
            </p>
        </div>
    );
};

export default CompleteSignupPage;
