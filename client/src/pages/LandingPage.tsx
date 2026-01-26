import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Play, CheckCircle2, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0b1221] text-white font-sans selection:bg-red-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#0b1221]/95 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <img src={logo} alt="ServiceTagger" className="h-8 w-auto brightness-0 invert" />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">ServiceTagger</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#about" className="hover:text-white transition-colors">Our Mission</a>
                            <a href="mailto:founder@servicetagger.com" className="hover:text-white transition-colors">Contact</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
                            >
                                Sign In
                            </Link>
                            <a
                                href="mailto:founder@servicetagger.com"
                                className="bg-[#FF4040] hover:bg-[#ff5555] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,64,64,0.3)] hover:shadow-[0_0_30px_rgba(255,64,64,0.5)] transform hover:-translate-y-0.5"
                            >
                                Get Early Access
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                    <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Accepting Alpha Partners
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        The Service Software <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                            Of The Future.
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
                        ServiceTagger is strictly for the bold. We're an early-stage startup building the next generation of field service management. Be part of the journey from day one.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <a
                            href="mailto:founder@servicetagger.com"
                            className="w-full sm:w-auto px-8 py-4 bg-[#FF4040] hover:bg-[#ff5555] text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,64,64,0.3)] hover:shadow-[0_0_30px_rgba(255,64,64,0.5)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Request Access <ArrowRight className="w-5 h-5" />
                        </a>
                        <a
                            href="#about"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-5 h-5 fill-current" /> Why Us?
                        </a>
                    </div>

                    {/* Screenshot Placeholder */}
                    <div className="relative max-w-5xl mx-auto rounded-xl border border-white/10 shadow-2xl bg-[#131b2e] overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] to-transparent z-10 opacity-60" />
                        <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#0F1623]">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <div className="ml-4 h-6 w-96 bg-white/5 rounded-md" />
                        </div>
                        <div className="aspect-[16/9] bg-[#1e293b] flex items-center justify-center text-gray-500">
                            <div className="text-center p-12">
                                <h3 className="text-2xl font-semibold text-white mb-2">Beautiful Dashboard Interface</h3>
                                <p>Designing the gold standard for modern HVAC & Plumbing workflows.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust/Warning Section */}
            <div className="py-20 bg-[#0F1623]" id="about">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">A Message from the Founder</h2>
                            <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                                <p>
                                    Look, we're not ServiceTitan yet. We don't have 1,000 engineers. What we do have is a relentless obsession with making your life easier.
                                </p>
                                <p>
                                    ServiceTagger is currently in <strong className="text-white">Alpha</strong>. That means it works, it's fast, but it's young. We are looking for partners who want to shape the future of this software, not just buy a license.
                                </p>
                                <p>
                                    If you want something polished to perfection, check back in a year. If you want to build the future with us, email me.
                                </p>
                                <div className="pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 rounded-full p-1">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                                                L
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">Luke Beteag</div>
                                            <div className="text-sm text-gray-500">Founder, ServiceTagger</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-6">
                            {[
                                { icon: Zap, title: "Lightning Fast", desc: "No loading Spinners. Instant interaction." },
                                { icon: ShieldCheck, title: "Modern Security", desc: "Built on 2024 standards, not 2010 legacy code." },
                                { icon: Users, title: "Direct Access", desc: "Talk directly to the engineers building the tool." },
                            ].map((feature, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                            <p className="text-gray-400">{feature.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="py-24 bg-[#0b1221] text-center border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">Ready to see what's possible?</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Join a small group of visionary service companies piloting our platform.
                    </p>
                    <a
                        href="mailto:founder@servicetagger.com"
                        className="inline-flex items-center justify-center px-10 py-5 bg-[#FF4040] hover:bg-[#ff5555] text-white rounded-lg font-bold text-xl transition-all shadow-[0_0_20px_rgba(255,64,64,0.3)] hover:shadow-[0_0_40px_rgba(255,64,64,0.6)]"
                    >
                        Email the Founder
                    </a>
                    <p className="mt-8 text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} ServiceTagger. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
