import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                setError(err.response.data.message || 'Invalid credentials');
            } else if (err.request) {
                setError('Server not reachable. Please check your connection.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="flex flex-col items-center mb-8">
                    <img src="/logo.png" alt="ServiceTagger" className="w-16 h-16 object-contain mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 text-sm">Sign in to your dashboard</p>
                </div>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 mb-4">
                    <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Admin</p>
                    <button
                        type="button"
                        onClick={() => {
                            const code = prompt("Enter Access Code:");
                            if (code) {
                                api.post('/auth/quick-access', { code })
                                    .then(({ data }) => {
                                        login(data.token, data.user);
                                        navigate('/dashboard');
                                        toast.success("Welcome back, Admin!");
                                    })
                                    .catch((err) => {
                                        toast.error(err.response?.data?.message || "Invalid Code");
                                    });
                            }
                        }}
                        className="w-full bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                    >
                        Admin Access
                    </button>
                </div>



                <p className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account? <Link to="/register" className="text-brand-dark font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </div >
    );
};

export default LoginPage;
