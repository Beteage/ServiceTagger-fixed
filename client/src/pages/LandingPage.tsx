import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import dashboardScreenshot from '../assets/dashboard_screenshot.png';
import customersScreenshot from '../assets/screenshot_customers.png';
import scheduleScreenshot from '../assets/screenshot_schedule.png';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, Users, Check, AlertTriangle, Clock, Menu, X, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <img src={logo} alt="ServiceTagger" className="h-8 w-auto transition-transform group-hover:scale-105" />
                            <span className="font-bold text-xl tracking-tight text-slate-900">ServiceTagger</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
                            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
                            <a href="#program" className="hover:text-blue-600 transition-colors">Partner Program</a>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Sign In
                            </Link>
                            <a
                                href="#contact"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-0.5"
                            >
                                Apply for Partner Access
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-600 hover:text-slate-900 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 shadow-lg">
                        <a href="#how-it-works" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <a href="#pricing" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#program" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Partner Program</a>
                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                            <Link to="/login" className="text-center text-slate-600 font-medium py-2">Sign In</Link>
                            <a href="#contact" className="bg-blue-600 text-white text-center py-3 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Apply for Partner Access</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Hero Text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 mb-8 uppercase tracking-wide">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                Private Alpha
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                                Modern field service software for <span className="text-blue-600">HVAC contractors.</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Dispatch faster, keep customers informed, and get paid on time—without enterprise bloat or 6‑month implementations.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <a
                                    href="#contact"
                                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    Apply for Partner Access
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 hover:border-slate-300"
                                >
                                    See How It Works
                                </a>
                            </div>

                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                                    Bank-Level Encryption
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-slate-400" />
                                    99.9% Uptime
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    Built in Orange County, CA
                                </div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl transform rotate-3 scale-95 opacity-50" />
                            <div className="relative rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden p-2">
                                <div className="rounded-lg bg-slate-100 overflow-hidden border border-slate-100">
                                    <img
                                        src={dashboardScreenshot}
                                        alt="ServiceTagger Dashboard"
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">See it in action</h2>
                        <p className="text-lg text-slate-600">No smoke and mirrors. Just working software designed for speed.</p>
                    </div>

                    <div className="space-y-24">
                        {/* Feature 1 */}
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="order-2 md:order-1">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Drag-and-Drop Scheduling</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Assign jobs in seconds. See where your techs are, update statuses instantly, and keep customers in the loop with automated SMS updates.
                                </p>
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                                        <div>
                                            <div className="font-bold text-slate-900">Reduce Admin Time</div>
                                            <div className="text-sm text-slate-500">Dispatchers save ~15 hours/week on average.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <img src={scheduleScreenshot} alt="Scheduling Interface" className="w-full rounded-lg shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div>
                                <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden p-2 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <img src={customersScreenshot} alt="Customer CRM" className="w-full rounded-lg shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">Simple Customer Management</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Track every interaction, invoice, and equipment detail. Search by name, address, or phone number and get the full history in one click.
                                </p>
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                                        <div>
                                            <div className="font-bold text-slate-900">Never Lose History</div>
                                            <div className="text-sm text-slate-500">Full equipment & service timeline for every address.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / Comparison Section */}
            <section id="pricing" className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple pricing, powerful features</h2>
                        <p className="text-slate-600">Enterprise features without the enterprise price tag.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
                            <div className="p-6 font-bold text-slate-500">Feature</div>
                            <div className="p-6 font-bold text-slate-900 text-center">Enterprise Platforms</div>
                            <div className="p-6 font-bold text-blue-600 text-center bg-blue-50/50">ServiceTagger</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-slate-100">
                            {[
                                { label: "Price per tech", their: "$300+/mo", our: "$99/mo" },
                                { label: "Setup Time", their: "3-6 Months", our: "48 Hours" },
                                { label: "Training Required", their: "Days", our: "20 Minutes" },
                                { label: "Contract", their: "Annual Lock-in", our: "Monthly" },
                                { label: "Support", their: "Ticket Queue", our: "Founder Direct" },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-3 hover:bg-slate-50/50 transition-colors">
                                    <div className="p-5 text-sm font-medium text-slate-600 flex items-center">{row.label}</div>
                                    <div className="p-5 text-sm font-medium text-slate-500 text-center flex items-center justify-center bg-slate-50/30">{row.their}</div>
                                    <div className="p-5 text-sm font-bold text-slate-900 text-center flex items-center justify-center bg-blue-50/30">{row.our}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner Program & Founder Section */}
            <section id="program" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Founder Quote Card */}
                    <div className="bg-slate-900 rounded-2xl p-12 text-center text-white relative shadow-2xl mb-24 overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-8 flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-slate-800">L</div>
                            <p className="text-2xl font-medium leading-relaxed mb-8 italic text-slate-200">
                                "ServiceTagger exists because HVAC operators told me they were tired of complicated, expensive software. I'm building exactly what small to mid-size teams need—nothing more, nothing less."
                            </p>
                            <div>
                                <div className="font-bold text-lg">Luke Beteag</div>
                                <div className="text-blue-400 font-medium">Founder, ServiceTagger</div>
                            </div>
                        </div>
                    </div>

                    {/* Partner Program Info */}
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-xs font-bold text-yellow-800 mb-6 uppercase tracking-wide">
                                Founding Partner Program
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Join as a Founding Partner</h2>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                We are hand-selecting 10 HVAC companies to help shape the future of ServiceTagger. This isn't just "early access"—it's a partnership.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { text: "Production-ready, shipping weekly", icon: Check },
                                    { text: "Bugs fixed within 24 hours", icon: Check },
                                    { text: "Lifetime discounted pricing", icon: Check },
                                    { text: "Direct influence on product roadmap", icon: Check },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="bg-green-100 p-1 rounded-full"><Check className="w-4 h-4 text-green-600" /></div>
                                        <span className="font-medium text-slate-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Development Velocity</h3>
                            <div className="space-y-0 relative">
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200" />
                                {[
                                    { date: "Jan 24", title: "Drag-and-Drop Dispatch", tag: "New" },
                                    { date: "Jan 18", title: "Weekly Schedule View", tag: "New" },
                                    { date: "Jan 15", title: "Equipment Photo AI", tag: "AI" },
                                    { date: "Jan 08", title: "Mobile App Beta", tag: "Beta" },
                                ].map((update, i) => (
                                    <div key={i} className="flex gap-6 relative pb-8 last:pb-0">
                                        <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10 shrink-0" />
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 mb-1">{update.date}</div>
                                            <div className="font-bold text-slate-800 text-sm mb-1">{update.title}</div>
                                            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide border border-blue-100">{update.tag}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Application Section */}
            <section id="contact" className="py-24 bg-slate-900 text-white">
                <div className="max-w-xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Request Partner Access</h2>
                    <p className="text-slate-400 mb-10">
                        Ready to modernize your operations? Apply to join the alpha.
                    </p>

                    <div className="bg-white rounded-2xl p-8 text-left shadow-2xl">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme HVAC" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input type="email" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@acme.com" />
                            </div>
                            <button
                                onClick={() => window.location.href = `mailto:founder@servicetagger.com?subject=Partner Access Request&body=I'm interesting in joining the alpha.`}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-600/20 transition-all mt-4"
                            >
                                Apply Now
                            </button>
                            <p className="text-xs text-center text-slate-400 mt-4">
                                Clicking "Apply Now" will open your email client.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 opacity-50">
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            <span>7 of 10 founding partner spots remaining</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <img src={logo} alt="ServiceTagger" className="h-6 w-auto" />
                                <span className="font-bold text-slate-900">ServiceTagger</span>
                            </div>
                            <p className="text-slate-500 text-sm max-w-xs mb-4">
                                Modern field service software for HVAC & Plumbing professionals. Built for speed and simplicity.
                            </p>
                            <div className="text-sm font-medium text-slate-900">
                                <a href="mailto:founder@servicetagger.com" className="hover:text-blue-600">founder@servicetagger.com</a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#how-it-works" className="hover:text-blue-600">Features</a></li>
                                <li><a href="#pricing" className="hover:text-blue-600">Pricing</a></li>
                                <li><a href="#program" className="hover:text-blue-600">Partner Program</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">About</a></li>
                                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                        <div>© {new Date().getFullYear()} ServiceTagger. All rights reserved.</div>
                        <div>Lake Forest, CA ☀️</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
