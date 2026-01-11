import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminAccessPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/quick-access', { code });
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError('Invalid Access Code');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h2>
                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm font-medium text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter Code"
                        className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-white text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-6"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-500 transition-all"
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAccessPage;
