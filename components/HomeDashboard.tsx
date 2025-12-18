
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Play, TrendingUp, TrendingDown, Activity, Users, Tv, Rabbit, Zap, Menu, ChevronDown, AlertCircle, RefreshCw, Radio, Layers, BrainCircuit, ArrowUpRight, ArrowDownRight, Lock, Cpu, BarChart3, MoreHorizontal, Calendar, Megaphone, Bell, Gauge, Timer, ExternalLink, DollarSign, Clock, Globe, Map, Droplets, Scale, Percent, BarChart4, Coins, Shield, Trophy, Gift, MessageCircle, Share2, Server, Link2, List, Wifi, Settings, Terminal, Image as ImageIcon, Target, X, Filter } from 'lucide-react';
import { TopAnalysts3D } from './TopAnalysts3D';
import { AiSignalResponse } from '../types';
import { Area, AreaChart, ResponsiveContainer, BarChart, Bar, Cell, Tooltip, XAxis, YAxis, PieChart, Pie, LineChart, Line, RadialBarChart, RadialBar } from 'recharts';

declare global {
    interface Window {
        Hls: any;
        TradingView: any;
    }
}

interface Props {
    onShowSignal?: (signal: AiSignalResponse) => void;
}

export interface TVChannel {
    id: string;
    name: string;
    streamUrl: string;
    fallbackUrl?: string;
    type: string;
    lang: string; // Used as Region
    viewers: string;
    category: string;
    logo: string;
}

// PREMIUM LIVE CHANNELS - DIRECT STREAMS
export const CHANNELS: TVChannel[] = [
    { 
        id: 'bloomberg', 
        name: "Bloomberg TV US", 
        streamUrl: "https://tv.garden/us/USmuuhVA4Jtz9O?autoplay=1&mute=1", 
        type: "Finance", 
        lang: "USA", 
        viewers: "1.2M", 
        category: "Markets",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Bloomberg_Television_logo.svg/512px-Bloomberg_Television_logo.svg.png"
    },
    { 
        id: 'cnbc', 
        name: "CNBC International", 
        streamUrl: "https://tv.garden/us/cnbc_live?autoplay=1&mute=1", 
        fallbackUrl: "https://www.youtube.com/embed/V0I5eglJMRI?autoplay=1&mute=1",
        type: "Finance", 
        lang: "USA", 
        viewers: "850k", 
        category: "Markets",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/CNBC_logo.svg"
    },
    { 
        id: 'skynews', 
        name: "Sky News", 
        streamUrl: "https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1", 
        type: "News", 
        lang: "UK", 
        viewers: "450k", 
        category: "Economy",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Sky_News_logo_2018.svg/1200px-Sky_News_logo_2018.svg.png"
    },
    { 
        id: 'aljazeera', 
        name: "Al Jazeera", 
        streamUrl: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8", 
        type: "News", 
        lang: "Qatar", 
        viewers: "890k", 
        category: "Global",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Aljazeera_eng.svg/512px-Aljazeera_eng.svg.png"
    },
    { 
        id: 'bbc', 
        name: "BBC News", 
        streamUrl: "https://www.youtube.com/embed/lx773f62?autoplay=1&mute=1", 
        fallbackUrl: "https://www.youtube.com/embed/guvF8P2t270?autoplay=1&mute=1", 
        type: "News", 
        lang: "UK", 
        viewers: "1.5M", 
        category: "Global",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/BBC_News_2019.svg/1200px-BBC_News_2019.svg.png"
    },
    { 
        id: 'france24', 
        name: "France 24", 
        streamUrl: "https://static.france24.com/live/F24_EN_HI_HLS/master_m3u8.m3u8", 
        type: "News", 
        lang: "France", 
        viewers: "120k", 
        category: "Europe",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/France_24_logo.svg/512px-France_24_logo.svg.png"
    },
    { 
        id: 'dw', 
        name: "DW News", 
        streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", 
        type: "News", 
        lang: "Germany", 
        viewers: "210k", 
        category: "Europe",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DW-Logo.svg/512px-DW-Logo.svg.png"
    },
    { 
        id: 'cna', 
        name: "CNA Insider", 
        streamUrl: "https://www.youtube.com/embed/XWq5kBlakcQ?autoplay=1&mute=1", 
        type: "Finance", 
        lang: "Singapore", 
        viewers: "180k", 
        category: "Asia",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/CNA_logo.svg/1200px-CNA_logo.svg.png"
    }
];

