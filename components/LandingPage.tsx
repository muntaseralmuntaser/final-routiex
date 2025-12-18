
import React from 'react';
import { Logo } from './Logo';
import { ArrowRight, PlayCircle, TrendingUp, Shield, Users, Globe, ChevronRight } from 'lucide-react';
import { TopAnalysts3D } from './TopAnalysts3D';

interface Props {
    onLogin: () => void;
    onRegister: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLogin, onRegister }) => {
    return (
        <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-terminal-accent selection:text-black overflow-x-hidden">
            
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 bg-[#050508]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Logo size="md" />
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter">ROUTIEX</span>
                        <span className="text-[8px] text-terminal-muted uppercase tracking-widest">by Bayanat Consultant Tech</span>
                    </div>
                </div>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Terminal</a>
                    <a href="#social" className="hover:text-white transition-colors">Social Hub</a>
                    <a href="#live" className="hover:text-white transition-colors">Live Studio</a>
                    <a href="#academy" className="hover:text-white transition-colors">Academy</a>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={onLogin} className="text-sm font-bold text-white hover:text-terminal-accent transition-colors">
                        Login
                    </button>
                    <button onClick={onRegister} className="bg-terminal-accent text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(41,98,255,0.4)]">
                        Start Trading
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
                <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-terminal-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-terminal-accent/30 bg-terminal-accent/5 text-terminal-accent text-xs font-bold mb-6 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-accent"></span>
                    </span>
                    V4.0 LIVE: The World's Largest Investment Platform
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 max-w-4xl leading-[1.1] animate-fade-in-up delay-100">
                    Trade with <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-accent to-cyan-400">Institutional Intelligence</span>
                </h1>
                
                <p className="text-lg text-gray-400 max-w-2xl mb-10 animate-fade-in-up delay-200">
                    Access professional markets, social trading, and AI-powered analytics in one ecosystem. Join 150,000+ traders on Routiex.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
                    <button onClick={onRegister} className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        Open Free Account <ArrowRight size={20} />
                    </button>
                    <button onClick={onLogin} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-2 backdrop-blur-sm">
                        <PlayCircle size={20} /> Watch Demo
                    </button>
                </div>

                {/* 3D Cards Preview */}
                <div className="w-full mt-20 max-w-6xl mx-auto relative z-10">
                    <TopAnalysts3D />
                </div>
            </section>

            {/* Ticker Strip */}
            <div className="bg-white/5 border-y border-white/10 py-3 overflow-hidden">
                <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
                    {['BTC/USD', 'ETH/USD', 'XAU/USD', 'SPX500', 'US30', 'EUR/USD', 'GBP/JPY', 'NVDA', 'TSLA'].map((sym, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm font-mono font-bold text-gray-400">
                            <span>{sym}</span>
                            <span className="text-green-500 flex items-center"><TrendingUp size={12} className="mr-1"/> +{(Math.random() * 2).toFixed(2)}%</span>
                        </div>
                    ))}
                     {['BTC/USD', 'ETH/USD', 'XAU/USD', 'SPX500', 'US30', 'EUR/USD', 'GBP/JPY', 'NVDA', 'TSLA'].map((sym, i) => (
                        <div key={i+'d'} className="flex items-center gap-2 text-sm font-mono font-bold text-gray-400">
                            <span>{sym}</span>
                            <span className="text-green-500 flex items-center"><TrendingUp size={12} className="mr-1"/> +{(Math.random() * 2).toFixed(2)}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Grid */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#0f111a] border border-white/10 p-8 rounded-3xl hover:border-terminal-accent transition-colors group">
                        <div className="w-12 h-12 bg-terminal-accent/10 rounded-2xl flex items-center justify-center text-terminal-accent mb-6 group-hover:scale-110 transition-transform">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Routiex Social</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A fully integrated Telegram-style chat system. Join VIP channels, discuss in public groups, and follow top analysts.
                        </p>
                    </div>
                    <div className="bg-[#0f111a] border border-white/10 p-8 rounded-3xl hover:border-terminal-accent transition-colors group">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Live Studio Pro</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Broadcast like a pro. Interactive streams, gifting, guest requests, and real-time chart sharing.
                        </p>
                    </div>
                    <div className="bg-[#0f111a] border border-white/10 p-8 rounded-3xl hover:border-terminal-accent transition-colors group">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Virtual Trading Room</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Practice in our institutional simulator. Risk-free environment with real-time market data execution.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#020203] pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start">
                        <Logo size="lg" />
                        <span className="mt-4 text-2xl font-black tracking-tighter">ROUTIEX</span>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">by Bayanat Consultant Tech</span>
                    </div>
                    <div className="text-center md:text-right text-sm text-gray-500">
                        <p>&copy; 2024 Bayanat Tech Group. All rights reserved.</p>
                        <div className="flex gap-6 justify-center md:justify-end mt-4">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                            <a href="#" className="hover:text-white">Risk Disclosure</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
