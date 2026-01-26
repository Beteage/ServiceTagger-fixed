import React from 'react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200">
            <header className="border-b border-slate-200">
                <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                            ST
                        </div>
                        <span className="text-lg font-semibold tracking-tight">ServiceTagger</span>
                    </div>
                </div>
            </header>

            <main className="bg-white">
                <section className="max-w-3xl mx-auto px-4 py-16">
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4 text-slate-900">
                        ServiceTagger
                    </h1>
                    <p className="text-lg text-slate-600 mb-2 leading-relaxed">
                        Proof that powerful field service software doesn't need to be expensive or complicated.
                    </p>
                    <p className="text-sm text-slate-500 mb-8 font-medium">
                        ServiceTagger is an early-stage startup product and is not ready for general use yet.
                    </p>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-600">
                            Interested or have feedback? Email the founder:
                        </p>
                        <a
                            href="mailto:founder@servicetagger.com"
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            founder@servicetagger.com
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;
