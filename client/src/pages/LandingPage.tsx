import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import dashboardScreenshot from '../assets/dashboard_screenshot.png';
import scheduleScreenshot from '../assets/screenshot_schedule.png';
import customersScreenshot from '../assets/screenshot_customers.png';
import { CheckCircle2, Menu, X, ShieldCheck, Zap, Users, ArrowRight, Star, Sparkles } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <img src={logo} alt="ServiceTagger" className="h-8 w-auto transition-transform group-hover:scale-105" />
                            <span className="font-extrabold text-2xl tracking-tighter text-slate-900">
                                Service<span className="text-sky-500">Tagger</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
                            <a href="#features" className="hover:text-sky-500 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-sky-500 transition-colors">How It Works</a>
                            <a href="#reviews" className="hover:text-sky-500 transition-colors">Reviews</a>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-bold text-slate-900 hover:text-sky-500 transition-colors"
                            >
                                Sign In
                            </Link>
                            <a
                                href="mailto:founder@servicetagger.com?subject=Early Access Request"
                                className="bg-black hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Email Founder
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-900 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-4 shadow-lg">
                        <a href="#features" className="block text-slate-600 font-bold" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="block text-slate-600 font-bold" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <Link to="/login" className="block text-slate-600 font-bold">Sign In</Link>
                        <a href="mailto:founder@servicetagger.com?subject=Early Access Request" className="block bg-black text-white text-center py-3 rounded-full font-bold" onClick={() => setMobileMenuOpen(false)}>Email Founder for Access</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Hero Text */}
                        <div className="text-center lg:text-left z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-xs font-bold text-sky-600 mb-8 uppercase tracking-wide">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                </span>
                                Founder‑led private alpha for HVAC teams
                            </div>

                            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.05]">
                                Proof that powerful field service software doesn't need to be <span className="text-sky-500">expensive or complicated.</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-600 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                                ServiceTagger is a streamlined field service platform designed to bring intelligent organization to HVAC operations.
                            </p>

                            <p className="text-base text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                We’re in early development and working closely with a small group of HVAC contractors to shape our fine‑tuned, RAG‑powered AI platform for real‑world service work. If you’re open to some bugs, direct access to the founder, and helping train the system on real jobs, we’d love to partner with you.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/40 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Apply for early access
                                </Link>
                                <a
                                    href="mailto:founder@servicetagger.com"
                                    className="w-full sm:w-auto px-10 py-5 text-slate-600 hover:text-slate-900 font-bold text-lg transition-all flex items-center justify-center gap-2 underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4"
                                >
                                    Talk directly with the founder
                                </a>
                            </div>

                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-bold text-slate-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-sky-500" />
                                    <span>Built for Industry Pros</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-sky-500" />
                                    <span>Quick Setup</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image - Stock Photo */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-sky-500/10 rounded-full blur-3xl transform rotate-3 opacity-60 pointer-events-none" />
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-700">
                                <img
                                    src="/hero-stock.jpg"
                                    alt="HVAC Technician using ServiceTagger"
                                    className="w-full h-auto object-cover"
                                />
                                {/* Overlay Card Effect similar to reference */}
                                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg hidden sm:block">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg">Job Completed</div>
                                            <div className="text-slate-500 text-sm">Tech notified • Customer billed</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Logo Cloud */}
            <section className="py-12 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Currently partnering with a small group of HVAC contractors in private alpha.</p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6">Focused on the <span className="text-sky-500">essentials</span> to run your HVAC jobs.</h2>
                        <p className="text-xl text-slate-600 font-medium">From the office to the field, keep your entire team in sync.</p>
                    </div>

                    <div className="space-y-40">
                        {/* Feature 1: Scheduling */}
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                            <div className="flex-1 order-2 lg:order-1">
                                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-8">
                                    <Star className="w-7 h-7" fill="currentColor" />
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">Schedule & Dispatch</h3>
                                <p className="text-slate-600 text-xl leading-relaxed mb-8">
                                    Drag and drop jobs to assign them to the right tech. Visualize your day, week, or month at a glance. Send instant notifications so your team knows exactly where to go.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Visual Drag-and-Drop Calendar",
                                        "Instant Technician Notifications",
                                        "Route Optimization",
                                        "Job Status Tracking"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-800 font-bold text-lg">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 lg:flex-[1.2] order-1 lg:order-2">
                                <div className="rounded-3xl p-4 bg-slate-100 border border-slate-200 shadow-2xl">
                                    <img src={scheduleScreenshot} alt="Scheduling" className="w-full h-auto rounded-2xl border border-slate-300/50 shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 2: Customer Management */}
                        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
                            <div className="flex-1 lg:flex-[1.2]">
                                <div className="rounded-3xl p-4 bg-slate-100 border border-slate-200 shadow-2xl">
                                    <img src={customersScreenshot} alt="Customer Management" className="w-full h-auto rounded-2xl border border-slate-300/50 shadow-sm" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mb-8">
                                    <Users className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">Customer Management</h3>
                                <p className="text-slate-600 text-xl leading-relaxed mb-8">
                                    All your customer data in one place. Service history, equipment details, and communication logs. Delight your customers with personalized service every time.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Complete Service History",
                                        "Equipment Tracking",
                                        "One-Click Communication",
                                        "Customer Portal"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-800 font-bold text-lg">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ServiceTagger Brain Section */}
            <section className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-black to-black opacity-40" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold text-sky-400 mb-8 uppercase tracking-wide">
                                <Sparkles className="w-3 h-3" />
                                <span>New Field Intelligence</span>
                            </div>

                            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
                                Meet <span className="text-sky-500">ServiceTagger Brain</span>
                            </h2>

                            <p className="text-xl text-slate-400 leading-relaxed mb-8">
                                A fine‑tuned, RAG‑powered AI that actually understands your business. It learns from your job history to organize workflows, answer questions, and automate dispatch.
                            </p>

                            <ul className="space-y-4 mb-10">
                                {[
                                    "Trained on your real-world job data",
                                    "Automates scheduling & dispatch logic",
                                    "Zero-setup: learns as you work",
                                    "Field intelligence, not just a chatbot"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-4 h-4 text-sky-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl">
                                <div className="flex items-start gap-4">
                                    <div>
                                        <div className="text-sm font-bold text-slate-300 mb-1">Human-level Context</div>
                                        <div className="text-xs text-slate-500 leading-relaxed">
                                            "Hey Brain, moving the Smith job to Tuesday—drag and drop it for me." <br />
                                            <span className="text-sky-500">Done. I've also notified the technician.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            <div className="absolute -inset-4 bg-sky-500/20 rounded-3xl blur-3xl opacity-30" />
                            <div className="relative rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-900 group">
                                <img
                                    src="/brain-screenshot.png"
                                    alt="ServiceTagger Brain Dashboard"
                                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">How it Works</h2>
                        <p className="text-xl text-slate-600">Three steps to a more organized business.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Create & Assign",
                                desc: "Generate work orders in a single click. Drag and drop to schedule and assign to technicians."
                            },
                            {
                                step: "02",
                                title: "Dispatch & Track",
                                desc: "Techs view job details, navigate to sites, and capture payments in app. You track progress in real-time."
                            },
                            {
                                step: "03",
                                title: "Get Paid Fast",
                                desc: "Send professional invoices instantly. Collect payments on the spot or online. Seamless accounting sync."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl text-slate-900 group-hover:text-sky-500 transition-colors select-none">
                                    {item.step}
                                </div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-sky-500/30">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black z-0" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-black to-black opacity-50" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                                Ready to grow your business?
                            </h2>
                            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                                We’re looking for a few more HVAC partners to help shape ServiceTagger during private alpha.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <a
                                    href="mailto:founder@servicetagger.com?subject=Early Access Request&body=I'm interested in joining the ServiceTagger alpha."
                                    className="w-full sm:w-auto px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-full font-bold text-xl transition-all shadow-xl shadow-sky-900/50 hover:shadow-2xl hover:shadow-sky-500/40 transform hover:-translate-y-1"
                                >
                                    Email Founder for Access
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <span className="font-extrabold text-2xl tracking-tighter text-slate-900 flex items-center gap-2 mb-6">
                                <img src={logo} alt="ServiceTagger" className="h-6 w-auto" />
                                <span>Service<span className="text-sky-500">Tagger</span></span>
                            </span>
                            <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
                                The modern operating system for field service teams. Built for speed, designed for growth.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-600">
                                <li><a href="#features" className="hover:text-sky-500 transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-sky-500 transition-colors">Pricing</a></li>
                                <li><a href="/login" className="hover:text-sky-500 transition-colors">Login</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-600">
                                <li><a href="#" className="hover:text-sky-500 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-sky-500 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-sky-500 transition-colors">Privacy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-400">
                        <div>© {new Date().getFullYear()} ServiceTagger. All rights reserved.</div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