// INITIAL DATA matching the Bloomberg Screenshot + Real Assets
const INITIAL_INDICATORS = [
    { id: 'BTCUSDT', name: 'BITCOIN', price: 69420.00, chg: 120.50, pct: 0.18, data: [69000, 69100, 69200, 69150, 69300, 69400, 69350, 69420], isLive: true, flash: '' },
    { id: 'PAXGUSDT', name: 'GOLD', price: 2180.50, chg: 15.20, pct: 0.70, data: [2160, 2165, 2170, 2168, 2175, 2180, 2178, 2180], isLive: true, flash: '' },
    { id: 'SPX', name: 'S&P 500', price: 5150.45, chg: 25.10, pct: 0.49, data: [5120, 5130, 5125, 5140, 5145, 5150, 5148, 5150], isLive: false, flash: '' },
    { id: 'DJI', name: 'DOW JONES', price: 38950.20, chg: 140.50, pct: 0.36, data: [38800, 38850, 38900, 38880, 38920, 38950, 38940, 38950], isLive: false, flash: '' },
    { id: 'EURUSDT', name: 'EUR/USD', price: 1.0920, chg: 0.0015, pct: 0.14, data: [1.089, 1.090, 1.091, 1.0905, 1.0915, 1.092, 1.0918, 1.092], isLive: true, flash: '' },
    { id: 'ETHUSDT', name: 'ETHEREUM', price: 3950.20, chg: 45.30, pct: 1.15, data: [3900, 3910, 3920, 3915, 3930, 3940, 3945, 3950], isLive: true, flash: '' },
    { id: 'SOLUSDT', name: 'SOLANA', price: 148.50, chg: 5.20, pct: 3.65, data: [140, 142, 143, 142, 145, 146, 148, 148.5], isLive: true, flash: '' },
    { id: 'B500', name: 'ROUTIEX 500', price: 2472.31, chg: 6.33, pct: 0.26, data: [2460, 2465, 2462, 2468, 2470, 2472, 2471, 2472], isLive: false, flash: '' },
];

// --- SUB-COMPONENTS ---

const PlatformStatusStrip = () => (
    <div className="flex items-center gap-2 bg-[#0f111a] border-b border-[#1e2235] px-4 py-1 overflow-x-auto no-scrollbar shrink-0 h-8">
        <div className="flex items-center gap-2 mr-4 border-r border-[#1e2235] pr-4">
            <Server size={12} className="text-terminal-accent" />
            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Bridge Status</span>
        </div>
        
        {[
            { name: 'MetaTrader 4', status: 'online', color: 'text-blue-500', ping: '12ms' },
            { name: 'MetaTrader 5', status: 'online', color: 'text-blue-400', ping: '14ms' },
            { name: 'TradingView', status: 'online', color: 'text-white', ping: '45ms' },
            { name: 'cTrader', status: 'offline', color: 'text-green-600', ping: '-' },
            { name: 'Binance API', status: 'online', color: 'text-yellow-500', ping: '88ms' },
            { name: 'FIX Protocol', status: 'online', color: 'text-purple-500', ping: '2ms' },
        ].map((p, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#1a1e2e] px-2 py-0.5 rounded border border-[#2a2f45] shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-[9px] font-black ${p.color}`}>{p.name}</span>
                {p.status === 'online' && <span className="text-[8px] text-gray-500 font-mono">{p.ping}</span>}
            </div>
        ))}
        <div className="flex-1"></div>
        <div className="text-[9px] text-gray-500 font-mono hidden md:block">
            System Time: {new Date().toLocaleTimeString()} UTC
        </div>
    </div>
);

