import React, { useEffect, useRef, useState } from 'react';
import { 
    Play, Tv, Globe, Zap, Radio, Layers, Activity, Search, AlertCircle, 
    Server, Wifi, MessageSquare, ArrowUpRight, ArrowDownRight, BarChart4,
    TrendingUp, TrendingDown, Timer, DollarSign, Clock, Volume2,
    Gauge, ArrowUp, ArrowDown, PauseCircle, PlayCircle, Rabbit, ShieldCheck
} from 'lucide-react';
import { TopAnalysts3D } from './TopAnalysts3D';
import { MarketTimings } from './MarketTimings';
import { AiSignalResponse } from '../types';

declare global {
    interface Window {
        Hls: any;
    }
}

interface Props {
    onShowSignal?: (signal: AiSignalResponse) => void;
}

export interface TVChannel {
    id: string;
    name: string;
    streamUrl: string;
    type: string;
    region: string;
    viewers: string;
    logo: string;
    status: 'LIVE' | 'PAUSED';
}

const CHANNELS: TVChannel[] = [
    { id: 'bloomberg', name: "Bloomberg TV US", streamUrl: "https://tv.garden/us/USmuuhVA4Jtz9O?autoplay=1&mute=1", type: "Finance", region: "USA", viewers: "1.2M", logo: "BBG", status: 'LIVE' },
    { id: 'cnbc', name: "CNBC International", streamUrl: "https://www.youtube.com/embed/V0I5eglJMRI?autoplay=1&mute=1", type: "Finance", region: "USA", viewers: "850k", logo: "CNBC", status: 'LIVE' },
    { id: 'skynews', name: "Sky News", streamUrl: "https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1", type: "News", region: "UK", viewers: "450k", logo: "SKY", status: 'PAUSED' },
    { id: 'aljazeera', name: "Al Jazeera", streamUrl: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8", type: "News", region: "Qatar", viewers: "890k", logo: "AJE", status: 'LIVE' },
];

const TOP_GAINERS = [
    { s: 'NVDA', p: '924.10', c: '+4.52%', v: '45.2M' },
    { s: 'AMD', p: '192.40', c: '+3.18%', v: '22.1M' },
    { s: 'SMCI', p: '1140.2', c: '+8.90%', v: '12.4M' },
    { s: 'BTCUSD', p: '69420.1', c: '+4.20%', v: '88.5B' },
    { s: 'SOLUSD', p: '148.50', c: '+12.4%', v: '4.2B' },
];

const TOP_LOSERS = [
    { s: 'TSLA', p: '162.30', c: '-3.10%', v: '32.1M' },
    { s: 'AAPL', p: '172.45', c: '-1.45%', v: '18.9M' },
    { s: 'PYPL', p: '58.20', c: '-2.80%', v: '8.4M' },
    { s: 'NKE', p: '94.50', c: '-1.20%', v: '5.2M' },
    { s: 'LULU', p: '385.10', c: '-4.15%', v: '2.1M' },
];

const LiveStreamPlayer: React.FC<{ url: string, autoPlay?: boolean }> = ({ url, autoPlay = true }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<any>(null);
    const isEmbed = url.includes('youtube.com') || url.includes('tv.garden');

    useEffect(() => {
        if (isEmbed || !url.includes('.m3u8')) return;
        const video = videoRef.current;
        if (!video) return;

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls();
            hlsRef.current = hls;
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) video.play().catch(() => {});
            });
        }
        return () => { if (hlsRef.current) hlsRef.current.destroy(); };
    }, [url, isEmbed, autoPlay]);

    if (isEmbed) {
        return <iframe src={url} className="w-full h-full border-0 relative z-10" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
    }

    return <video ref={videoRef} controls autoPlay={autoPlay} muted playsInline className="w-full h-full object-cover relative z-10" />;
};

