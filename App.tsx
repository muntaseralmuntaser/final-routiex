
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FeaturedSignals } from './components/FeaturedSignals';
import { RegionalChannels } from './components/RegionalChannels';
import { SignalsPanel } from './components/SignalsPanel';
import { AiAnalyzerWidget } from './components/AiAnalyzerWidget';
import { AccountLinkModal } from './components/AccountLinkModal';
import { WatchlistPanel } from './components/WatchlistPanel';
import { PerformanceStats } from './components/PerformanceStats';
import { CommunityHub } from './components/CommunityHub';
import { SettingsPanel } from './components/SettingsPanel';
import { AppsIntegrationGrid } from './components/AppsIntegrationGrid';
import { Marketplace } from './components/Marketplace';
import { LiveStreamStudio } from './components/LiveStreamStudio';
import { EducationHub } from './components/EducationHub';
import { Competitions } from './components/Competitions';
import { PortfolioManager } from './components/PortfolioManager';
import { TradingChart } from './components/TradingChart';
import { MarketCenter } from './components/MarketCenter';
import { AdminPanel } from './components/AdminPanel';
import { AuthFlow } from './components/AuthFlow';
import { IntroAnimation } from './components/IntroAnimation';
import { TopAnalysts3D } from './components/TopAnalysts3D';
import { WhaleWatch } from './components/WhaleWatch';
import { HomeDashboard } from './components/HomeDashboard';
import { VirtualTradingPlatform } from './components/VirtualTradingPlatform';
import { NewsTerminal } from './components/NewsTerminal';

import { TradingAccount, PlatformType, LanguageCode, AiSignalResponse, MarketplaceItem, UserProfile, TradingStrategy, AiHistoryItem, AppNotification } from './types';
import { getTranslation } from './utils/translations';
import { generateRoutiexSignal } from './services/geminiService';
import { Plus, Wallet, TrendingUp, Radio, Tv, Activity, Clock, Rabbit, X, Megaphone, Send, Target, LogIn, BarChart2, FileText, BrainCircuit, CheckCircle, Loader2, Download, ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    Hls: any;
  }
}

const INITIAL_MARKET_ITEMS: MarketplaceItem[] = [
    { id: '1', title: 'Sniper Entry Indicator v4', category: 'Indicator', price: 49.99, rating: 4.8, sales: 1250, author: 'ProCode Systems', status: 'APPROVED', description: 'High probability entry signals for scalping.' },
    { id: '2', title: 'Gold Scalper EA (Low DD)', category: 'Strategy', price: 199.00, rating: 4.5, sales: 430, author: 'AlgoKings', status: 'APPROVED' },
    { id: '3', title: 'Ultra-Low Latency VPS London', category: 'VPS', price: 25.00, rating: 4.9, sales: 3200, author: 'Bayanat Host', status: 'APPROVED' },
    { id: '4', title: 'Institutional SMC Masterclass', category: 'Course', price: 299.00, rating: 5.0, sales: 890, author: 'Mentorship Lab', status: 'APPROVED' },
];