export const LiveStreamPlayer: React.FC<{ url: string, fallbackUrl?: string, autoPlay?: boolean }> = ({ url, fallbackUrl, autoPlay = true }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ bitrate: 0, buffer: 0 });
    const hlsRef = useRef<any>(null);
    
    // Fallback state
    const [isUsingFallback, setIsUsingFallback] = useState(false);

    // Determine active URL
    const activeUrl = isUsingFallback && fallbackUrl ? fallbackUrl : url;

    // Detect Source Type based on ACTIVE url
    const isM3U8 = activeUrl && activeUrl.includes('.m3u8');
    const isMP4 = activeUrl && activeUrl.includes('.mp4');
    const isDirectStream = isM3U8 || isMP4;
    const isEmbed = !isDirectStream;

    // Reset fallback state when main URL changes
    useEffect(() => {
        setIsUsingFallback(false);
        setError(false);
        setLoading(true);
    }, [url]);

    useEffect(() => {
        if (isEmbed) {
            setLoading(false);
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        const cleanup = () => {
             if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };

        cleanup();

        const handleError = () => {
            if (fallbackUrl && !isUsingFallback) {
                console.log("Stream Error: Switching to fallback...", fallbackUrl);
                setIsUsingFallback(true);
                setLoading(true);
            } else {
                console.error("Stream Error & No Fallback Available");
                setLoading(false);
                setError(true);
            }
        };

        if (isM3U8 && window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({ 
                enableWorker: true, 
                lowLatencyMode: true,
                debug: false,
            });
            hlsRef.current = hls;
            
            try {
                hls.loadSource(activeUrl);
                hls.attachMedia(video);
                
                hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                    setLoading(false);
                    if (autoPlay) video.play().catch(() => {});
                });

                hls.on(window.Hls.Events.FRAG_LOADED, (event: any, data: any) => {
                   setStats(prev => ({
                       ...prev,
                       bitrate: Math.round(data.frag.stats.total / 1024), 
                   }));
                });

                hls.on(window.Hls.Events.ERROR, (e: any, data: any) => {
                    if (data.fatal) {
                        switch (data.type) {
                        case window.Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case window.Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            handleError();
                            break;
                        }
                    }
                });
            } catch (err) {
                handleError();
            }
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = activeUrl;
            video.addEventListener('loadedmetadata', () => {
                setLoading(false);
                if (autoPlay) video.play().catch(() => {});
            });
            video.addEventListener('error', handleError);
        } else {
            video.src = activeUrl;
            video.oncanplay = () => setLoading(false);
            video.onerror = handleError;
            if (autoPlay) video.play().catch(() => {});
        }

        return () => { cleanup(); };
    }, [activeUrl, isM3U8, isEmbed, autoPlay, fallbackUrl, isUsingFallback]);

    if (isEmbed) {
        return (
            <div className="w-full h-full bg-black relative">
                <iframe 
                    src={activeUrl} 
                    className="w-full h-full border-0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    scrolling="no"
                    title="Live Stream"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                />
            </div>
        );
    }

    if (error) return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-red-500 text-xs font-bold p-4 text-center">
            <RefreshCw size={24} className="mb-2 opacity-50"/>
            <p>Signal Lost</p>
            <p className="text-[10px] text-gray-500 mt-1">Source Unavailable</p>
            <button 
                onClick={() => { setError(false); setIsUsingFallback(false); setLoading(true); }}
                className="mt-4 px-4 py-2 bg-[#1e2235] text-white rounded text-[10px] hover:bg-terminal-accent hover:text-black transition-colors"
            >
                Retry Connection
            </button>
        </div>
    );

    return (
        <div className="w-full h-full bg-black relative group">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"><div className="w-6 h-6 border-2 border-terminal-accent border-t-transparent rounded-full animate-spin"></div></div>}
            
            <div className="absolute top-2 left-2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 backdrop-blur px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-gray-300">
                    <div>STREAM: {isM3U8 ? 'HLS DIRECT' : 'MEDIA FILE'}</div>
                    {isM3U8 && <div>BITRATE: {stats.bitrate} KB/s</div>}
                </div>
            </div>

            <video 
                ref={videoRef} 
                controls={true} 
                autoPlay={autoPlay} 
                muted={true}
                loop={true}
                playsInline 
                crossOrigin="anonymous" 
                className="w-full h-full object-cover" 
            />
        </div>
    );
};