export const HomeDashboard: React.FC<Props> = () => {
    const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
    const [livePrice, setLivePrice] = useState(2184.20);
    const [velocity, setVelocity] = useState(74);

    useEffect(() => {
        const interval = setInterval(() => {
            setLivePrice(p => p + (Math.random() - 0.5) * 0.5);
            setVelocity(v => Math.max(10, Math.min(95, v + (Math.random() - 0.5) * 4)));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full bg-[#020617] overflow-hidden font-sans select-none">
            
            {/* 1. TOP BRIDGE STATUS STRIP */}
            <div className="h-7 bg-[#0f111a] border-b border-[#1e2235] flex items-center px-4 gap-6 shrink-0 text-[9px] font-black uppercase tracking-wider overflow-hidden">
                <div className="flex items-center gap-2 border-r border-[#1e2235] pr-6">
                    <Server size={12} className="text-terminal-accent" /> BRIDGE STATUS
                </div>
                {[
                    { n: 'MT5 CORE', v: '12ms', c: 'text-blue-400' },
                    { n: 'TRADINGVIEW', v: '45ms', c: 'text-green-500' },
                    { n: 'BINANCE API', v: '88ms', c: 'text-yellow-500' },
                    { n: 'FIX PROT', v: '2ms', c: 'text-purple-500' },
                ].map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-gray-400">{b.n}</span>
                        <span className={b.c}>{b.v}</span>
                    </div>
                ))}
                <div className="ml-auto text-gray-500 flex items-center gap-2">
                    <Wifi size={12} className="text-green-500" />
                    SYSTEM TIME: <span className="text-white font-mono">{new Date().toLocaleTimeString('en-US', {hour12: true})}</span>
                </div>
            </div>

            {/* 2. MARQUEE */}
            <div className="h-8 bg-[#0a0a0b] border-b border-[#1e293b] flex items-center overflow-hidden shrink-0">
                <div className="bg-terminal-accent text-black px-4 h-full flex items-center gap-2 font-black text-[10px] italic skew-x-[-12deg] -ml-2 relative z-10 shadow-lg">
                    <Zap size={14} fill="currentColor" /> ROUTIEX LIVE
                </div>
                <div className="flex items-center gap-8 animate-marquee whitespace-nowrap pl-6">
                    {TOP_GAINERS.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                            <span className="text-white font-black tracking-tighter uppercase">{f.s}</span>
                            <span className="text-green-500 font-mono font-black animate-pulse">{f.c}</span>
                        </div>
                    ))}
                    {TOP_LOSERS.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                            <span className="text-white font-black tracking-tighter uppercase">{f.s}</span>
                            <span className="text-red-500 font-mono font-black animate-pulse">{f.c}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MAIN DASHBOARD GRID */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar relative">
                
                {/* GLOBAL BACKGROUND WATERMARK */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden opacity-10">
                    <div className="animate-brand-glow flex flex-col items-center">
                        <Rabbit size={520} strokeWidth={0.2} className="text-terminal-accent" />
                        <div className="text-5xl font-black text-terminal-accent tracking-[0.5em] -mt-16 uppercase font-mono">
                            ROTEX TERMINAL PRO
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-3">
                    {/* ROW 1: TV & SESSIONS */}
                    <div className="grid grid-cols-12 gap-3 h-[480px]">
                        {/* TV PLAYER (Narrowed to 6 cols for better focus) */}
                        <div className="col-span-12 lg:col-span-6 bg-[#0f111a]/80 backdrop-blur-md border border-[#1e2235] rounded-xl overflow-hidden shadow-2xl flex flex-col h-full relative group">
                            
                            <div className="p-3 border-b border-[#1e2235] flex items-center justify-between bg-[#151720]/80 backdrop-blur-sm z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg flex items-center justify-center text-terminal-accent">
                                        <Tv size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm text-white uppercase leading-none">Intelligence TV</h3>
                                        <p className="text-[8px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{activeChannel.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex gap-1">
                                        {CHANNELS.map(ch => (
                                            <button 
                                                key={ch.id} 
                                                onClick={() => setActiveChannel(ch)}
                                                className={`w-10 h-6 rounded flex items-center justify-center text-[8px] font-black uppercase transition-all border ${activeChannel.id === ch.id ? 'bg-terminal-accent text-black border-terminal-accent' : 'bg-[#1a1e2e] border-[#2a2f45] text-gray-500 hover:text-white'}`}
                                            >
                                                {ch.logo}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="px-2 py-1 bg-red-600 text-white text-[8px] font-black rounded uppercase animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.4)]">Live</div>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden z-10">
                                <div className="flex-1 bg-black relative group">
                                    <LiveStreamPlayer key={activeChannel.id} url={activeChannel.streamUrl} />
                                    <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                                        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl">
                                            <div className="text-[7px] text-gray-400 font-bold uppercase flex items-center gap-1">
                                                <div className="w-1 h-1 bg-terminal-accent rounded-full animate-pulse"></div>
                                                XAUUSD Live Feed
                                            </div>
                                            <div className="text-lg font-black text-terminal-accent font-mono tracking-tighter animate-pulse">${livePrice.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                                {/* MINI CHANNEL LIST */}
                                <div className="w-40 bg-[#0a0c14]/80 backdrop-blur-md border-l border-[#1e2235] overflow-y-auto custom-scrollbar p-1 space-y-1 shrink-0">
                                    {CHANNELS.map(ch => (
                                        <div 
                                            key={ch.id} 
                                            onClick={() => setActiveChannel(ch)}
                                            className={`p-2 rounded border cursor-pointer transition-all ${activeChannel.id === ch.id ? 'bg-[#1e2235] border-terminal-accent' : 'border-transparent hover:bg-white/5'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-black text-white truncate w-24">{ch.name}</span>
                                                {ch.status === 'LIVE' ? <PlayCircle size={10} className="text-green-500" /> : <PauseCircle size={10} className="text-gray-600" />}
                                            </div>
                                            <div className="flex justify-between text-[7px] font-bold uppercase text-gray-500">
                                                <span>{ch.status}</span>
                                                <span>{ch.viewers}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* MARKET TIMINGS (Expanded to 6 cols to match TV) */}
                        <div className="col-span-12 lg:col-span-6 h-full relative z-10">
                            <MarketTimings />
                        </div>
                    </div>

                    {/* ROW 2: MARKET INDICATOR & TOP/BOTTOM STOCKS */}
                    <div className="grid grid-cols-12 gap-3 h-80 relative z-10">
                        
                        {/* Market Velocity Indicator */}
                        <div className="col-span-12 lg:col-span-4 bg-[#0f111a]/90 backdrop-blur-md border border-[#1e2235] rounded-xl p-5 shadow-xl flex flex-col justify-between overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Gauge size={160} />
                            </div>
                            <h3 className="text-[10px] font-black text-white uppercase flex items-center gap-2 tracking-widest relative z-10">
                                <Activity size={14} className="text-terminal-accent"/> Market Momentum
                            </h3>
                            
                            <div className="flex flex-col items-center justify-center flex-1 py-4 relative z-10">
                                <div className="relative w-40 h-20 overflow-hidden">
                                    <div className="absolute bottom-0 w-40 h-40 border-[12px] border-[#1e2235] rounded-full"></div>
                                    <div 
                                        className="absolute bottom-0 w-40 h-40 border-[12px] border-transparent border-t-terminal-accent border-r-terminal-accent rounded-full transition-transform duration-[2000ms] ease-in-out"
                                        style={{ transform: `rotate(${(velocity * 1.8) - 90}deg)` }}
                                    ></div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
                                        <div className="text-3xl font-black text-white leading-none">{velocity.toFixed(0)}%</div>
                                        <div className="text-[8px] text-terminal-accent font-bold uppercase mt-1 tracking-tighter">Aggressive Buy</div>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full mt-4 px-4 text-[8px] font-bold text-gray-500 uppercase">
                                    <span>Fear</span>
                                    <span>Neutral</span>
                                    <span>Greed</span>
                                </div>
                            </div>

                            <div className="border-t border-[#1e2235] pt-4 flex justify-between items-center relative z-10">
                                <div>
                                    <div className="text-[8px] text-gray-500 font-bold uppercase">Net Vol Delta</div>
                                    <div className="text-sm font-black text-green-500">+1.2M</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] text-gray-500 font-bold uppercase">VIX Index</div>
                                    <div className="text-sm font-black text-red-500">14.20</div>
                                </div>
                            </div>
                        </div>

                        {/* TOP GAINERS & BOTTOM LOSERS */}
                        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-3">
                            {/* Top 5 Gainers */}
                            <div className="bg-[#0f111a]/90 backdrop-blur-md border border-[#1e2235] rounded-xl overflow-hidden shadow-xl flex flex-col">
                                <div className="p-3 bg-[#151720] border-b border-[#1e2235] flex justify-between items-center">
                                    <span className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1.5"><ArrowUp size={12}/> Global Top Performers</span>
                                    <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">TV Live Feed</span>
                                </div>
                                <div className="flex-1 bg-[#050508]/50 p-1.5 space-y-1 overflow-y-auto custom-scrollbar">
                                    {TOP_GAINERS.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded bg-[#0f111a] border border-[#1e2235] hover:border-green-500/50 transition-all cursor-pointer group shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-500/10 rounded flex items-center justify-center font-black text-[10px] text-green-500 border border-green-500/20">{i+1}</div>
                                                <div>
                                                    <div className="text-xs font-black text-white group-hover:text-green-500 uppercase transition-colors">{s.s}</div>
                                                    <div className="text-[8px] text-gray-500 font-mono">24h Vol: {s.v}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-white font-mono tracking-tighter">${s.p}</div>
                                                <div className="text-[10px] font-black text-green-500 animate-pulse">{s.c}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom 5 Losers */}
                            <div className="bg-[#0f111a]/90 backdrop-blur-md border border-[#1e2235] rounded-xl overflow-hidden shadow-xl flex flex-col">
                                <div className="p-3 bg-[#151720] border-b border-[#1e2235] flex justify-between items-center">
                                    <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1.5"><ArrowDown size={12}/> Global Low Performers</span>
                                    <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">TV Live Feed</span>
                                </div>
                                <div className="flex-1 bg-[#050508]/50 p-1.5 space-y-1 overflow-y-auto custom-scrollbar">
                                    {TOP_LOSERS.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded bg-[#0f111a] border border-[#1e2235] hover:border-red-500/50 transition-all cursor-pointer group shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-red-500/10 rounded flex items-center justify-center font-black text-[10px] text-red-500 border border-red-500/20">{i+1}</div>
                                                <div>
                                                    <div className="text-xs font-black text-white group-hover:text-red-500 uppercase transition-colors">{s.s}</div>
                                                    <div className="text-[8px] text-gray-500 font-mono">24h Vol: {s.v}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-black text-white font-mono tracking-tighter">${s.p}</div>
                                                <div className="text-[10px] font-black text-red-500 animate-pulse">{s.c}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* BOTTOM SECTION: ANALYSTS */}
            <div className="shrink-0 relative z-20">
                 <TopAnalysts3D />
            </div>
        </div>
    );
};