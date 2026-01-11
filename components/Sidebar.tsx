
import React from 'react';
import { 
    LayoutDashboard, BarChart2, Radio, Wallet, Activity, BrainCircuit, 
    Settings, LogOut, Users, Grid, ShoppingBag, GraduationCap, 
    Video, Trophy, Database, Globe, Rabbit, Home, MonitorPlay, Newspaper,
    Monitor, Layout
} from 'lucide-react';
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
    { id: 'home', label: 'Home Dashboard', icon: Home }, 
    { id: 'dashboard', label: 'Routiex Terminal', icon: BarChart2, pro: true },
    { id: 'news-terminal', label: 'News Intelligence', icon: Newspaper },
    { id: 'ai-analysis', label: 'AI Market Analysis', icon: BrainCircuit, highlight: true },
    { id: 'studio', label: 'Live Studio Pro', icon: Video },
    { id: 'signals', label: 'Signal Center', icon: Radio },
    { id: 'competitions', label: 'Competitions', icon: Trophy, alert: true },
    { id: 'portfolio', label: 'My Wallet', icon: Wallet },
    { id: 'community', label: 'Social Hub', icon: Users },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'apps', label: 'Integrations', icon: Grid },
  ];

  return (
    <aside className={`${isOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')} md:translate-x-0 fixed md:relative w-64 h-[calc(100vh-3.5rem)] bg-[#0f172a] border-r border-[#1e293b] transition-transform duration-300 z-50 flex flex-col justify-between overflow-y-auto custom-scrollbar`}>
      <div className="p-4 space-y-1">
        <div className="mb-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest opacity-60">Routiex v4.5.0</div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-lg transition-all group relative overflow-hidden ${
              currentView === item.id 
                ? 'bg-[#1e293b] text-white border-l-4 border-terminal-accent shadow-lg' 
                : 'text-gray-400 hover:bg-[#1e293b]/50 hover:text-white'
            }`}
          >
            <item.icon size={18} className={currentView === item.id ? 'text-terminal-accent' : (item.highlight ? 'text-terminal-accent' : 'text-gray-500 group-hover:text-terminal-accent')} />
            <span className="uppercase tracking-tight whitespace-nowrap">{item.label}</span>
            
            {item.pro && <span className="ml-auto text-[8px] bg-terminal-accent text-black px-1.5 py-0.5 rounded font-black tracking-widest">PRO</span>}
            {item.alert && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 ml-auto animate-pulse"></div>}
          </button>
        ))}

        <div className="my-4 border-t border-[#1e293b]/50"></div>

        <button
            onClick={() => setView('routiex-trading')}
            className={`w-full flex items-center gap-3 px-4 py-4 text-[11px] font-black rounded-lg transition-all uppercase tracking-widest overflow-hidden relative group border border-terminal-accent/20 ${
              currentView === 'routiex-trading' 
                ? 'bg-gradient-to-r from-terminal-accent/20 to-transparent text-white border-l-4 border-terminal-accent' 
                : 'text-gray-300 hover:bg-white/5'
            }`}
        >
            <MonitorPlay size={18} className="text-terminal-accent relative z-10" />
            <span className="relative z-10">Live Trading</span>
            <div className="ml-auto bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black relative z-10 animate-pulse">LIVE</div>
        </button>
      </div>

      <div className="p-4 border-t border-[#1e293b] space-y-1 mt-auto bg-[#0b0f1a]">
        <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${currentView === 'settings' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
        >
            <Settings size={18} />
            <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={18} />
            <span>Disconnect</span>
        </button>
        <div className="mt-4 text-[9px] text-center text-gray-600 font-black tracking-widest opacity-50 uppercase leading-relaxed font-mono">
            ROUTIEX CORE v4.5.2<br/>by Bayanat Tech Group
        </div>
      </div>
    </aside>
  );
};
