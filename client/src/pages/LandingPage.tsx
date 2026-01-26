import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import dashboardScreenshot from '../assets/dashboard_screenshot.png';
import customersScreenshot from '../assets/screenshot_customers.png';
import scheduleScreenshot from '../assets/screenshot_schedule.png';
import { Play, CheckCircle2, ArrowRight, ShieldCheck, Zap, Users, Check, Lock, Star, ChevronRight, Phone, Clock, DollarSign, AlertTriangle } from 'lucide-react';

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
                            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                            <a href="#comparison" className="hover:text-white transition-colors">Compare</a>
                            <a href="#program" className="hover:text-white transition-colors">Partner Program</a>
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
                                href="https://calendly.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-md text-sm font-bold transition-all shadow-[0_0_15px_rgba(211,47,47,0.3)] hover:shadow-[0_0_25px_rgba(211,47,47,0.5)] transform hover:-translate-y-0.5"
                            >
                                Schedule Demo
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-white text-[#0b1221]">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-xs font-semibold text-blue-800 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Private Alpha • Limited founding partner spots available
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight max-w-5xl mx-auto text-[#0b1221]">
                        Modern field service software for HVAC contractors.
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg sm:text-2xl text-gray-600 mb-10 leading-relaxed font-light">
                        Built from the ground up for small to mid-size HVAC contractors who want modern software without enterprise-level complexity or cost. <br className="hidden sm:block" />
                        <span className="font-medium text-gray-900">Currently in alpha with select partners.</span> Deploy in days, not months.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                        <a
                            href="https://calendly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-10 py-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg font-bold text-lg transition-all shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Talk to the Founder
                        </a>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-gray-50 text-[#0b1221] border border-gray-200 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
                        >
                            See How It Works
                        </a>
                    </div>

                    {/* Main Dashboard Screenshot */}
                    <div className="relative max-w-6xl mx-auto rounded-xl shadow-2xl border border-gray-200 overflow-hidden group mb-16">
                        <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <div className="mx-auto w-1/3 h-4 bg-white rounded-md shadow-sm" />
                        </div>
                        <img
                            src={dashboardScreenshot}
                            alt="ServiceTagger Dashboard"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Alpha Callout Section */}
                    <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-100 rounded-lg p-8 mb-16 text-center shadow-sm">
                        <div className="flex items-center justify-center gap-2 text-blue-800 font-bold mb-4 uppercase tracking-wide text-sm">
                            <AlertTriangle className="w-5 h-5" /> Alpha Software Notice
                        </div>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                            ServiceTagger is currently in private alpha. The product is functional and fast, but actively evolving based on partner feedback.
                        </p>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto italic">
                            If you're looking for a fully mature platform, check back in 6 months. If you want to help shape the future of HVAC software and get priority support, now is the perfect time to join.
                        </p>
                        <div className="text-sm font-bold text-blue-900 bg-blue-100 inline-block px-4 py-2 rounded-full">
                            Spots available: 7 of 10 founding partners
                        </div>
                    </div>
                </div>

                {/* Trust Badges (No Customers) */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale pb-4">
                    <div className="flex items-center gap-2 font-bold text-gray-500"><ShieldCheck className="w-5 h-5" /> Bank-Level Encryption</div>
                    <div className="flex items-center gap-2 font-bold text-gray-500"><Zap className="w-5 h-5" /> 99.9% Uptime</div>
                    <div className="flex items-center gap-2 font-bold text-gray-500"><Users className="w-5 h-5" /> Built in Orange County, CA</div>
                </div>

            </div>

            {/* Comparison Section */}
            <div className="py-24 bg-[#0b1221]" id="comparison">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Transparent pricing for modern teams</h2>
                        <p className="text-gray-400">Stop paying for features you never use.</p>
                    </div>

                    <div className="bg-[#0F1623] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 p-6 border-b border-white/10 bg-white/5 font-bold text-lg">
                            <div className="text-gray-400">Feature</div>
                            <div className="text-center text-gray-500">Enterprise Platforms</div>
                            <div className="text-center text-white flex items-center justify-center gap-2">
                                <img src={logo} alt="ST" className="w-5 h-5 brightness-0 invert" /> ServiceTagger
                            </div>
                        </div>

                        {[
                            { label: "Price per tech", their: "$300+/mo", our: "$99/mo" },
                            { label: "Setup Time", their: "3-6 Months", our: "48 Hours" },
                            { label: "Training Required", their: "Days", our: "20 Minutes" },
                            { label: "Contract", their: "Annual Lock-in", our: "Monthly" },
                            { label: "Support", their: "Ticket Queue", our: "Founder Direct" },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-3 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <div className="font-medium text-gray-300">{row.label}</div>
                                <div className="text-center text-gray-500">{row.their}</div>
                                <div className="text-center text-green-400 font-bold">{row.our}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works - Screenshots */}
            <div className="py-24 bg-white text-[#0b1221]" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">See it in action</h2>
                        <p className="text-xl text-gray-600">No smoke and mirrors. Just working software.</p>
                    </div>

                    {/* Feature 1: Schedule */}
                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div className="order-2 md:order-1">
                            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Drag-and-Drop Scheduling</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Assign jobs in seconds. See where your techs are, update statuses instantly, and keep customers in the loop with automated SMS updates.
                            </p>
                            <ul className="space-y-3">
                                {["Real-time sync", "Map view", "Tech mobile app"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 md:order-2 shadow-2xl rounded-xl overflow-hidden border border-gray-100">
                            <img src={scheduleScreenshot} alt="Scheduling Interface" className="w-full" />
                        </div>
                    </div>

                    {/* Feature 2: Customers */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="shadow-2xl rounded-xl overflow-hidden border border-gray-100">
                            <img src={customersScreenshot} alt="Customer CRM" className="w-full" />
                        </div>
                        <div>
                            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Simple Customer Management</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Track every interaction, invoice, and equipment detail. Search by name, address, or phone number and get the full history in one click.
                            </p>
                            <ul className="space-y-3">
                                {["Equipment history", "Service agreements", "One-click invoicing"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* Partner Program / Founder Section */}
            <div className="py-24 bg-[#0F1623] relative overflow-hidden" id="program">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="bg-[#1a2333] rounded-2xl p-10 border border-white/10 shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-500 mb-6 uppercase tracking-wide">
                            Private Alpha Access
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6">Join Our Founding Partner Program</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            We are hand-selecting 10 HVAC companies to help shape the future of ServiceTagger. This isn't just "early access"—it's a partnership.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-4">What "Alpha" Means for You:</h3>

                        <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                            {[
                                { text: "The product works and is production-ready", icon: Check, color: "text-green-400", bg: "bg-green-500/20" },
                                { text: "New features ship weekly based on feedback", icon: Check, color: "text-green-400", bg: "bg-green-500/20" },
                                { text: "Bugs fixed within 24 hours (founder direct)", icon: Check, color: "text-green-400", bg: "bg-green-500/20" },
                                { text: "Lifetime discounted pricing", icon: Check, color: "text-green-400", bg: "bg-green-500/20" },
                                { text: "Expect UI changes and feature iterations", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/20" },
                                { text: "Not all features are complete yet", icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/20" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`${item.bg} p-1 rounded-full mt-0.5`}><item.icon className={`w-4 h-4 ${item.color}`} /></div>
                                    <span className="text-gray-300 text-sm">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">L</div>
                            <div className="flex-grow text-center md:text-left">
                                <p className="text-gray-300 italic mb-2">"ServiceTagger exists because HVAC operators told me they were tired of complicated, expensive software. I'm building exactly what small to mid-size teams need—nothing more, nothing less."</p>
                                <div className="font-bold text-white">Luke Beteag</div>
                                <div className="text-sm text-blue-400">Founder, ServiceTagger</div>
                            </div>
                            <a href="https://calendly.com" target="_blank" className="px-6 py-3 bg-white text-[#0b1221] font-bold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                                Apply for Partner Program
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-[#0b1221] py-16 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 text-center">Development Velocity</h3>
                    <div className="space-y-6">
                        {[
                            { date: "Jan 24, 2026", title: "Drag-and-Drop Dispatch Board", tag: "New Feature" },
                            { date: "Jan 18, 2026", title: "Weekly Schedule View", tag: "New Feature" },
                            { date: "Jan 15, 2026", title: "Equipment Photo AI Tagging", tag: "AI Beta" },
                            { date: "Jan 08, 2026", title: "ServiceTagger Mobile App Beta", tag: "Mobile" },
                        ].map((update, i) => (
                            <div key={i} className="flex items-center gap-6 group hover:bg-white/5 p-4 rounded-lg transition-colors cursor-default">
                                <div className="text-sm text-gray-500 font-mono min-w-[100px]">{update.date}</div>
                                <div className="flex-grow font-medium text-gray-300 group-hover:text-white transition-colors">{update.title}</div>
                                <div className="text-xs px-2 py-1 rounded bg-white/10 text-gray-400 border border-white/5">{update.tag}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#080d1a] border-t border-white/5 pt-16 pb-8 text-sm text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <img src={logo} alt="ServiceTagger" className="h-6 w-auto brightness-0 invert opacity-50" />
                                <span className="font-bold text-white">ServiceTagger</span>
                            </div>
                            <p className="mb-4">Modern field service software for HVAC & Plumbing professionals.</p>
                            <p className="flex items-center gap-2"><span className="text-white">Email:</span> founder@servicetagger.com</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Partner Program</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>© {new Date().getFullYear()} ServiceTagger. All rights reserved.</div>
                        <div className="text-gray-500">Built with 🔧 in Orange County, CA</div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default LandingPage;
