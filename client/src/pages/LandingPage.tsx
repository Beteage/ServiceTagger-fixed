import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import dashboardScreenshot from '../assets/dashboard_screenshot.png';
import scheduleScreenshot from '../assets/screenshot_schedule.png';
import customersScreenshot from '../assets/screenshot_customers.png';
import { CheckCircle2, Menu, X, ShieldCheck, Clock, Users } from 'lucide-react';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Navigation — white for industry authenticity */}
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <img src={logo} alt="ServiceTagger" className="h-7 w-auto" />
                            <span className="font-bold text-xl tracking-tight text-slate-900">
                                Service<span className="text-blue-700">Tagger</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                            <a href="#features" className="hover:text-blue-700 transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-blue-700 transition-colors">How It Works</a>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
                            >
                                Sign In
                            </Link>
                            <a
                                href="mailto:founder@servicetagger.com?subject=Early Access Request"
                                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Email Founder
                            </a>
                        </div>

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

                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
                        <a href="#features" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" className="block text-slate-600 font-medium" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <Link to="/login" className="block text-slate-600 font-medium">Sign In</Link>
                        <a href="mailto:founder@servicetagger.com?subject=Early Access Request" className="block bg-slate-900 text-white text-center py-2.5 rounded-lg font-semibold" onClick={() => setMobileMenuOpen(false)}>Email Founder for Access</a>
                    </div>
                )}
            </nav>

            {/* Hero — full-viewport background image */}
            <header className="relative min-h-screen flex items-center justify-center">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('/hero-bg.jpg')` }}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center pt-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/20 text-xs font-semibold text-orange-400 mb-6 uppercase tracking-wide">
                        Private alpha · HVAC teams only
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Your technicians forget equipment details. ServiceTagger <span className="text-blue-400">doesn't.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/80 mb-4 leading-relaxed max-w-2xl mx-auto">
                        Track every job, every unit, every customer. One app your whole crew actually uses.
                    </p>

                    <p className="text-base text-white/60 mb-8 leading-relaxed max-w-2xl mx-auto">
                        We're building this with a small group of HVAC contractors. You'll get bugs, direct founder access, and software shaped around your real jobs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base transition-colors"
                        >
                            Apply for early access
                        </Link>
                        <a
                            href="mailto:founder@servicetagger.com"
                            className="w-full sm:w-auto px-8 py-3.5 text-white/70 hover:text-white font-semibold text-base transition-colors flex items-center justify-center gap-1 underline decoration-white/30 hover:decoration-white/70 underline-offset-4"
                        >
                            Talk directly with the founder
                        </a>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium text-white/50">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            <span>Used by real HVAC crews</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>Set up in one lunch break</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Alpha Notice */}
            <section className="py-8 bg-slate-50 border-y border-slate-200">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Currently partnering with a small group of HVAC contractors in private alpha.</p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything to run HVAC jobs. <span className="text-blue-700">Nothing you won't use.</span></h2>
                        <p className="text-lg text-slate-600">Scheduling, customers, invoicing. That's it.</p>
                    </div>

                    <div className="space-y-20">
                        {/* Feature 1: Scheduling */}
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 order-2 lg:order-1">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-6">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Schedule & Dispatch</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    See where every tech is at 2 PM. Drag a job to reassign it. They get a ping, you get confirmation.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Drag-and-drop weekly calendar",
                                        "Push notifications to techs",
                                        "Color-coded job status",
                                        "Filter by tech, date, or job type"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-slate-700 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 lg:flex-[1.2] order-1 lg:order-2">
                                <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 shadow-md">
                                    <img src={scheduleScreenshot} alt="Scheduling view" className="w-full h-auto rounded-lg border border-slate-200" />
                                </div>
                            </div>
                        </div>

                        {/* Feature 2: Customer Management */}
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 lg:flex-[1.2]">
                                <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 shadow-md">
                                    <img src={customersScreenshot} alt="Customer list view" className="w-full h-auto rounded-lg border border-slate-200" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 mb-6">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Customer Management</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                    Pull up any address and see every unit you've touched, every part you've installed, every note your techs left.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Full service history per address",
                                        "Equipment and model tracking",
                                        "Notes from every tech visit",
                                        "One-click call or text"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-slate-700 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
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
            <section className="py-16 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-semibold text-blue-400 mb-6 uppercase tracking-wide">
                                Built-in AI assistant
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                                Ask Brain. It remembers <span className="text-blue-400">your jobs.</span>
                            </h2>

                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                Ask it where the Smith job parts are. Ask what compressor you installed at 412 Oak last March. It pulls from your actual job history.
                            </p>

                            <ul className="space-y-3 mb-8">
                                {[
                                    "Searches your past jobs and customer records",
                                    "Answers questions about parts, addresses, equipment",
                                    "Learns from every job you log",
                                    "No setup, no training, just start asking"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-slate-300 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                                <div className="text-sm font-semibold text-slate-300 mb-1">Example</div>
                                <div className="text-sm text-slate-500 leading-relaxed">
                                    "Hey Brain, move the Smith job to Tuesday and notify the tech." <br />
                                    <span className="text-blue-400">Done. I've also notified the technician.</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="rounded-xl border border-slate-700 shadow-lg overflow-hidden bg-slate-800">
                                <img
                                    src="/brain-screenshot.png"
                                    alt="ServiceTagger Brain in action"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-16 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How it Works</h2>
                        <p className="text-lg text-slate-600">From phone call to payment in three clicks.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                step: "1",
                                title: "Create & Assign",
                                desc: "Customer calls, you create a job. Drag it onto a tech's calendar. They get a push notification with the address and job details."
                            },
                            {
                                step: "2",
                                title: "Dispatch & Track",
                                desc: "Your tech sees the job on their phone, drives to the site, logs parts used and time spent. You see their progress from the office."
                            },
                            {
                                step: "3",
                                title: "Invoice & Close",
                                desc: "Job done. Send a Stripe invoice from the app. Customer pays online. You move to the next call."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-10 h-10 bg-slate-800 text-white rounded-lg flex items-center justify-center font-bold text-lg mb-5">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-2xl p-10 md:p-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            Stop losing warranty paperwork.
                        </h2>
                        <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                            We're looking for 5 more HVAC shops to join the alpha. Email the founder directly.
                        </p>
                        <a
                            href="mailto:founder@servicetagger.com?subject=Early Access Request&body=I'm interested in joining the ServiceTagger alpha."
                            className="inline-block px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-lg transition-colors"
                        >
                            Email Founder for Access
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2 mb-4">
                                <img src={logo} alt="ServiceTagger" className="h-5 w-auto" />
                                <span>Service<span className="text-blue-700">Tagger</span></span>
                            </span>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                Job tracking and dispatch for HVAC contractors.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Product</h4>
                            <ul className="space-y-2.5 text-sm text-slate-600">
                                <li><a href="#features" className="hover:text-blue-700 transition-colors">Features</a></li>
                                <li><Link to="/login" className="hover:text-blue-700 transition-colors">Login</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-slate-900 mb-4 text-sm">Contact</h4>
                            <ul className="space-y-2.5 text-sm text-slate-600">
                                <li><a href="mailto:founder@servicetagger.com" className="hover:text-blue-700 transition-colors">founder@servicetagger.com</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6 text-sm text-slate-400">
                        <div>&copy; {new Date().getFullYear()} ServiceTagger. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
