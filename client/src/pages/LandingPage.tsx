import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import dashboardScreenshot from '../assets/dashboard_screenshot.png';
import { Play, CheckCircle2, ArrowRight, ShieldCheck, Zap, Users, Check } from 'lucide-react';

const LandingPage = () => {
    // Determine greeting based on time of day
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 6;

    return (
        <div className="min-h-screen bg-[#0b1221] text-white font-sans selection:bg-red-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-[#0b1221]/95 backdrop-blur-sm border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <img src={logo} alt="ServiceTagger" className="h-8 w-auto brightness-0 invert transition-transform group-hover:scale-105" />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">ServiceTagger</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
                            <a href="#features" className="hover:text-white transition-colors">Features</a>
                            <a href="#about" className="hover:text-white transition-colors">About</a>
                            <a href="#customers" className="hover:text-white transition-colors">Customers</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                title="Sign in to your account"
                            >
                                Sign In
                            </Link>
                            <a
                                href="mailto:founder@servicetagger.com"
                                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-all shadow-[0_0_15px_rgba(211,47,47,0.3)] hover:shadow-[0_0_25px_rgba(211,47,47,0.5)] transform hover:-translate-y-0.5"
                            >
                                Request Access
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
                    <div className="absolute top-[20%] left-[0%] w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    {/* Alpha Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-8 hover:bg-blue-500/15 transition-colors cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Now onboarding select early access customers
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight max-w-5xl mx-auto">
                        Field service software built for <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
                            speed and simplicity.
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg sm:text-2xl text-gray-400 mb-10 leading-relaxed font-light">
                        Modern field service management for HVAC & plumbing teams. Organizes your equipment history automatically and cuts admin time in half.
                    </p>

                    {/* Key Benefits Bullets */}
                    <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12 mb-12 text-gray-300">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="bg-green-500/10 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="font-medium">Auto-organized history</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <div className="bg-green-500/10 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="font-medium">Tech-friendly interface</span>
                        </div>
                        <div className="flex items-center gap-3 justify-center">
                            <div className="bg-green-500/10 p-1 rounded-full">
                                <Check className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="font-medium">Cost-effective</span>
                        </div>
                    </div>

                    {/* Primary CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                        <a
                            href="mailto:founder@servicetagger.com"
                            className="w-full sm:w-auto px-10 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(211,47,47,0.3)] hover:shadow-[0_0_30px_rgba(211,47,47,0.5)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                        >
                            Request Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Dashboard Screenshot */}
                    <div className="relative max-w-6xl mx-auto rounded-xl border border-white/10 shadow-2xl bg-[#0f1623] overflow-hidden group hover:border-white/20 transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] via-transparent to-transparent z-10 pointer-events-none" />

                        {/* Browser Header Mockup */}
                        <div className="h-8 bg-[#131b2e] border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5 opacity-60">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                            <div className="mx-auto w-1/3 h-4 bg-white/5 rounded-md" />
                        </div>

                        {/* Actual Screenshot */}
                        <img
                            src={dashboardScreenshot}
                            alt="ServiceTagger Dashboard Interface"
                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-[#0F1623]" id="features">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-bold mb-4">Everything you need, nothing you don't</h2>
                        <p className="text-gray-400">Core capabilities designed for modern service workflows.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Lightning Fast Dispatch", desc: "Drag and drop scheduling that updates instantly across all devices. No loading spinners." },
                            { icon: ShieldCheck, title: "Equipment History", desc: "AI automatically structures model and serial numbers from technician photos." },
                            { icon: Users, title: "Customer Portal", desc: "Give your commercial clients a direct login to view their asset history and invoices." },
                        ].map((feature, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/[0.07] transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Founder / About Section */}
            <div className="py-24 bg-[#0b1221] relative overflow-hidden" id="about">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left Content */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-3xl font-bold">From the Founder</h2>
                                <div className="h-px bg-white/10 flex-grow" />
                            </div>

                            <div className="prose prose-lg prose-invert text-gray-400 leading-relaxed mb-8">
                                <p className="font-medium text-white text-xl mb-4">
                                    ServiceTagger is in private alpha. I'm looking for partners who want to shape the future of this software, not just buy a license.
                                </p>
                                <p>
                                    I've built this platform by listening to HVAC operators who are tired of complicated, expensive legacy software. We are a focused team building specifically for speed and clarity.
                                </p>
                                <p>
                                    We are production-ready for early adopters and evolving weekly based on your direct feedback. If you want to co-design the next generation of field service software, we'd like to talk.
                                </p>
                            </div>

                            <div className="flex items-center gap-5 mt-10">
                                <div className="w-16 h-16 rounded-full bg-[#1e293b] border-2 border-blue-500/30 flex items-center justify-center overflow-hidden shrink-0">
                                    {/* Placeholder for real headshot, using polished initial for now */}
                                    <span className="text-2xl font-bold text-blue-400">L</span>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">Luke Beteag</div>
                                    <div className="text-blue-400 font-medium">Founder, ServiceTagger</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - "Who we serve" Card */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75" />
                            <div className="relative bg-[#0F1623] border border-white/10 p-10 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-sm text-gray-500">Who We Serve</h3>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="mt-1 bg-blue-500/20 p-1 rounded h-fit">
                                            <Check className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Residential & Commercial HVAC</h4>
                                            <p className="text-sm text-gray-400 mt-1">Companies handling 5-50 jobs a day needing streamlined dispatch.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="mt-1 bg-blue-500/20 p-1 rounded h-fit">
                                            <Check className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Plumbing Services</h4>
                                            <p className="text-sm text-gray-400 mt-1">Teams that need to track asset history and customer memberships.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="mt-1 bg-blue-500/20 p-1 rounded h-fit">
                                            <Check className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Growth-Minded Owners</h4>
                                            <p className="text-sm text-gray-400 mt-1">Operators who want data-driven insights without the enterprise bloat.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="py-32 bg-[#0b1221] text-center border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0b1221] to-[#0b1221] pointer-events-none" />

                <div className="relative max-w-4xl mx-auto px-4 z-10">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-8">Ready to modernize your operations?</h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Join the visionary service companies building their future on ServiceTagger.
                    </p>
                    <a
                        href="mailto:founder@servicetagger.com"
                        className="inline-flex items-center justify-center px-10 py-5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg font-bold text-xl transition-all shadow-[0_0_20px_rgba(211,47,47,0.3)] hover:shadow-[0_0_40px_rgba(211,47,47,0.6)]"
                    >
                        Request Access
                    </a>
                </div>
            </div>

            {/* Company Strip */}
            <footer className="bg-[#080d1a] border-t border-white/5 py-12 text-sm text-gray-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-75">
                        <img src={logo} alt="ServiceTagger" className="h-6 w-auto brightness-0 invert opacity-50" />
                        <span>© {new Date().getFullYear()} ServiceTagger</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                        <a href="mailto:founder@servicetagger.com" className="hover:text-gray-300 transition-colors">Contact</a>
                    </div>

                    <div className="text-center md:text-right">
                        <p>Designed & Built in <span className="text-gray-400">Orange County, CA</span> ☀️</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
