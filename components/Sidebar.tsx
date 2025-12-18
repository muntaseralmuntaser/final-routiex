
import React from 'react';
import { LayoutDashboard, BarChart2, Radio, Wallet, Activity, BrainCircuit, Settings, LogOut, Users, Grid, ShoppingBag, GraduationCap, Video, Trophy, Database, Globe, Rabbit, Home, MonitorPlay, Newspaper } from 'lucide-react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';

interface SidebarProps {
    isOpen: boolean;
    currentView: string;
    setView: (view: string) => void;
    lang: LanguageCode;
    isDark?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentView, setView, lang, isDark }) => {
  const t = (key: string) => getTranslation(lang, key);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, highlight: false }, 
    { id: 'dashboard', label: 'Routiex Terminal', icon: BarChart2, highlight: true },
    { id: 'news-terminal', label: 'News Intelligence', icon: Newspaper, highlight: false }, // New Item
    { id: 'ai-analysis', label: t('aiAnalysis'), icon: Rabbit, color: 'text-terminal-accent' },
    { id: 'studio', label: t('studio'), icon: Video },
    { id: 'signals', label: t('signals'), icon: Radio },
    { id: 'competitions', label: t('competitions'), icon: Trophy, color: 'text-yellow-500' },
    { id: 'portfolio', label: t('portfolio'), icon: Wallet },
    { id: 'community', label: t('community'), icon: Users },
    { id: 'marketplace', label: t('marketplace'), icon: ShoppingBag },
    { id: 'academy', label: t('academy'), icon: GraduationCap },
    { id: 'apps', label: t('apps'), icon: Grid },
  ];

  return (
    <aside className={`${isOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')} md:translate-x-0 fixed md:relative w-64 h-[calc(100vh-3.5rem)] bg-terminal-panel border-r border-l-0 rtl:border-l rtl:border-r-0 border-terminal-border transition-transform duration-300 z-10 flex flex-col justify-between overflow-y-auto custom-scrollbar`}>
      <div className="p-4 space-y-1">
        <div className="mb-4 px-2 text-xs font-mono text-terminal-muted uppercase tracking-wider opacity-60">Routiex Pro</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-all ${
              currentView === item.id 
                ? 'bg-terminal-bg text-terminal-text border-l-2 rtl:border-l-0 rtl:border-r-2 border-terminal-accent shadow-sm' 
                : 'text-terminal-muted hover:bg-terminal-bg hover:text-terminal-text'
            }`}
          >
            <item.icon size={18} className={item.color ? item.color : (item.highlight ? 'text-terminal-accent' : '')} />
            <span>{item.label}</span>
            {item.highlight && <span className="ml-auto text-[9px] bg-terminal-accent text-black px-1.5 py-0.5 rounded font-bold animate-pulse">PRO</span>}
            {item.color && <span className="ml-auto w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>}
          </button>
        ))}

        {/* Separator */}
        <div className="my-2 border-t border-terminal-border/50"></div>

        {/* Routiex Trading - Highlighted */}
        <button
            onClick={() => setView('routiex-trading')}
            className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-black rounded transition-all uppercase tracking-wide overflow-hidden relative group ${
              currentView === 'routiex-trading' 
                ? 'bg-gradient-to-r from-terminal-accent/20 to-transparent text-white border-l-4 border-terminal-accent' 
                : 'text-gray-300 hover:bg-white/5'
            }`}
        >
            <div className="absolute inset-0 bg-terminal-accent/5 animate-pulse"></div>
            <MonitorPlay size={18} className="text-terminal-accent relative z-10" />
            <span className="relative z-10">Routiex Trading</span>
            <div className="ml-auto bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold relative z-10">LIVE</div>
        </button>

      </div>

      <div className="p-4 border-t border-terminal-border space-y-1 mt-auto">
        <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${currentView === 'settings' ? 'text-terminal-text font-bold' : 'text-terminal-muted hover:text-terminal-text'}`}
        >
            <Settings size={18} />
            <span>{t('settings')}</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-terminal-danger hover:text-red-400 transition-colors">
            <LogOut size={18} />
            <span>{t('logout')}</span>
        </button>
        <div className="mt-4 text-[9px] text-center text-terminal-muted font-mono opacity-50">
            ROUTIEX PRO v4.5<br/>by Bayanat Tech Group
        </div>
      </div>
    </aside>
  );
};
