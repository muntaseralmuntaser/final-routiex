import React from 'react';
import { Logo } from './Logo';
import { 
    ArrowRight, PlayCircle, TrendingUp, Shield, Users, Globe, ChevronRight, 
    Zap, BrainCircuit, Activity, BarChart2, ShieldCheck, Laptop, Smartphone,
    PieChart, Layers, Database, Cpu, Lock, MousePointer2, Target, Gauge, ArrowUpRight
} from 'lucide-react';
import { TopAnalysts3D } from './TopAnalysts3D';

interface Props {
    onLogin: () => void;
    onRegister: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLogin, onRegister }) => {
    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-terminal-accent selection:text-black overflow-x-hidden">
            
            {/* --- IMMERSIVE ANIMATED BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* 1. Moving Grid */}
                <div className="absolute inset-0 landing-grid opacity-30 animate-grid-move"></div>
                
                {/* 2. Scanning Line */}
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-terminal-accent to-transparent opacity-20 animate-scan-line"></div>
                
                {/* 3. Deep Blur Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-terminal-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                {/* 4. Subtle Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <div className="flex items-center gap-3">
                    <Logo size="md" />
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter">ROUTIEX</span>
                        <span className="text-[8px] text-terminal-muted uppercase tracking-widest font-black">by Bayanat Consultant Tech</span>
                    </div>
                </div>
                
                <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-gray-500">
                    <a href="#company" className="hover:text-terminal-accent transition-colors">Company</a>
                    <a href="#terminal" className="hover:text-terminal-accent transition-colors">Terminal Preview</a>
                    <a href="#intelligence" className="hover:text-terminal-accent transition-colors">AI Intelligence</a>
                    <a href="#services" className="hover:text-terminal-accent transition-colors">Solutions</a>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={onLogin} className="hidden sm:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                        Terminal Access
                    </button>
                    <button onClick={onRegister} className="bg-terminal-accent text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                        Launch System
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center z-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-terminal-accent/30 bg-terminal-accent/5 text-terminal-accent text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in slide-in-from-bottom-4 duration-700">
                    <Zap size={14} fill="currentColor" className="animate-pulse" />
                    Institutional Deep Intelligence Platform
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 max-w-5xl leading-[0.9] animate-in slide-in-from-bottom-8 duration-1000">
                    The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-accent via-cyan-400 to-blue-500">Capital Intelligence</span>
                </h1>
                
                <p className="text-xl text-gray-400 max-w-2xl mb-12 font-medium animate-in fade-in duration-1000 delay-300">
                    Bayanat Tech introduces Routiex: A 4th-generation institutional terminal powered by Deep Learning AI, providing high-conviction market matrix and global liquidity analysis.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-in zoom-in-95 duration-700 delay-500 mb-20">
                    <button onClick={onRegister} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-terminal-accent transition-all flex items-center gap-3 shadow-2xl">
                        Open Pro Account <ArrowRight size={20} />
                    </button>
                    <button onClick={onLogin} className="px-10 py-5 bg-[#0a0f1e] border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-xl">
                        <PlayCircle size={20} className="text-terminal-accent" /> Watch Intro
                    </button>
                </div>

                {/* --- 3D PERSPECTIVE DASHBOARD PREVIEW --- */}
                <div id="terminal" className="w-full max-w-7xl mx-auto mt-10 perspective-2000 animate-in fade-in duration-1000 delay-700">
                    <div className="relative transform rotate-x-12 rotate-y-[-10deg] rotate-z-[-2deg] transition-transform hover:rotate-x-6 hover:rotate-y-[-5deg] duration-1000 group">
                        
                        {/* Shadow Glow */}
                        <div className="absolute inset-0 bg-terminal-accent/10 blur-[100px] -z-10 group-hover:bg-terminal-accent/20 transition-all duration-1000"></div>

                        {/* Main Mockup Body */}
                        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col ring-1 ring-white/10">
                            
                            {/* Fake Toolbar */}
                            <div className="h-10 bg-[#020617] border-b border-white/5 flex items-center px-4 gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                                </div>
                                <div className="flex-1 bg-white/5 h-5 rounded mx-10"></div>
                                <div className="flex gap-3">
                                    <div className="w-4 h-4 bg-white/10 rounded"></div>
                                    <div className="w-4 h-4 bg-white/10 rounded"></div>
                                </div>
                            </div>

                            <div className="flex h-[500px] relative">
                                {/* Side Menu Preview */}
                                <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-[#0a0a0f]">
                                    <div className="w-8 h-8 bg-terminal-accent/20 rounded-lg flex items-center justify-center text-terminal-accent"><Activity size={16} /></div>
                                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-600"><Layers size={16} /></div>
                                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-600"><Target size={16} /></div>
                                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-600"><Globe size={16} /></div>
                                </div>

                                {/* Dashboard Content Mock */}
                                <div className="flex-1 p-6 grid grid-cols-12 gap-4 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                                    
                                    {/* Chart Area */}
                                    <div className="col-span-8 bg-[#020617]/50 border border-white/5 rounded-xl p-4 flex flex-col">
                                        <div className="flex justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-xs font-black">XAUUSD Live Feed</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="w-6 h-4 bg-white/5 rounded text-[8px] flex items-center justify-center">1H</div>
                                                <div className="w-6 h-4 bg-terminal-accent/20 rounded text-[8px] flex items-center justify-center text-terminal-accent">4H</div>
                                            </div>
                                        </div>
                                        {/* Chart Visuals */}
                                        <div className="flex-1 flex items-end gap-1 px-4">
                                            {Array.from({length: 40}).map((_, i) => (
                                                <div key={i} className={`flex-1 rounded-t-sm ${i % 3 === 0 ? 'bg-red-500/20' : 'bg-green-500/20'}`} style={{ height: `${Math.random()*80 + 10}%` }}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Intelligence Panel */}
                                    <div className="col-span-4 space-y-4">
                                        <div className="bg-[#0a0a0f] border border-white/5 rounded-xl p-4 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BrainCircuit size={16} className="text-terminal-accent" />
                                                <span className="text-[10px] font-black uppercase text-terminal-accent">AI Signal Engine</span>
                                            </div>
                                            <div className="p-2 bg-terminal-accent/5 rounded border border-terminal-accent/10">
                                                <div className="flex justify-between text-[9px] mb-1"><span className="text-gray-400">Bias</span><span className="text-green-500 font-bold">STRONG BUY</span></div>
                                                <div className="flex justify-between text-[9px] mb-1"><span className="text-gray-400">Target</span><span className="text-white font-mono">$2,245.00</span></div>
                                                <div className="flex justify-between text-[9px]"><span className="text-gray-400">Conf.</span><span className="text-terminal-accent font-bold">92%</span></div>
                                            </div>
                                        </div>
                                        <div className="bg-[#0a0a0f] border border-white/5 rounded-xl p-4 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Gauge size={16} className="text-purple-500" />
                                                <span className="text-[10px] font-black uppercase text-white/50">Market Velocity</span>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center">
                                                 <div className="w-20 h-10 border-t-2 border-r-2 border-l-2 border-terminal-accent/30 rounded-t-full relative">
                                                     <div className="absolute bottom-0 left-1/2 w-8 h-1 bg-terminal-accent -translate-x-1/2 rotate-[-45deg] origin-left"></div>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Activity Bar */}
                                    <div className="col-span-12 h-16 bg-[#020617] border border-white/5 rounded-xl p-3 flex items-center justify-between">
                                        <div className="flex gap-4 items-center">
                                            <div className="text-[9px]"><div className="text-gray-500 uppercase font-bold">DXY Impact</div><div className="text-red-500 font-bold">BEARISH</div></div>
                                            <div className="text-[9px] border-l border-white/10 pl-4"><div className="text-gray-500 uppercase font-bold">Volatility</div><div className="text-yellow-500 font-bold">HIGH</div></div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                                            <span className="text-[10px] font-mono text-gray-500 tracking-widest">BRIDGE_STATUS_OK_2ms</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Labels around the preview */}
                        <div className="absolute -top-10 -left-10 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-xl flex items-center gap-3 animate-bounce-slow">
                            <Activity size={14} className="text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Real-time Data Grid</span>
                        </div>
                        <div className="absolute top-1/2 -right-12 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-xl flex items-center gap-3 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Secure MT5 Bridge</span>
                        </div>
                    </div>
                </div>

                {/* Top Analysts Scroller Section */}
                <div className="w-full mt-40 max-w-7xl mx-auto">
                    <div className="mb-10 text-left px-4">
                        <h2 className="text-xs font-black text-terminal-accent uppercase tracking-[0.4em] mb-2">Live Ecosystem</h2>
                        <h3 className="text-3xl font-black text-white tracking-tight">Institutional Analysts Online</h3>
                    </div>
                    <TopAnalysts3D />
                </div>
            </header>

            {/* Definition Section: COMPANY & SERVICES */}
            <section id="company" className="py-32 px-6 relative z-10 border-t border-white/5 bg-[#01030d]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="w-16 h-1 w-terminal-accent bg-terminal-accent mb-8"></div>
                        <h2 className="text-xs font-black text-terminal-accent uppercase tracking-[0.5em] mb-4">Who we are</h2>
                        <h3 className="text-5xl font-black text-white tracking-tighter mb-8 leading-none">Bayanat Consultant Tech Group</h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Founded in Riyadh with a global mission, Bayanat Tech is a leading quantitative research and software firm specializing in institutional capital markets. We build the infrastructure that powers the world's most successful traders.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="border-l-2 border-red-600 pl-6">
                                <div className="text-3xl font-black text-white">$4.2B</div>
                                <div className="text-xs text-gray-500 uppercase font-black tracking-widest">Daily Volume</div>
                            </div>
                            <div className="border-l-2 border-terminal-accent pl-6">
                                <div className="text-3xl font-black text-white">150k+</div>
                                <div className="text-xs text-gray-500 uppercase font-black tracking-widest">Active Nodes</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <ServiceCard icon={Globe} title="Global Markets" desc="Connect to 40+ global exchanges including NYSE, NASDAQ, and LSE." color="text-blue-500" />
                        <ServiceCard icon={Database} title="Big Data" desc="Analyze millions of data points per second with our low-latency grid." color="text-purple-500" />
                        <ServiceCard icon={ShieldCheck} title="Bank Grade" desc="Military-grade AES-256 encryption protects your assets and data." color="text-green-500" />
                        <ServiceCard icon={Zap} title="Sub-ms Speed" desc="Proprietary bridge technology executes orders in under 1ms." color="text-yellow-500" />
                    </div>
                </div>
            </section>

            {/* AI Intelligence Section */}
            <section id="intelligence" className="py-32 px-6 bg-[#020617] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <h2 className="text-xs font-black text-terminal-accent uppercase tracking-[0.5em] mb-4">Core Technology</h2>
                    <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8">Routiex AI <span className="text-gray-700">Gen-2.5</span></h3>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto font-medium">
                        Our proprietary AI engine doesn't just predict price—it maps institutional liquidity, analyzes dark pool imbalances, and identifies market manipulation in real-time.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                    <AiFeature icon={BrainCircuit} title="Neural Patterns" label="Complex Logic" />
                    <AiFeature icon={Layers} title="Multi-TF Matrix" label="Confluence" />
                    <AiFeature icon={Cpu} title="Quantum Compute" label="Fast Inference" />
                    <AiFeature icon={Activity} title="Sentiment Bias" label="Psychology" />
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-terminal-accent/20 to-blue-900/10 border border-terminal-accent/30 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Zap size={200} /></div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">Ready to upgrade your trading DNA?</h2>
                    <button onClick={onRegister} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-terminal-accent transition-all shadow-2xl">
                        Access Terminal Now
                    </button>
                    <p className="mt-8 text-xs text-gray-500 font-bold uppercase tracking-widest opacity-60">Join the Institutional Elite Group Today</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#010208] border-t border-white/5 py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-xs">
                        <div className="flex items-center gap-3 mb-6">
                            <Logo size="md" />
                            <span className="text-2xl font-black tracking-tighter">ROUTIEX</span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-bold">
                            Official Institutional Trading Terminal by Bayanat Consultant Tech Group. Innovation in every node.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Terminal</h4>
                            <div className="flex flex-col gap-4 text-sm text-gray-500 font-bold">
                                <a href="#" className="hover:text-terminal-accent">Market Matrix</a>
                                <a href="#" className="hover:text-terminal-accent">Signal Hub</a>
                                <a href="#" className="hover:text-terminal-accent">Liquidity Map</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Legal</h4>
                            <div className="flex flex-col gap-4 text-sm text-gray-500 font-bold">
                                <a href="#" className="hover:text-terminal-accent">Privacy Policy</a>
                                <a href="#" className="hover:text-terminal-accent">Terms of Access</a>
                                <a href="#" className="hover:text-terminal-accent">Risk Disclosure</a>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                             <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6">Office</h4>
                             <p className="text-sm text-gray-500 font-bold">King Abdullah Financial District,<br/>Riyadh, Saudi Arabia</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-gray-700 uppercase tracking-widest">
                    <span>&copy; 2024 Bayanat Tech Group</span>
                    <div className="flex gap-6">
                        <Globe size={14} />
                        <ShieldCheck size={14} />
                        <Lock size={14} />
                    </div>
                </div>
            </footer>
        </div>
    );
};

const ServiceCard = ({ icon: Icon, title, desc, color }: any) => (
    <div className="bg-[#0a0f1e] border border-white/5 p-8 rounded-3xl hover:border-terminal-accent transition-all group hover:-translate-y-1">
        <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <h3 className="text-lg font-black mb-2 text-white">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-tight">{desc}</p>
    </div>
);

const AiFeature = ({ icon: Icon, title, label }: any) => (
    <div className="bg-[#0a0f1e]/40 border border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center group hover:bg-terminal-accent/5 transition-all">
        <div className="w-20 h-20 bg-terminal-accent/10 rounded-3xl flex items-center justify-center text-terminal-accent mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <Icon size={40} />
        </div>
        <span className="text-[9px] font-black text-terminal-accent uppercase tracking-[0.3em] mb-2">{label}</span>
        <h4 className="text-lg font-black text-white">{title}</h4>
    </div>
);