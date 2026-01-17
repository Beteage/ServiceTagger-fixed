import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import MainLayout from '../components/MainLayout';
import { User, Mail, Shield, Plus, X, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
    id: string;
    email: string;
    role: string;
    skills?: string;
    paypalEmail?: string;
}

const TeamPage: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'Technician', skills: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Payout State
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutNote, setPayoutNote] = useState('');

    const handlePayout = async () => {
        if (!selectedMember || !payoutAmount || !selectedMember.paypalEmail) return;

        setIsSaving(true);
        try {
            await api.post('/payments/payouts', {
                email: selectedMember.paypalEmail,
                amount: payoutAmount,
                note: payoutNote
            });
            toast.success(`Sent $${payoutAmount} to ${selectedMember.email}`);
            setSelectedMember(null);
            setPayoutAmount('');
            setPayoutNote('');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Payout failed");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data } = await api.get('/users');
            setMembers(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load team");
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/users', newUser);
            toast.success("Team member added");
            setIsInviting(false);
            setNewUser({ email: '', password: '', role: 'Technician', skills: '' });
            fetchMembers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add member");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="p-8 max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Team Management</h1>
                        <p className="text-slate-500 mt-1">Manage technicians and dispatchers</p>
                    </div>
                    <button
                        onClick={() => setIsInviting(true)}
                        className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-xl shadow-lg shadow-brand/20 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Member
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading team...</div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {members.map(member => (
                                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                    {member.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="font-medium text-slate-900">{member.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${member.role === 'Admin'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                }`}>
                                                {member.role === 'Admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {member.skills || <span className="text-slate-300 italic">None listed</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-brand font-medium text-sm transition-colors">
                                                Edit
                                            </button>
                                            {member.paypalEmail && (
                                                <button
                                                    onClick={() => setSelectedMember(member)}
                                                    className="ml-4 text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 transition-colors"
                                                >
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {members.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                No team members found. Invite some!
                            </div>
                        )}
                    </div>
                )}

                {isInviting && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800">Invite New Member</h3>
                                <button onClick={() => setIsInviting(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleInvite} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="email"
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand/20 transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="tech@example.com"
                                            value={newUser.email}
                                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Temporary Password</label>
                                    <input
                                        required
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand/20 transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand/20 bg-white"
                                            value={newUser.role}
                                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <option value="Technician">Technician</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Dispatcher">Dispatcher</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Skills</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand/20 text-slate-900"
                                            placeholder="HVAC, Plumbing..."
                                            value={newUser.skills}
                                            onChange={e => setNewUser({ ...newUser, skills: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsInviting(false)}
                                        className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 py-2.5 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Member
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Payout Modal */}
                {selectedMember && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800">Send Payout</h3>
                                <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 flex items-center gap-2">
                                    <User size={16} />
                                    Paying <strong>{selectedMember.email}</strong>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Amount ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand/20 transition-all text-slate-900 text-lg font-bold"
                                        placeholder="0.00"
                                        value={payoutAmount}
                                        onChange={e => setPayoutAmount(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Note</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-brand/20 transition-all text-slate-900"
                                        placeholder="Bonus, expense reimbursement..."
                                        value={payoutNote}
                                        onChange={e => setPayoutNote(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={handlePayout}
                                    disabled={isSaving || !payoutAmount}
                                    className="w-full py-3 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : "Send Money"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default TeamPage;
