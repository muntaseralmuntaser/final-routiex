
import React, { useEffect, useRef, useState } from 'react';
import { Bell, User, Menu, Search, Globe, Moon, Sun, Command, Activity, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { LanguageCode, AppNotification } from '../types';
import { getTranslation } from '../utils/translations';
import { Logo } from './Logo';

interface HeaderProps {
    toggleSidebar: () => void;
    lang: LanguageCode;
    setLang: (l: LanguageCode) => void;
    isDark: boolean;
    toggleTheme: () => void;
    notifications: AppNotification[];
    onSystemCheck: () => void;
    onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, lang, setLang, isDark, toggleTheme, notifications, onSystemCheck, onNavigate }) => {
  const t = (key: string) => getTranslation(lang, key);
  const tickerRef = useRef<HTMLDivElement>(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{label: string, action: () => void, type: string}[]>([]);

  useEffect(() => {
    if (tickerRef.current) {
        tickerRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.type = 'text/javascript';
        script.innerHTML = JSON.stringify({
            "symbols": [
                { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
                { "proName": "FOREXCOM:NSXUSD", "title": "US 100" },
                { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
                { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
                { "description": "Gold", "proName": "OANDA:XAUUSD" },
                { "description": "Oil", "proName": "MCX:CRUDEOIL1!" },
                { "description": "Nvidia", "proName": "NASDAQ:NVDA" },
                { "description": "Tesla", "proName": "NASDAQ:TSLA" },
                { "description": "Apple", "proName": "NASDAQ:AAPL" },
                { "description": "DXY", "proName": "TVC:DXY" }
            ],
            "showSymbolLogo": true,
            "colorTheme": isDark ? "dark" : "light",
            "isTransparent": true,
            "displayMode": "adaptive",
            "locale": "en"
        });
        tickerRef.current.appendChild(script);
    }
  }, [isDark]);

  const handleSearch = (query: string) => {
      setSearchQuery(query);
      if (!query) {
          setSearchResults([]);
          return;
      }
      
      const lower = query.toLowerCase();
      const results = [];

      // Navigation Commands
      if ('dashboard'.includes(lower)) results.push({ label: 'Go to Dashboard', action: () => onNavigate('dashboard'), type: 'NAV' });
      if ('live studio'.includes(lower) || 'broadcast'.includes(lower)) results.push({ label: 'Open Live Studio', action: () => onNavigate('studio'), type: 'NAV' });
      if ('markets'.includes(lower)) results.push({ label: 'Market Center', action: () => onNavigate('dashboard'), type: 'NAV' });
      if ('settings'.includes(lower)) results.push({ label: 'System Settings', action: () => onNavigate('settings'), type: 'NAV' });
      if ('ai'.includes(lower)) results.push({ label: 'AI Analyzer', action: () => onNavigate('ai-analysis'), type: 'NAV' });

      // Asset Placeholders (Simulated)
      if ('gold'.includes(lower) || 'xau'.includes(lower)) results.push({ label: 'Analyze XAUUSD', action: () => onNavigate('dashboard'), type: 'ASSET' });
      if ('btc'.includes(lower) || 'bitcoin'.includes(lower)) results.push({ label: 'Analyze BTCUSD', action: () => onNavigate('dashboard'), type: 'ASSET' });

      setSearchResults(results);
  };

  const executeSearch = (result: {action: () => void}) => {
      result.action();
      setSearchQuery('');
      setSearchResults([]);
  };

  return (
    <header className="h-16 bg-terminal-panel border-b border-terminal-border flex items-center justify-between px-4 sticky top-0 z-50 transition-colors shadow-lg">
      {/* Logo Area */}
      <div className="flex items-center gap-4 w-56 shrink-0">
        <button onClick={toggleSidebar} className="md:hidden text-terminal-muted hover:text-terminal-text">
          <Menu size={20} />
        </button>
        <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
                <Logo size="sm" animated={true} />
                <span className="font-black text-xl tracking-tighter text-terminal-text">
                    ROUTIEX
                </span>
            </div>
            <span className="text-[9px] text-terminal-muted font-semibold uppercase tracking-widest pl-10 leading-none opacity-70 whitespace-nowrap">
                by Bayanat Tech Group
            </span>
        </div>
      </div>

      {/* TRADINGVIEW REAL-TIME TICKER (White Labeled) */}
      <div className="hidden xl:block flex-1 mx-4 h-12 bg-terminal-bg rounded-lg border border-terminal-border overflow-hidden relative shadow-inner group">
         {/* Branding Mask for Ticker */}
         <div className="absolute bottom-0 left-0 bg-terminal-bg h-4 w-8 z-20"></div>
         <div className="tradingview-widget-container w-full h-full relative z-10" ref={tickerRef}>
             <div className="tradingview-widget-container__widget"></div>
         </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-auto justify-end shrink-0">
        
        {/* System Status Check */}
        <button 
            onClick={onSystemCheck}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1e2e] border border-[#2a2f45] rounded-md hover:bg-[#2a2f45] transition-colors group"
            title="Run System Diagnostics"
        >
            <Activity size={14} className="text-green-500 group-hover:animate-pulse" />
            <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase hidden sm:inline-block">System Healthy</span>
        </button>

        <div className="h-6 w-[1px] bg-terminal-border mx-1"></div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center bg-terminal-bg border border-terminal-border rounded-md px-2 py-1.5 group focus-within:border-terminal-accent transition-colors relative">
            <Search size={14} className="text-terminal-muted group-focus-within:text-terminal-accent" />
            <input 
                type="text" 
                placeholder="Command / Asset..." 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-terminal-text w-24 lg:w-32 ml-2 placeholder-terminal-muted/50" 
            />
            {/* Search Dropdown */}
            {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f111a] border border-[#1e2235] rounded-lg shadow-xl overflow-hidden z-50">
                    {searchResults.map((res, i) => (
                        <div key={i} onClick={() => executeSearch(res)} className="px-3 py-2 hover:bg-[#1e2235] cursor-pointer flex items-center justify-between text-xs text-gray-300">
                            <span>{res.label}</span>
                            <span className="text-[9px] font-bold bg-[#1e2235] px-1 rounded text-gray-500">{res.type}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {/* Theme */}
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded hover:bg-terminal-bg text-terminal-muted hover:text-terminal-text transition-colors" title={isDark ? t('lightMode') : t('darkMode')}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Lang */}
        <div className="hidden sm:flex items-center gap-1 border border-terminal-border rounded-md px-2 py-1 bg-terminal-bg text-xs hover:border-terminal-accent transition-colors">
            <Globe size={12} className="text-terminal-muted" />
            <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as LanguageCode)}
                className="bg-transparent border-none outline-none text-terminal-text uppercase cursor-pointer font-bold text-[10px] w-10"
            >
                <option value="en">EN</option>
                <option value="ar">AR</option>
                <option value="zh">ZH</option>
            </select>
        </div>

        {/* Notifications */}
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-terminal-muted hover:text-terminal-accent transition-colors relative p-1.5 hover:bg-terminal-bg rounded"
            >
                <Bell size={18} />
                {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-terminal-danger rounded-full border-2 border-terminal-panel animate-pulse"></span>
                )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#0f111a] border border-[#1e2235] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                    <div className="p-3 bg-[#151720] border-b border-[#1e2235] flex justify-between items-center">
                        <span className="text-xs font-bold text-white uppercase">Notifications</span>
                        <button onClick={() => setShowNotifications(false)}><X size={14} className="text-gray-500 hover:text-white"/></button>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-500">No new alerts.</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="p-3 border-b border-[#1e2235] hover:bg-[#1e2235] transition-colors flex gap-3">
                                    <div className={`mt-0.5 ${n.type === 'success' ? 'text-green-500' : n.type === 'error' ? 'text-red-500' : 'text-blue-500'}`}>
                                        {n.type === 'success' ? <CheckCircle size={14} /> : n.type === 'error' ? <AlertTriangle size={14} /> : <Info size={14} />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-200">{n.title}</div>
                                        <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{n.message}</div>
                                        <div className="text-[9px] text-gray-600 mt-1">{n.time}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
        
        {/* Profile */}
        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white hover:ring-2 hover:ring-terminal-accent transition-all cursor-pointer shadow-inner border border-white/10">
            <User size={14} />
        </div>
      </div>
    </header>
  );
};
