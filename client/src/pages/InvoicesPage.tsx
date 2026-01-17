
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { FileText, Plus, DollarSign, Clock, CheckCircle, Mail, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'sonner';
import PayPalPayment from '../components/PayPalPayment';

interface Invoice {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    job?: {
        customer?: {
            name: string;
        };
    };
    items: any[];
}

const InvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsCreateModalOpen(true);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const { data } = await api.get('/invoices');
            setInvoices(data);
        } catch (err) {
            console.error("Failed to fetch invoices", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJobSelect = async (jobId: string, items: any[]) => {
        try {
            // Generate Invoice via API
            await api.post('/invoices/generate', {
                jobId: jobId,
                items: items
            });
            setIsCreateModalOpen(false);
            fetchInvoices();
            // Optional: Provide download link for generated PDF if returned?
            // Current backend pipes PDF directly, so we might want a different approach for "download"
            // For MVP, we can just say "Invoice Created" and maybe refresh list.
            // Actually, if backend pipes PDF, axios might struggle unless we set blob response type.
            // Let's assume the POST just creates it in DB for now, or we'll fix the backend to return JSON first then PDF via separate link.
            // Wait, looking at backend: `doc.pipe(res)`. This downloads the file.
            // If we use axios normally, it will swallow the PDF binary.
            // We should use window.open or a form submit if we want immediate download, OR change backend.
            toast.success("Invoice Generated! Check the list.");
        } catch (error) {
            console.error("Failed to generate invoice", error);
            toast.error("Failed to generate invoice");
        }
    };

    // Calculate Summary Metrics
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'draft': return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'void': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-orange-100 text-orange-800 border-orange-200';
        }
    };

    const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

    // ... (existing imports and state)

    return (
        <MainLayout>
            <CreateInvoiceModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onJobSelect={handleJobSelect}
            />

            {/* Payment Modal */}
            {paymentInvoice && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                        <button
                            onClick={() => setPaymentInvoice(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <Plus className="rotate-45" size={24} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <DollarSign size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Pay Invoice #{paymentInvoice.id.substring(0, 8)}</h3>
                            <p className="text-slate-500">Amount Due</p>
                            <div className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(paymentInvoice.amount)}</div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-500">Customer</span>
                                <span className="font-semibold text-slate-800">{paymentInvoice.job?.customer?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Date</span>
                                <span className="font-semibold text-slate-800">{formatDate(paymentInvoice.createdAt)}</span>
                            </div>
                        </div>

                        <PayPalPayment
                            amount={paymentInvoice.amount}
                            onSuccess={() => {
                                setPaymentInvoice(null);
                                fetchInvoices();
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
                {/* ... existing header and summary cards ... */}

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Invoices</h1>
                        <p className="text-slate-500 mt-1">Track payments and revenue</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Create Invoice
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold text-slate-800">{formatCurrency(totalRevenue)}</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1">Outstanding</div>
                            <div className="text-2xl font-bold text-orange-500">{formatCurrency(outstanding)}</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1">Paid</div>
                            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(paid)}</div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-slate-500">Loading invoices...</div>
                    ) : invoices.length > 0 ? (
                        <div className="overflow-auto custom-scrollbar flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Invoice ID</th>
                                        <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Date</th>
                                        <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Customer</th>
                                        <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Amount</th>
                                        <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Status</th>
                                        <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                            <td className="p-4 font-mono text-sm text-slate-500">#{inv.id.substring(0, 8)}</td>
                                            <td className="p-4 text-slate-700 font-medium">{formatDate(inv.createdAt)}</td>
                                            <td className="p-4 font-bold text-slate-800">{inv.job?.customer?.name || "Unknown"}</td>
                                            <td className="p-4 font-bold text-slate-900">{formatCurrency(inv.amount)}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(inv.status)}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                <button className="text-brand hover:text-brand-dark font-bold text-sm bg-brand/5 px-3 py-1.5 rounded-lg hover:bg-brand/10 transition-colors">PDF</button>
                                                {inv.status !== 'Paid' && (
                                                    <button
                                                        onClick={() => setPaymentInvoice(inv)}
                                                        className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        const subject = encodeURIComponent(`Invoice from ServiceTagger #${inv.id.substring(0, 8)}`);
                                                        const body = encodeURIComponent(`Hi ${inv.job?.customer?.name || 'Customer'},\n\nPlease find your invoice attached.\n\nThank you,\nServiceTagger Team`);
                                                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                                    }}
                                                    className="text-slate-500 hover:text-slate-700 font-bold text-sm bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                                                    title="Email Invoice"
                                                >
                                                    <Mail size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete Invoice #${inv.id.substring(0, 8)}? This cannot be undone.`)) {
                                                            api.delete(`/invoices/${inv.id}`)
                                                                .then(() => {
                                                                    toast.success('Invoice deleted');
                                                                    fetchInvoices();
                                                                })
                                                                .catch(err => toast.error('Failed to delete invoice'));
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-white font-bold text-sm bg-red-50 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                    title="Delete Invoice"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 relative">
                                <FileText size={40} className="text-slate-300" />
                                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm">
                                    <Plus size={16} className="text-brand" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No invoices generated</h3>
                            <p className="text-slate-500 max-w-md mb-8">
                                Invoices will appear here once you complete jobs and bill customers.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

const CreateInvoiceModal = ({ isOpen, onClose, onJobSelect }: { isOpen: boolean, onClose: () => void, onJobSelect: (jobId: string, items: any[]) => void }) => {
    const [step, setStep] = useState(1);
    const [jobs, setJobs] = useState<any[]>([]);
    const [pricebook, setPricebook] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedJob(null);
            setInvoiceItems([]);
            fetchJobs();
            fetchPricebook();
        }
    }, [isOpen]);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPricebook = async () => {
        try {
            const { data } = await api.get('/pricebook');
            setPricebook(data);
        } catch (error) {
            console.error(error);
        }
    };

    const addItem = (item: any) => {
        const existing = invoiceItems.find(i => i.pricebookItemId === item.id);
        if (existing) {
            setInvoiceItems(invoiceItems.map(i => i.pricebookItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setInvoiceItems([...invoiceItems, { pricebookItemId: item.id, name: item.name, price: item.price, quantity: 1 }]);
        }
    };

    const updateQuantity = (id: string, delta: number) => {
        setInvoiceItems(invoiceItems.map(i => {
            if (i.pricebookItemId === id) {
                const newQty = Math.max(0, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const total = invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-0 shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {step === 1 ? "Select Job" : "Add Items"}
                        </h3>
                        <p className="text-sm text-slate-500">Step {step} of 2</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-100">
                        <Plus className="rotate-45" size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {step === 1 ? (
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {isLoading ? (
                                <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-2">
                                    <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                                    Loading jobs...
                                </div>
                            ) : jobs.length > 0 ? (
                                jobs.map(job => (
                                    <div
                                        key={job.id}
                                        onClick={() => { setSelectedJob(job); setStep(2); }}
                                        className="p-4 border border-slate-200 rounded-xl hover:bg-brand/5 hover:border-brand/30 cursor-pointer transition-all group flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg mb-1">{job.customer?.name || "Unknown Customer"}</div>
                                            <div className="flex gap-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(job.scheduledStart).toLocaleDateString()}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium uppercase">{job.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-brand opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">Select &rarr;</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    No active jobs found.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Job Header */}
                            <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                                <span className="font-bold text-slate-700">{selectedJob?.customer?.name}</span>
                                <button onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline">Change Job</button>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* Pricebook List */}
                                <div className="w-1/2 border-r border-slate-100 overflow-y-auto p-4 custom-scrollbar">
                                    <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">Pricebook Items</h4>
                                    <div className="space-y-2">
                                        {pricebook.map(item => (
                                            <div key={item.id} onClick={() => addItem(item)} className="p-3 border border-slate-200 rounded-lg hover:border-brand hover:shadow-sm cursor-pointer transition-all bg-white group">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                                    <div className="font-mono text-xs text-brand font-bold bg-brand/5 px-1.5 py-0.5 rounded">${item.price}</div>
                                                </div>
                                                <div className="text-xs text-slate-500 line-clamp-1 mt-1">{item.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Invoice Items (Bill) */}
                                <div className="w-1/2 flex flex-col bg-slate-50/50">
                                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                        <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">Invoice Items</h4>
                                        {invoiceItems.length === 0 ? (
                                            <div className="text-center py-8 text-slate-400 text-sm italic">Click items on the left to add them</div>
                                        ) : (
                                            <div className="space-y-2">
                                                {invoiceItems.map((item, idx) => (
                                                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                                                        <div className="flex-1">
                                                            <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                                                            <div className="text-xs text-slate-500">${item.price} x {item.quantity}</div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => updateQuantity(item.pricebookItemId, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-600">-</button>
                                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.pricebookItemId, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 text-slate-600">+</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                        <div className="flex justify-between items-end mb-4">
                                            <span className="text-slate-500 font-medium">Total Due</span>
                                            <span className="text-2xl font-bold text-slate-900">${total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => onJobSelect(selectedJob.id, invoiceItems)}
                                                disabled={invoiceItems.length === 0}
                                                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50"
                                            >
                                                Save Only
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await api.post('/invoices/paypal', { jobId: selectedJob.id, items: invoiceItems });
                                                        toast.success(`PayPal Invoice Sent! Opening link...`);
                                                        window.open(res.data.link, '_blank');
                                                        onClose();
                                                    } catch (err: any) {
                                                        const msg = err.response?.data?.message || err.message;
                                                        const detail = err.response?.data?.error || '';
                                                        toast.error(`Failed: ${msg}`, { description: detail });
                                                    }
                                                }}
                                                disabled={invoiceItems.length === 0}
                                                className="flex-1 bg0-[#003087] bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                Send PayPal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoicesPage;
