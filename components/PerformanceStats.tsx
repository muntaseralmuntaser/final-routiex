
import React from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { TrendingUp, Activity, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Props {
    lang: LanguageCode;
}

// Mock data for mini growth chart
const data = [
    { v: 0 }, { v: 5 }, { v: 3 }, { v: 12 }, { v: 10 }, { v: 25 }, { v: 45 }, { v: 40 }, { v: 65 }
];

export const PerformanceStats: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);

    return (
        <div className="bg-terminal-panel border border-terminal-border rounded-xl h-full flex flex-col shadow-sm overflow-hidden">
            <div className="p-3 border-b border-terminal-border flex justify-between items-center bg-[#151515]">
                <h3 className="text-sm font-bold text-terminal-text flex items-center gap-2">
                    <Activity size={16} className="text-terminal-accent animate-pulse" />
                    {t('performance')}
                </h3>
                <div className="flex items-center gap-1">
                     <ShieldCheck size={12} className="text-green-500" />
                     <span className="text-[10px] text-green-500 font-bold">AUDITED</span>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                {/* Main Abstract Gain - Flex container to prevent overlap */}
                <div className="flex justify-between items-end gap-2 min-h-[80px]">
                    <div className="flex flex-col">
                        <span className="text-xs text-terminal-muted font-bold uppercase tracking-wider">{t('gain')}</span>
                        <div className="text-2xl lg:text-4xl font-black text-terminal-success flex items-baseline gap-1 tracking-tighter">
                            +65.4%
                            <TrendingUp size={16} className="mb-1" />
                        </div>
                    </div>
                    {/* Explicit Height for Chart */}
                    <div className="h-12 w-24 opacity-50" style={{ minHeight: 48, minWidth: 96 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <Area type="monotone" dataKey="v" stroke="var(--success)" fill="var(--success)" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Stats Grid - Fixed overlap with min-width and text scaling */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-terminal-bg/50 p-2 rounded border border-terminal-border/50">
                        <div className="text-[9px] text-terminal-muted uppercase font-bold truncate">{t('profit')}</div>
                        <div className="text-sm lg:text-base font-mono text-terminal-success font-bold truncate">$6,542.00</div>
                    </div>
                     <div className="bg-terminal-bg/50 p-2 rounded border border-terminal-border/50">
                        <div className="text-[9px] text-terminal-muted uppercase font-bold truncate">{t('dailyPnl')}</div>
                        <div className="text-sm lg:text-base font-mono text-terminal-success font-bold truncate">+0.85%</div>
                    </div>
                     <div className="bg-terminal-bg/50 p-2 rounded border border-terminal-border/50">
                        <div className="text-[9px] text-terminal-muted uppercase font-bold truncate">{t('drawdown')}</div>
                        <div className="text-sm lg:text-base font-mono text-terminal-danger font-bold truncate">12.40%</div>
                    </div>
                     <div className="bg-terminal-bg/50 p-2 rounded border border-terminal-border/50">
                        <div className="text-[9px] text-terminal-muted uppercase font-bold truncate">{t('profitFactor')}</div>
                        <div className="text-sm lg:text-base font-mono text-terminal-text font-bold truncate">1.85</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-terminal-border/50">
                    <div>
                        <div className="text-[9px] text-terminal-muted uppercase font-bold">{t('deposits')}</div>
                        <div className="text-xs font-mono text-white truncate">$10,000</div>
                    </div>
                    <div>
                        <div className="text-[9px] text-terminal-muted uppercase font-bold">{t('trades')}</div>
                        <div className="text-xs font-mono text-white truncate">432</div>
                    </div>
                    <div>
                        <div className="text-[9px] text-terminal-muted uppercase font-bold">{t('lots')}</div>
                        <div className="text-xs font-mono text-white truncate">54.2</div>
                    </div>
                </div>
            </div>
            
            {/* Progress Bars */}
            <div className="p-3 border-t border-terminal-border bg-terminal-bg">
                <div className="flex justify-between text-[9px] mb-1 font-bold">
                    <span className="text-terminal-accent">Longs 68%</span>
                    <span className="text-red-500">Shorts 55%</span>
                </div>
                <div className="flex gap-1">
                    <div className="h-1 rounded-full bg-terminal-accent w-[68%] shadow-[0_0_10px_rgba(41,98,255,0.5)]"></div>
                    <div className="h-1 rounded-full bg-red-500 w-[55%] ml-auto shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
            </div>
        </div>
    );
};
