
import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { 
    Search, Settings, Download, 
    Globe, LayoutGrid, TrendingUp, Zap, PieChart as PieChartIcon, 
    List, Rabbit, X, Maximize2, Filter, BarChart2, 
    Activity, ArrowUpRight, ArrowDownRight, Crosshair, 
    Layers, BrainCircuit, Target, Anchor, Newspaper, Wallet, Share2, Gauge, TrendingDown, Clock, BarChart4,
    Coffee, Flame, Droplets, Map as MapIcon, Timer, Flag
} from 'lucide-react';
import { 
    ResponsiveContainer, AreaChart, Area, 
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line, PieChart, Pie
} from 'recharts';

interface Props {
    lang: LanguageCode;
    onAiRequest?: (symbol: string, strategy?: string, timeframe?: string) => void;
}

// --- EXTENDED TYPES FOR PRO TERMINAL ---
interface TimeframeIntel {
    label: string;
    high: number;
    low: number;
    stoch: number; // Stochastic value
    rsi: number;
}

interface MarketAsset {
    symbol: string;
    name: string;
    price: number;
    chg: number;
    pct: number;
    vol: string;
    type: 'Stock' | 'Forex' | 'Crypto' | 'Commodity' | 'Index';
    category?: 'Energy' | 'Metals' | 'Agri' | 'Currencies' | 'Blue Chip' | 'L1';
    spark: {v: number}[];
    intel: {
        "5m": TimeframeIntel;
        "15m": TimeframeIntel;
        "30m": TimeframeIntel;
        "1h": TimeframeIntel;
        "4h": TimeframeIntel;
        "1d": TimeframeIntel;
    };
}

const generateMockIntel = (basePrice: number): MarketAsset['intel'] => {
    const tfs = ["5m", "15m", "30m", "1h", "4h", "1d"];
    const intel: any = {};
    tfs.forEach(tf => {
        intel[tf] = {
            label: tf.toUpperCase(),
            high: basePrice * (1 + Math.random() * 0.01),
            low: basePrice * (1 - Math.random() * 0.01),
            stoch: Math.floor(Math.random() * 100),
            rsi: Math.floor(Math.random() * 100)
        };
    });
    return intel;
};

const ALL_MARKETS: MarketAsset[] = [
    // COMMODITIES
    { symbol: 'XAUUSD', name: 'Gold Spot', price: 2160.50, chg: 15.20, pct: 0.71, vol: '1.2M', type: 'Commodity', category: 'Metals', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(2160.50) },
    { symbol: 'XAGUSD', name: 'Silver Spot', price: 24.85, chg: 0.45, pct: 1.85, vol: '800K', type: 'Commodity', category: 'Metals', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(24.85) },
    { symbol: 'USOIL', name: 'Crude Oil WTI', price: 82.40, chg: -1.20, pct: -1.45, vol: '2.5M', type: 'Commodity', category: 'Energy', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(82.40) },
    { symbol: 'UKOIL', name: 'Brent Oil', price: 86.15, chg: -0.95, pct: -1.10, vol: '2.1M', type: 'Commodity', category: 'Energy', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(86.15) },
    { symbol: 'NATGAS', name: 'Natural Gas', price: 1.75, chg: 0.05, pct: 2.94, vol: '5M', type: 'Commodity', category: 'Energy', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(1.75) },
    { symbol: 'COPPER', name: 'Copper', price: 4.12, chg: 0.08, pct: 1.98, vol: '400K', type: 'Commodity', category: 'Metals', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(4.12) },
    
    // FOREX
    { symbol: 'EURUSD', name: 'Euro / USD', price: 1.0850, chg: -0.0020, pct: -0.18, vol: '12B', type: 'Forex', category: 'Currencies', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(1.0850) },
    { symbol: 'GBPUSD', name: 'British Pound', price: 1.2740, chg: 0.0015, pct: 0.12, vol: '8B', type: 'Forex', category: 'Currencies', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(1.2740) },
    { symbol: 'USDJPY', name: 'Dollar / Yen', price: 149.20, chg: 0.45, pct: 0.30, vol: '15B', type: 'Forex', category: 'Currencies', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(149.20) },

    // CRYPTO
    { symbol: 'BTCUSD', name: 'Bitcoin', price: 68450.00, chg: 1200.00, pct: 1.78, vol: '42B', type: 'Crypto', category: 'L1', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(68450) },
    { symbol: 'ETHUSD', name: 'Ethereum', price: 3840.50, chg: 85.00, pct: 2.26, vol: '18B', type: 'Crypto', category: 'L1', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(3840) },
    
    // STOCKS
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 890.45, chg: 25.10, pct: 2.90, vol: '45M', type: 'Stock', category: 'Blue Chip', spark: Array.from({length: 15}, () => ({v: 50+Math.random()*20})), intel: generateMockIntel(890.45) },
];

