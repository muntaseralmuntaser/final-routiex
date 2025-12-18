
import React, { useState } from 'react';
import { Layers, Mail, Lock, ArrowRight, Chrome, User, X, CheckCircle, Loader2 } from 'lucide-react';

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
    const [oauthProvider, setOauthProvider] = useState<'google' | 'tradingview' | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API Call
        setTimeout(() => {
            setIsLoading(false);
            if (email.includes('admin')) {
                onLogin(true, { firstName: 'Admin', lastName: 'User', email });
            } else {
                onLogin(false, { firstName: firstName || 'Trader', lastName: lastName || 'One', email });
            }
        }, 1500);
    };

    const handleOAuth = (provider: 'google' | 'tradingview') => {
        setOauthProvider(provider);
        setTimeout(() => {
            // Simulate successful OAuth callback
            onLogin(false, { 
                firstName: provider === 'google' ? 'Google' : 'TV', 
                lastName: 'User', 
                email: `user@${provider}.com` 
            });
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-md z-10 animate-in zoom-in-95 duration-300">
                
                <div className="bg-[#0f111a] border border-[#1e2235] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}
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
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-1">ROUTIEX</h1>
                        <p className="text-xs text-terminal-muted font-medium uppercase tracking-widest">Institutional Access Gateway</p>
                    </div>

                    {oauthProvider ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-terminal-accent/30 border-t-terminal-accent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {oauthProvider === 'google' ? <Chrome size={24} className="text-white" /> : <div className="w-6 h-6 bg-white rounded-full"></div>}
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-white font-bold">Connecting to {oauthProvider === 'google' ? 'Google' : 'TradingView'}...</h3>
                                <p className="text-xs text-gray-500 mt-1">Verifying secure token...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-8 border-b border-[#1e2235]">
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1">First Name</label>
                                            <input 
                                                type="text" 
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-3 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                                placeholder="John"
                                                required={!isLogin}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1">Last Name</label>
                                            <input 
                                                type="text" 
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-3 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                                placeholder="Doe"
                                                required={!isLogin}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-terminal-accent transition-colors" />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#050508] border border-[#1e2235] rounded-lg py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-terminal-muted uppercase ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-terminal-accent transition-colors" />
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-[#050508] border border-[#1e2235] rounded-lg py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-terminal-accent transition-colors"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-terminal-accent text-black font-black text-sm py-4 rounded-lg hover:bg-white transition-all shadow-lg shadow-terminal-accent/20 flex items-center justify-center gap-2 mt-6 hover:scale-[1.02]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'ACCESS TERMINAL' : 'CREATE ACCOUNT')}
                                    {!isLoading && <ArrowRight size={16} strokeWidth={3} />}
                                </button>
                            </form>

                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-[#1e2235]"></div>
                                <span className="flex-shrink-0 mx-4 text-[10px] text-gray-600 uppercase font-bold">Or connect with</span>
                                <div className="flex-grow border-t border-[#1e2235]"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-3 py-3 border border-[#1e2235] bg-[#0a0a0a] rounded-xl hover:bg-[#1e2235] hover:border-white/20 transition-all text-white text-xs font-bold group">
                                    <Chrome size={16} className="text-white group-hover:text-blue-400 transition-colors" /> 
                                    <span>Google</span>
                                </button>
                                <button onClick={() => handleOAuth('tradingview')} className="flex items-center justify-center gap-3 py-3 border border-[#1e2235] bg-[#0a0a0a] rounded-xl hover:bg-[#1e2235] hover:border-white/20 transition-all text-white text-xs font-bold group">
                                    <div className="w-4 h-4 bg-white rounded-full group-hover:scale-110 transition-transform"></div>
                                    <span>TradingView</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