// --- INSTITUTIONAL DEPTH WIDGET ---
const InstitutionalDepth = () => {
    const gaugeData = [{ name: 'Buy', value: 65, fill: '#10b981' }];
    const flowData = [
        { name: 'Tech', buy: 400, sell: 240 },
        { name: 'Fin', buy: 300, sell: 139 },
        { name: 'Energy', buy: 200, sell: 580 },
        { name: 'Health', buy: 278, sell: 390 },
    ];

    return (
        <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20"><Layers size={64} /></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <Layers size={16} className="text-terminal-accent" /> Institutional Depth
                </h3>
                <span className="text-[9px] font-bold bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">DARK POOL ACCESS</span>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Sentiment Gauge */}
                <div className="bg-[#1a1e2e] rounded-lg p-2 flex flex-col items-center justify-center relative">
                    <div className="w-full h-full" style={{ minHeight: '80px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={gaugeData} startAngle={180} endAngle={0} innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                                    <Cell fill="#10b981" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="absolute bottom-2 text-center">
                        <div className="text-xl font-black text-white">65%</div>
                        <div className="text-[8px] text-green-500 uppercase font-bold">Inst. Buy Bias</div>
                    </div>
                </div>

                {/* Flow Bars */}
                <div className="flex flex-col justify-center space-y-2">
                    {flowData.map((d, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-[9px] text-gray-400 mb-0.5">
                                <span>{d.name}</span>
                                <span className={d.buy > d.sell ? 'text-green-500' : 'text-red-500'}>{d.buy > d.sell ? 'Net Buy' : 'Net Sell'}</span>
                            </div>
                            <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-800">
                                <div className="bg-green-500" style={{ width: `${(d.buy / (d.buy + d.sell)) * 100}%` }}></div>
                                <div className="bg-red-500" style={{ width: `${(d.sell / (d.buy + d.sell)) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#1e2235]">
                <div>
                    <div className="text-[9px] text-gray-500 uppercase">Gamma Exp</div>
                    <div className="text-xs font-mono font-bold text-white">$4.2B</div>
                </div>
                <div>
                    <div className="text-[9px] text-gray-500 uppercase">Dark Vol</div>
                    <div className="text-xs font-mono font-bold text-terminal-accent">42%</div>
                </div>
                <div>
                    <div className="text-[9px] text-gray-500 uppercase">Smart Flow</div>
                    <div className="text-xs font-mono font-bold text-green-500">+128M</div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---

export const HomeDashboard: React.FC<Props> = ({ onShowSignal }) => {
    const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Live Ticker State
    const [liveTickers, setLiveTickers] = useState(INITIAL_INDICATORS);

    // WebSocket & Simulation Effect
    useEffect(() => {
        // 1. WebSocket for Crypto/Forex Proxies
        let ws: WebSocket | null = null;
        try {
            ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/paxgusdt@ticker/eurusdt@ticker');
            
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                const data = message.data;
                const symbol = data.s; // e.g., BTCUSDT
                const price = parseFloat(data.c);
                const chg = parseFloat(data.p);
                const pct = parseFloat(data.P);

                setLiveTickers(prev => prev.map(t => {
                    if (t.id === symbol) {
                        const isUp = price > t.price;
                        return {
                            ...t,
                            price,
                            chg,
                            pct,
                            data: [...t.data.slice(1), price],
                            flash: isUp ? 'bg-green-500/20' : 'bg-red-500/20' // Flash Logic
                        };
                    }
                    return { ...t, flash: '' }; // Clear flash for others
                }));
            };
        } catch (e) {
            console.error("WebSocket Init Failed", e);
        }

        // 2. Simulation for Indices (No free WS available) with "Live" feel
        const simInterval = setInterval(() => {
            setLiveTickers(prev => prev.map(t => {
                if (!t.isLive) {
                    // Random walk simulation
                    const move = (Math.random() - 0.5) * (t.price * 0.0005);
                    const newPrice = t.price + move;
                    const newChg = t.chg + move;
                    const newPct = (newChg / (newPrice - newChg)) * 100;
                    const isUp = move > 0;
                    
                    return {
                        ...t,
                        price: newPrice,
                        chg: newChg,
                        pct: newPct,
                        data: [...t.data.slice(1), newPrice],
                        flash: isUp ? 'bg-green-500/10' : 'bg-red-500/10'
                    };
                }
                return t;
            }));
        }, 1500);

        // Flash cleaner
        const flashCleaner = setInterval(() => {
             setLiveTickers(prev => prev.map(t => ({ ...t, flash: '' })));
        }, 800);

        return () => {
            if (ws) ws.close();
            clearInterval(simInterval);
            clearInterval(flashCleaner);
        };
    }, []);

    // Extract unique filters
    const regions = ['All', ...Array.from(new Set(CHANNELS.map(c => c.lang)))];
    const categories = ['All', ...Array.from(new Set(CHANNELS.map(c => c.category)))];

    // Filter Logic
    const filteredChannels = CHANNELS.filter(ch => {
        const matchRegion = selectedRegion === 'All' || ch.lang === selectedRegion;
        const matchCat = selectedCategory === 'All' || ch.category === selectedCategory;
        return matchRegion && matchCat;
    });

    const [symbol, setSymbol] = useState('BTC/USD');
    const [price, setPrice] = useState(69420.00);
    const [connectionStatus, setConnectionStatus] = useState('CONNECTED');
    const [connectionType, setConnectionType] = useState('Binance API');
    const [latency, setLatency] = useState(45);
    const [balance, setBalance] = useState(12450.00);
    const [equity, setEquity] = useState(12890.00);
    const [leverage, setLeverage] = useState(100);
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [orderSize, setOrderSize] = useState(1.0);
    const [processingOrder, setProcessingOrder] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState<any>(null);
    const [activeBottomTab, setActiveBottomTab] = useState('positions');
    
    // Main Chart Initialization
    useEffect(() => {
        let mounted = true;
        let checkInterval: any = null;

        const initChart = () => {
            if (!mounted) return;
            const container = document.getElementById('tradingview_professional');
            if (window.TradingView && container) {
                container.innerHTML = ''; // Explicitly clear to prevent overlap and errors
                // Determine symbol based on state
                let tvSymbol = "BINANCE:BTCUSDT"; // Default
                if (symbol.includes('XAU')) tvSymbol = "OANDA:XAUUSD";
                if (symbol.includes('EUR')) tvSymbol = "FX:EURUSD";
                if (symbol.includes('SPX') || symbol.includes('US30')) tvSymbol = "FOREXCOM:SPXUSD";

                new window.TradingView.widget({
                    "autosize": true,
                    "symbol": tvSymbol,
                    "interval": "15",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "enable_publishing": false,
                    "hide_side_toolbar": false, // SHOW TOOLBAR FOR DRAWINGS
                    "allow_symbol_change": true,
                    "container_id": "tradingview_professional",
                    "toolbar_bg": "#0f111a",
                    "studies": ["STD;RSI", "STD;MACD"]
                });
            }
        };

        if (window.TradingView) {
            initChart();
        } else {
            // Robust check for existing script
            if (!document.getElementById('tv-widget-lib')) {
                const script = document.createElement('script');
                script.id = 'tv-widget-lib';
                script.src = 'https://s3.tradingview.com/tv.js';
                script.async = true;
                script.onload = () => {
                    if (window.TradingView) initChart();
                };
                document.head.appendChild(script);
            }
            
            // Polling backup
            checkInterval = setInterval(() => {
                if (window.TradingView) {
                    clearInterval(checkInterval);
                    initChart();
                }
            }, 100);
        }

        return () => {
            mounted = false;
            if (checkInterval) clearInterval(checkInterval);
        };
    }, [symbol]); // Re-init on symbol change

    const executeTrade = (side: 'BUY' | 'SELL') => {
        if(connectionStatus !== 'CONNECTED') return;
        setProcessingOrder(true);
        
        setTimeout(() => {
            setProcessingOrder(false);
            // Simulate trade
        }, 1000); 
    };

    const handleConnect = () => {
        setConnectionStatus('CONNECTED');
        setIsSetupOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-[#020617] overflow-hidden">
            
            {/* 1. PLATFORM STATUS STRIP */}
            <PlatformStatusStrip />

            {/* 2. NEWS TICKER (TOP) */}
            <div className="bg-terminal-accent/5 border-b border-terminal-accent/20 h-8 flex items-center overflow-hidden relative shrink-0">
                <div className="absolute left-0 bg-terminal-accent text-black px-4 h-full flex items-center text-[10px] font-black uppercase z-10 tracking-widest shadow-lg">
                    <Zap size={12} className="mr-1 fill-current" /> ROUTIEX FEED
                </div>
                <div className="animate-marquee whitespace-nowrap flex items-center gap-12 pl-36">
                    <span className="text-xs text-white font-mono"><span className="text-green-500 font-bold">BTC</span> $69,420 (+4.2%)</span>
                    <span className="text-xs text-white font-mono"><span className="text-yellow-500 font-bold">XAU</span> $2,180 (+1.2%)</span>
                    <span className="text-xs text-white font-mono"><span className="text-blue-500 font-bold">SPX</span> 5,150 (+0.8%)</span>
                    <span className="text-xs text-white font-mono"><span className="text-red-500 font-bold">VIX</span> 14.20 (-2.1%)</span>
                    <span className="text-xs text-white font-mono"><span className="text-purple-500 font-bold">SOL</span> $145 (+8.5%)</span>
                    <span className="text-xs text-white font-mono flex items-center gap-1 text-gray-400">| <Megaphone size={10}/> ALERT: Institutional buy volume detected on NVDA 900C.</span>
                </div>
            </div>

            {/* 3. MAIN GRID - SCROLLABLE AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="grid grid-cols-12 gap-4 h-full min-h-[600px]">
                    
                    {/* LEFT: Live TV Command Center (6 Cols - 50%) */}
                    <div className="col-span-12 lg:col-span-6 flex flex-col h-[700px] bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden shadow-2xl">
                        
                        {/* HEADER: 2 Quadrants */}
                        <div className="h-24 flex border-b border-[#1e2235] shrink-0 relative z-20">
                            {/* ... (Existing Header Code) ... */}
                            <div className="w-2/3 border-r border-[#1e2235] relative overflow-hidden bg-[#0b0d14] flex items-center px-6 gap-4 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                                <div className="absolute left-10 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                                    <Globe size={180} className="text-blue-500 animate-spin-slow duration-[120s]" />
                                </div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#0f111a] border-2 border-terminal-accent rounded-xl flex items-center justify-center text-terminal-accent shadow-[0_0_30px_rgba(41,98,255,0.2)] relative z-20">
                                        <Globe size={32} strokeWidth={2} />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-[#0f111a] animate-pulse shadow-[0_0_10px_red]"></div>
                                    </div>
                                    <div className="flex flex-col justify-center z-20">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-white text-xl uppercase tracking-tighter leading-none drop-shadow-md">Live Earth TV</h3>
                                            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-[0_0_15px_red] animate-pulse tracking-widest border border-red-400/50">LIVE</span>
                                        </div>
                                        <span className="text-[10px] text-blue-200 font-bold tracking-[0.25em] uppercase mt-1.5 flex items-center gap-2 opacity-90">
                                            Global Broadcast <Wifi size={10} className="text-terminal-accent animate-pulse" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-1/3 bg-[#0b0d14] flex flex-col justify-center px-4 gap-2 border-l border-[#1e2235]/50">
                                <div className="flex items-center gap-2">
                                    <Globe size={14} className="text-gray-500" />
                                    <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} className="bg-[#151720] text-[10px] text-white border border-[#333] rounded px-2 py-1.5 w-full outline-none focus:border-terminal-accent font-bold">
                                        {regions.map(r => <option key={r} value={r}>{r === 'All' ? 'All Regions' : r}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter size={14} className="text-gray-500" />
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="bg-[#151720] text-[10px] text-white border border-[#333] rounded px-2 py-1.5 w-full outline-none focus:border-terminal-accent font-bold">
                                        {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Types' : c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT: Player + List */}
                        <div className="flex-1 flex min-h-0">
                            <div className="w-[65%] bg-black border-r border-[#1e2235] relative flex flex-col">
                                <LiveStreamPlayer key={activeChannel.id} url={activeChannel.streamUrl} fallbackUrl={activeChannel.fallbackUrl} />
                            </div>
                            <div className="w-[35%] bg-[#0f111a] flex flex-col">
                                <div className="p-3 bg-[#1a1e2e] border-b border-[#1e2235] text-[10px] font-bold text-gray-400 uppercase flex justify-between items-center shadow-sm z-10">
                                    <span>Available ({filteredChannels.length})</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <Wifi size={12} className="text-terminal-accent" />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-1">
                                    {filteredChannels.map(ch => (
                                        <button key={ch.id} onClick={() => setActiveChannel(ch)} className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all group ${activeChannel.id === ch.id ? 'bg-[#1e2235] border border-terminal-accent/30 shadow-md' : 'hover:bg-[#1e2235] border border-transparent'}`}>
                                            <div className="w-10 h-8 rounded bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm relative border border-gray-700">
                                                {ch.logo ? <img src={ch.logo} className="w-full h-full object-contain" /> : <span className="text-black font-bold text-[8px]">{ch.name.substring(0,2)}</span>}
                                            </div>
                                            <div className="text-left min-w-0 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div className={`text-[10px] font-bold truncate ${activeChannel.id === ch.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{ch.name}</div>
                                                    <div className="text-[7px] font-black text-red-500 bg-red-500/10 px-1 py-0.5 rounded animate-pulse border border-red-500/20 whitespace-nowrap">TV LIVE</div>
                                                </div>
                                                <div className="text-[8px] text-gray-600 flex items-center gap-1 mt-0.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${activeChannel.id === ch.id ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
                                                    {ch.lang} • {ch.viewers}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* LIVE TICKER STRIP - ORANGE / BLUE / GREEN / RED THEME */}
                        <div className="h-16 bg-[#000] border-t border-[#1e2235] flex overflow-x-auto custom-scrollbar shrink-0 gap-[1px] p-[2px]">
                            {liveTickers.map((ticker, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 min-w-[120px] bg-[#050508] border border-[#1e2235] hover:border-terminal-accent transition-all duration-300 flex flex-col justify-center px-3 relative group ${ticker.flash}`}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        {/* Orange Symbol Name */}
                                        <div className="text-xs font-black text-amber-500 tracking-tight shadow-black drop-shadow-md">{ticker.name}</div>
                                        {/* Green/Red Change */}
                                        <div className={`text-[10px] font-bold ${ticker.chg >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {ticker.chg > 0 ? '+' : ''}{ticker.chg.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center w-full mt-1">
                                        {/* White/Blue Price */}
                                        <div className="text-white group-hover:text-blue-200 font-mono font-bold text-xs transition-colors">
                                            {ticker.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </div>
                                        {/* Animated Sparkline */}
                                        <div className="w-12 h-6 opacity-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={ticker.data.map((v, idx) => ({v, idx}))}>
                                                    <Line 
                                                        type="monotone" 
                                                        dataKey="v" 
                                                        stroke={ticker.chg >= 0 ? '#10b981' : '#ef4444'} 
                                                        strokeWidth={2} 
                                                        dot={false}
                                                        isAnimationActive={false} 
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CENTER: Deep Analytics & Institutional Data (3 Cols) */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                        {/* Institutional Widget */}
                        <div className="h-64">
                            <InstitutionalDepth />
                        </div>
                        
                        {/* Market Heatmap & Liquidity */}
                        <div className="flex-1 bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                                    <Map size={14} className="text-purple-500" /> Liquidity Heatmap
                                </h3>
                            </div>
                            <div className="flex-1 grid grid-cols-2 gap-1">
                                {[
                                    { s: 'NVDA', v: +4.2, c: 'bg-green-600' }, { s: 'TSLA', v: -2.1, c: 'bg-red-600' }, { s: 'AMD', v: +1.8, c: 'bg-green-500' },
                                    { s: 'AAPL', v: -0.5, c: 'bg-red-900' }, { s: 'MSFT', v: +0.9, c: 'bg-green-800' }, { s: 'GOOG', v: -1.2, c: 'bg-red-500' },
                                    { s: 'AMZN', v: +2.4, c: 'bg-green-500' }, { s: 'META', v: +3.1, c: 'bg-green-500' }, { s: 'NFLX', v: -0.2, c: 'bg-red-900' },
                                ].map((b, i) => (
                                    <div key={i} className={`${b.c} rounded flex flex-col items-center justify-center text-white p-1 hover:opacity-80 cursor-pointer transition-opacity`}>
                                        <span className="text-[10px] font-black">{b.s}</span>
                                        <span className="text-[9px]">{b.v}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-[9px] text-gray-500 text-center">
                                Real-time SPX500 Sector Performance
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: AI, Social & Promos (3 Cols) */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                        
                        {/* Live Signal Feed */}
                        <div className="flex-1 bg-terminal-panel border border-terminal-border rounded-xl overflow-hidden flex flex-col max-h-64 shadow-md">
                            <div className="p-3 border-b border-terminal-border bg-[#1a1e2e] flex justify-between items-center shrink-0">
                                <span className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-wide">
                                    <Target size={14} className="text-terminal-accent" /> Live Signals
                                </span>
                                <span className="flex items-center gap-1 text-[9px] font-bold text-green-500">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 5 Active
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0 bg-[#050508]">
                                {[
                                    { sym: 'XAUUSD', action: 'BUY', entry: 2031.50, pnl: '+45 pips', time: '2m', status: 'ACTIVE' },
                                    { sym: 'BTCUSD', action: 'BUY', entry: 67200, pnl: '+550 pts', time: '15m', status: 'ACTIVE' },
                                    { sym: 'EURUSD', action: 'SELL', entry: 1.0850, pnl: '+12 pips', time: '42m', status: 'ACTIVE' },
                                    { sym: 'US30', action: 'BUY', entry: 38900, pnl: '0 pts', time: '1h', status: 'PENDING' },
                                    { sym: 'GBPJPY', action: 'BUY', entry: 188.20, pnl: '+130 pips', time: '1h', status: 'CLOSED' },
                                ].map((s, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => onShowSignal && onShowSignal({
                                            symbol: s.sym, 
                                            action: s.action as any, 
                                            confidence: 90, 
                                            entryZone: s.entry.toString(), 
                                            tp1: (s.entry * 1.01).toFixed(2), 
                                            tp2: (s.entry * 1.02).toFixed(2), 
                                            tp3: (s.entry * 1.03).toFixed(2), 
                                            stopLoss: (s.entry * 0.99).toFixed(2), 
                                            reasoning: 'Live Signal Feed Click', 
                                            timeframe: 'H1'
                                        })} 
                                        className="flex items-center justify-between p-3 border-b border-[#1e2235] hover:bg-[#1e2235] cursor-pointer group transition-colors relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.status === 'ACTIVE' ? 'bg-green-500' : s.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                                        <div className="flex items-center gap-3 pl-2">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[9px] border ${s.action === 'BUY' ? 'bg-green-900/20 text-green-500 border-green-500/20' : 'bg-red-900/20 text-red-500 border-red-500/20'}`}>
                                                {s.action === 'BUY' ? 'BUY' : 'SELL'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-xs">{s.sym}</div>
                                                <div className="text-[9px] text-gray-500 flex items-center gap-1">
                                                    @{s.entry} • {s.time} ago
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-bold font-mono ${s.status === 'CLOSED' ? 'text-gray-400' : s.pnl.includes('+') ? 'text-green-500' : 'text-gray-400'}`}>
                                                {s.pnl}
                                            </div>
                                            <div className="text-[8px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-terminal-accent transition-colors">
                                                {s.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Pulse */}
                        <div className="flex-1 bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden flex flex-col">
                            <div className="p-3 border-b border-[#1e2235] bg-[#1a1e2e] flex justify-between items-center shrink-0">
                                <span className="text-xs font-bold text-white flex items-center gap-2">
                                    <MessageCircle size={14} className="text-blue-400" /> Routiex Social
                                </span>
                                <span className="text-[9px] text-green-500 font-bold animate-pulse">● 14k Online</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-[#050508]">
                                {[
                                    { name: 'Gold Snipers VIP', msg: 'Buy limit hit at 2030!', time: '1m', unread: 3 },
                                    { name: 'Crypto Whales', msg: 'BTC breakout imminent.', time: '4m', unread: 0 },
                                    { name: 'Forex General', msg: 'Anyone watching GBP?', time: '12m', unread: 15 },
                                    { name: 'Routiex Official', msg: 'Maintenance scheduled...', time: '1h', unread: 0 },
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-[#1e2235] rounded cursor-pointer group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] font-bold text-white border border-gray-600">
                                            {c.name.substring(0,1)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <span className="text-[10px] font-bold text-gray-300 truncate">{c.name}</span>
                                                <span className="text-[9px] text-gray-600">{c.time}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 truncate group-hover:text-white transition-colors">{c.msg}</div>
                                        </div>
                                        {c.unread > 0 && (
                                            <div className="w-4 h-4 bg-terminal-accent text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                                                {c.unread}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM ANALYST STRIP (Fixed) */}
            <div className="shrink-0 z-30">
                <TopAnalysts3D />
            </div>
        </div>
    );
};
