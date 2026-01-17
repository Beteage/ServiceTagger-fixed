import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    Search,
    Bell,
    LogOut,
    Menu,
    FolderOpen,
    BrainCircuit,
    Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Toaster } from 'sonner';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const MOCK_RESULTS = [
        { type: 'Customer', label: 'John Smith', sub: 'Los Angeles, CA' },
        { type: 'Customer', label: 'Alice Brown', sub: 'San Diego, CA' },
        { type: 'Job', label: '#1024 - Fix AC', sub: 'Pending • John Smith' },
        { type: 'Job', label: '#1025 - Install Heater', sub: 'Scheduled • Alice Brown' },
        { type: 'Invoice', label: 'INV-2024-001', sub: '$450.00 • Paid' },
    ];

    const navItems = [
        { label: 'Dispatch', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Schedule', icon: Calendar, path: '/schedule' },
        { label: 'The Brain', icon: BrainCircuit, path: '/brain' },
        { label: 'Customers', icon: Users, path: '/customers' },
        { label: 'Pricebook', icon: FolderOpen, path: '/pricebook' },
        { label: 'Invoices', icon: FileText, path: '/invoices' },
        { label: 'Team', icon: Users, path: '/team' },
        { label: 'Settings', icon: Settings, path: '/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen overflow-hidden font-sans transition-colors duration-500 bg-white">
            {/* Sidebar */}
            <aside className={cn(
                "flex flex-col transition-all duration-300 ease-in-out z-20 border-r",
                isSidebarOpen ? "w-64" : "w-20",
                "bg-white border-slate-100 text-slate-600"
            )}>

                <div className={cn("h-40 flex flex-col items-center justify-center py-6 border-b transition-all border-slate-100")}>
                    <div className={cn("font-bold text-xl tracking-tight flex flex-col items-center gap-2", !isSidebarOpen && "justify-center")}>
                        <img src="/logo.png" alt="ServiceTagger Logo" className={cn("object-contain transition-all", isSidebarOpen ? "w-20 h-20" : "w-10 h-10")} />
                        {isSidebarOpen && <span className="text-xl bg-clip-text text-transparent font-extrabold uppercase tracking-wide bg-gradient-to-r from-slate-900 to-slate-600">ServiceTagger</span>}
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative font-medium",
                                    isActive ? "bg-brand/10 text-brand font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                                    !isSidebarOpen && "justify-center"
                                )}
                            >
                                <item.icon size={20} className={cn("transition-colors",
                                    isActive ? "text-brand" : "text-slate-400 group-hover:text-slate-700"
                                )} />
                                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                                {!isSidebarOpen && (
                                    <div className="absolute left-14 text-xs font-medium px-2 py-1.5 rounded shadow-xl border opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-opacity bg-white text-slate-900 border-slate-100">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs ring-2 bg-white text-slate-700 ring-slate-200 shadow-sm">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-slate-900">{user?.email}</p>
                                <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 mt-0.5 transition-colors">
                                    <LogOut size={12} /> Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-16 absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 border-b transition-all bg-white/80 backdrop-blur-xl border-slate-100 text-slate-900">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-md transition-colors lg:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Global Search */}
                        <div className="relative hidden md:block w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-brand" size={16} />
                            <input
                                type="text"
                                placeholder="Search customers, jobs, invoices..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(e.target.value.length > 0);
                                }}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                                className="w-full pl-10 pr-4 py-2 rounded-full text-sm transition-all outline-none border bg-slate-100 border-transparent text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand"
                            />
                            {/* Search Dropdown */}
                            {showResults && searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    {MOCK_RESULTS.filter(r => r.label.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                        MOCK_RESULTS.filter(r => r.label.toLowerCase().includes(searchQuery.toLowerCase())).map((result, i) => (
                                            <div
                                                key={i}
                                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0"
                                                onClick={() => {
                                                    setSearchQuery(result.label);
                                                    setShowResults(false);
                                                }}
                                            >
                                                <div className={`p-2 rounded-lg ${result.type === 'Customer' ? 'bg-blue-50 text-blue-600' :
                                                    result.type === 'Job' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                    {result.type === 'Customer' ? <Users size={16} /> : result.type === 'Job' ? <LayoutDashboard size={16} /> : <FileText size={16} />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-800">{result.label}</div>
                                                    <div className="text-xs text-slate-500">{result.sub}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 rounded-full transition-all group text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            onClick={() => alert("Notifications coming soon!")}
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white group-hover:animate-ping"></span>
                        </button>
                        <div
                            className="h-9 w-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white cursor-pointer transition-all active:scale-95 bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-900/20"
                            onClick={() => navigate('/profile')}
                        >
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto pt-16 bg-white">
                    {children}
                </main>
            </div>
            <Toaster position="top-right" richColors />
        </div>
    );
};

export default MainLayout;
