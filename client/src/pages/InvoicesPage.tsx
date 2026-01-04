
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { FileText, Plus, DollarSign, Clock, CheckCircle } from 'lucide-react';
import api from '../api/axios';

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

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            // Simulate opening invoice flow
            setTimeout(() => alert("AI Command: Starting Invoice Creation Flow..."), 500);
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

    return (
        <MainLayout>
            <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Invoices</h1>
                        <p className="text-slate-500 mt-1">Track payments and revenue</p>
                    </div>
                    <button
                        onClick={() => alert("Create Invoice Flow: Go to a Job -> Click Generate Invoice")}
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
                                            <td className="p-4">
                                                <button className="text-brand hover:text-brand-dark font-bold text-sm bg-brand/5 px-3 py-1.5 rounded-lg hover:bg-brand/10 transition-colors">Download PDF</button>
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

export default InvoicesPage;
