import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import MainLayout from '../components/MainLayout';
import { Loader2, Sparkles, X, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import PricingInsight from '../components/PricingInsight';

interface PricebookItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    type: string;
    category?: string;
}

const PricebookPage: React.FC = () => {
    const [items, setItems] = useState<PricebookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', type: 'service', price: '', description: '', category: '' });
    const [isGenerating, setIsGenerating] = useState(false);
    const [showInsight, setShowInsight] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/pricebook', newItem);
            setItems([...items, data]);
            setIsCreating(false);
            setNewItem({ name: '', type: 'service', price: '', description: '', category: '' });
            setShowInsight(false);
            toast.success("Item added to pricebook");
        } catch (err) {
            toast.error("Failed to create item");
        }
    };

    const handleAIGenerate = async () => {
        if (!newItem.name) return toast.error("Please enter a name first");
        setIsGenerating(true);
        try {
            // Asking AI to write a description based on the name
            const { data } = await api.post('/ai/tone-check', {
                text: `Write a professional, sales-oriented description for a ${newItem.type} called "${newItem.name}". Keep it under 30 words.`
            });
            setNewItem({ ...newItem, description: data.result });
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const { data } = await api.get('/pricebook');
                setItems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    if (loading) return <div>Loading Pricebook...</div>;

    return (
        <MainLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Pricebook Manager</h2>
                        <p className="text-slate-500 mt-1">Manage services and materials</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-xl shadow-lg shadow-brand/20 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
                    >
                        + Add Item
                    </button>
                </header>

                {isCreating && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-800">Add New Item</h3>
                                <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow border border-slate-100"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                                        <input
                                            required
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium text-slate-900"
                                            placeholder="e.g. AC Tune-Up"
                                            value={newItem.name}
                                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-semibold text-slate-700">Price ($)</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!newItem.name) return toast.error("Enter a name first to check market rates");
                                                    setShowInsight(true);
                                                }}
                                                className="text-xs flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-all"
                                            >
                                                <TrendingUp size={12} /> Check Market
                                            </button>
                                        </div>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-all font-medium text-slate-900"
                                            placeholder="0.00"
                                            value={newItem.price}
                                            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                        />
                                        {showInsight && newItem.name && (
                                            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
                                                <PricingInsight
                                                    serviceType={newItem.name}
                                                    currentPrice={parseFloat(newItem.price) || 0}
                                                    zipCode="90210" // Demo Zip
                                                    onUpdatePrice={(p) => setNewItem({ ...newItem, price: p.toString() })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                                        <select
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand/20 bg-white"
                                            value={newItem.type}
                                            onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                                        >
                                            <option value="service">Service</option>
                                            <option value="material">Material</option>
                                            <option value="labor">Labor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                        <input
                                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                            placeholder="e.g. HVAC"
                                            value={newItem.category}
                                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-semibold text-slate-700">Description</label>
                                        <button
                                            type="button"
                                            onClick={handleAIGenerate}
                                            disabled={isGenerating || !newItem.name}
                                            className="text-xs flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-bold bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
                                        >
                                            {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                            AI Generate
                                        </button>
                                    </div>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand/20 transition-all min-h-[100px] resize-none text-slate-600"
                                        placeholder="Enter description or use AI to generate one..."
                                        value={newItem.description}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-brand/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                    >
                                        Save Item
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group hover:border-brand/30">
                                <div className="h-32 bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand/5 transition-colors">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wide
                                            ${item.type === 'service' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {item.type}
                                        </span>
                                        <span className="text-lg font-bold text-slate-900">${item.price.toFixed(2)}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 h-10 overflow-hidden line-clamp-2">{item.description}</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 border border-slate-200 text-slate-600 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all">Edit</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Items in Pricebook</h3>
                        <p className="text-slate-500 max-w-md mb-8">
                            Add services, labor rates, and materials to your pricebook to speed up invoicing.
                        </p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Add Your First Item
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default PricebookPage;
