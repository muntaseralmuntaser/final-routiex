
import React, { useState, useEffect } from 'react';
import { Timer, Globe, Clock, Activity, AlertCircle, CalendarX, BarChart3 } from 'lucide-react';

interface MarketSession {
    id: string;
    name: string;
    city: string;
    flag: string;
    start: number; // UTC hour
    startMin: number;
    end: number; // UTC hour
    endMin: number;
    color: string; // Country primary brand color
    workingDays: number[]; // 0 (Sun) to 6 (Sat)
    baseVolume: string; // Institutional Volume label
}

const SESSIONS: MarketSession[] = [
    { id: 'aus', name: 'Australian', city: 'Sydney (ASX)', flag: '🇦🇺', start: 23, startMin: 0, end: 5, endMin: 0, color: '#00008B', workingDays: [1, 2, 3, 4, 5], baseVolume: '4.2B' },
    { id: 'asia', name: 'Asian', city: 'Tokyo (TSE)', flag: '🇯🇵', start: 0, startMin: 0, end: 6, endMin: 0, color: '#BC002D', workingDays: [1, 2, 3, 4, 5], baseVolume: '12.8B' },
    { id: 'uae', name: 'Emirati', city: 'Dubai (DFM)', flag: '🇦🇪', start: 6, startMin: 0, end: 11, endMin: 0, color: '#00732F', workingDays: [1, 2, 3, 4, 5], baseVolume: '1.5B' },
    { id: 'ksa', name: 'Saudi', city: 'Riyadh (TADAWUL)', flag: '🇸🇦', start: 7, startMin: 0, end: 12, endMin: 0, color: '#006C35', workingDays: [0, 1, 2, 3, 4], baseVolume: '2.8B' },
    { id: 'eu', name: 'European', city: 'London (LSE)', flag: '🇬🇧', start: 8, startMin: 0, end: 16, endMin: 30, color: '#00247D', workingDays: [1, 2, 3, 4, 5], baseVolume: '24.5B' },
    { id: 'us', name: 'American', city: 'New York (NYSE)', flag: '🇺🇸', start: 14, startMin: 30, end: 21, endMin: 0, color: '#B22234', workingDays: [1, 2, 3, 4, 5], baseVolume: '45.1B' },
];

type SessionStatus = 'OPEN' | 'CLOSING_SOON' | 'OPENING_SOON' | 'CLOSED' | 'WEEKEND';

