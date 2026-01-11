
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { 
    Search, Filter, Activity, Zap, BrainCircuit, Globe, 
    TrendingUp, TrendingDown, Layout, Info, ChevronRight, 
    X, MoreHorizontal, BarChart3, LineChart, PieChart,
    Timer, RefreshCw, Cpu, Database, 
    Layers
} from 'lucide-react';

interface Props {
    lang: LanguageCode;
    onAiRequest?: (symbol: string, strategy?: string, timeframe?: string) => void;
}

const INITIAL_INSTRUMENTS = [
    { id: 'XAUUSD', symbol: 'XAU', name: 'GOLD SPOT', price: 2160.50, change: 0.71, stoch: 90, rsi: 71, proName: 'OANDA:XAUUSD' },
    { id: 'XAGUSD', symbol: 'XAG', name: 'SILVER SPOT', price: 24.85, change: 1.85, stoch: 1, rsi: 23, proName: 'OANDA:XAGUSD' },
    { id: 'USOIL', symbol: 'USO', name: 'CRUDE OIL WTI', price: 82.40, change: 1.45, stoch: 11, rsi: 35, proName: 'TVC:USOIL' },
    { id: 'UKOIL', symbol: 'UKO', name: 'BRENT OIL', price: 86.15, change: -1.1, stoch: 42, rsi: 46, proName: 'TVC:UKOIL' },
    { id: 'NATGAS', symbol: 'NAT', name: 'NATURAL GAS', price: 1.75, change: 2.94, stoch: 6, rsi: 26, proName: 'TVC:NATGAS' },
    { id: 'EURUSD', symbol: 'EUR', name: 'EURO / USD', price: 1.085, change: -0.18, stoch: 79, rsi: 89, proName: 'FX:EURUSD' },
    { id: 'GBPUSD', symbol: 'GBP', name: 'BRITISH POUND', price: 1.274, change: 0.12, stoch: 62, rsi: 24, proName: 'FX:GBPUSD' },
];

const TIMEFRAME_DATA = [
    { frame: '5M Frame', high: 2163.01, low: 2152.69, stoch: 8, rsi: 36 },
    { frame: '15M Frame', high: 2161.28, low: 2141.06, stoch: 16, rsi: 37 },
    { frame: '30M Frame', high: 2178.79, low: 2142.91, stoch: 57, rsi: 45 },
    { frame: '1H Frame', high: 2174.89, low: 2143.94, stoch: 90, rsi: 71 },
    { frame: '4H Frame', high: 2172.93, low: 2144.50, stoch: 44, rsi: 9 },
    { frame: '1D Frame', high: 2174.84, low: 2160.08, stoch: 34, rsi: 17 },
];

const ProgressBar: React.FC<{ value: number; color: string; showLabel?: boolean }> = ({ value, color, showLabel = true }) => (
    <div className="flex items-center gap-2 w-full">
        <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
        </div>
        {showLabel && <span className={`text-[10px] font-bold w-4 text-right ${color.replace('bg-', 'text-')}`}>{value}</span>}
    </div>
);

