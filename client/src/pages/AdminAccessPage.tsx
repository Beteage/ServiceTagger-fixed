import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

const AdminAccessPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Artificial delay for smooth feel
            await new Promise(resolve => setTimeout(resolve, 800));

            const { data } = await api.post('/auth/quick-access', { code });
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError('Access Denied');
            setLoading(false);
            setCode('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black selection:bg-white/20">
            <div className="w-full max-w-sm px-6">

                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-glow">
                        <Lock className="w-5 h-5 text-white/80" />
                    </div>
                    <h1 className="text-xl font-medium text-white tracking-widest uppercase opacity-80">
                        Restricted Access
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up delay-100">
                    <div className="relative group">
                        <input
                            type="password"
                            placeholder="ENTER ACCESS CODE"
                            className="w-full bg-transparent border-b border-white/20 py-4 text-center text-2xl tracking-[0.5em] text-white placeholder-white/20 focus:outline-none focus:border-white transition-all duration-500 font-light"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            autoFocus
                            disabled={loading}
                        />

                        {/* Error Message */}
                        <div className={`absolute -bottom-8 left-0 w-full text-center transition-all duration-300 ${error ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}>
                            <span className="text-red-400 text-xs tracking-widest uppercase font-medium">{error}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!code || loading}
                        className="group w-full flex items-center justify-center space-x-2 py-4 text-sm font-medium tracking-widest uppercase text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <span>{loading ? 'Verifying' : 'Enter System'}</span>
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        )}
                    </button>
                </form>

                {/* Footer Decor */}
                <div className="fixed bottom-8 left-0 w-full text-center">
                    <p className="text-[10px] text-white/20 tracking-[0.3em]">SERVICETAGGER ADMIN</p>
                </div>
            </div>

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
            }}></div>
        </div>
    );
};

export default AdminAccessPage;
