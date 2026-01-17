
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { User, CreditCard, Bell, Shield, Key, Save, Loader } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'sonner';

interface UserProfile {
    id: string;
    email: string;
    role: string;
    paypalEmail?: string;
}

const SettingsPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [password, setPassword] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // Local Settings State
    const [company, setCompany] = useState({ name: 'ServiceTagger Inc.', email: 'support@servicetagger.com' });
    const [notifications, setNotifications] = useState({ jobBooked: true, invoicePaid: true, weeklySummary: false });

    useEffect(() => {
        fetchProfile();
        // Load settings from localStorage
        const savedCompany = localStorage.getItem('st_company_settings');
        if (savedCompany) setCompany(JSON.parse(savedCompany));

        const savedNotifs = localStorage.getItem('st_notif_settings');
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/users/me');
            setProfile(data);
            if (data.paypalEmail) setPaypalEmail(data.paypalEmail);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates: any = {};
            if (password) updates.password = password;
            if (paypalEmail) updates.paypalEmail = paypalEmail;

            await api.put('/users/me', updates);
            toast.success('Profile updated successfully');
            setPassword('');
        } catch (err) {
            console.error("Failed to update profile", err);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveCompany = () => {
        localStorage.setItem('st_company_settings', JSON.stringify(company));
        toast.success('Company settings saved (Local)');
    };

    const handleSaveNotifications = () => {
        localStorage.setItem('st_notif_settings', JSON.stringify(notifications));
        toast.success('Notification preferences saved (Local)');
    };

    return (
        <MainLayout>
            <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                    {/* Settings Sidebar */}
                    <div className="space-y-1">
                        {[
                            { id: 'profile', icon: User, label: 'Profile' },
                            { id: 'company', icon: Shield, label: 'Company' },
                            { id: 'notifications', icon: Bell, label: 'Notifications' },
                            { id: 'billing', icon: CreditCard, label: 'Billing' },
                            { id: 'api', icon: Key, label: 'API Keys' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-white text-brand shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        {loading ? (
                            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-500">
                                <Loader className="animate-spin mr-2" /> Loading settings...
                            </div>
                        ) : activeTab === 'profile' ? (
                            /* Profile Section */
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                    <h3 className="text-lg font-bold text-slate-800">Profile Information</h3>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{profile?.role}</span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed"
                                            value={profile?.email || ''}
                                            disabled
                                        />
                                        <p className="text-xs text-slate-400 mt-1">Email cannot be changed via settings. Contact support.</p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-800 mb-4">Payout Settings</h4>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">PayPal Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                                            placeholder="you@example.com (for receiving payouts)"
                                            value={paypalEmail}
                                            onChange={(e) => setPaypalEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-800 mb-4">Security</h4>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                                            placeholder="Enter new password to update"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={(!password && !paypalEmail) || saving}
                                        className={`flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-brand/20 transition-all ${(!password && !paypalEmail) || saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-dark hover:scale-105'}`}
                                    >
                                        {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : activeTab === 'company' ? (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Company Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none"
                                            value={company.name}
                                            onChange={(e) => setCompany({ ...company, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none"
                                            value={company.email}
                                            onChange={(e) => setCompany({ ...company, email: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveCompany}
                                        className="bg-brand text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:scale-105 transition-all"
                                    >
                                        Save Company Info
                                    </button>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h4 className="text-sm font-bold text-red-600 mb-4">Danger Zone</h4>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                                            <div>
                                                <h5 className="font-semibold text-slate-800">Clear All Data</h5>
                                                <p className="text-sm text-slate-500">Permanently remove all jobs, customers, and invoices.</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you absolutely sure? This will delete ALL customers, jobs, and invoices. This action cannot be undone.')) {
                                                        api.delete('/seed')
                                                            .then(() => toast.success('All data cleared successfully'))
                                                            .catch(() => toast.error('Failed to clear data'));
                                                    }
                                                }}
                                                className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Remove Demo Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'notifications' ? (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Notification Preferences</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifications.jobBooked}
                                            onChange={(e) => setNotifications({ ...notifications, jobBooked: e.target.checked })}
                                            className="w-4 h-4 text-brand rounded focus:ring-brand option-input"
                                        />
                                        <label className="text-slate-700">Email me when a job is booked</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifications.invoicePaid}
                                            onChange={(e) => setNotifications({ ...notifications, invoicePaid: e.target.checked })}
                                            className="w-4 h-4 text-brand rounded focus:ring-brand option-input"
                                        />
                                        <label className="text-slate-700">Email me when an invoice is paid</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifications.weeklySummary}
                                            onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
                                            className="w-4 h-4 text-brand rounded focus:ring-brand option-input"
                                        />
                                        <label className="text-slate-700">Weekly performance summary</label>
                                    </div>

                                    <button
                                        onClick={handleSaveNotifications}
                                        className="bg-brand text-white px-4 py-2 rounded-lg font-bold text-sm mt-4 shadow-md hover:scale-105 transition-all"
                                    >
                                        Update Preferences
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Fallback for others */
                            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center opacity-70">
                                <Shield size={32} className="text-slate-400 mb-4" />
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Under Construction</h3>
                                <p className="text-slate-500">The {activeTab} panel is coming in the next update.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SettingsPage;