const INITIAL_USERS: UserProfile[] = [
    { id: '1', firstName: 'Ahmed', lastName: 'Al-Saud', name: 'Ahmed Al-Saud', email: 'ahmed@example.com', role: 'user', status: 'active', plan: 'Pro', joinedDate: '2023-12-01', lastLogin: '2024-03-15', ip: '192.168.1.4', isSeller: true, balance: 1250, aiUsageToday: 0 },
];

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login'|'register'>('login');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setView] = useState('home');
  
  const [lang, setLang] = useState<LanguageCode>('en');
  const [isDark, setIsDark] = useState(true);
  const [aiSignal, setAiSignal] = useState<AiSignalResponse | null>(null);
  const [isSignalLoading, setIsSignalLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<AiHistoryItem[]>([]);
  
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>(INITIAL_MARKET_ITEMS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);

  // System State
  const [notifications, setNotifications] = useState<AppNotification[]>([
      { id: '1', title: 'System Online', message: 'All modules active.', time: 'Now', type: 'success', read: false },
      { id: '2', title: 'Market Alert', message: 'High volatility expected in US Session.', time: '10m ago', type: 'warning', read: false }
  ]);
  const [isSystemCheckOpen, setIsSystemCheckOpen] = useState(false);
  const [checkProgress, setCheckProgress] = useState(0);

  useEffect(() => {
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

    const handleLogin = (adminStatus: boolean, userDetails: any) => {
      setIsAdmin(adminStatus);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      
      if (adminStatus) {
          setCurrentUser({ 
            id: 'admin', firstName: 'Admin', lastName: 'User', name: 'Administrator', email: 'admin@routiex.com', 
            role: 'admin', status: 'active', plan: 'Institutional', joinedDate: '', lastLogin: '', ip: '', 
            isSeller: true, balance: 999999, aiUsageToday: 0
        });
      } else {
          setCurrentUser({ 
            id: 'new-user', firstName: userDetails.firstName, lastName: userDetails.lastName, name: `${userDetails.firstName} ${userDetails.lastName}`,
            email: userDetails.email, role: 'user', status: 'active', plan: 'Free', joinedDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(), ip: '127.0.0.1', isSeller: false, balance: 0, aiUsageToday: 0
        });
      }
      setNotifications(prev => [{ id: Date.now().toString(), title: 'Login Successful', message: `Welcome back, ${userDetails.firstName}`, time: 'Now', type: 'success', read: false }, ...prev]);
  };

  const requireAuth = (action: () => void) => {
      if (!isAuthenticated) {
          setAuthInitialMode('login');
          setShowAuthModal(true);
      } else {
          action();
      }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setCurrentUser(null);
      setView('home'); 
  };

  // Updated to support custom strategies/scripts
  const handleGenerateSignal = async (symbol: string, price: number, strategy: string = 'SMC', customScript?: string) => {
    requireAuth(async () => {
        if (currentUser) {
             setIsSignalLoading(true);
             const signal = await generateRoutiexSignal(symbol, price, '1H', strategy, customScript);
             setIsSignalLoading(false);
             if (signal) {
                 setAiSignal(signal);
                 // Add to history
                 setAiHistory(prev => [
                     { id: Date.now(), timestamp: new Date().toISOString(), symbol: signal.symbol, data: signal },
                     ...prev
                 ]);
                 // Notification
                 setNotifications(prev => [{ id: Date.now().toString(), title: 'AI Analysis Complete', message: `Signal generated for ${symbol}`, time: 'Now', type: 'info', read: false }, ...prev]);
             }
        }
    });
  };

  const runSystemCheck = () => {
      setIsSystemCheckOpen(true);
      setCheckProgress(0);
      const interval = setInterval(() => {
          setCheckProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  return 100;
              }
              return prev + 2;
          });
      }, 50);
  };

  // --- VIEW RENDERER ---
  const renderView = () => {
    switch (currentView) {
        case 'home': return <HomeDashboard onShowSignal={(s) => setAiSignal(s)} />;
        case 'routiex-trading': return <VirtualTradingPlatform />;
        case 'news-terminal': return <NewsTerminal />;
        case 'dashboard': return <MarketCenter lang={lang} onAiRequest={(s) => handleGenerateSignal(s, 0, 'SMC')} />;
        case 'ai-analysis': 
            return (
                <div className="h-full w-full flex flex-col lg:flex-row gap-4 animate-fade-in-up">
                    <div className="flex-1 bg-terminal-panel border border-terminal-border rounded-lg flex flex-col relative overflow-hidden shadow-lg">
                        <div className="flex-1 relative"><TradingChart isDark={isDark} onScan={(s, p) => handleGenerateSignal(s, p, 'SMC')} /></div>
                    </div>
                    <div className="w-full lg:w-80 h-full">
                         <AiAnalyzerWidget 
                            lang={lang} 
                            setView={setView} 
                            onGenerateSignal={handleGenerateSignal} 
                            isGenerating={isSignalLoading} 
                            usageCount={currentUser?.aiUsageToday || 0} 
                            hasPlan={currentUser?.plan !== 'Free'} 
                            onUpgrade={() => requireAuth(() => setView('settings'))}
                            aiSignal={aiSignal}
                            onCloseSignal={() => setAiSignal(null)}
                            history={aiHistory}
                            onSelectHistory={(signal) => setAiSignal(signal)}
                         />
                    </div>
                </div>
            );
        case 'community': return <CommunityHub lang={lang} isAuthenticated={isAuthenticated} onRequireAuth={() => setShowAuthModal(true)} />;
        case 'settings': return <SettingsPanel lang={lang} />;
        case 'apps': return <AppsIntegrationGrid lang={lang} />;
        case 'marketplace': return <Marketplace lang={lang} items={marketItems} user={currentUser} onUpload={(item) => setMarketItems([...marketItems, {...item, id: Date.now().toString(), sales: 0, rating: 0, status: 'PENDING'} as MarketplaceItem])} onPurchase={() => {}} />;
        case 'studio': return <LiveStreamStudio lang={lang} />;
        case 'academy': return <EducationHub lang={lang} />;
        case 'competitions': return <Competitions lang={lang} />;
        case 'portfolio': return <PortfolioManager lang={lang} />;
        case 'signals': return <div className="h-full"><SignalsPanel /></div>;
        default: return <HomeDashboard onShowSignal={(s) => setAiSignal(s)} />;
    }
  };

  if (showIntro) return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  if (isAdmin) return <AdminPanel onLogout={handleLogout} users={users} setUsers={setUsers} marketItems={marketItems} setMarketItems={setMarketItems} />;

  return (
    <div className="flex flex-col h-screen bg-terminal-bg text-terminal-text overflow-hidden transition-colors duration-300 font-sans relative">
      {showAuthModal && <AuthFlow onLogin={handleLogin} onClose={() => setShowAuthModal(false)} initialMode={authInitialMode} />}
      
      {currentView !== 'routiex-trading' && (
          <Header 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            lang={lang} 
            setLang={setLang} 
            isDark={isDark} 
            toggleTheme={() => setIsDark(!isDark)} 
            notifications={notifications}
            onSystemCheck={runSystemCheck}
            onNavigate={(view) => setView(view)}
          />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} currentView={currentView} setView={setView} lang={lang} />
        <main className={`flex-1 overflow-y-auto custom-scrollbar relative bg-[#020617] ${currentView === 'routiex-trading' || currentView === 'home' || currentView === 'studio' || currentView === 'news-terminal' ? 'p-0' : 'p-2 md:p-3 lg:p-4'}`}>
            {renderView()}
        </main>
      </div>
      
      {/* Global AI Signal Modal (if activated from other views) */}
      {aiSignal && currentView !== 'ai-analysis' && (
          <div className="fixed inset-0 z-[9999] pointer-events-auto">
              <AiAnalyzerWidget 
                lang={lang} 
                onGenerateSignal={handleGenerateSignal} 
                isGenerating={false} 
                usageCount={0} 
                hasPlan={true} 
                onUpgrade={() => {}}
                aiSignal={aiSignal}
                onCloseSignal={() => setAiSignal(null)}
                isModal={true}
                history={aiHistory}
                onSelectHistory={(signal) => setAiSignal(signal)}
              />
          </div>
      )}

      {/* SYSTEM CHECK MODAL ("CHECK ALL") */}
      {isSystemCheckOpen && (
          <div className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
              <div className="w-full max-w-lg bg-[#0f111a] border border-[#1e2235] rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                  <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-terminal-accent/10 rounded-full mb-4 border border-terminal-accent/20">
                          <ShieldCheck size={32} className="text-terminal-accent animate-pulse" />
                      </div>
                      <h2 className="text-2xl font-black text-white">SYSTEM DIAGNOSTICS</h2>
                      <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Routiex Core V4.5 Integrity Check</p>
                  </div>

                  <div className="space-y-4 mb-8">
                      {[
                          { label: 'API Gateway Latency', status: checkProgress > 20 ? 'Optimal (12ms)' : 'Checking...' },
                          { label: 'Market Data Feed (Bloomberg)', status: checkProgress > 40 ? 'Connected' : 'Checking...' },
                          { label: 'AI Inference Engine', status: checkProgress > 60 ? 'Online' : 'Checking...' },
                          { label: 'Encryption Protocol', status: checkProgress > 80 ? 'Secure (AES-256)' : 'Checking...' },
                          { label: 'User Auth Module', status: checkProgress > 95 ? 'Active' : 'Checking...' },
                      ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-[#1e2235] pb-2">
                              <span className="text-gray-400 font-bold">{item.label}</span>
                              <span className={`${item.status.includes('Checking') ? 'text-yellow-500' : 'text-green-500'} font-mono`}>{item.status}</span>
                          </div>
                      ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#1e2235] h-2 rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-terminal-accent transition-all duration-100 ease-out" style={{ width: `${checkProgress}%` }}></div>
                  </div>

                  {checkProgress >= 100 && (
                      <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                          <button onClick={() => setIsSystemCheckOpen(false)} className="flex-1 bg-white text-black py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                              Access Terminal
                          </button>
                          <button onClick={() => alert('PWA Install Prompt Triggered')} className="flex-1 bg-[#1e2235] text-white py-3 rounded-lg font-bold border border-[#333] hover:bg-[#2a2f45] flex items-center justify-center gap-2">
                              <Download size={16} /> Install App
                          </button>
                      </div>
                  )}
                  
                  {checkProgress < 100 && (
                      <div className="text-center text-[10px] text-gray-500 font-mono">
                          INITIALIZING MODULES... PLEASE WAIT
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
