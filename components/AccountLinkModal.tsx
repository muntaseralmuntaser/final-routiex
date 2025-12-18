import React, { useState } from 'react';
import { X, Server, ShieldCheck, Globe, CheckCircle, Loader2, ArrowRight, Lock, Layers, AlertCircle, Cloud, Zap } from 'lucide-react';
import { PlatformType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (details: any) => void;
}

export const AccountLinkModal: React.FC<Props> = ({ isOpen, onClose, onConnect }) => {
  const [platform, setPlatform] = useState<PlatformType>(PlatformType.TRADINGVIEW);
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'IDLE' | 'CONSENT' | 'CONNECTING' | 'SUCCESS'>('IDLE');

  if (!isOpen) return null;

  const startTradingViewFlow = () => {
      setAuthStep('CONSENT');
  };

  const confirmTradingViewAuth = () => {
      setAuthStep('CONNECTING');
      // Simulate OAuth Handshake / Token Exchange
      setTimeout(() => {
          setAuthStep('SUCCESS');
          setTimeout(() => {
            onConnect({ platform: PlatformType.TRADINGVIEW, id: 'tv_' + Date.now().toString() });
            setIsLoading(false);
            onClose();
          }, 1500);
      }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate connection delay
    setTimeout(() => {
        setIsLoading(false);
        onConnect({ platform, id: Date.now().toString() });
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-terminal-panel border border-terminal-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terminal-accent via-purple-500 to-terminal-accent"></div>
        
        <div className="flex justify-between items-center p-5 border-b border-terminal-border bg-terminal-bg">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cloud size={18} className="text-terminal-accent" />
            Link Platform
          </h2>
          <button onClick={onClose} className="text-terminal-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
            {/* TRADINGVIEW OAUTH FLOW */}
            {authStep === 'IDLE' && (
                <div className="mb-6">
                     <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2962FF]/10 mb-2">
                            <Globe size={24} className="text-[#2962FF]" />
                        </div>
                        <h3 className="text-white font-bold">Connect TradingView</h3>
                        <p className="text-xs text-terminal-muted">Sync your charts, alerts, and positions instantly.</p>
                     </div>

                    <button 
                        onClick={startTradingViewFlow}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#2962FF] to-[#1E53E5] hover:from-[#1E53E5] hover:to-[#2962FF] text-white font-bold py-4 rounded-lg transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3 relative overflow-hidden group border border-white/10"
                    >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                        <Globe size={24} />
                        <span className="text-sm tracking-wide">Log in with TradingView</span>
                        <Zap size={16} className="text-yellow-300 animate-pulse ml-auto mr-2" fill="currentColor" />
                    </button>
                    <p className="text-[10px] text-center text-terminal-muted mt-3 flex items-center justify-center gap-1.5">
                        <ShieldCheck size={12} className="text-green-500"/> 
                        <span>Official SaaS Integration • End-to-End Encrypted</span>
                    </p>
                </div>
            )}

            {authStep === 'CONSENT' && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                     <div className="flex items-center justify-between mb-6 px-4">
                         <div className="w-12 h-12 bg-[#2962FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                             <Globe size={28} />
                         </div>
                         <div className="h-px flex-1 bg-terminal-border mx-4 relative">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-terminal-panel p-1 rounded-full border border-terminal-border">
                                 <ArrowRight size={12} className="text-terminal-muted" />
                             </div>
                         </div>
                         <div className="w-12 h-12 bg-terminal-accent rounded-xl flex items-center justify-center text-black shadow-lg">
                             <Layers size={28} />
                         </div>
                     </div>
                     
                     <div className="text-center mb-6">
                         <h3 className="text-lg font-bold text-white mb-1">Authorize Routiex SaaS?</h3>
                         <p className="text-xs text-terminal-muted">Routiex requests access to your TradingView account to:</p>
                     </div>

                     <div className="space-y-3 mb-6">
                         <div className="flex items-start gap-3 p-3 bg-terminal-bg rounded border border-terminal-border">
                             <CheckCircle size={16} className="text-green-500 mt-0.5" />
                             <div>
                                 <div className="text-xs font-bold text-white">Sync All Accounts</div>
                                 <div className="text-[10px] text-terminal-muted">Read balance and equity from all linked brokers.</div>
                             </div>
                         </div>
                         <div className="flex items-start gap-3 p-3 bg-terminal-bg rounded border border-terminal-border">
                             <CheckCircle size={16} className="text-green-500 mt-0.5" />
                             <div>
                                 <div className="text-xs font-bold text-white">API Bridge Access</div>
                                 <div className="text-[10px] text-terminal-muted">Enable bi-directional signal execution.</div>
                             </div>
                         </div>
                     </div>

                     <div className="flex gap-3">
                         <button onClick={() => setAuthStep('IDLE')} className="flex-1 py-3 border border-terminal-border rounded-lg text-xs font-bold text-terminal-muted hover:bg-terminal-bg hover:text-white transition-colors">Cancel</button>
                         <button onClick={confirmTradingViewAuth} className="flex-1 py-3 bg-terminal-accent text-black rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-terminal-accent/10">Authorize & Connect</button>
                     </div>
                 </div>
            )}

            {authStep === 'CONNECTING' && (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in-95">
                     <div className="relative mb-6">
                         <div className="w-20 h-20 rounded-full border-4 border-terminal-border border-t-terminal-accent animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Lock size={24} className="text-terminal-accent" />
                         </div>
                     </div>
                     <h3 className="text-lg font-bold text-white mb-2">Establishing API Bridge...</h3>
                     <p className="text-xs text-terminal-muted">Exchanging secure keys with Pikigvc/TradingView.</p>
                </div>
            )}

            {authStep === 'SUCCESS' && (
                <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in-95">
                     <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                         <CheckCircle size={40} className="text-green-500" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">SaaS Connection Active</h3>
                     <p className="text-xs text-terminal-muted">Your TradingView account is now fully synced.</p>
                </div>
            )}

            {/* MANUAL LOGIN DIVIDER */}
            {authStep === 'IDLE' && (
                <>
                    <div className="relative flex py-2 items-center my-4">
                        <div className="flex-grow border-t border-terminal-border"></div>
                        <span className="flex-shrink-0 mx-4 text-[10px] text-terminal-muted uppercase font-bold">Or Connect Broker Direct</span>
                        <div className="flex-grow border-t border-terminal-border"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {Object.values(PlatformType).filter(p => p !== 'TradingView').map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPlatform(p)}
                                    className={`py-2 text-[10px] font-bold border rounded transition-all ${
                                        platform === p 
                                        ? 'bg-terminal-accent text-black border-terminal-accent' 
                                        : 'bg-transparent text-terminal-muted border-terminal-border hover:border-terminal-muted'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-terminal-muted font-bold">Login ID</label>
                            <input required type="text" className="w-full bg-terminal-bg border border-terminal-border rounded p-2.5 text-sm text-white focus:border-terminal-accent outline-none transition-colors placeholder-terminal-muted/30" placeholder="Account Number" />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs text-terminal-muted font-bold">Investor Password</label>
                            <input required type="password" className="w-full bg-terminal-bg border border-terminal-border rounded p-2.5 text-sm text-white focus:border-terminal-accent outline-none transition-colors placeholder-terminal-muted/30" placeholder="••••••••••••" />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-terminal-bg border border-terminal-border text-terminal-text font-bold py-3 rounded-lg mt-2 hover:bg-terminal-panel hover:border-terminal-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center hover:text-white"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Connect Manual Terminal'}
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
};