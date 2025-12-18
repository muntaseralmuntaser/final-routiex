
import React, { useState, useEffect } from 'react';
import { TradingChart } from './TradingChart';
import { 
    Maximize2, Settings, X, Activity, 
    Shield, ArrowUpRight, ArrowDownLeft, Layers, Menu, Search, Filter, CheckSquare
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- COMPONENTS ---

const WindowHeader: React.FC<{ title: string; color?: string }> = ({ title, color = "bg-terminal-panel" }) => (
    <div className={`h-6 ${color} flex items-center justify-between px-2 border-b border-terminal-border select-none`}>
        <div className="flex items-center gap-2">
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <span className="text-[10px] font-bold text-terminal-muted uppercase tracking-wide">{title}</span>
        </div>
        <div className="flex gap-2 text-terminal-muted">
            <Settings size={10} className="hover:text-white cursor-pointer" />
            <Maximize2 size={10} className="hover:text-white cursor-pointer" />
            <X size={10} className="hover:text-red-500 cursor-pointer" />
        </div>
    </div>
);

const Sparkline: React.FC<{ data: any[], color: string }> = ({ data, color }) => (
    <div className="w-12 h-6">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <Area type="monotone" dataKey="price" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={1} />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

// --- MAIN DASHBOARD ---

export const TerminalDashboard: React.FC = () => {
    const [activeTicker, setActiveTicker] = useState('DDOG US');
    const [ticketPrice, setTicketPrice] = useState(154.14);
    const [ticketQty, setTicketQty] = useState(1000);
    
    // Order Book State
    const [orderBook, setOrderBook] = useState<{asks: any[], bids: any[], maxTotal: number}>({ asks: [], bids: [], maxTotal: 1 });

    // Generate Order Book
    useEffect(() => {
        const generateBook = () => {
            const mid = 154.14 + (Math.random() - 0.5) * 0.05;
            
            // Asks (Sell Orders) - High to Low
            let asks = [];
            let askCum = 0;
            for(let i=0; i<15; i++) {
                const size = Math.floor(Math.random() * 1500) + 100;
                askCum += size;
                asks.push({ price: mid + (i+1)*0.01, size, total: askCum });
            }
            asks.reverse(); 

            // Bids (Buy Orders) - High to Low
            let bids = [];
            let bidCum = 0;
            for(let i=0; i<15; i++) {
                const size = Math.floor(Math.random() * 1500) + 100;
                bidCum += size;
                bids.push({ price: mid - (i+1)*0.01, size, total: bidCum });
            }

            setOrderBook({ asks, bids, maxTotal: Math.max(askCum, bidCum) });
        };

        generateBook();
        const interval = setInterval(generateBook, 800);
        return () => clearInterval(interval);
    }, []);

    const MONITOR_DATA = [
        { symbol: 'DDOG US', name: 'Datadog Inc', price: 149.09, chg: -0.26, pct: -0.17 },
        { symbol: 'AAPL US', name: 'Apple Inc', price: 182.50, chg: +1.20, pct: +0.65 },
        { symbol: 'TSLA US', name: 'Tesla Inc', price: 175.30, chg: -2.50, pct: -1.40 },
        { symbol: 'NVDA US', name: 'NVIDIA Corp', price: 890.00, chg: +15.2, pct: +1.80 },
        { symbol: 'AMD US', name: 'Adv Micro Dev', price: 160.40, chg: -0.80, pct: -0.50 },
        { symbol: 'MSFT US', name: 'Microsoft', price: 410.20, chg: +2.10, pct: +0.51 },
        { symbol: 'AMZN US', name: 'Amazon.com', price: 178.15, chg: +0.95, pct: +0.54 },
        { symbol: 'GOOGL US', name: 'Alphabet Inc', price: 145.30, chg: -0.40, pct: -0.27 },
    ];

    const getSparkData = () => Array.from({length: 10}, () => ({ price: Math.random() * 100 }));

    return (
        <div className="h-full bg-[#000000] text-[#e1e1e1] font-mono text-xs overflow-hidden flex p-1 gap-1">
            
            {/* --- LEFT COLUMN: MONITOR & NEWS --- */}
            <div className="w-72 flex flex-col gap-1 shrink-0">
                {/* MONITOR */}
                <div className="flex-1 bg-terminal-panel border border-terminal-border flex flex-col">
                    <WindowHeader title="Launchpad - Eng Value p2" color="bg-blue-900/20" />
                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-[#1a1a1a] text-[9px] text-gray-400 font-bold uppercase">
                                <tr>
                                    <th className="p-1 text-left">Ticker</th>
                                    <th className="p-1 text-right">Last</th>
                                    <th className="p-1 text-right">Chg%</th>
                                    <th className="p-1 text-center">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MONITOR_DATA.map((row) => (
                                    <tr 
                                        key={row.symbol} 
                                        onClick={() => setActiveTicker(row.symbol)}
                                        className={`cursor-pointer border-b border-terminal-border hover:bg-[#222] ${activeTicker === row.symbol ? 'bg-blue-900/20' : ''}`}
                                    >
                                        <td className="p-1.5">
                                            <div className="font-bold text-blue-400">{row.symbol}</div>
                                            <div className="text-[9px] text-gray-500 truncate">{row.name}</div>
                                        </td>
                                        <td className="p-1.5 text-right font-bold">{row.price.toFixed(2)}</td>
                                        <td className={`p-1.5 text-right font-bold ${row.chg >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {row.pct > 0 ? '+' : ''}{row.pct}%
                                        </td>
                                        <td className="p-1.5 align-middle">
                                            <Sparkline data={getSparkData()} color={row.chg >= 0 ? '#22c55e' : '#ef4444'} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* NEWS FEED */}
                <div className="h-1/3 bg-terminal-panel border border-terminal-border flex flex-col">
                    <WindowHeader title="News Feed - Datadog Inc" />
                    <div className="flex-1 overflow-auto p-1 text-[10px] space-y-1">
                        {[
                            { time: '10:24', src: 'BTR', head: 'Datadog Inc Trading Report: Volume Spike Detected' },
                            { time: '10:15', src: 'DJ', head: 'ETF Daily News: SignatureFd LLC has $348,000 Stock Position' },
                            { time: '09:55', src: 'BBG', head: 'Pulse 2.0: Datadog (DDOG) Stock: $200 Price Target' },
                            { time: '09:30', src: 'RTRS', head: 'Truist Securities Adjusts Price Target to $225' },
                        ].map((news, i) => (
                            <div key={i} className="flex gap-2 border-b border-terminal-border pb-1 hover:bg-[#222] cursor-pointer p-1">
                                <span className="text-blue-400 font-bold min-w-[30px]">{news.src}</span>
                                <span className="text-gray-500 min-w-[30px]">{news.time}</span>
                                <span className="text-[#d1d5db] truncate">{news.head}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- CENTER COLUMN: CHART & BLOTTER --- */}
            <div className="flex-1 flex flex-col gap-1 relative">
                {/* Main Chart */}
                <div className="flex-1 bg-terminal-panel border border-terminal-border flex flex-col min-h-0 relative">
                    <WindowHeader title={`G 214: Histogram 6M | ${activeTicker} Equity`} />
                    <div className="flex-1 relative">
                        <TradingChart isDark={true} />
                    </div>
                </div>
                {/* Blotter */}
                <div className="h-48 bg-terminal-panel border border-terminal-border flex flex-col">
                    <WindowHeader title="EMSX: Execution Management" />
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1a1a1a] text-[9px] text-gray-400 font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="p-1 pl-2">Time</th>
                                    <th className="p-1">Side</th>
                                    <th className="p-1">Symbol</th>
                                    <th className="p-1 text-right">Qty</th>
                                    <th className="p-1 text-right">Price</th>
                                    <th className="p-1 text-center">Route</th>
                                    <th className="p-1">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-[10px] font-mono">
                                {[
                                    { time: '09:53:22', side: 'Buy', symbol: 'DDOG US', qty: 1000, price: 154.14, status: 'Filled', route: 'BATS' },
                                    { time: '09:52:15', side: 'Sell', symbol: 'AAPL US', qty: 500, price: 182.45, status: 'Partial', route: 'NSDQ' },
                                    { time: '09:50:01', side: 'Buy', symbol: 'NVDA US', qty: 200, price: 889.50, status: 'Working', route: 'ARCA' },
                                ].map((order, i) => (
                                    <tr key={i} className="border-b border-terminal-border hover:bg-[#222]">
                                        <td className="p-1 pl-2 text-gray-500">{order.time}</td>
                                        <td className={`p-1 font-bold ${order.side === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{order.side}</td>
                                        <td className="p-1 font-bold text-blue-400">{order.symbol}</td>
                                        <td className="p-1 text-right text-white">{order.qty.toLocaleString()}</td>
                                        <td className="p-1 text-right text-yellow-500">{order.price}</td>
                                        <td className="p-1 text-center text-gray-400">{order.route}</td>
                                        <td className="p-1"><span className="px-1 rounded text-[9px] bg-blue-900 text-blue-400">{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: VISUAL ORDER BOOK --- */}
            <div className="w-72 flex flex-col gap-1 shrink-0">
                
                {/* VISUAL ORDER BOOK */}
                <div className="h-2/3 bg-terminal-panel border border-terminal-border flex flex-col">
                    <WindowHeader title="IB Manager: Level 2" />
                    
                    {/* Header Stats */}
                    <div className="bg-[#000] p-2 border-b border-terminal-border grid grid-cols-2 gap-2">
                         <div>
                             <div className="text-[9px] text-gray-500 uppercase">Mid Price</div>
                             <div className="text-sm font-bold text-white">154.14</div>
                         </div>
                         <div className="text-right">
                             <div className="text-[9px] text-gray-500 uppercase">Spread</div>
                             <div className="text-sm font-bold text-yellow-500">0.02</div>
                         </div>
                    </div>

                    {/* Book Columns */}
                    <div className="flex bg-[#1a1a1a] text-[9px] text-gray-400 font-bold px-2 py-1">
                        <div className="flex-1 text-right">Price</div>
                        <div className="flex-1 text-right">Size</div>
                        <div className="flex-1 text-right">Total</div>
                    </div>

                    {/* Book List */}
                    <div className="flex-1 overflow-auto bg-[#050508] font-mono text-[10px] relative custom-scrollbar">
                        {/* Asks (Sell) - Highest Ask at Top */}
                        <div className="flex flex-col-reverse">
                            {orderBook.asks.map((ask, i) => (
                                <div key={`ask-${i}`} className="flex relative hover:bg-[#1a1a1a] cursor-pointer group">
                                    <div className="absolute top-0 right-0 bottom-0 bg-red-900/30 transition-all duration-300" style={{ width: `${(ask.total / orderBook.maxTotal) * 100}%` }}></div>
                                    <div className="flex-1 z-10 px-2 py-0.5 text-red-400 text-right group-hover:text-red-300">{ask.price.toFixed(2)}</div>
                                    <div className="flex-1 z-10 px-2 py-0.5 text-right text-white">{ask.size}</div>
                                    <div className="flex-1 z-10 px-2 py-0.5 text-right text-gray-500">{ask.total}</div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Spread Indicator */}
                        <div className="py-1 bg-[#1a1e2e] text-center text-gray-400 text-[9px] border-y border-[#333] sticky top-0 bottom-0 z-20 shadow-sm">
                            --- Spread 0.02 ---
                        </div>

                        {/* Bids (Buy) - Highest Bid at Top */}
                        <div className="flex flex-col">
                            {orderBook.bids.map((bid, i) => (
                                <div key={`bid-${i}`} className="flex relative hover:bg-[#1a1a1a] cursor-pointer group">
                                    <div className="absolute top-0 right-0 bottom-0 bg-green-900/30 transition-all duration-300" style={{ width: `${(bid.total / orderBook.maxTotal) * 100}%` }}></div>
                                    <div className="flex-1 z-10 px-2 py-0.5 text-green-400 text-right group-hover:text-green-300">{bid.price.toFixed(2)}</div>
                                    <div className="flex-1 z-10 px-2 py-0.5 text-right text-white">{bid.size}</div>
                                    <div className="flex-1 z-10 px-2 py-0.5 text-right text-gray-500">{bid.total}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CHAT */}
                <div className="flex-1 bg-terminal-panel border border-terminal-border flex flex-col">
                    <WindowHeader title="IB - All Chats" />
                    <div className="flex-1 overflow-auto p-2 space-y-3">
                        <div className="text-[10px]">
                            <div className="font-bold text-orange-400 flex justify-between">Giovanni <span className="text-gray-600 font-normal">09:38</span></div>
                            <div className="text-gray-300 pl-2 border-l border-[#333] mt-1">Offer wanted 1.5M DDOG</div>
                        </div>
                        <div className="text-[10px]">
                            <div className="font-bold text-blue-400 flex justify-between">Dan Wenner <span className="text-gray-600 font-normal">09:39</span></div>
                            <div className="text-gray-300 pl-2 border-l border-[#333] mt-1">Checking dark pools...</div>
                        </div>
                    </div>
                    <div className="p-1 border-t border-terminal-border">
                        <input type="text" placeholder="Message..." className="w-full bg-[#000] border border-[#333] rounded px-2 py-1 text-[10px] text-white outline-none" />
                    </div>
                </div>
            </div>

        </div>
    );
};
