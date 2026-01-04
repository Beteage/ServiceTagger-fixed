
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import { Users, UserPlus, Search, MapPin, Phone, Mail } from 'lucide-react';
import api from '../api/axios';

interface Customer {
    id: string;
    name: string;
    address: string;
    phone: string;
    email?: string;
}

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        email: ''
    });

    const fetchCustomers = async () => {
        try {
            const { data } = await api.get('/customers');
            setCustomers(data);
        } catch (err) {
            console.error("Failed to fetch customers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/customers', formData);
            setIsModalOpen(false);
            setFormData({ name: '', address: '', phone: '', email: '' });
            fetchCustomers(); // Refresh list
        } catch (err) {
            alert('Failed to create customer');
            console.error(err);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
                        <p className="text-slate-500 mt-1">Manage your client base</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand/20 hover:-translate-y-0.5"
                    >
                        <UserPlus size={20} />
                        Add Customer
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm mb-6 flex gap-4 pl-4 items-center focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition-all">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers by name or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 bg-transparent focus:outline-none placeholder:text-slate-400 text-slate-800"
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading customers...</div>
                    ) : filteredCustomers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCustomers.map((customer) => (
                                <div key={customer.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group hover:border-brand/30">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 font-bold group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <button className="text-xs text-slate-400 hover:text-brand font-bold border border-slate-200 hover:border-brand px-3 py-1 rounded-lg transition-all">View</button>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-brand transition-colors">{customer.name}</h3>

                                    <div className="space-y-2 mt-3 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-400" />
                                            <span className="truncate">{customer.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" />
                                            <span>{customer.phone}</span>
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-slate-400" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center h-full">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Users size={40} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No customers found</h3>
                            <p className="text-slate-500 max-w-md mb-8">
                                {searchQuery ? "Try adjusting your search terms." : "Get started by adding your first customer."}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    Add Customer Now
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Add New Customer</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                                    placeholder="e.g. Jane Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                                    placeholder="e.g. 123 Main St"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                                        placeholder="(555) 123-4567"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                                        placeholder="jane@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
                                >
                                    Create Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default CustomersPage;

