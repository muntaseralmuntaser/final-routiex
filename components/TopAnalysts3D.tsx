
import React, { useState, useEffect, useRef } from 'react';
import { FeaturedTrader } from '../types';
import { Users, ArrowRight, X, ShieldCheck, Activity, BarChart2, Copy } from 'lucide-react';

interface AnalystProfile extends FeaturedTrader {
    interest: 'GOLD' | 'FOREX' | 'STOCKS' | 'CRYPTO';
}

const MOCK_TRADERS: AnalystProfile[] = [
    { id: '1', name: 'Ahmed Al-Saud', rank: 1, style: 'SMC / Scalp', followers: 15200, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', winRate: 88, region: 'ME', isLive: true, activeSignal: { symbol: 'XAUUSD', type: 'BUY', pnl: 120, image: '' }, interest: 'GOLD' },
    { id: '2', name: 'Sarah J. Trading', rank: 2, style: 'Swing', followers: 12500, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', winRate: 82, region: 'EU', isLive: false, activeSignal: { symbol: 'GBPUSD', type: 'SELL', pnl: 40, image: '' }, interest: 'FOREX' },
    { id: '3', name: 'Tokyo Whale', rank: 3, style: 'Algorithmic', followers: 9800, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', winRate: 91, region: 'ASIA', isLive: true, activeSignal: { symbol: 'BTCUSD', type: 'BUY', pnl: 450, image: '' }, interest: 'CRYPTO' },
    { id: '4', name: 'Michael Ross', rank: 4, style: 'Price Action', followers: 8100, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', winRate: 78, region: 'US', isLive: false, interest: 'STOCKS' },
    { id: '5', name: 'Elena Voronina', rank: 5, style: 'Macro', followers: 6200, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', winRate: 75, region: 'EU', isLive: true, interest: 'FOREX' },
    { id: '6', name: 'David Chen', rank: 6, style: 'Quant', followers: 5400, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', winRate: 85, region: 'ASIA', isLive: false, interest: 'STOCKS' },
];

const getBorderAndShadow = (interest: string) => {
    switch (interest) {
        case 'GOLD': return 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.6)]';
        case 'FOREX': return 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]';
        case 'STOCKS': return 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]';
        case 'CRYPTO': return 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]';
        default: return 'border-gray-500';
    }
};

const getTextColor = (interest: string) => {
    switch (interest) {
        case 'GOLD': return 'text-yellow-500';
        case 'FOREX': return 'text-blue-500';
        case 'STOCKS': return 'text-red-500';
        case 'CRYPTO': return 'text-green-500';
        default: return 'text-gray-500';
    }
};

const getInterestLabel = (interest: string) => {
    switch (interest) {
        case 'GOLD': return 'GOLD HUNTER';
        case 'FOREX': return 'FOREX SNIPER';
        case 'STOCKS': return 'WALL ST WOLF';
        case 'CRYPTO': return 'CRYPTO KING';
        default: return 'TRADER';
    }
};

export const TopAnalysts3D: React.FC = () => {
    const [selectedTrader, setSelectedTrader] = useState<FeaturedTrader | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Stop-and-Go Animation Logic
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollAmount = 0;
        const cardWidth = 320; // Width of card + gap (288 + 24 approx)
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        const interval = setInterval(() => {
            if (scrollContainer) {
                // Check if we reached the end
                if (scrollAmount >= maxScroll) {
                    scrollAmount = 0;
                    scrollContainer.scrollTo({ left: 0, behavior: 'auto' });
                } else {
                    scrollAmount += cardWidth;
                    scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 3500); // 3.5 seconds total cycle (Move + Stop)

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Increased height to h-32 to prevent top clipping of floating elements */}
            <div className="w-full h-32 relative overflow-hidden bg-[#050508] border-t border-[#1e2235] flex items-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-50">
                
                {/* Scroll Container */}
                <div 
                    ref={scrollRef}
                    className="flex gap-6 px-6 items-center h-full overflow-x-hidden no-scrollbar w-full"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {/* Render list buffer for scrolling */}
                    {[...MOCK_TRADERS, ...MOCK_TRADERS, ...MOCK_TRADERS].map((trader, i) => (
                        <div 
                            key={`${trader.id}-${i}`}
                            onClick={() => setSelectedTrader(trader)}
                            className="group relative w-72 h-20 bg-[#0f111a] rounded-xl p-3 cursor-pointer transition-all duration-300 hover:scale-105 shrink-0 hover:bg-[#1a1e2e] border border-transparent hover:border-terminal-border mt-2" // Added margin-top to ensure absolute tags clear container
                        >
                            {/* Pulsing Border/Glow Layer */}
                            <div className={`absolute inset-0 rounded-xl border-2 ${getBorderAndShadow(trader.interest)} opacity-80 group-hover:opacity-100 animate-pulse`}></div>

                            {/* Blinking Interest Tag */}
                            <div className={`
                                absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#0f111a] border z-20 shadow-md
                                ${getBorderAndShadow(trader.interest)} ${getTextColor(trader.interest)} animate-pulse
                            `}>
                                {getInterestLabel(trader.interest)}
                            </div>

                            {/* Rank Badge */}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black border border-[#1e2235] rounded-full flex items-center justify-center text-[10px] font-black text-terminal-accent z-20 shadow-lg">
                                #{trader.rank}
                            </div>

                            {/* Content Layer (Static) */}
                            <div className="relative z-10 flex items-center gap-4 h-full w-full">
                                {/* Avatar */}
                                <div className="relative shrink-0 ml-2">
                                    <img src={trader.avatar} className="w-14 h-14 rounded-full border-2 border-[#1e2235] group-hover:border-white object-cover" />
                                    {trader.isLive && (
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-red-600 border-2 border-[#0f111a] rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-sm truncate flex items-center gap-2">
                                        {trader.name}
                                        {trader.isLive && <span className="text-[8px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black animate-bounce">LIVE</span>}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                                        <span className={`${getTextColor(trader.interest)} font-bold`}>{trader.winRate}% WR</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Users size={10}/> {(trader.followers/1000).toFixed(1)}k</span>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-terminal-accent">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- ANALYST PROFILE POPUP MODAL --- */}
            {selectedTrader && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
                    <div className="bg-[#0f111a] border border-[#1e2235] rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        {/* Header Background */}
                        <div className="h-24 bg-gradient-to-r from-blue-900/40 to-terminal-accent/20 relative">
                            <button onClick={() => setSelectedTrader(null)} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="px-6 relative -mt-10 mb-6 text-center">
                            <div className="relative inline-block">
                                <img src={selectedTrader.avatar} className="w-20 h-20 rounded-full border-4 border-[#0f111a] shadow-xl object-cover" />
                                {selectedTrader.isLive && (
                                    <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-[#0f111a] animate-pulse">
                                        LIVE
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-black text-white mt-2 flex items-center justify-center gap-2">
                                {selectedTrader.name}
                                <ShieldCheck size={16} className="text-terminal-accent" />
                            </h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{selectedTrader.style} Specialist</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 px-6 mb-6">
                            <div className="bg-[#1a1e2e] p-3 rounded-xl text-center border border-[#2a2f45]">
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Win Rate</div>
                                <div className="text-lg font-black text-green-500">{selectedTrader.winRate}%</div>
                            </div>
                            <div className="bg-[#1a1e2e] p-3 rounded-xl text-center border border-[#2a2f45]">
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Followers</div>
                                <div className="text-lg font-black text-white">{(selectedTrader.followers/1000).toFixed(1)}k</div>
                            </div>
                            <div className="bg-[#1a1e2e] p-3 rounded-xl text-center border border-[#2a2f45]">
                                <div className="text-[10px] text-gray-500 uppercase font-bold">Risk Score</div>
                                <div className="text-lg font-black text-yellow-500">Low</div>
                            </div>
                        </div>

                        {/* Active Signal Preview */}
                        {selectedTrader.activeSignal ? (
                            <div className="mx-6 mb-6 bg-terminal-accent/5 border border-terminal-accent/20 rounded-xl p-4 relative overflow-hidden">
                                <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-terminal-accent uppercase">
                                    <Activity size={10} /> Active Trade
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-2xl font-black text-white">{selectedTrader.activeSignal.symbol}</div>
                                        <div className={`text-sm font-bold ${selectedTrader.activeSignal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                            {selectedTrader.activeSignal.type} @ Market
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500">Running PnL</div>
                                        <div className="text-lg font-mono font-bold text-green-500">+{selectedTrader.activeSignal.pnl} pips</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-6 mb-6 bg-[#1a1e2e] rounded-xl p-4 text-center text-xs text-gray-500 italic">
                                No active trades currently.
                            </div>
                        )}

                        {/* Actions */}
                        <div className="p-4 bg-[#0a0a0a] border-t border-[#1e2235] flex gap-3">
                            <button className="flex-1 py-3 bg-[#1e2235] hover:bg-[#2a2f45] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors">
                                <BarChart2 size={16} /> View Stats
                            </button>
                            <button className="flex-1 py-3 bg-terminal-accent hover:bg-white text-black rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-terminal-accent/20">
                                <Copy size={16} /> Copy Trades
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
