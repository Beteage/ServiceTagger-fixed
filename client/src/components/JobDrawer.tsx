import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, MapPin, FileText, Loader2, Save, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import PricingInsight from './PricingInsight';
import UpsellSuggestions from './UpsellSuggestions';

interface Job {
    id: string;
    description: string;
    status: string;
    scheduledStart: string;
    technicianId?: string;
    customer?: {
        name: string;
        address: string;
        phone?: string;
        email?: string;
    };
}

interface JobDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string | null;
    onJobUpdated: () => void;
    allJobs: Job[];
}

const JobDrawer: React.FC<JobDrawerProps> = ({ isOpen, onClose, jobId, onJobUpdated, allJobs }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [technicians, setTechnicians] = useState<any[]>([]);

    // Workload Calculation Helper
    const getTechWorkload = (techId: string, dateStr: string) => {
        if (!dateStr) return 0;
        const targetDate = new Date(dateStr).toDateString();
        return allJobs.filter(j =>
            j.technicianId === techId &&
            new Date(j.scheduledStart).toDateString() === targetDate &&
            j.id !== jobId // Don't count current job if already assigned? Or do? Maybe exclude self if reassignment.
        ).length;
    };

    // Edit States
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');
    const [technicianId, setTechnicianId] = useState('');
    const [scheduledStart, setScheduledStart] = useState('');

    useEffect(() => {
        if (isOpen && jobId) {
            fetchJobDetails(jobId);
            fetchTechnicians();
        } else {
            setJob(null);
        }
    }, [isOpen, jobId]);

    const fetchJobDetails = async (id: string) => {
        setLoading(true);
        try {
            const { data } = await api.get(`/jobs/${id}`);
            setJob(data);
            setStatus(data.status);
            setDescription(data.description);
            setTechnicianId(data.technicianId || '');
            // Format date for datetime-local input
            const date = new Date(data.scheduledStart);
            const formatted = date.toISOString().slice(0, 16); // yyyy-MM-ddThh:mm
            setScheduledStart(formatted);
        } catch (err) {
            console.error("Failed to fetch job", err);
            toast.error("Failed to load job details");
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const { data } = await api.get('/users');
            // Filter for technicians only (case insensitive just in case)
            const techs = data.filter((u: any) => u.role.toLowerCase() === 'technician');
            setTechnicians(techs);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        if (!job) return;
        setSaving(true);
        try {
            await api.put(`/jobs/${job.id}`, {
                status,
                description,
                technicianId: technicianId || null, // Create endpoint usually handles this? Checks routs... 
                // Typically PUT /jobs/:id updates specific fields. 
                // If backend supports full update, great. If not, we might need separate endpoints.
                // Assuming standard REST update based on typical patterns.
                scheduledStart: new Date(scheduledStart).toISOString()
            });

            // Also update status specifically if needed (some backends separate workflow)
            if (status !== job.status) {
                await api.put(`/jobs/${job.id}/status`, { status });
            }

            toast.success("Job updated successfully");
            onJobUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update job");
        } finally {
            setSaving(false);
        }
    };

    const handleGenerateInvoice = () => {
        if (!job) return;
        window.open(`http://localhost:3001/api/invoices/generate?jobId=${job.id}`, '_blank');
        toast.success("Generating Invoice...");
    };

    if (!isOpen) return null;

    return (
        <div className={cn(
            "fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
        )}>
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        Job #{job?.id.slice(0, 8)}
                        {loading && <Loader2 className="animate-spin text-slate-400" size={16} />}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full">✕</button>
                </div>

                {loading || !job ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400">Loading details...</div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-6">
                        {/* Status Bar */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Status</label>
                            <div className="flex gap-2">
                                {['Draft', 'Scheduled', 'EnRoute', 'Working', 'Done'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-bold transition-all border",
                                            status === s
                                                ? "bg-brand text-white border-brand shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-brand/30"
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <User size={16} className="text-slate-500" /> Customer
                            </h3>
                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <div className="font-bold text-lg text-slate-900">{job.customer?.name}</div>
                                <div className="flex items-start gap-2 text-slate-600 text-sm mt-1">
                                    <MapPin size={14} className="mt-0.5 text-slate-400" />
                                    {job.customer?.address}
                                </div>
                            </div>
                        </div>

                        {/* Details Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Items / Description</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-xl p-3 h-32 outline-none focus:ring-2 focus:ring-brand/20 transition-all text-slate-700 resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Technician</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand/20 bg-white"
                                        value={technicianId}
                                        onChange={(e) => setTechnicianId(e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        {technicians.map(t => {
                                            const count = getTechWorkload(t.id, scheduledStart);
                                            const workloadText = count > 0 ? `(${count} jobs today)` : '';
                                            return (
                                                <option key={t.id} value={t.id}>
                                                    {t.email} {workloadText}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Schedule</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-brand/20"
                                        value={scheduledStart}
                                        onChange={(e) => setScheduledStart(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Insight */}
                        <PricingInsight
                            serviceType={description} // Use description as service type for now (simple heuristic)
                            currentPrice={0} // Job Model doesn't have price? Let's check. 
                            // Ah, Job has Invoices, but Job itself doesn't have a total? 
                            // InvoiceItems have price. 
                            // For MVP Smart Pricing Calculator, let's just assume we want to guide them on the "Service" being discussed.
                            // Or, we can add a "Estimated Price" field to Job? 
                            // Or just pass 0 to show "Set Price".
                            zipCode="90210" // Hardcoded for demo or derived from customer address if we can parse it.
                            onUpdatePrice={(p) => {
                                // Add line item
                                setDescription(d => d + `\n\nService: $${p}`);
                            }}
                        />

                        {/* Upsell Suggestions */}
                        <UpsellSuggestions
                            jobId={job.id}
                            description={description}
                        />

                        {/* Actions */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 mb-3">Actions</h3>
                            <button
                                onClick={handleGenerateInvoice}
                                className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 mb-2"
                            >
                                <FileText size={18} />
                                Generate Inline Invoice
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm('Delete this job? This will also delete any associated invoices.')) {
                                        api.delete(`/jobs/${job.id}`)
                                            .then(() => {
                                                toast.success('Job deleted');
                                                onJobUpdated();
                                                onClose();
                                            })
                                            .catch(err => toast.error('Failed to delete job'));
                                    }
                                }}
                                className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={18} />
                                Delete Job
                            </button>
                        </div>
                    </div>
                )}

                <div className="pt-6 mt-auto border-t border-slate-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="flex-1 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDrawer;
