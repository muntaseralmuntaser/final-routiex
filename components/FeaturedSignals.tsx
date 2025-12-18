
import React from 'react';
import { FeaturedTrader, LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { TrendingUp, TrendingDown, ShieldCheck, ArrowRight, Target } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

const TRADERS: FeaturedTrader[] = [
    { 
        id: '1', 
        name: 'Ahmed Al-Saud', 
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', 
        winRate: 88, 
        region: 'ME', 
        isLive: true, 
        rank: 1,
        style: 'SMC',
        followers: 15200,
        activeSignal: { symbol: 'XAUUSD', type: 'BUY', pnl: 120, image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=300&q=80' } 
    },
    { 
        id: '2', 
        name: 'Sarah Jenkins', 
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', 
        winRate: 82, 
        region: 'EU', 
        isLive: false, 
        rank: 2,
        style: 'Swing',
        followers: 12500,
        activeSignal: { symbol: 'GBPJPY', type: 'SELL', pnl: 45, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=300&q=80' } 
    },
    { 
        id: '3', 
        name: 'Takeshi Sato', 
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', 
        winRate: 91, 
        region: 'ASIA', 
        isLive: true, 
        rank: 3,
        style: 'Algorithmic',
        followers: 9800,
        activeSignal: { symbol: 'BTCUSD', type: 'BUY', pnl: 320, image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=300&q=80' } 
    },
    { 
        id: '4', 
        name: 'Michael Ross', 
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', 
        winRate: 78, 
        region: 'US', 
        isLive: false, 
        rank: 4,
        style: 'Price Action',
        followers: 8100,
        activeSignal: { symbol: 'US30', type: 'SELL', pnl: -15, image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=300&q=80' } 
    },
];

export const FeaturedSignals: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);

    return (
        <div className="flex flex-col h-full bg-terminal-panel border border-terminal-border rounded-xl overflow-hidden shadow-md">
            <div className="p-4 border-b border-terminal-border bg-terminal-bg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-terminal-accent" />
                    <h3 className="font-bold text-sm text-terminal-text uppercase tracking-wider">{t('recommendations')}</h3>
                </div>
                <div className="flex -space-x-2">
                    {TRADERS.slice(0,3).map(tr => (
                        <img key={tr.id} src={tr.avatar} className="w-6 h-6 rounded-full border-2 border-terminal-panel" alt={tr.name} />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-terminal-border flex items-center justify-center text-[8px] font-bold text-terminal-muted">+12</div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {TRADERS.map(trader => (
                    <div key={trader.id} className="bg-terminal-bg border border-terminal-border rounded-xl p-4 hover:border-terminal-accent transition-all group cursor-pointer relative overflow-hidden">
                        {trader.activeSignal?.pnl && trader.activeSignal.pnl > 0 && (
                            <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                        )}
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <img src={trader.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-terminal-border group-hover:border-terminal-accent transition-colors" alt={trader.name} />
                                {trader.isLive && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 border-2 border-terminal-bg rounded-full animate-pulse"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm text-terminal-text">{trader.name}</h4>
                                        <span className="text-[10px] text-terminal-muted flex items-center gap-1">
                                            {trader.region === 'ME' ? t('middleEast') : trader.region === 'ASIA' ? t('eastAsia') : t('europe')} • Win Rate {trader.winRate}%
                                        </span>
                                    </div>
                                    {trader.activeSignal && (
                                        <div className={`text-xs font-black px-2 py-1 rounded flex items-center gap-1 ${trader.activeSignal.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {trader.activeSignal.type === 'BUY' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                            {trader.activeSignal.symbol}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {trader.activeSignal && (
                            <div className="mt-3 bg-terminal-panel rounded-lg p-2 flex gap-3 border border-terminal-border/50">
                                <img src={trader.activeSignal.image} className="w-16 h-12 object-cover rounded border border-terminal-border opacity-80" alt="Chart" />
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-center text-[10px] text-terminal-muted mb-1">
                                        <span>Entry: <span className="text-terminal-text font-mono">2034.50</span></span>
                                        <span>TP: <span className="text-terminal-success font-mono">2045.00</span></span>
                                    </div>
                                    <div className="w-full bg-terminal-bg h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${trader.activeSignal.pnl > 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: '65%'}}></div>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span className="text-[9px] font-bold text-terminal-accent">Active Trade</span>
                                        <span className={`text-[9px] font-mono font-bold ${trader.activeSignal.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {trader.activeSignal.pnl > 0 ? '+' : ''}{trader.activeSignal.pnl} pips
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-3 flex justify-end">
                            <button className="text-[10px] font-bold text-terminal-text hover:text-terminal-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Copy Signal <ArrowRight size={10} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
