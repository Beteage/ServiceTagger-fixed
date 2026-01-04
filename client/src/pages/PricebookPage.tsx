import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import MainLayout from '../components/MainLayout';

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
                        onClick={() => alert("Create Item Modal coming soon!")}
                        className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-xl shadow-lg shadow-brand/20 hover:-translate-y-0.5 transition-all font-bold flex items-center gap-2"
                    >
                        + Add Item
                    </button>
                </header>

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
            </div>
        </MainLayout>
    );
};

export default PricebookPage;