export const MarketTimings: React.FC = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (h: number, m: number) => {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const getSessionInfo = (session: MarketSession) => {
        const dayOfWeek = now.getUTCDay();
        const currentTotalMins = now.getUTCHours() * 60 + now.getUTCMinutes();
        const startTotalMins = session.start * 60 + session.startMin;
        const endTotalMins = session.end * 60 + session.endMin;
        const isWorkingDay = session.workingDays.includes(dayOfWeek);

        let isOpen = false;
        let minsUntilClose = 0;
        let minsUntilOpen = 0;

        if (startTotalMins < endTotalMins) {
            isOpen = isWorkingDay && currentTotalMins >= startTotalMins && currentTotalMins < endTotalMins;
            if (isOpen) {
                minsUntilClose = endTotalMins - currentTotalMins;
            } else {
                minsUntilOpen = currentTotalMins < startTotalMins 
                    ? startTotalMins - currentTotalMins 
                    : (1440 - currentTotalMins) + startTotalMins;
            }
        } else {
            const prevDay = (dayOfWeek + 6) % 7;
            isOpen = (isWorkingDay && currentTotalMins >= startTotalMins) || 
                     (session.workingDays.includes(prevDay) && currentTotalMins < endTotalMins);

            if (isOpen) {
                minsUntilClose = currentTotalMins >= startTotalMins 
                    ? (1440 - currentTotalMins) + endTotalMins 
                    : endTotalMins - currentTotalMins;
            } else {
                minsUntilOpen = startTotalMins - currentTotalMins;
            }
        }

        let status: SessionStatus = 'CLOSED';
        let countdownMins = 0;

        if (isOpen) {
            status = minsUntilClose <= 60 ? 'CLOSING_SOON' : 'OPEN';
            countdownMins = minsUntilClose;
        } else {
            if (!isWorkingDay) {
                status = 'WEEKEND';
                countdownMins = currentTotalMins < startTotalMins 
                    ? startTotalMins - currentTotalMins 
                    : (1440 - currentTotalMins) + startTotalMins;
            } else {
                status = minsUntilOpen <= 60 ? 'OPENING_SOON' : 'CLOSED';
                countdownMins = minsUntilOpen;
            }
        }

        const hRem = Math.floor(countdownMins / 60);
        const mRem = countdownMins % 60;
        const sRem = 59 - now.getUTCSeconds();

        let progress = 0;
        if (isOpen) {
            const totalDuration = startTotalMins < endTotalMins 
                ? endTotalMins - startTotalMins 
                : (1440 - startTotalMins) + endTotalMins;
            const elapsed = currentTotalMins >= startTotalMins 
                ? currentTotalMins - startTotalMins 
                : (1440 - startTotalMins) + currentTotalMins;
            progress = (elapsed / totalDuration) * 100;
        }

        return {
            status,
            isOpen,
            isWorkingDay,
            countdown: `${hRem}h ${mRem.toString().padStart(2, '0')}m ${sRem.toString().padStart(2, '0')}s`,
            progress: Math.min(100, Math.max(0, progress))
        };
    };

    const getStatusStyle = (status: SessionStatus) => {
        switch (status) {
            case 'OPEN': return { color: 'text-green-500', bg: 'bg-green-500', pulse: true, label: 'Live' };
            case 'CLOSING_SOON': return { color: 'text-orange-500', bg: 'bg-orange-500', pulse: true, label: 'Closing' };
            case 'OPENING_SOON': return { color: 'text-yellow-500', bg: 'bg-yellow-500', pulse: true, label: 'Opening' };
            case 'CLOSED': return { color: 'text-red-500', bg: 'bg-red-600', pulse: false, label: 'Closed' };
            case 'WEEKEND': return { color: 'text-gray-600', bg: 'bg-gray-800', pulse: false, label: 'Weekend' };
            default: return { color: 'text-gray-500', bg: 'bg-gray-500', pulse: false, label: 'N/A' };
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-[#1e2235] bg-[#1a1e2e] flex justify-between items-center shrink-0">
                <span className="text-xs font-black text-white flex items-center gap-2 uppercase tracking-widest">
                    <Timer size={14} className="text-terminal-accent" /> Market Intelligence
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <Globe size={12} /> {now.getUTCHours().toString().padStart(2, '0')}:{now.getUTCMinutes().toString().padStart(2, '0')} UTC
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050508]">
                {SESSIONS.map((session) => {
                    const info = getSessionInfo(session);
                    const style = getStatusStyle(info.status);
                    return (
                        <div key={session.id} className="p-3 border-b border-[#1e2235] hover:bg-[#0f111a] transition-all group relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: session.color }}></div>
                            
                            {info.isOpen && (
                                <div 
                                    className={`absolute left-0 bottom-0 h-[2px] opacity-30 transition-all duration-1000 ${style.bg}`}
                                    style={{ width: `${info.progress}%` }}
                                ></div>
                            )}

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300 block">
                                            {session.flag}
                                        </span>
                                        <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-black ${style.bg} ${style.pulse ? 'animate-pulse' : ''}`}></div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-white tracking-tight uppercase">{session.name}</span>
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase ${info.status === 'WEEKEND' ? 'text-gray-500 bg-gray-800' : style.color + ' ' + style.bg.replace('bg-', 'bg-opacity-20 bg-')}`}>
                                                {style.label}
                                            </span>
                                        </div>
                                        <div className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">
                                            {formatTime(session.start, session.startMin)} - {formatTime(session.end, session.endMin)} UTC
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Volume Column */}
                                    <div className="text-right border-l border-[#1e2235] pl-4">
                                        <div className="text-[8px] text-gray-500 font-bold uppercase">Volume</div>
                                        <div className="text-[10px] font-black text-blue-400 font-mono flex items-center justify-end gap-1">
                                            <BarChart3 size={10} />
                                            {info.isOpen ? session.baseVolume : '0.0B'}
                                        </div>
                                    </div>
                                    
                                    {/* Countdown Column */}
                                    <div className="text-right w-20">
                                        <div className={`text-[10px] font-black font-mono tracking-tighter ${style.color}`}>
                                            {info.status === 'WEEKEND' ? '--h --m --s' : info.countdown}
                                        </div>
                                        <div className="text-[8px] font-bold text-gray-600 uppercase">
                                            {info.isOpen ? 'To Close' : 'To Open'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="p-2 bg-[#0a0c14] border-t border-[#1e2235] flex items-center justify-around">
                <div className="flex items-center gap-1">
                    <Activity size={10} className="text-terminal-accent" />
                    <span className="text-[8px] font-black text-gray-400 uppercase">Global Data Feed: Active</span>
                </div>
            </div>
        </div>
    );
};