const TVWidgetWrapper: React.FC<{ src: string, config: any, id?: string, isLibrary?: boolean }> = ({ src, config, id, isLibrary }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mounted = true;
        if (isLibrary && id) {
            const init = () => {
                if (mounted && window.TradingView && document.getElementById(id)) {
                    const el = document.getElementById(id);
                    if (el) el.innerHTML = '';
                    try {
                        new window.TradingView.widget({ ...config, container_id: id });
                    } catch (e) {
                        console.error("TV Widget Init Error:", e);
                    }
                }
            };

            if (window.TradingView) {
                init();
            } else {
                const scriptId = 'tv-script-lib-main';
                let s = document.getElementById(scriptId) as HTMLScriptElement;
                if (!s) {
                    s = document.createElement('script');
                    s.id = scriptId;
                    s.src = src;
                    s.async = true;
                    s.onload = init;
                    document.head.appendChild(s);
                } else {
                    const checkExist = setInterval(() => {
                        if (window.TradingView) {
                            clearInterval(checkExist);
                            init();
                        }
                    }, 100);
                }
            }
        } else if (containerRef.current) {
            containerRef.current.innerHTML = '';
            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.type = 'text/javascript';
            s.innerHTML = JSON.stringify(config);
            containerRef.current.appendChild(s);
        }
        return () => { mounted = false; };
    }, [config, src, id, isLibrary]);

    return isLibrary && id ? (
        <div id={id} className="w-full h-full" />
    ) : (
        <div className="tradingview-widget-container w-full h-full" ref={containerRef}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export const MarketCenter: React.FC<Props> = ({ lang, onAiRequest }) => {
    const [selectedAsset, setSelectedAsset] = useState(INITIAL_INSTRUMENTS[0]);
    const [activeTab, setActiveTab] = useState<'intel' | 'chart' | 'distribution'>('intel');
    const [filterTab, setFilterTab] = useState('All');

    return (
        <div className="flex h-full bg-[#020617] text-white overflow-hidden p-1 gap-1 font-mono">
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                <div className="h-14 bg-[#0f172a] border border-[#1e293b] rounded flex items-center px-4 justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#050508] border border-[#1e293b] rounded flex items-center px-3 py-1.5 gap-2 group focus-within:border-terminal-accent">
                            <Search size={16} className="text-gray-500 group-focus-within:text-terminal-accent" />
                            <input placeholder="SEARCH INSTRUMENT..." className="bg-transparent border-none outline-none text-[10px] font-bold w-40" />
                        </div>
                        <div className="flex bg-[#050508] border border-[#1e293b] rounded p-1 gap-1">
                            {['All', 'Commodity', 'Forex', 'Crypto'].map(tab => (
                                <button key={tab} onClick={() => setFilterTab(tab)} className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${filterTab === tab ? 'bg-terminal-accent text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-500">
                        <span className="flex items-center gap-1 text-green-500"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> FEED: LIVE</span>
                        <span className="flex items-center gap-1"><Database size={12}/> SOURCE: TRADINGVIEW</span>
                    </div>
                </div>

                <div className="flex-1 bg-[#0f172a] border border-[#1e293b] rounded overflow-hidden flex flex-col">
                    <div className="overflow-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#0f172a] z-10">
                                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-[#1e293b]">
                                    <th className="p-4 w-12 text-center"><MoreHorizontal size={14}/></th>
                                    <th className="p-4">Instrument</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-right">24H Chg%</th>
                                    <th className="p-4">Stochastic (1H)</th>
                                    <th className="p-4">RSI (1H)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e293b]/30">
                                {INITIAL_INSTRUMENTS.map((item) => (
                                    <tr 
                                        key={item.id}
                                        onClick={() => setSelectedAsset(item)}
                                        className={`group cursor-pointer transition-colors ${selectedAsset.id === item.id ? 'bg-[#1e2235] border-l-2 border-l-terminal-accent' : 'hover:bg-[#1a1e2e]'}`}
                                    >
                                        <td className="p-4">
                                            <div className="w-10 h-10 bg-terminal-accent/10 text-terminal-accent font-black text-[10px] rounded flex items-center justify-center border border-terminal-accent/20">
                                                {item.symbol}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-black text-sm text-white leading-none">{item.id}</div>
                                            <div className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-widest">{item.name}</div>
                                        </td>
                                        <td className="p-4 text-right font-black text-sm text-white font-mono">
                                            {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className={`p-4 text-right font-black text-sm font-mono ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.change >= 0 ? '↗' : '↘'} {Math.abs(item.change)}%
                                        </td>
                                        <td className="p-4 w-48">
                                            <ProgressBar value={item.stoch} color="bg-blue-500" />
                                        </td>
                                        <td className="p-4 w-48">
                                            <ProgressBar value={item.rsi} color="bg-green-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="h-44 flex gap-1 shrink-0">
                    <div className="w-1/2 bg-[#0f172a] border border-[#1e293b] rounded p-4 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><BarChart3 size={64}/></div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Activity size={12} className="text-terminal-accent" /> Market Breath
                        </h4>
                        <div className="flex-1 flex items-end gap-1 px-2">
                             {[40, 60, 45, 80, 50, 30, 70, 90, 65, 40, 55, 75, 40, 60, 45, 30, 50].map((h, i) => (
                                 <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm group relative" style={{ height: `${h}%` }}>
                                     <div className="absolute inset-0 bg-terminal-accent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm"></div>
                                 </div>
                             ))}
                        </div>
                    </div>
                    <div className="w-1/2 bg-[#0f172a] border border-[#1e293b] rounded p-4 flex flex-col">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Layers size={12} className="text-blue-500"/> Active Flows (Real-time)
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Gold (XAU)', val: '+2.4M', color: 'text-green-500' },
                                { label: 'Crude Oil', val: '-1.8M', color: 'text-red-500' },
                                { label: 'USD Index', val: '+12M', color: 'text-green-500' },
                                { label: 'Bitcoin', val: '+450K', color: 'text-green-500' },
                            ].map((flow, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px] font-bold border-b border-[#1e293b] pb-2">
                                    <span className="text-gray-400">{flow.label}</span>
                                    <span className={flow.color}>{flow.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[440px] bg-[#0f172a] border border-[#1e293b] rounded flex flex-col shrink-0 overflow-hidden relative shadow-2xl">
                <div className="p-6 border-b border-[#1e2235] bg-gradient-to-br from-[#1a1e2e] to-[#0f172a] shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-black border border-terminal-accent/30 rounded-xl flex items-center justify-center text-terminal-accent shadow-[0_0_30px_rgba(14,165,233,0.15)] relative">
                                <BrainCircuit size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">{selectedAsset.id}</h2>
                                <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mt-1">Terminal Intelligence</p>
                            </div>
                        </div>
                        <button className="text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
                    </div>

                    <div className="flex gap-6 border-b border-[#1e293b]">
                        {[
                            { id: 'intel', label: 'Matrix Intel', icon: Info },
                            { id: 'chart', label: 'Advanced Chart', icon: LineChart },
                            { id: 'distribution', label: 'Technical Gauge', icon: BarChart3 }
                        ].map((tab) => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-3 text-[10px] font-black uppercase tracking-widest relative flex items-center gap-2 transition-all ${activeTab === tab.id ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <tab.icon size={12}/> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-[#0b0f1a]/30">
                    {activeTab === 'intel' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[11px] font-black text-terminal-accent uppercase flex items-center gap-2 tracking-widest">
                                    <Activity size={14} /> Multi-Timeframe Matrix
                                </h3>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                    <RefreshCw size={8} className="animate-spin-slow" /> Real-time Sync
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {TIMEFRAME_DATA.map((d, i) => (
                                    <div key={i} className="bg-[#1a1e2e]/40 border border-[#2a2f45] rounded-xl p-4 flex flex-col gap-3 hover:border-terminal-accent/30 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{d.frame}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:animate-ping"></div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="text-[8px] text-gray-500 font-bold uppercase">High</div>
                                                <div className="text-xs font-black text-white font-mono">{d.high.toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[8px] text-gray-500 font-bold uppercase">Low</div>
                                                <div className="text-xs font-black text-white font-mono">{d.low.toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-1 border-t border-white/5">
                                            <div>
                                                <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase mb-1">
                                                    <span>Stochastic</span>
                                                    <span className="text-blue-400">{d.stoch}</span>
                                                </div>
                                                <ProgressBar value={d.stoch} color="bg-blue-500" showLabel={false} />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase mb-1">
                                                    <span>RSI (14)</span>
                                                    <span className="text-green-500">{d.rsi}</span>
                                                </div>
                                                <ProgressBar value={d.rsi} color="bg-green-500" showLabel={false} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'chart' && (
                        <div className="h-full animate-in zoom-in-95 duration-300">
                            <TVWidgetWrapper 
                                id="tv_main_terminal_intel"
                                src="https://s3.tradingview.com/tv.js"
                                isLibrary={true}
                                config={{
                                    "autosize": true,
                                    "symbol": selectedAsset.proName,
                                    "interval": "D",
                                    "theme": "dark",
                                    "style": "1",
                                    "locale": "en",
                                    "hide_side_toolbar": true,
                                    "container_id": "tv_main_terminal_intel",
                                    "studies": ["STD;Supertrend", "STD;RSI"]
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'distribution' && (
                        <div className="h-full animate-in slide-in-from-bottom-4 duration-300">
                            <TVWidgetWrapper 
                                src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
                                config={{
                                    "interval": "1h",
                                    "width": "100%",
                                    "isTransparent": true,
                                    "height": "100%",
                                    "symbol": selectedAsset.proName,
                                    "showIntervalTabs": true,
                                    "displayMode": "single",
                                    "locale": "en",
                                    "colorTheme": "dark"
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[#1a1e2e] border-t border-[#1e293b] flex justify-between items-center text-[10px] font-black uppercase tracking-widest shrink-0">
                    <div className="flex items-center gap-2 text-terminal-accent">
                        <Zap size={12} fill="currentColor" /> Signal Engine v4.5 Active
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1 text-green-500"><Activity size={10} /> CONNECTED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