const TVAdvancedChart: React.FC<{ symbol: string }> = ({ symbol }) => {
    const containerId = useRef(`tv_adv_${Math.random().toString(36).substring(7)}`);
    useEffect(() => {
        const init = () => {
            if (window.TradingView && document.getElementById(containerId.current)) {
                new window.TradingView.widget({
                    "autosize": true,
                    "symbol": symbol.includes('BTC') ? `BINANCE:${symbol.replace('-','')}` : symbol.includes('XAU') || symbol.includes('XAG') || symbol.includes('OIL') ? `OANDA:${symbol}` : `FOREXCOM:${symbol}`,
                    "interval": "60",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "container_id": containerId.current,
                    "studies": ["STD;Stochastic", "STD;Fib_Retracement", "STD;RSI", "STD;Supertrend"]
                });
            }
        };
        if (window.TradingView) init();
        else {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = init;
            document.head.appendChild(script);
        }
    }, [symbol]);
    return <div id={containerId.current} className="w-full h-full" />;
};

// --- WORLD MARKET SESSIONS COMPONENT ---
const MarketSessions: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const sessions = [
        { name: 'London', open: 8, close: 16, color: 'bg-blue-500' },
        { name: 'New York', open: 13, close: 21, color: 'bg-green-500' },
        { name: 'Tokyo', open: 0, close: 8, color: 'bg-red-500' },
        { name: 'Sydney', open: 22, close: 6, color: 'bg-yellow-500' },
    ];

    const isSessionOpen = (open: number, close: number) => {
        const hour = currentTime.getUTCHours();
        if (open < close) return hour >= open && hour < close;
        return hour >= open || hour < close; // Crosses midnight
    };

    return (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-black text-white uppercase flex items-center gap-2">
                <Timer size={14} className="text-terminal-accent" /> Global Trading Sessions
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {sessions.map(s => {
                    const isOpen = isSessionOpen(s.open, s.close);
                    return (
                        <div key={s.name} className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${isOpen ? 'bg-[#1e293b] border-terminal-accent shadow-[0_0_10px_rgba(14,165,233,0.1)]' : 'bg-[#0a0a0a] border-gray-800 opacity-60'}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white">{s.name}</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            </div>
                            <span className={`text-[9px] font-bold ${isOpen ? 'text-terminal-accent' : 'text-gray-500'}`}>
                                {isOpen ? 'SESSION LIVE' : 'CLOSED'}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="text-[9px] text-gray-500 text-center font-mono">Current UTC: {currentTime.getUTCHours()}:00</div>
        </div>
    );
};

export const MarketCenter: React.FC<Props> = ({ lang, onAiRequest }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(ALL_MARKETS[0]);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [tabView, setTabView] = useState<'chart' | 'intelligence' | 'distribution'>('intelligence');
    const [selectedStrategy, setSelectedStrategy] = useState('SMC');
    const [selectedTimeframe, setSelectedTimeframe] = useState('1H');

    const filteredAssets = ALL_MARKETS.filter(asset => {
        const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeTypeFilter === 'All' || asset.type === activeTypeFilter;
        return matchesSearch && matchesType;
    });

    // Mock Data for Pie Chart
    const typeDistribution = [
        { name: 'Commodity', value: 40, color: '#f59e0b' },
        { name: 'Forex', value: 25, color: '#3b82f6' },
        { name: 'Crypto', value: 20, color: '#10b981' },
        { name: 'Stock', value: 15, color: '#ef4444' },
    ];

    return (
        <div className="flex h-full bg-[#020617] text-white font-sans overflow-hidden">
            {/* Left Rail */}
            <div className="w-14 bg-[#0f172a] border-r border-[#1e293b] flex flex-col items-center py-4 gap-6 shrink-0 z-20">
                <button className="p-2 rounded transition-all text-terminal-accent bg-terminal-accent/10"><Globe size={20} /></button>
                <button className="p-2 rounded transition-all text-gray-500 hover:text-white"><List size={20} /></button>
                <button className="p-2 rounded transition-all text-gray-500 hover:text-white"><Activity size={20} /></button>
                <button className="p-2 rounded transition-all text-gray-500 hover:text-white"><Newspaper size={20} /></button>
                <div className="mt-auto">
                    <button className="p-2 rounded transition-all text-gray-500 hover:text-white"><Settings size={20} /></button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* 1. TOP TOOLBAR & FILTERS */}
                <div className="h-16 border-b border-[#1e293b] bg-[#0f172a] flex items-center px-6 gap-6 shrink-0">
                    <div className="relative group w-64">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-terminal-accent transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search Market..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#050508] border border-[#1e293b] rounded-lg py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-terminal-accent w-full transition-all" 
                        />
                    </div>

                    <div className="flex gap-2">
                        {['All', 'Commodity', 'Forex', 'Crypto', 'Stock'].map(type => (
                            <button 
                                key={type}
                                onClick={() => setActiveTypeFilter(type)}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all border ${activeTypeFilter === type ? 'bg-terminal-accent text-black border-terminal-accent shadow-lg shadow-terminal-accent/20' : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-500'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1"></div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                        <span className="flex items-center gap-1"><Flag size={12} /> US Core PCE in 2h 45m</span>
                        <div className="h-4 w-px bg-gray-800"></div>
                        <span className="flex items-center gap-1 text-green-500"><Zap size={12} /> Institutional Feed Active</span>
                    </div>
                </div>

                {/* 2. ASSET GRID / LIST */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050508]">
                    <table className="min-w-full divide-y divide-[#1e293b]">
                        <thead className="bg-[#0f172a] text-[10px] font-black text-gray-500 uppercase tracking-wider sticky top-0 z-10 shadow-md">
                            <tr>
                                <th className="px-6 py-4 text-left">Instrument</th>
                                <th className="px-6 py-4 text-right">Price</th>
                                <th className="px-6 py-4 text-right">24h Chg%</th>
                                <th className="px-6 py-4 text-center">Stochastic (1H)</th>
                                <th className="px-6 py-4 text-center">RSI (1H)</th>
                                <th className="px-6 py-4 text-center">Trigger</th>
                                <th className="px-6 py-4 text-right">Volume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e293b]">
                            {filteredAssets.map(asset => {
                                const stoch = asset.intel['1h'].stoch;
                                const rsi = asset.intel['1h'].rsi;
                                const isSell = stoch > 90 && rsi > 90;
                                const isBuy = stoch < 10 && rsi < 10;

                                return (
                                    <tr 
                                        key={asset.symbol} 
                                        onClick={() => {setSelectedAsset(asset); setIsPanelOpen(true);}} 
                                        className={`hover:bg-[#1a1e2e] cursor-pointer transition-colors group ${selectedAsset.symbol === asset.symbol ? 'bg-[#1a1e2e] border-l-4 border-terminal-accent' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border group-hover:scale-110 transition-transform ${asset.type === 'Commodity' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : asset.type === 'Forex' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' : 'bg-terminal-accent/10 border-terminal-accent/30 text-terminal-accent'}`}>
                                                    {asset.symbol.substring(0,3)}
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-sm tracking-tight">{asset.symbol}</div>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase">{asset.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-white text-sm font-black">{asset.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${asset.pct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            <div className="flex items-center justify-end gap-1">
                                                {asset.pct > 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                                {Math.abs(asset.pct)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-24 h-1 bg-[#1e293b] rounded-full overflow-hidden relative">
                                                    <div className={`h-full absolute left-0 transition-all duration-700 ${stoch > 90 ? 'bg-red-500 shadow-[0_0_10px_red]' : stoch < 10 ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-blue-500'}`} style={{width: `${stoch}%`}}></div>
                                                </div>
                                                <span className={`text-[9px] font-black ${stoch > 90 ? 'text-red-500' : stoch < 10 ? 'text-green-500' : 'text-gray-500'}`}>{stoch}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                             <span className={`text-[10px] font-mono font-black ${rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-green-400' : 'text-white'}`}>{rsi}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {isSell ? <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded animate-pulse shadow-lg shadow-red-900/40">SELL NOW</span> : 
                                             isBuy ? <span className="bg-green-600 text-white text-[8px] font-black px-2 py-1 rounded animate-pulse shadow-lg shadow-green-900/40">BUY NOW</span> :
                                             <span className="text-gray-700 text-[9px] font-bold">NEUTRAL</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400 font-mono font-bold text-xs">{asset.vol}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 3. BOTTOM ANALYTICS STRIP */}
                <div className="h-40 bg-[#0f172a] border-t border-[#1e293b] p-4 flex gap-4 overflow-hidden shrink-0">
                    <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3 flex flex-col justify-center">
                        <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Market Breath</div>
                        <div className="flex items-end gap-2 h-16">
                            {Array.from({length: 20}).map((_, i) => (
                                <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm" style={{height: `${Math.random()*100}%`}}></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-black/30 border border-white/5 rounded-xl p-3">
                         <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Active Flows</div>
                         <div className="space-y-1.5 overflow-y-auto h-24 no-scrollbar">
                             {[{s: 'Gold', f: '+2.4M'}, {s: 'Oil', f: '-1.8M'}, {s: 'USD', f: '+12M'}, {s: 'BTC', f: '+450K'}].map(f => (
                                 <div key={f.s} className="flex justify-between text-[10px]">
                                     <span className="text-gray-400">{f.s}</span>
                                     <span className={f.f.includes('+') ? 'text-green-500' : 'text-red-500'}>{f.f}</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            {/* RIGHT DETAIL PANEL - PRO INTELLIGENCE MATRIX */}
            {isPanelOpen && (
                <div className="w-[550px] bg-[#0f172a] border-l border-[#1e293b] flex flex-col shrink-0 animate-in slide-in-from-right shadow-2xl z-30">
                    <div className="h-16 border-b border-[#1e293b] flex items-center justify-between px-6 bg-[#1a1e2e]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-terminal-accent border border-terminal-accent/30 shadow-lg shadow-terminal-accent/10">
                                <BrainCircuit size={28} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white leading-none mb-1">{selectedAsset.symbol}</h2>
                                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Routiex Terminal Pro Intelligence</p>
                            </div>
                        </div>
                        <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-black/20 rounded-full text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
                    </div>

                    {/* SUB-TABS */}
                    <div className="flex border-b border-[#1e293b] bg-[#0f172a]">
                        <button onClick={() => setTabView('intelligence')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${tabView === 'intelligence' ? 'border-terminal-accent text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Professional Intel</button>
                        <button onClick={() => setTabView('chart')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${tabView === 'chart' ? 'border-terminal-accent text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Advanced Chart</button>
                        <button onClick={() => setTabView('distribution')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${tabView === 'distribution' ? 'border-terminal-accent text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Distribution</button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050508]">
                        {tabView === 'intelligence' && (
                            <div className="p-6 space-y-6">
                                
                                {/* 1. PRICE INTELLIGENCE MATRIX (THE USER'S REQUEST) */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-black text-terminal-accent flex items-center gap-2 uppercase tracking-tighter">
                                            <Activity size={14} /> Multi-Timeframe Matrix
                                        </h3>
                                        <span className="text-[9px] font-bold text-gray-500">REAL-TIME SYNC</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(selectedAsset.intel).map(([tf, data]: [string, any]) => {
                                            const sellSignal = data.stoch > 90 && data.rsi > 90;
                                            const buySignal = data.stoch < 10 && data.rsi < 10;

                                            return (
                                                <div key={tf} className={`bg-[#0f172a] border rounded-2xl p-4 flex flex-col transition-all group hover:-translate-y-1 ${sellSignal ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : buySignal ? 'border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-[#1e293b]'}`}>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-[10px] font-black text-white group-hover:text-terminal-accent">{data.label} Frame</span>
                                                        {sellSignal && <span className="text-[8px] bg-red-600 text-white px-2 py-0.5 rounded font-black animate-pulse">SELL ALARM</span>}
                                                        {buySignal && <span className="text-[8px] bg-green-600 text-white px-2 py-0.5 rounded font-black animate-pulse">BUY ALARM</span>}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4 text-[10px] mb-4">
                                                        <div className="bg-black/20 p-2 rounded-lg">
                                                            <div className="text-gray-500 font-bold uppercase mb-0.5">High</div>
                                                            <div className="text-white font-mono font-black">{data.high.toFixed(2)}</div>
                                                        </div>
                                                        <div className="bg-black/20 p-2 rounded-lg">
                                                            <div className="text-gray-500 font-bold uppercase mb-0.5">Low</div>
                                                            <div className="text-white font-mono font-black">{data.low.toFixed(2)}</div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="flex justify-between text-[9px] mb-1">
                                                                <span className="text-gray-400 font-bold">Stochastic (14,4,4)</span>
                                                                <span className={`font-black ${data.stoch > 90 ? 'text-red-500' : data.stoch < 10 ? 'text-green-500' : 'text-terminal-accent'}`}>{data.stoch}</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                                                <div className={`h-full transition-all duration-1000 ${data.stoch > 90 ? 'bg-red-500' : data.stoch < 10 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${data.stoch}%`}}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between text-[9px] mb-1">
                                                                <span className="text-gray-400 font-bold">RSI (14)</span>
                                                                <span className={`font-black ${data.rsi > 70 ? 'text-red-400' : data.rsi < 30 ? 'text-green-400' : 'text-white'}`}>{data.rsi}</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden">
                                                                <div className={`h-full bg-white transition-all duration-1000`} style={{width: `${data.rsi}%`, opacity: 0.6}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* 2. MARKET SESSIONS & WORLD MAP (THE USER'S REQUEST) */}
                                <MarketSessions />

                                {/* 3. AI COMPUTE TRIGGER */}
                                <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden group">
                                    <div className="absolute -right-6 -bottom-6 text-blue-500/5 rotate-12 group-hover:scale-110 transition-transform"><BrainCircuit size={160} /></div>
                                    <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2 uppercase tracking-widest"><Rabbit size={18} className="text-terminal-accent" /> Compute AI Signal</h3>
                                    
                                    <div className="space-y-4 relative z-10">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Strategy</label>
                                                <select value={selectedStrategy} onChange={e => setSelectedStrategy(e.target.value)} className="w-full bg-black/60 border border-[#2a2f45] rounded-xl p-3 text-xs font-bold text-white focus:border-terminal-accent outline-none">
                                                    <option value="SMC">Smart Money (SMC)</option>
                                                    <option value="Scalp">Fib Scalper 30m</option>
                                                    <option value="Trend">Multi-TF Trend</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-gray-500 uppercase block mb-1">Anchor Frame</label>
                                                <select value={selectedTimeframe} onChange={e => setSelectedTimeframe(e.target.value)} className="w-full bg-black/60 border border-[#2a2f45] rounded-xl p-3 text-xs font-bold text-white focus:border-terminal-accent outline-none">
                                                    <option value="5m">5 Minutes</option>
                                                    <option value="15m">15 Minutes</option>
                                                    <option value="1H">1 Hour</option>
                                                    <option value="4H">4 Hours</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => onAiRequest && onAiRequest(selectedAsset.symbol, selectedStrategy, selectedTimeframe)}
                                            className="w-full bg-terminal-accent text-black font-black text-sm py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_4px_20px_rgba(14,165,233,0.3)] uppercase tracking-wider"
                                        >
                                            <BrainCircuit size={20} /> Generate Institutional Intel
                                        </button>
                                        <p className="text-[9px] text-gray-500 text-center italic font-bold">Includes Fibonacci (1D/4H/1H) + SMC Block Detection</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabView === 'chart' && (
                            <div className="h-full relative bg-black">
                                <TVAdvancedChart symbol={selectedAsset.symbol} />
                                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Fibonacci & Stochastic Overlay Active</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tabView === 'distribution' && (
                            <div className="p-8 space-y-8 flex flex-col items-center">
                                <h3 className="text-xs font-black text-white uppercase self-start flex items-center gap-2">
                                    <PieChartIcon size={14} className="text-red-500" /> Sector Volume Distribution
                                </h3>
                                
                                <div className="w-full h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={typeDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {typeDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px'}}
                                                itemStyle={{color: '#fff', fontWeight: 'bold'}}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {typeDistribution.map(item => (
                                        <div key={item.name} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                                <span className="text-[10px] font-black text-gray-300">{item.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black text-white">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#1e293b]/50 border border-terminal-accent/20 rounded-2xl p-4 w-full text-center">
                                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed italic">
                                        "Distribution analysis suggests institutional capital is currently rotating heavily into Metals (Gold/Silver) ahead of US Session open."
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* FOOTER STRIP */}
                    <div className="p-4 bg-[#1a1e2e] border-t border-[#1e293b] flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-terminal-accent"><Zap size={12} fill="currentColor" /> Quant Engine 4.5 Stable</span>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1"><MapIcon size={12} /> Global</span>
                            <span className="flex items-center gap-1"><Flag size={12} /> Live</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
