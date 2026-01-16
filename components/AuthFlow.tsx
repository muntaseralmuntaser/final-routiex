import React, { useState } from 'react';
import { Layers, Mail, Lock, ArrowRight, Chrome, User, X, CheckCircle, Loader2, Shield, Globe, Zap } from 'lucide-react';

interface Props {
    onLogin: (isAdmin: boolean, userDetails: any) => void;
    onClose?: () => void;
    initialMode?: 'login' | 'register';
}

export const AuthFlow: React.FC<Props> = ({ onLogin, onClose, initialMode = 'login' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Official Admin Credentials Check
        const ADMIN_EMAIL = 'bayanatglobal@gmail.com';
        const ADMIN_PASS = 'Dev@#routiex$448890448890';

        setTimeout(() => {
            setIsLoading(false);
            if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
                onLogin(true, { firstName: 'Official', lastName: 'Admin', email });
            } else if (email.includes('admin') || password === 'admin') {
                // Secondary check for flexibility in dev
                onLogin(true, { firstName: 'System', lastName: 'Admin', email });
            } else {
                if (isLogin && email === 'user@test.com') {
                     onLogin(false, { firstName: 'Test', lastName: 'Trader', email });
                } else if (!isLogin) {
                    onLogin(false, { firstName: firstName || 'Trader', lastName: lastName || 'One', email });
                } else {
                    setError('Invalid credentials for official terminal access.');
                }
            }
        }, 1500);
    };

    const handleSocialLogin = (provider: 'Google' | 'TradingView') => {
        setIsLoading(true);
        // Simulate OAuth Redirect/Response
        setTimeout(() => {
            setIsLoading(false);
            onLogin(false, { 
                firstName: provider, 
                lastName: 'User', 
                email: `${provider.toLowerCase()}@auth.internal` 
            });
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
            <div className="w-full max-w-md z-10 animate-in zoom-in-95 duration-300">
                <div className="bg-[#0f111a] border border-[#1e2235] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-transparent via-terminal-accent to-transparent opacity-50"></div>

                    {onClose && (
                        <button onClick={onClose} className="absolute top-4 right-4 text-terminal-muted hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    )}

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-terminal-accent to-blue-900 rounded-2xl text-white shadow-[0_0_30px_rgba(41,98,255,0.3)] mb-4 ring-1 ring-white/10">
                            <Layers size={28} />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase">Routiex Pro</h1>
                        <p className="text-xs text-terminal-muted font-medium uppercase tracking-widest">Institutional Access Gateway</p>
                    </div>

                    {/* Social Login Section */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        <button 
                            onClick={() => handleSocialLogin('Google')}
                            className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all border border-gray-200"
                        >
                            <Chrome size={18} className="text-blue-500" />
                            {isLogin ? 'Sign in' : 'Sign up'} with Google
                        </button>
                        <button 
                            onClick={() => handleSocialLogin('TradingView')}
                            className="flex items-center justify-center gap-3 w-full bg-[#2962FF] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#1E53E5] transition-all shadow-lg shadow-blue-900/20"
                        >
                            <Globe size={18} fill="currentColor" className="text-white" />
                            {isLogin ? 'Sign in' : 'Sign up'} with TradingView
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center my-6">
                        <div className="flex-grow border-t border-[#1e2235]"></div>
                        <span className="flex-shrink-0 mx-4 text-[10px] text-terminal-muted uppercase font-bold tracking-widest">OR USE TERMINAL ID</span>
                        <div className="flex-grow border-t border-[#1e2235]"></div>
                    </div>

                    <div className="flex justify-center mb-6 border-b border-[#1e2235]">
                        <button 
                            onClick={() => setIsLogin(true)}
                            className={`pb-3 px-8 text-sm font-bold transition-all relative ${isLogin ? 'text-white' : 'text-terminal-muted hover:text-gray-300'}`}
                        >
                            Login
                            {isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-terminal-accent shadow-[0_0_10px_rgba(41,98,255,0.8)]"></div>}
                        </button>
                        <button 
                            onClick={() => setIsLogin(false)}
                            className={`pb-3 px-8 text-sm font-bold transition-all relative ${!isLogin ? 'text-white' : 'text-terminal-muted hover:text-gray-300'}`}
                        >
                            Register
                            {!isLogin && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-terminal-accent shadow-[0_0_10px_rgba(41,98,255,0.8)]"></div>}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-bold flex items-center gap-2 animate-pulse">
                            <Shield size={14} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1 tracking-wider">First Name</label>
                                    <input 
                                        type="text" 
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-2.5 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                        placeholder="John"
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1 tracking-wider">Last Name</label>
                                    <input 
                                        type="text" 
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-2.5 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                        placeholder="Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1 tracking-wider">Terminal Email</label>
                            <div className="relative group">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-terminal-accent transition-colors" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#050508] border border-[#1e2235] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1 tracking-wider">Secure Password</label>
                            <div className="relative group">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-terminal-accent transition-colors" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#050508] border border-[#1e2235] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-terminal-accent text-black font-black text-xs py-4 rounded-lg hover:bg-white transition-all shadow-lg shadow-terminal-accent/20 flex items-center justify-center gap-2 mt-6 hover:scale-[1.02] uppercase tracking-[0.2em]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? 'Access Secure Terminal' : 'Establish Account')}
                            {!isLoading && <ArrowRight size={16} strokeWidth={3} />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                         <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                            Secure Terminal by Bayanat Consultant Tech Group
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};