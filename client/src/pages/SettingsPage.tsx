
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { User, CreditCard, Bell, Shield, Key, Save, Loader } from 'lucide-react';
import api from '../api/axios';

interface UserProfile {
    id: string;
    email: string;
    role: string;
}

const SettingsPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/users/me');
            setProfile(data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!password) return;
        setSaving(true);
        try {
            await api.put('/users/me', { password });
            alert('Password updated successfully');
            setPassword('');
        } catch (err) {
            console.error("Failed to update profile", err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
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
                                        disabled={!password || saving}
                                        className={`flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-brand/20 transition-all ${!password || saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-dark hover:scale-105'}`}
                                    >
                                        {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Coming Soon Placeholder */
                            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center opacity-70 animate-in fade-in zoom-in-95">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Shield size={32} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon</h3>
                                <p className="text-slate-500 max-w-md">
                                    The <span className="font-bold text-brand capitalize">{activeTab}</span> settings panel is currently under development.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default SettingsPage;
