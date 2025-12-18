
import React, { useState } from 'react';
import { Channel, LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { Globe, Users, Lock, PlayCircle, Radio, Tv } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

const CHANNELS: Channel[] = [
    { id: '1', name: 'Saudi Whales VIP', category: 'VIP', region: 'Middle East', subscribers: 15400, isLive: true, image: 'https://images.unsplash.com/photo-1565514020176-db1444e30306?auto=format&fit=crop&w=500&q=80' },
    { id: '2', name: 'London Open Strategy', category: 'Free', region: 'Europe', subscribers: 8500, isLive: true, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80' },
    { id: '3', name: 'Tokyo Snipers', category: 'VIP', region: 'East Asia', subscribers: 12100, isLive: false, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92a805?auto=format&fit=crop&w=500&q=80' },
    { id: '4', name: 'Dubai Gold Room', category: 'Institutional', region: 'Middle East', subscribers: 5600, isLive: false, image: 'https://images.unsplash.com/photo-1512453979798-5ea904ac66de?auto=format&fit=crop&w=500&q=80' },
    { id: '5', name: 'Frankfurt DAX30', category: 'VIP', region: 'Europe', subscribers: 4300, isLive: true, image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&q=80' },
    { id: '6', name: 'Shanghai Composite', category: 'Free', region: 'East Asia', subscribers: 9800, isLive: false, image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=500&q=80' },
];

export const RegionalChannels: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [activeTab, setActiveTab] = useState<'Middle East' | 'Europe' | 'East Asia'>('Middle East');

    const filteredChannels = CHANNELS.filter(c => c.region === activeTab);

    return (
        <div className="flex flex-col h-full bg-terminal-panel border border-terminal-border rounded-xl overflow-hidden shadow-md">
            {/* Live Header */}
            <div className="p-4 border-b border-terminal-border bg-terminal-bg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Radio size={18} className="text-red-500 animate-pulse" />
                    <h3 className="font-bold text-sm text-terminal-text uppercase tracking-wider">{t('liveStream')} & {t('vipChannels')}</h3>
                </div>
                <button className="text-[10px] font-bold text-terminal-accent hover:underline">View All</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-terminal-border bg-terminal-panel">
                {['Middle East', 'Europe', 'East Asia'].map((region) => (
                    <button
                        key={region}
                        onClick={() => setActiveTab(region as any)}
                        className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-colors relative ${
                            activeTab === region ? 'text-terminal-text bg-terminal-bg' : 'text-terminal-muted hover:bg-terminal-bg/50'
                        }`}
                    >
                        {activeTab === region && <div className="absolute top-0 left-0 right-0 h-0.5 bg-terminal-accent"></div>}
                        {region === 'Middle East' ? t('middleEast') : region === 'Europe' ? t('europe') : t('eastAsia')}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {filteredChannels.map(channel => (
                    <div key={channel.id} className="group relative bg-black border border-terminal-border rounded-xl overflow-hidden hover:border-terminal-accent transition-all cursor-pointer">
                        {/* Background Image with overlay */}
                        <div className="aspect-video w-full relative">
                            <img src={channel.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt={channel.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            
                            {/* Badges */}
                            <div className="absolute top-2 left-2 flex gap-2">
                                {channel.isLive && (
                                    <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                        <Radio size={10} /> {t('liveNow')}
                                    </span>
                                )}
                                {channel.category !== 'Free' && (
                                    <span className="bg-terminal-accent text-black text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                        <Lock size={8} /> {channel.category}
                                    </span>
                                )}
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-terminal-accent/90 flex items-center justify-center text-black shadow-lg hover:scale-110 transition-transform">
                                    <PlayCircle size={20} fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-3 bg-terminal-panel">
                            <h4 className="font-bold text-sm text-terminal-text flex items-center justify-between">
                                {channel.name}
                                <Tv size={14} className="text-terminal-muted group-hover:text-terminal-accent transition-colors" />
                            </h4>
                            <div className="flex items-center justify-between mt-2 text-[10px] text-terminal-muted">
                                <span className="flex items-center gap-1"><Users size={10} /> {(channel.subscribers / 1000).toFixed(1)}k {t('members')}</span>
                                <span className="group-hover:text-terminal-accent transition-colors">{channel.isLive ? t('watch') : t('subscribe')}</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                <div className="p-3 bg-terminal-bg/30 border border-dashed border-terminal-border rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-terminal-bg transition-colors cursor-pointer">
                    <Globe size={24} className="text-terminal-muted opacity-50" />
                    <span className="text-xs font-bold text-terminal-muted">Explore Global Channels</span>
                </div>
            </div>
        </div>
    );
};