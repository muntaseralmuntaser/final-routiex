
// ... (imports remain same)
import React, { useState, useEffect, useRef } from 'react';
import { Rabbit, TrendingUp, Activity, Settings, Layers, BarChart2, DollarSign, RefreshCw, ShieldCheck, ChevronDown, Check, Server, Link2, Lock, Globe, Power, Wifi, Cpu, AlertCircle, PlayCircle, ArrowUpRight, ArrowDownLeft, X, Share2, FileText, Clock, Save } from 'lucide-react';

declare global {
    interface Window {
        TradingView: any;
    }
}

type ConnectionType = 'DEMO' | 'MT4' | 'MT5' | 'BINANCE' | 'FIX_API';
type OrderStatus = 'PENDING' | 'FILLED' | 'REJECTED' | 'CLOSED';

interface Position {
    id: number;
    symbol: string;
    side: 'BUY' | 'SELL';
    size: number;
    entry: number;
    current: number;
    pnl: number;
    brokerId: string;
    openTime: string;
}

interface HistoryTrade extends Position {
    closeTime: string;
    closePrice: number;
}

export const VirtualTradingPlatform: React.FC = () => {
    const [isSetupOpen, setIsSetupOpen] = useState(true);
    const [connectionType, setConnectionType] = useState<ConnectionType>('DEMO');
    const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'>('DISCONNECTED');
    const [brokerId, setBrokerId] = useState('');
    
    // Connection Inputs
    const [connField1, setConnField1] = useState('');
    const [connField2, setConnField2] = useState('');
    const [connField3, setConnField3] = useState('');

    // Account State
    const [balance, setBalance] = useState(100000);
    const [equity, setEquity] = useState(100000);
    const [leverage, setLeverage] = useState(100);
    const [latency, setLatency] = useState(12);

    // Trading State
    const [symbol, setSymbol] = useState('BTC/USD');
    const [price, setPrice] = useState(67450.20);
    const [positions, setPositions] = useState<Position[]>([]);
    const [history, setHistory] = useState<HistoryTrade[]>([]);
    const [orderSize, setOrderSize] = useState(1.0);
    const [processingOrder, setProcessingOrder] = useState(false);
    
    // UI State
    const [activeBottomTab, setActiveBottomTab] = useState<'positions' | 'orders' | 'history' | 'journal'>('positions');
    const [shareModalOpen, setShareModalOpen] = useState<Position | HistoryTrade | null>(null);

    // Simulate price movement & Latency fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            const move = (Math.random() - 0.5) * 25;
            setPrice(p => p + move);
            setLatency(l => Math.max(5, Math.min(150, l + (Math.random() - 0.5) * 10)));
            
            // Update PnL
            setPositions(prev => prev.map(pos => {
                const diff = pos.side === 'BUY' ? (price + move) - pos.entry : pos.entry - (price + move);
                const pnl = diff * pos.size * (symbol.includes('BTC') ? 1 : 100); // Rough scaling
                return { ...pos, current: price + move, pnl };
            }));

            // Update Equity
            const totalPnL = positions.reduce((acc, pos) => acc + pos.pnl, 0);
            setEquity(balance + totalPnL);

        }, 800);
        return () => clearInterval(interval);
    }, [positions, balance, symbol]);

    // Hook to load TV Chart
    useEffect(() => {
        let checkInterval: any = null;

        const initChart = () => {
            if (window.TradingView && document.getElementById('tradingview_professional')) {
                // Ensure container is clear
                const container = document.getElementById('tradingview_professional');
                if (container) container.innerHTML = '';

                new window.TradingView.widget({
                    "autosize": true,
                    "symbol": "BINANCE:BTCUSDT",
                    "interval": "1",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_professional",
                    "hide_side_toolbar": false,
                    "details": false,
                    "toolbar_bg": "#0f111a",
                    "studies": ["STD;RSI", "STD;MACD"]
                });
            }
        };

        if (window.TradingView) {
            initChart();
        } else {
            // Check for existing script injected by other components to avoid duplication
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

            // Robust polling in case onload fired elsewhere or hasn't fired yet
            checkInterval = setInterval(() => {
                if (window.TradingView) {
                    clearInterval(checkInterval);
                    initChart();
                }
            }, 100);
        }

        return () => {
            if (checkInterval) clearInterval(checkInterval);
        };
    }, []);

    const handleConnect = () => {
        if (connectionType !== 'DEMO' && (!connField1 || !connField2)) {
            alert("Please enter API credentials.");
            return;
        }

        setConnectionStatus('CONNECTING');
        setTimeout(() => {
            setConnectionStatus('CONNECTED');
            setIsSetupOpen(false);
            if(connectionType === 'MT4' || connectionType === 'MT5') {
                setBalance(24500.00); // Simulate fetching real balance
                setBrokerId(`${connectionType}-${connField1}`);
            } else if (connectionType === 'BINANCE') {
                setBalance(12.45); // BTC equivalent or USDT
                setBrokerId(`BINANCE-API`);
            } else {
                setBrokerId('DEMO-User-1');
            }
        }, 2500);
    };

    const executeTrade = (side: 'BUY' | 'SELL') => {
        if(connectionStatus !== 'CONNECTED') return;
        setProcessingOrder(true);
        
        setTimeout(() => {
            const entryPrice = price;
            const newPos: Position = {
                id: Date.now(),
                symbol,
                side,
                size: orderSize,
                entry: entryPrice,
                current: entryPrice,
                pnl: 0,
                brokerId: connectionType === 'DEMO' ? 'ROUTIEX-SIM' : `${connectionType}-BRIDGE`,
                openTime: new Date().toLocaleTimeString()
            };
            setPositions([newPos, ...positions]);
            setProcessingOrder(false);
            // Auto switch to positions tab
            setActiveBottomTab('positions');
        }, connectionType === 'DEMO' ? 200 : 800); 
    };

    const closePosition = (id: number) => {
        const pos = positions.find(p => p.id === id);
        if (pos) {
            const closedTrade: HistoryTrade = {
                ...pos,
                closeTime: new Date().toLocaleTimeString(),
                closePrice: pos.current
            };
            setHistory([closedTrade, ...history]);
            setBalance(prev => prev + pos.pnl);
            setPositions(positions.filter(p => p.id !== id));
        }
    };

    // Helper to clear inputs when switching type
    const switchType = (type: ConnectionType) => {
        setConnectionType(type);
        setConnField1('');
        setConnField2('');
        setConnField3('');
    };

    return (
        <div className="h-full flex flex-col bg-[#050508] text-white overflow-hidden relative font-sans">
            
            {/* --- BROKER CONNECTION BRIDGE --- */}
            {isSetupOpen && (
                <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <div className="bg-[#0f111a] border border-[#1e2235] rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
                        {/* ... Left Panel (same as before) ... */}
                        <div className="w-full md:w-1/3 bg-[#111] p-8 flex flex-col justify-between border-r border-[#1e2235] relative overflow-hidden">
                            <div className="absolute inset-0 bg-terminal-accent/5"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-terminal-accent rounded-xl flex items-center justify-center text-black mb-6">
                                    <Server size={24} />
                                </div>
                                <h1 className="text-2xl font-black text-white tracking-tight mb-2">Routiex Bridge™</h1>
                                <p className="text-sm text-gray-400">Low-latency institutional gateway for MT4, MT5, and Binance API.</p>
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <ShieldCheck size={16} className="text-green-500" /> End-to-End Encrypted
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <Activity size={16} className="text-blue-500" /> Sub-millisecond Execution
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                    <Globe size={16} className="text-purple-500" /> Global Server Network
                                </div>
                            </div>
                        </div>

                        {/* Right Panel: Form */}
                        <div className="flex-1 p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Link2 size={20} className="text-terminal-accent" /> Connect Trading Account
                            </h2>

                            {/* Connection Type Tabs */}
                            <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar pb-2">
                                {[
                                    { id: 'DEMO', label: 'Routiex Cloud' },
                                    { id: 'MT4', label: 'MetaTrader 4' },
                                    { id: 'MT5', label: 'MetaTrader 5' },
                                    { id: 'BINANCE', label: 'Binance API' },
                                    { id: 'FIX_API', label: 'FIX Protocol' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => switchType(type.id as ConnectionType)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
                                            connectionType === type.id
                                            ? 'bg-white text-black border-white'
                                            : 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:border-gray-500'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            {/* Credentials Form */}
                            <div className="space-y-4">
                                {connectionType === 'DEMO' ? (
                                     <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                         <p className="text-sm text-green-400 font-bold mb-2">Instant Demo Access</p>
                                         <p className="text-xs text-gray-400">Connect to Routiex's high-speed simulation server. Perfect for practicing strategies risk-free.</p>
                                         <div className="mt-4 grid grid-cols-2 gap-4">
                                             <div>
                                                 <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Starting Balance</label>
                                                 <select className="w-full bg-[#050508] border border-[#1e2235] text-white text-sm rounded p-2 outline-none" value={balance} onChange={(e) => setBalance(Number(e.target.value))}>
                                                     <option value="10000">$10,000</option>
                                                     <option value="50000">$50,000</option>
                                                     <option value="100000">$100,000</option>
                                                 </select>
                                             </div>
                                             <div>
                                                 <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Leverage</label>
                                                 <select className="w-full bg-[#050508] border border-[#1e2235] text-white text-sm rounded p-2 outline-none" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))}>
                                                     <option value="50">1:50</option>
                                                     <option value="100">1:100</option>
                                                     <option value="500">1:500</option>
                                                 </select>
                                             </div>
                                         </div>
                                     </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                                                {connectionType === 'BINANCE' ? 'API Key (Read/Trade)' : 
                                                 connectionType === 'FIX_API' ? 'SenderCompID' : 
                                                 `${connectionType} Login ID`}
                                            </label>
                                            <input 
                                                type="text" 
                                                value={connField1}
                                                onChange={(e) => setConnField1(e.target.value)}
                                                className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-3 text-white outline-none focus:border-terminal-accent" 
                                                placeholder={connectionType === 'BINANCE' ? 'vmPU...' : 'Account Number'} 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                                                {connectionType === 'BINANCE' ? 'API Secret' : 
                                                 connectionType === 'FIX_API' ? 'TargetCompID' : 
                                                 'Password'}
                                            </label>
                                            <input 
                                                type="password" 
                                                value={connField2}
                                                onChange={(e) => setConnField2(e.target.value)}
                                                className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-3 text-white outline-none focus:border-terminal-accent" 
                                                placeholder="••••••••••••••" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                                                {connectionType === 'FIX_API' ? 'Socket Host:Port' : 'Server Address / Host'}
                                            </label>
                                            <input 
                                                type="text" 
                                                value={connField3}
                                                onChange={(e) => setConnField3(e.target.value)}
                                                className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-3 text-white outline-none focus:border-terminal-accent" 
                                                placeholder={connectionType === 'BINANCE' ? 'api.binance.com' : 'Broker-Server-Live'} 
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="pt-4">
                                    <button 
                                        onClick={handleConnect}
                                        disabled={connectionStatus === 'CONNECTING'}
                                        className="w-full py-4 bg-terminal-accent text-black font-black text-lg rounded-xl hover:bg-white transition-all shadow-lg shadow-terminal-accent/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {connectionStatus === 'CONNECTING' ? (
                                            <>
                                                <RefreshCw size={20} className="animate-spin" /> ESTABLISHING HANDSHAKE...
                                            </>
                                        ) : (
                                            <>
                                                <Power size={20} /> CONNECT {connectionType}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SHARE MODAL --- */}
            {shareModalOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white text-black rounded-xl p-0 overflow-hidden shadow-2xl max-w-md w-full relative">
                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={() => setShareModalOpen(null)} className="bg-black/10 hover:bg-black/20 p-2 rounded-full"><X size={20}/></button>
                        </div>
                        
                        {/* Receipt Design */}
                        <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-dashed border-gray-300">
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center gap-2 text-black">
                                    <Rabbit size={32} strokeWidth={2} />
                                    <span className="font-black text-2xl tracking-tight">ROUTIEX</span>
                                </div>
                            </div>
                            <div className="text-center mb-6">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Official Trade Receipt</div>
                                <div className="text-3xl font-black">{shareModalOpen.symbol}</div>
                                <div className={`text-lg font-bold ${shareModalOpen.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>{shareModalOpen.side} {shareModalOpen.size} LOTS</div>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Entry Price</span>
                                    <span className="font-mono font-bold">{shareModalOpen.entry.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-gray-500">Current/Close</span>
                                    <span className="font-mono font-bold">{(shareModalOpen as any).closePrice?.toFixed(2) || shareModalOpen.current.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-lg">Profit / Loss</span>
                                    <span className={`font-black text-2xl font-mono ${shareModalOpen.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {shareModalOpen.pnl >= 0 ? '+' : ''}{shareModalOpen.pnl.toFixed(2)} USD
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 flex gap-2">
                            <button className="flex-1 bg-[#1DA1F2] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:brightness-110">
                                <Share2 size={18} /> Share to X
                            </button>
                            <button className="flex-1 bg-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800">
                                <ArrowDownLeft size={18} /> Save Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER: STATUS BAR --- */}
            <header className="h-14 bg-[#0f111a] border-b border-[#1e2235] flex items-center justify-between px-4 shrink-0 z-40 relative shadow-md">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-terminal-accent">
                        <Rabbit size={24} strokeWidth={2.5} />
                        <div className="flex flex-col">
                            <span className="font-black tracking-wide text-sm leading-none">ROUTIEX</span>
                            <span className="text-[9px] text-gray-500 font-bold tracking-widest">PRO TERMINAL</span>
                        </div>
                    </div>
                    
                    <div className="h-8 w-[1px] bg-[#1e2235]"></div>

                    {/* Connection Status */}
                    <div className="flex items-center gap-3 bg-[#050508] px-3 py-1.5 rounded border border-[#1e2235]">
                        <div className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase leading-none">Status</div>
                            <div className={`text-xs font-bold leading-none ${connectionStatus === 'CONNECTED' ? 'text-green-500' : 'text-red-500'}`}>
                                {connectionStatus === 'CONNECTED' ? `LIVE: ${connectionType}` : 'OFFLINE'}
                            </div>
                        </div>
                    </div>

                    {connectionStatus === 'CONNECTED' && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                            <Wifi size={12} className={latency < 50 ? 'text-green-500' : latency < 100 ? 'text-yellow-500' : 'text-red-500'} />
                            <span>{latency}ms</span>
                            <span className="text-gray-700">|</span>
                            <Cpu size={12} className="text-blue-500" />
                            <span>API OK</span>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Balance</div>
                        <div className="text-sm font-black text-white font-mono">${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-500 uppercase">Equity</div>
                        <div className={`text-sm font-black font-mono ${equity >= balance ? 'text-green-500' : 'text-red-500'}`}>
                            ${equity.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                    </div>
                    <div className="bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20 text-center">
                        <div className="text-[9px] font-bold text-yellow-600 uppercase">Leverage</div>
                        <span className="text-xs font-bold text-yellow-500">1:{leverage}</span>
                    </div>
                    <button onClick={() => setIsSetupOpen(true)} className="p-2 hover:bg-[#1e2235] rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* --- LEFT: MARKET WATCH --- */}
                <div className="w-72 bg-[#0f111a] border-r border-[#1e2235] flex flex-col shrink-0 z-30">
                    <div className="p-2 bg-[#1e2235] text-[10px] font-bold text-gray-400 uppercase flex justify-between">
                        <span>Active Symbols</span>
                        <Settings size={12} />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {['BTC/USD', 'ETH/USD', 'XAU/USD', 'EUR/USD', 'GBP/JPY', 'US30', 'NAS100', 'NVDA', 'TSLA'].map(sym => (
                            <div key={sym} onClick={() => setSymbol(sym)} className={`flex justify-between items-center p-3 border-b border-[#1e2235] cursor-pointer hover:bg-[#1e2235] transition-colors group ${symbol === sym ? 'bg-[#1a1e2e] border-l-4 border-l-terminal-accent' : ''}`}>
                                <div>
                                    <div className={`font-bold text-sm ${symbol === sym ? 'text-white' : 'text-gray-300'}`}>{sym}</div>
                                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                        {symbol === sym && <Activity size={10} className="text-terminal-accent" />}
                                        Market Open
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono text-sm text-green-500">{(Math.random() * 1000 + 500).toFixed(2)}</div>
                                    <div className="text-[9px] text-gray-400 group-hover:text-white">+{(Math.random()).toFixed(2)}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Depth Chart Mock */}
                    <div className="h-64 border-t border-[#1e2235] flex flex-col">
                        <div className="p-2 bg-[#1e2235] text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2">
                            <Layers size={12} /> Order Book (L2)
                        </div>
                        <div className="flex-1 bg-[#000] relative overflow-hidden bookmap-gradient flex flex-col-reverse p-1 gap-[1px]">
                             {Array.from({length: 24}).map((_, i) => (
                                 <div key={i} className="h-2 w-full flex items-center relative group">
                                     <div className="h-[1px] bg-white/5 w-full group-hover:bg-white/10"></div>
                                     {Math.random() > 0.7 && (
                                         <div className="absolute right-0 h-1.5 rounded-l-sm bg-red-500/50" style={{width: `${Math.random()*60}%`}}></div>
                                     )}
                                     {Math.random() > 0.7 && (
                                         <div className="absolute left-0 h-1.5 rounded-r-sm bg-green-500/50" style={{width: `${Math.random()*60}%`}}></div>
                                     )}
                                     {Math.random() > 0.9 && <div className="w-1.5 h-1.5 rounded-full bg-white absolute animate-ping" style={{left: `${Math.random()*90 + 5}%`}}></div>}
                                 </div>
                             ))}
                             <div className="absolute top-2 right-2 text-[10px] font-bold text-white/30">Ask Vol</div>
                             <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white/30">Bid Vol</div>
                        </div>
                    </div>
                </div>

                {/* --- CENTER: CHART --- */}
                <div className="flex-1 bg-[#000] relative flex flex-col">
                    {/* Chart Header */}
                    <div className="h-10 bg-[#0f111a] border-b border-[#1e2235] flex items-center px-4 gap-4">
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                             <div className="text-lg font-black text-white">{symbol}</div>
                         </div>
                         <div className="h-4 w-[1px] bg-[#333]"></div>
                         <div className="flex gap-1">
                            {['1M', '5M', '15M', '1H', '4H', 'D'].map(tf => (
                                <button key={tf} className="px-2 py-0.5 text-xs font-bold text-gray-400 hover:text-white hover:bg-[#1e2235] rounded transition-colors">{tf}</button>
                            ))}
                         </div>
                         <div className="flex-1"></div>
                         <div className="text-xs text-green-500 font-mono font-bold flex items-center gap-2">
                             <TrendingUp size={14} /> AI SIGNAL: STRONG BUY
                         </div>
                    </div>

                    {/* Chart Container */}
                    <div className="flex-1 relative overflow-hidden group">
                         <div className="tv-mask pointer-events-none"></div> 
                         
                         {/* Live Price Overlay */}
                         <div className="absolute top-4 left-4 z-20 bg-[#0f111a]/90 backdrop-blur p-3 rounded-lg border border-[#1e2235] shadow-lg flex items-center gap-4">
                             <div>
                                 <div className="text-[10px] text-gray-500 uppercase font-bold">Mark Price</div>
                                 <div className={`text-xl font-mono font-black ${processingOrder ? 'text-gray-500' : 'text-white'}`}>
                                     {price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                 </div>
                             </div>
                             <div className="text-right">
                                 <div className="text-[10px] text-gray-500 uppercase font-bold">24h Change</div>
                                 <div className="text-sm font-bold text-green-500">+2.45%</div>
                             </div>
                         </div>

                         <div className="tradingview-widget-container w-full h-full">
                             <div id="tradingview_professional" className="w-full h-full"></div>
                         </div>
                         
                         {processingOrder && (
                             <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-[1px]">
                                 <div className="bg-[#0f111a] border border-terminal-accent px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(41,98,255,0.4)]">
                                     <RefreshCw size={20} className="text-terminal-accent animate-spin" />
                                     <span className="text-sm font-bold text-white">ROUTING ORDER TO {connectionType}...</span>
                                 </div>
                             </div>
                         )}
                    </div>
                </div>

                {/* --- RIGHT: ORDER TICKET --- */}
                <div className="w-80 bg-[#0f111a] border-l border-[#1e2235] flex flex-col shrink-0 z-30">
                    <div className="p-4 border-b border-[#1e2235] flex justify-between items-center bg-[#151720]">
                        <div>
                            <h3 className="font-black text-white text-lg leading-none">ORDER ENTRY</h3>
                            <p className="text-[10px] text-green-500 font-bold mt-0.5">GATEWAY: {connectionStatus === 'CONNECTED' ? 'ACTIVE' : 'OFFLINE'}</p>
                        </div>
                        <div className="w-8 h-8 rounded bg-black border border-[#1e2235] flex items-center justify-center text-terminal-accent">
                            <Activity size={16} />
                        </div>
                    </div>

                    <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                        {/* Order Type */}
                        <div className="grid grid-cols-2 gap-1 bg-[#050508] p-1 rounded-lg border border-[#1e2235]">
                            <button className="py-2 text-xs font-black bg-[#1e2235] text-white rounded shadow-sm border border-gray-700">MARKET</button>
                            <button className="py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">LIMIT</button>
                        </div>

                        {/* Size Input */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Size (Lots)</label>
                                <span className="text-[10px] text-gray-500">Max: 50.0</span>
                            </div>
                            <div className="flex items-center bg-[#050508] border border-[#1e2235] rounded-lg px-3 py-3 focus-within:border-terminal-accent transition-colors">
                                <input 
                                    type="number" 
                                    value={orderSize} 
                                    onChange={e => setOrderSize(Number(e.target.value))}
                                    className="bg-transparent text-white font-mono font-bold text-lg outline-none flex-1" 
                                />
                                <span className="text-xs text-gray-500 font-bold px-2 border-l border-[#333]">LOTS</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                {[0.01, 0.1, 0.5, 1.0].map(s => (
                                    <button key={s} onClick={() => setOrderSize(s)} className="flex-1 py-1 bg-[#1e2235] rounded text-[10px] font-bold text-gray-400 hover:text-white hover:bg-[#2a2f45]">{s}</button>
                                ))}
                            </div>
                        </div>

                        {/* TP / SL */}
                        <div className="space-y-3 pt-2 border-t border-[#1e2235]">
                             <div className="flex items-center gap-2">
                                <div className="w-full">
                                    <label className="text-[10px] font-bold text-red-500 uppercase block mb-1">Stop Loss</label>
                                    <input placeholder="Price" className="w-full bg-[#050508] border border-[#1e2235] rounded px-3 py-2 text-sm text-white outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div className="w-full">
                                    <label className="text-[10px] font-bold text-green-500 uppercase block mb-1">Take Profit</label>
                                    <input placeholder="Price" className="w-full bg-[#050508] border border-[#1e2235] rounded px-3 py-2 text-sm text-white outline-none focus:border-green-500 transition-colors" />
                                </div>
                             </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-2 space-y-3">
                            <button 
                                onClick={() => executeTrade('BUY')}
                                disabled={connectionStatus !== 'CONNECTED'}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-lg shadow-[0_4px_20px_rgba(22,163,74,0.3)] flex flex-col items-center transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                <span className="text-xl tracking-wide flex items-center gap-2">BUY <ArrowUpRight size={20} strokeWidth={3} /></span>
                                <span className="text-[10px] opacity-80 font-mono tracking-wider">ASK: {(price + 0.5).toFixed(2)}</span>
                            </button>
                            
                            <button 
                                onClick={() => executeTrade('SELL')}
                                disabled={connectionStatus !== 'CONNECTED'}
                                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-lg shadow-[0_4px_20px_rgba(220,38,38,0.3)] flex flex-col items-center transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                <span className="text-xl tracking-wide flex items-center gap-2">SELL <ArrowDownLeft size={20} strokeWidth={3} /></span>
                                <span className="text-[10px] opacity-80 font-mono tracking-wider">BID: {(price - 0.5).toFixed(2)}</span>
                            </button>
                        </div>

                        {/* Info Footer */}
                        <div className="border-t border-[#1e2235] pt-4">
                             <div className="flex justify-between text-xs text-gray-400 mb-1">
                                 <span>Commission:</span>
                                 <span className="font-mono">$0.00</span>
                             </div>
                             <div className="flex justify-between text-xs text-gray-400">
                                 <span>Est. Margin:</span>
                                 <span className="text-yellow-500 font-mono font-bold">$250.00</span>
                             </div>
                             {connectionStatus !== 'CONNECTED' && (
                                 <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-[10px] text-red-500 font-bold">
                                     <AlertCircle size={12} /> DISCONNECTED: Please Connect API
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: POSITIONS & HISTORY PANEL --- */}
            <div className="h-64 bg-[#0f111a] border-t border-[#1e2235] flex flex-col shrink-0 z-30">
                <div className="h-10 bg-[#151720] border-b border-[#1e2235] flex items-center px-4 gap-6 text-xs font-bold text-gray-400">
                    <button onClick={() => setActiveBottomTab('positions')} className={`h-full border-b-2 px-2 transition-colors ${activeBottomTab === 'positions' ? 'border-terminal-accent text-white' : 'border-transparent hover:text-white'}`}>Positions ({positions.length})</button>
                    <button onClick={() => setActiveBottomTab('history')} className={`h-full border-b-2 px-2 transition-colors ${activeBottomTab === 'history' ? 'border-terminal-accent text-white' : 'border-transparent hover:text-white'}`}>History ({history.length})</button>
                    <button onClick={() => setActiveBottomTab('journal')} className={`h-full border-b-2 px-2 transition-colors ${activeBottomTab === 'journal' ? 'border-terminal-accent text-white' : 'border-transparent hover:text-white'}`}>Journal</button>
                    <div className="flex-1"></div>
                    <div className="text-[10px] font-mono text-gray-500">Server Time: {new Date().toISOString().split('T')[1].split('.')[0]} UTC</div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050508]">
                    {/* POSITIONS TABLE */}
                    {activeBottomTab === 'positions' && (
                        <table className="w-full text-left border-collapse">
                            <thead className="text-[10px] uppercase text-gray-500 bg-[#0f111a] sticky top-0 z-10 font-bold">
                                <tr>
                                    <th className="p-3 pl-6">Symbol</th>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Vol</th>
                                    <th className="p-3 text-right">Entry</th>
                                    <th className="p-3 text-right">Current</th>
                                    <th className="p-3 text-right">Profit</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-mono text-white">
                                {positions.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                <Layers size={32} />
                                                <span className="text-sm font-sans">No open positions</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {positions.map(pos => (
                                    <tr key={pos.id} className="border-b border-[#1e2235] hover:bg-[#1e2235] group transition-colors">
                                        <td className="p-3 pl-6 font-bold flex items-center gap-2">
                                            <div className={`w-1 h-8 rounded-full ${pos.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {pos.symbol}
                                        </td>
                                        <td className="p-3 text-gray-500">{pos.openTime}</td>
                                        <td className={`p-3 font-bold ${pos.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{pos.side}</td>
                                        <td className="p-3">{pos.size.toFixed(2)}</td>
                                        <td className="p-3 text-right text-gray-400">{pos.entry.toFixed(2)}</td>
                                        <td className="p-3 text-right">{pos.current.toFixed(2)}</td>
                                        <td className={`p-3 text-right font-bold ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setShareModalOpen(pos)} className="p-1.5 rounded bg-blue-900/20 text-blue-500 hover:bg-blue-900 hover:text-white" title="Share Trade">
                                                    <Share2 size={14} />
                                                </button>
                                                <button onClick={() => closePosition(pos.id)} className="p-1.5 rounded bg-red-900/20 text-red-500 hover:bg-red-900 hover:text-white font-bold text-[10px] px-3" title="Close Position">
                                                    CLOSE
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* HISTORY TABLE */}
                    {activeBottomTab === 'history' && (
                        <table className="w-full text-left border-collapse">
                            <thead className="text-[10px] uppercase text-gray-500 bg-[#0f111a] sticky top-0 z-10 font-bold">
                                <tr>
                                    <th className="p-3 pl-6">Symbol</th>
                                    <th className="p-3">Open Time</th>
                                    <th className="p-3">Close Time</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Vol</th>
                                    <th className="p-3 text-right">Entry</th>
                                    <th className="p-3 text-right">Close Price</th>
                                    <th className="p-3 text-right">Profit</th>
                                    <th className="p-3 text-center">Share</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs font-mono text-white">
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-2 opacity-30">
                                                <Clock size={32} />
                                                <span className="text-sm font-sans">No trade history</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {history.map(hist => (
                                    <tr key={hist.id} className="border-b border-[#1e2235] hover:bg-[#1e2235] transition-colors">
                                        <td className="p-3 pl-6 font-bold flex items-center gap-2">
                                            <div className={`w-1 h-8 rounded-full ${hist.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {hist.symbol}
                                        </td>
                                        <td className="p-3 text-gray-500">{hist.openTime}</td>
                                        <td className="p-3 text-gray-500">{hist.closeTime}</td>
                                        <td className={`p-3 font-bold ${hist.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{hist.side}</td>
                                        <td className="p-3">{hist.size.toFixed(2)}</td>
                                        <td className="p-3 text-right text-gray-400">{hist.entry.toFixed(2)}</td>
                                        <td className="p-3 text-right text-gray-400">{hist.closePrice.toFixed(2)}</td>
                                        <td className={`p-3 text-right font-bold ${hist.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {hist.pnl >= 0 ? '+' : ''}{hist.pnl.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => setShareModalOpen(hist)} className="text-gray-500 hover:text-white">
                                                <Share2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* JOURNAL TAB */}
                    {activeBottomTab === 'journal' && (
                        <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                            <FileText size={48} className="text-terminal-muted opacity-20 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Trading Journal</h3>
                            <p className="text-sm text-gray-500 max-w-md mb-6">Track your psychological state, strategy adherence, and mistakes for every trade.</p>
                            <button className="bg-[#1e2235] hover:bg-[#2a2f45] text-white px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
                                <Save size={14} /> Create New Entry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
