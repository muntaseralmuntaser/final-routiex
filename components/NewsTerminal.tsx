
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Newspaper, BrainCircuit, Search, RefreshCw, ArrowUpRight, ArrowDownRight, Globe, Zap, Activity, DollarSign, BarChart2, CalendarDays, Filter, ChevronRight, Layers, Coins, Terminal, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { analyzeNewsImpact, NewsAnalysisResult } from '../services/geminiService';

// --- MOCK DATABASE FOR SEARCH PRESETS ---
const ASSET_DATABASE = [
    { symbol: 'NASDAQ:NVDA', name: 'NVIDIA Corp', type: 'Stock', sector: 'Technology' },
    { symbol: 'NASDAQ:TSLA', name: 'Tesla Inc', type: 'Stock', sector: 'Auto' },
    { symbol: 'NASDAQ:AAPL', name: 'Apple Inc', type: 'Stock', sector: 'Technology' },
    { symbol: 'NASDAQ:MSFT', name: 'Microsoft', type: 'Stock', sector: 'Technology' },
    { symbol: 'NASDAQ:AMZN', name: 'Amazon', type: 'Stock', sector: 'Cons. Discret.' },
    { symbol: 'NASDAQ:GOOGL', name: 'Alphabet Inc', type: 'Stock', sector: 'Technology' },
    { symbol: 'NASDAQ:META', name: 'Meta Platforms', type: 'Stock', sector: 'Technology' },
    { symbol: 'OANDA:XAUUSD', name: 'Gold Spot', type: 'Commodity', sector: 'Metal' },
    { symbol: 'TVC:USOIL', name: 'Crude Oil', type: 'Commodity', sector: 'Energy' },
    { symbol: 'FX:EURUSD', name: 'EUR / USD', type: 'Forex', sector: 'Currency' },
    { symbol: 'FX:GBPUSD', name: 'GBP / USD', type: 'Forex', sector: 'Currency' },
    { symbol: 'FX:USDJPY', name: 'USD / JPY', type: 'Forex', sector: 'Currency' },
    { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin', type: 'Crypto', sector: 'Digital Asset' },
    { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum', type: 'Crypto', sector: 'Smart Contract' },
    { symbol: 'BINANCE:SOLUSDT', name: 'Solana', type: 'Crypto', sector: 'L1 Chain' },
    { symbol: 'FOREXCOM:SPXUSD', name: 'S&P 500', type: 'Index', sector: 'US Market' },
    { symbol: 'FOREXCOM:NSXUSD', name: 'Nasdaq 100', type: 'Index', sector: 'US Tech' },
    { symbol: 'FRED:CPIAUCSL', name: 'US CPI (Inflation)', type: 'Economy', sector: 'Indicator' },
    { symbol: 'FRED:FEDFUNDS', name: 'Fed Interest Rate', type: 'Economy', sector: 'Indicator' }
];

// --- TIMEFRAME TYPES ---
type TimeframeKey = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

interface TrendData {
    tf: TimeframeKey;
    label: string;
    interval: string; // TradingView interval code
    direction: 'UP' | 'DOWN';
    change: number;
}

export const NewsTerminal: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeAsset, setActiveAsset] = useState(ASSET_DATABASE[0]);
    const [aiAnalysis, setAiAnalysis] = useState<NewsAnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Multi-Timeframe State
    const [activeTimeframe, setActiveTimeframe] = useState<TrendData | null>(null);
    const [trends, setTrends] = useState<TrendData[]>([]);

    // Filtered list based on search
    const searchResults = ASSET_DATABASE.filter(asset => 
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Auto-analyze when asset changes
    useEffect(() => {
        handleRunAnalysis();
        generateTrendMatrix();
    }, [activeAsset]);

    const generateTrendMatrix = () => {
        // Generate consistent mock trends for the asset
        const timeframes: { key: TimeframeKey, label: string, interval: string }[] = [
            { key: '1m', label: '1 Min', interval: '1' },
            { key: '5m', label: '5 Min', interval: '5' },
            { key: '15m', label: '15 Min', interval: '15' },
            { key: '30m', label: '30 Min', interval: '30' },
            { key: '1h', label: '1 Hour', interval: '60' },
            { key: '4h', label: '4 Hours', interval: '240' },
            { key: '1d', label: 'Daily', interval: 'D' },
        ];

        const newTrends: TrendData[] = timeframes.map(tf => {
            const isBullish = Math.random() > 0.4; // Slightly bullish bias
            return {
                tf: tf.key,
                label: tf.label,
                interval: tf.interval,
                direction: isBullish ? 'UP' : 'DOWN',
                change: parseFloat((Math.random() * (isBullish ? 1.5 : -1.5)).toFixed(2))
            };
        });

        setTrends(newTrends);
        setActiveTimeframe(newTrends.find(t => t.tf === '1h') || newTrends[4]); // Default to 1H
    };

    const handleRunAnalysis = async () => {
        setAiAnalysis(null);
        setIsAnalyzing(true);
        const simHeadline = `Latest market data and trading volume analysis for ${activeAsset.name}`;
        const result = await analyzeNewsImpact(simHeadline, activeAsset.name);
        setAiAnalysis(result);
        setIsAnalyzing(false);
    };

    const handleCustomSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const custom: any = { 
            symbol: searchTerm.toUpperCase(), 
            name: searchTerm.toUpperCase(), 
            type: 'Custom', 
            sector: 'General' 
        };
        setActiveAsset(custom);
    };

    return (
        <div className="flex h-full gap-4 p-4 bg-[#050508] text-white font-sans overflow-hidden">
            
            {/* LEFT: Search & Asset Selector */}
            <div className="w-80 flex flex-col bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden shadow-2xl shrink-0">
                <div className="p-4 border-b border-[#1e2235] bg-[#151720]">
                    <div className="flex items-center gap-2 mb-4">
                        <Search size={20} className="text-terminal-accent" />
                        <h2 className="font-black text-sm tracking-tight uppercase">Market Scanner</h2>
                    </div>
                    <form onSubmit={handleCustomSearch} className="relative group">
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search Symbol (e.g. AAPL, BTC)..." 
                            className="w-full bg-[#050508] border border-[#1e2235] rounded-lg py-3 pl-4 pr-10 text-xs text-white outline-none focus:border-terminal-accent transition-colors font-bold uppercase" 
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-[#1e2235] rounded hover:bg-terminal-accent hover:text-black transition-colors">
                            <ArrowUpRight size={14} />
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {searchResults.map((asset) => (
                        <div 
                            key={asset.symbol} 
                            onClick={() => setActiveAsset(asset)}
                            className={`p-3 rounded-lg cursor-pointer transition-all border border-transparent group ${activeAsset.symbol === asset.symbol ? 'bg-[#1e2235] border-terminal-accent/30 shadow-lg' : 'hover:bg-[#1a1e2e] hover:border-[#2a2f45]'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`font-black text-sm ${activeAsset.symbol === asset.symbol ? 'text-white' : 'text-gray-300'}`}>{asset.name}</span>
                                <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-gray-500 font-mono">{asset.type}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] text-terminal-accent font-bold">{asset.symbol}</span>
                                <span className="text-[10px] text-gray-600">{asset.sector}</span>
                            </div>
                        </div>
                    ))}
                    {searchResults.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-xs">
                            <Terminal size={32} className="mx-auto mb-2 opacity-20" />
                            <p>No presets found.</p>
                            <button onClick={handleCustomSearch} className="mt-2 text-terminal-accent hover:underline">
                                Search TradingView for "{searchTerm}"
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Professional Intelligence Dashboard */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                
                {/* 1. Dashboard Header */}
                <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col gap-4 shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black border border-[#1e2235] rounded-lg flex items-center justify-center text-xl font-black text-terminal-accent shadow-inner">
                                {activeAsset.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tight leading-none">{activeAsset.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-mono font-bold text-gray-400 bg-[#1e2235] px-2 py-0.5 rounded border border-[#333]">{activeAsset.symbol}</span>
                                    <span className="text-[10px] text-green-500 font-bold flex items-center gap-1"><Activity size={10} /> MARKET DATA ACTIVE</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* AI Quick Stats */}
                        {aiAnalysis ? (
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-500 uppercase font-bold">AI Sentiment</div>
                                    <div className={`text-lg font-black ${aiAnalysis.sentiment === 'POSITIVE' ? 'text-green-500' : aiAnalysis.sentiment === 'NEGATIVE' ? 'text-red-500' : 'text-yellow-500'}`}>
                                        {aiAnalysis.sentiment}
                                    </div>
                                </div>
                                <div className="text-right border-l border-[#1e2235] pl-4">
                                    <div className="text-[9px] text-gray-500 uppercase font-bold">Confidence</div>
                                    <div className="text-lg font-black text-terminal-accent">{aiAnalysis.confidenceScore}%</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-terminal-accent animate-pulse">
                                <BrainCircuit size={20} /> <span className="text-xs font-bold">ANALYZING...</span>
                            </div>
                        )}
                    </div>

                    {/* NEW: Multi-Timeframe Trend Matrix */}
                    <div className="grid grid-cols-7 gap-2 border-t border-[#1e2235] pt-4">
                        {trends.map((t) => (
                            <button
                                key={t.tf}
                                onClick={() => setActiveTimeframe(t)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                    activeTimeframe?.tf === t.tf 
                                    ? 'bg-[#1e2235] border-terminal-accent shadow-md scale-105' 
                                    : 'bg-[#0a0a0a] border-[#1e2235] hover:bg-[#151720] hover:border-gray-600'
                                }`}
                            >
                                <span className="text-[9px] font-bold text-gray-500 uppercase mb-1">{t.label}</span>
                                <div className={`flex items-center gap-1 font-black text-sm ${t.direction === 'UP' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.direction === 'UP' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                    {Math.abs(t.change)}%
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Main Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
                    
                    {/* LEFT COL: AI & Technicals */}
                    <div className="flex flex-col gap-4">
                        {/* AI Insight Card */}
                        <div className="bg-gradient-to-br from-[#151720] to-[#0f111a] border border-[#1e2235] rounded-xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Zap size={48} /></div>
                            <h3 className="text-sm font-black text-terminal-accent uppercase mb-3 flex items-center gap-2">
                                <BrainCircuit size={16} /> Gemini Macro Insight
                            </h3>
                            {isAnalyzing ? (
                                <div className="h-32 flex items-center justify-center">
                                    <RefreshCw size={24} className="text-terminal-muted animate-spin" />
                                </div>
                            ) : aiAnalysis ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Prediction</div>
                                        <div className="text-sm font-bold text-white leading-tight">{aiAnalysis.prediction}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Executive Summary</div>
                                        <p className="text-xs text-gray-300 leading-relaxed">{aiAnalysis.summary}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                        <span className="text-[10px] text-gray-500">DXY Impact</span>
                                        <span className={`text-xs font-bold ${aiAnalysis.dxyImpact === 'BULLISH' ? 'text-green-500' : 'text-red-500'}`}>{aiAnalysis.dxyImpact}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-500 text-center py-10">Select an asset to analyze</div>
                            )}
                        </div>

                        {/* Technical Gauge */}
                        <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden flex-1 min-h-[300px] flex flex-col">
                            <div className="p-3 border-b border-[#1e2235] bg-[#1a1e2e] flex items-center gap-2">
                                <BarChart2 size={14} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-white uppercase">Technical Strength</span>
                            </div>
                            <div className="flex-1 bg-[#0f111a] p-2">
                                {/* Use interval based on selected trend matrix if possible, else default */}
                                <TVTechnicalAnalysisWidget symbol={activeAsset.symbol} interval={activeTimeframe?.interval || '1m'} />
                            </div>
                        </div>
                    </div>

                    {/* CENTER COL: Dynamic Chart & Timeline */}
                    <div className="lg:col-span-2 bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden flex flex-col relative">
                        <div className="p-3 border-b border-[#1e2235] bg-[#1a1e2e] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Activity size={16} className="text-yellow-500" />
                                <span className="text-xs font-bold text-white uppercase">
                                    {activeTimeframe ? `${activeTimeframe.label} Chart & Data` : 'Market Chart'}
                                </span>
                            </div>
                            <span className="text-[10px] text-gray-500">Source: TradingView</span>
                        </div>
                        <div className="flex-1 relative bg-[#0f111a] min-h-[500px]">
                            {/* DYNAMIC CHART: Replaces Timeline when a timeframe is selected */}
                            {activeTimeframe ? (
                                <TVAdvancedChartWidget symbol={activeAsset.symbol} interval={activeTimeframe.interval} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-2">
                                    <Activity size={32} className="opacity-20" />
                                    <span className="text-xs">Select a timeframe from the matrix above to load chart.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Row: Profile & Financials */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64 shrink-0">
                    <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden flex flex-col">
                        <div className="p-3 border-b border-[#1e2235] bg-[#1a1e2e] flex items-center gap-2">
                            <Globe size={14} className="text-purple-500" />
                            <span className="text-[10px] font-bold text-white uppercase">Corporate Profile</span>
                        </div>
                        <div className="flex-1 bg-[#0f111a]">
                            <TVSymbolInfoWidget symbol={activeAsset.symbol} />
                        </div>
                    </div>
                    
                    <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden flex flex-col">
                        <div className="p-3 border-b border-[#1e2235] bg-[#1a1e2e] flex items-center gap-2">
                            <Coins size={14} className="text-green-500" />
                            <span className="text-[10px] font-bold text-white uppercase">Financial Data</span>
                        </div>
                        <div className="flex-1 bg-[#0f111a]">
                            <TVFinancialsWidget symbol={activeAsset.symbol} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- TV WIDGET WRAPPERS ---

const TVAdvancedChartWidget: React.FC<{ symbol: string, interval: string }> = ({ symbol, interval }) => {
    const containerId = useRef(`tv_chart_${Math.random().toString(36).substr(2, 9)}`);
    
    // MEMOIZE CONFIG to prevent constant re-renders/script injections
    const config = useMemo(() => ({
        "autosize": true,
        "symbol": symbol,
        "interval": interval,
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": containerId.current,
        "studies": ["STD;RSI", "STD;MACD"]
    }), [symbol, interval]);

    return (
        <div className="w-full h-full relative">
             <TVWidgetWrapper 
                id={containerId.current}
                src="https://s3.tradingview.com/tv.js"
                config={config}
                isLibrary={true} // Indicates we need to use new TradingView.widget()
            />
        </div>
    );
};

const TVTechnicalAnalysisWidget: React.FC<{ symbol: string, interval: string }> = ({ symbol, interval }) => {
    const config = useMemo(() => ({
        "interval": interval,
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": symbol,
        "showIntervalTabs": false,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
    }), [symbol, interval]);

    return <TVWidgetWrapper src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js" config={config} />;
};

const TVSymbolInfoWidget: React.FC<{ symbol: string }> = ({ symbol }) => {
    const config = useMemo(() => ({
        "width": "100%",
        "height": "100%",
        "isTransparent": true,
        "colorTheme": "dark",
        "symbol": symbol,
        "locale": "en"
    }), [symbol]);

    return <TVWidgetWrapper src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js" config={config} />;
};

const TVFinancialsWidget: React.FC<{ symbol: string }> = ({ symbol }) => {
    const config = useMemo(() => ({
        "isTransparent": true,
        "largeChartUrl": "",
        "displayMode": "compact",
        "width": "100%",
        "height": "100%",
        "colorTheme": "dark",
        "symbol": symbol,
        "locale": "en"
    }), [symbol]);

    return <TVWidgetWrapper src="https://s3.tradingview.com/external-embedding/embed-widget-financials.js" config={config} />;
};

const TVTimelineWidget: React.FC<{ symbol: string }> = ({ symbol }) => {
    return <TVWidgetWrapper src="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
        config={{
            "feedMode": "symbol",
            "symbol": symbol,
            "colorTheme": "dark",
            "isTransparent": true,
            "displayMode": "regular",
            "width": "100%",
            "height": "100%",
            "locale": "en"
        }}
    />;
};

// Reusable Helper for Scripts
const TVWidgetWrapper: React.FC<{ src: string, config: any, id?: string, isLibrary?: boolean }> = ({ src, config, id, isLibrary }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let mounted = true;
        let checkInterval: any = null;

        // Logic for Advanced Chart (Library)
        if (isLibrary && id) {
            const initWidget = () => {
                if (!mounted) return;
                // Ensure container exists and global variable is present
                if (document.getElementById(id) && window.TradingView) {
                     new window.TradingView.widget(config);
                }
            };

            if (window.TradingView) {
                initWidget();
            } else {
                // Singleton script check to avoid duplicates
                if (!document.getElementById('tv-widget-lib')) {
                    const script = document.createElement('script');
                    script.id = 'tv-widget-lib';
                    script.src = src;
                    script.async = true;
                    script.onload = () => {
                        if (window.TradingView) initWidget();
                    };
                    document.head.appendChild(script);
                }
                
                // Polling fallback in case script was already loading or race condition
                checkInterval = setInterval(() => {
                    if (window.TradingView) {
                        clearInterval(checkInterval);
                        initWidget();
                    }
                }, 100);
            }
        } else {
            // Logic for Embeds (Simple Widgets)
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.type = 'text/javascript';
                script.innerHTML = JSON.stringify(config);
                containerRef.current.appendChild(script);
            }
        }

        return () => {
            mounted = false;
            if (checkInterval) clearInterval(checkInterval);
        };
    }, [config, src, id, isLibrary]);

    if (isLibrary && id) {
        return <div id={id} className="w-full h-full" />;
    }

    return <div className="tradingview-widget-container w-full h-full" ref={containerRef}><div className="tradingview-widget-container__widget"></div></div>;
};
