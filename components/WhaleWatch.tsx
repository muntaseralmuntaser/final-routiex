
import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Anchor, Activity } from 'lucide-react';

export const WhaleWatch: React.FC = () => {
    const [trades, setTrades] = useState([
        { id: 1, symbol: 'BTC/USDT', size: 150, value: '9.2M', side: 'SELL', time: 'Now' },
        { id: 2, symbol: 'XAU/USD', size: 5000, value: '10.1M', side: 'BUY', time: '2s ago' },
        { id: 3, symbol: 'NVDA', size: 20000, value: '15.4M', side: 'BUY', time: '5s ago' },
        { id: 4, symbol: 'ETH/USDT', size: 2500, value: '6.2M', side: 'SELL', time: '12s ago' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const symbols = ['BTC/USDT', 'ETH/USDT', 'XAU/USD', 'EUR/USD', 'TSLA', 'NVDA', 'AAPL'];
            const sides = ['BUY', 'SELL'];
            const newTrade = {
                id: Date.now(),
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: Math.floor(Math.random() * 10000),
                value: (Math.random() * 20 + 1).toFixed(1) + 'M',
                side: sides[Math.floor(Math.random() * sides.length)],
                time: 'Now'
            };
            setTrades(prev => [newTrade, ...prev.slice(0, 4)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-terminal-panel border border-terminal-border rounded-xl flex flex-col h-full overflow-hidden shadow-lg relative">
            <div className="p-3 border-b border-terminal-border bg-terminal-bg flex justify-between items-center">
                <h3 className="text-sm font-bold text-terminal-text flex items-center gap-2">
                    <Anchor size={16} className="text-blue-500" />
                    WHALE WATCH <span className="text-[9px] text-terminal-muted opacity-70">BLOCK ORDERS > $1M</span>
                </h3>
                <Activity size={14} className="text-blue-500 animate-pulse" />
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                
                <div className="flex flex-col">
                    {trades.map((trade, idx) => (
                        <div key={trade.id} className={`flex items-center justify-between p-3 border-b border-terminal-border/50 transition-all duration-500 ${idx === 0 ? 'bg-blue-500/5 animate-flash-green' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${trade.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {trade.side === 'BUY' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                </div>
                                <div>
                                    <div className="text-xs font-black text-white">{trade.symbol}</div>
                                    <div className="text-[9px] text-terminal-muted font-mono">{trade.time}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-black text-white flex items-center justify-end gap-1">
                                    <DollarSign size={10} className="text-terminal-muted" />
                                    {trade.value}
                                </div>
                                <div className={`text-[9px] font-bold uppercase ${trade.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                    {trade.side} ORDER
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
