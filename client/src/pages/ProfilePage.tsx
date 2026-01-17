import React from 'react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/MainLayout';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <MainLayout>
            <div className="p-6 max-w-4xl mx-auto py-10">
                <button
                    onClick={() => window.history.back()}
                    className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                >
                    ← Back
                </button>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
                <p className="text-slate-500 mb-8">Manage your account settings and preferences</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center gap-6">
                        <div className="w-24 h-24 bg-brand/10 text-brand rounded-full flex items-center justify-center text-4xl font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{user?.email?.split('@')[0]}</h2>
                            <p className="text-slate-500">{user?.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                {user?.role || 'User'}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <User size={16} /> Full Name
                                </label>
                                <p className="text-lg text-slate-800 font-medium">
                                    {/* Assuming name might not be on user object based on previous context, using placeholder or email part */}
                                    {user?.email?.split('@')[0]}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </label>
                                <p className="text-lg text-slate-800 font-medium">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <Shield size={16} /> Account Role
                                </label>
                                <p className="text-lg text-slate-800 font-medium capitalize">{user?.role || 'Standard User'}</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Account Actions</h3>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                            >
                                <LogOut size={20} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
