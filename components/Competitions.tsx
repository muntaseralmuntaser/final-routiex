
import React from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { Trophy, Users, Clock, Medal, ArrowUpRight, Flame, Target, Shield } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

export const Competitions: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);

    const leaderboard = [
        { rank: 1, name: "Ahmed_FX_Sniper", country: "SA", profit: "+452%", equity: "$145,200", trades: 89 },
        { rank: 2, name: "CryptoKing99", country: "US", profit: "+388%", equity: "$98,450", trades: 124 },
        { rank: 3, name: "TokyoDrift", country: "JP", profit: "+310%", equity: "$75,100", trades: 65 },
        { rank: 4, name: "SarahTrades", country: "UK", profit: "+285%", equity: "$62,300", trades: 92 },
        { rank: 5, name: "FalconEye", country: "AE", profit: "+240%", equity: "$58,900", trades: 45 },
    ];

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-br from-[#ffd700] via-[#f59e0b] to-[#b45309] rounded-xl p-6 md:p-10 text-black overflow-hidden shadow-lg group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                 <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
                     <Trophy size={240} />
                 </div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div>
                         <div className="flex items-center gap-2 bg-black/20 backdrop-blur px-3 py-1 rounded-full w-fit mb-2">
                             <Flame size={16} className="text-white animate-pulse" fill="currentColor" />
                             <span className="text-xs font-black text-white uppercase tracking-widest">Season 4 Live</span>
                         </div>
                         <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 uppercase">{t('contestTitle')}</h1>
                         <p className="text-lg font-bold opacity-80 max-w-lg">Compete with 15,000+ traders globally. Prove your skills and win massive capital allocation.</p>
                     </div>
                     <div className="flex flex-col items-end">
                         <span className="text-xs font-bold uppercase tracking-widest opacity-70">{t('grandPrize')}</span>
                         <span className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-md">$100,000</span>
                         <button className="mt-4 bg-black text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-2xl flex items-center gap-2">
                             {t('joinContest')} <ArrowUpRight size={18} />
                         </button>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prizes Section */}
                <div className="lg:col-span-1 bg-terminal-panel border border-terminal-border rounded-xl p-6 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-terminal-text flex items-center gap-2">
                        <Medal size={20} className="text-terminal-accent" />
                        Prize Pool Breakdown
                    </h3>
                    
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/30 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-black text-xl shadow-lg shadow-yellow-500/20">1</div>
                        <div>
                            <div className="text-2xl font-black text-white">$100,000</div>
                            <div className="text-xs text-terminal-muted">Cash + Prop Firm Account</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-400/20 to-transparent border border-gray-400/30 rounded-lg">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-black font-black text-xl shadow-lg shadow-gray-400/20">2</div>
                        <div>
                            <div className="text-2xl font-black text-white">$50,000</div>
                            <div className="text-xs text-terminal-muted">Cash Prize</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-700/20 to-transparent border border-orange-700/30 rounded-lg">
                        <div className="w-12 h-12 bg-[#cd7f32] rounded-full flex items-center justify-center text-black font-black text-xl shadow-lg shadow-orange-700/20">3</div>
                        <div>
                            <div className="text-2xl font-black text-white">$25,000</div>
                            <div className="text-xs text-terminal-muted">Cash Prize</div>
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-terminal-border text-xs text-terminal-muted flex gap-2">
                        <Shield size={14} />
                        <span>Fully audited by MyFxBook & Bayanat Risk Engine.</span>
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className="lg:col-span-2 bg-terminal-panel border border-terminal-border rounded-xl p-0 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-terminal-border flex justify-between items-center bg-terminal-bg">
                        <h3 className="text-lg font-bold text-terminal-text flex items-center gap-2">
                            <Target size={20} className="text-terminal-accent" />
                            {t('leaderboard')}
                        </h3>
                        <div className="flex gap-4 text-xs font-mono text-terminal-muted">
                            <span className="flex items-center gap-1"><Users size={14}/> 14,203 Participants</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> 12 Days Left</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-terminal-muted border-b border-terminal-border bg-terminal-bg/50 uppercase tracking-wider">
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">Trader</th>
                                    <th className="p-4 text-right">Profit %</th>
                                    <th className="p-4 text-right hidden sm:table-cell">Equity</th>
                                    <th className="p-4 text-right hidden sm:table-cell">Trades</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {leaderboard.map((trader) => (
                                    <tr key={trader.rank} className="border-b border-terminal-border hover:bg-terminal-bg/50 transition-colors group">
                                        <td className="p-4">
                                            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                                                trader.rank === 1 ? 'bg-yellow-500 text-black' :
                                                trader.rank === 2 ? 'bg-gray-400 text-black' :
                                                trader.rank === 3 ? 'bg-[#cd7f32] text-black' :
                                                'bg-terminal-bg text-terminal-muted'
                                            }`}>
                                                {trader.rank}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-terminal-text">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                {trader.name} 
                                                <span className="text-[10px] opacity-50 bg-terminal-bg border border-terminal-border px-1 rounded">{trader.country}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-terminal-success">{trader.profit}</td>
                                        <td className="p-4 text-right font-mono text-terminal-text hidden sm:table-cell">{trader.equity}</td>
                                        <td className="p-4 text-right font-mono text-terminal-muted hidden sm:table-cell">{trader.trades}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
