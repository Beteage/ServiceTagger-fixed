import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';


const RegisterPage: React.FC = () => {
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { businessName, email, password });
            if (data.userId) {
                // Registration successful, payment required
                navigate(`/complete-signup/${data.userId}`);
            } else if (data.token) {
                // Should not happen with new flow, but safe fallback
                login(data.token, data.user);
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="ServiceTagger" className="w-16 h-16 object-contain mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">Get Started</h2>
                    <p className="text-slate-500 text-sm">Create your ServiceTagger account</p>
                </div>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2">Business Name</label>
                        <input
                            type="text"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 focus:border-brand outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-brand text-slate-900 font-bold p-3 rounded-lg hover:bg-brand/90 transition-all shadow-lg shadow-brand/20"
                    >
                        Create Account
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-brand-dark font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
