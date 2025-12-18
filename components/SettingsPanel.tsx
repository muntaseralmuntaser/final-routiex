

import React, { useState } from 'react';
import { LanguageCode, SubscriptionPlan } from '../types';
import { getTranslation } from '../utils/translations';
import { Check, Shield, Cpu, Zap, CreditCard, Layout, Bell, Globe, Sliders, Smartphone, ArrowRight, Link, Copy, RefreshCw, Lock, Radio, Database, Server, Key, Terminal } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

const PLANS: SubscriptionPlan[] = [
    {
        id: 'free',
        name: 'freePlan',
        price: '$0',
        features: ['Basic Market Watch', '15m Delayed Data', 'Community Chat Access', '1 AI Analysis / Day'],
        color: 'var(--tier-bronze)'
    },
    {
        id: 'pro',
        name: 'proPlan',
        price: '$3',
        features: ['Real-time Data', 'Unlimited AI Projections', 'Unlimited Signals', 'Full Studio Access', 'Priority Support'],
        recommended: true,
        color: 'var(--tier-silver)'
    }
];

export const SettingsPanel: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [activeTab, setActiveTab] = useState<'platform' | 'billing' | 'ai' | 'security' | 'bridge'>('security');
    const [webhookVisible, setWebhookVisible] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    return (
        <div className="bg-terminal-panel border border-terminal-border rounded-lg h-full flex flex-col shadow-sm overflow-hidden">
            <div className="p-5 border-b border-terminal-border flex justify-between items-center bg-terminal-bg">
                <div>
                    <h2 className="text-xl font-bold text-terminal-text flex items-center gap-2">
                        <Sliders size={20} className="text-terminal-accent" />
                        {t('settings')}
                    </h2>
                    <p className="text-xs text-terminal-muted mt-1">Configure your Bayanat One workspace.</p>
                </div>
                <div className="px-3 py-1 bg-terminal-panel border border-terminal-border rounded text-[10px] font-mono text-terminal-muted flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    ID: 8842-AX-92
                </div>
            </div>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-terminal-border p-2 bg-terminal-bg/30 overflow-y-auto">
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider mb-2 px-3 mt-2 opacity-70">Account & Security</div>
                         <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 flex items-center gap-3 transition-all ${activeTab === 'security' ? 'bg-terminal-accent text-black font-bold shadow-sm' : 'text-terminal-muted hover:bg-terminal-panel hover:text-terminal-text'}`}
                        >
                            <Shield size={16} />
                            Security & Auth
                        </button>
                        
                        <div className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider mt-6 mb-2 px-3 opacity-70">Integration</div>
                         <button 
                            onClick={() => setActiveTab('bridge')}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 flex items-center gap-3 transition-all ${activeTab === 'bridge' ? 'bg-terminal-accent text-black font-bold shadow-sm' : 'text-terminal-muted hover:bg-terminal-panel hover:text-terminal-text'}`}
                        >
                            <Globe size={16} />
                            Platform Bridge
                        </button>

                        <div className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider mt-6 mb-2 px-3 opacity-70">Subscription</div>
                        <button 
                            onClick={() => setActiveTab('billing')}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 flex items-center gap-3 transition-all ${activeTab === 'billing' ? 'bg-terminal-accent text-black font-bold shadow-sm' : 'text-terminal-muted hover:bg-terminal-panel hover:text-terminal-text'}`}
                        >
                            <CreditCard size={16} />
                            {t('packages')}
                        </button>
                        
                        <div className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider mt-6 mb-2 px-3 opacity-70">System</div>
                        <button 
                            onClick={() => setActiveTab('platform')}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 flex items-center gap-3 transition-all ${activeTab === 'platform' ? 'bg-terminal-accent text-black font-bold shadow-sm' : 'text-terminal-muted hover:bg-terminal-panel hover:text-terminal-text'}`}
                        >
                            <Layout size={16} />
                            Chart & Terminal
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-md mb-1 flex items-center gap-3 transition-all ${activeTab === 'ai' ? 'bg-terminal-accent text-black font-bold shadow-sm' : 'text-terminal-muted hover:bg-terminal-panel hover:text-terminal-text'}`}
                        >
                            <Cpu size={16} />
                            AI Intelligence
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-terminal-panel">

                     {/* --- SECURITY TAB --- */}
                     {activeTab === 'security' && (
                        <div className="max-w-2xl animate-in fade-in duration-300 space-y-6">
                            <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                                <Key size={20} className="text-terminal-accent" /> Security Center
                            </h3>

                            {/* 2FA Toggle */}
                            <div className="bg-terminal-bg border border-terminal-border rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1">Two-Factor Authentication (2FA)</h4>
                                        <p className="text-xs text-gray-400">Secure your account with Google Authenticator.</p>
                                    </div>
                                    <div className={`relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer ${is2FAEnabled ? 'bg-green-500' : 'bg-gray-700'}`} onClick={() => setIs2FAEnabled(!is2FAEnabled)}>
                                        <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${is2FAEnabled ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                </div>
                                {is2FAEnabled && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                                        <Shield size={20} className="text-green-500" />
                                        <div className="text-xs text-green-200">
                                            <strong>Protected:</strong> 2FA is active on this account.
                                        </div>
                                    </div>
                                )}
                            </div>

                             {/* Login History */}
                             <div className="bg-terminal-bg border border-terminal-border rounded-xl p-6 shadow-sm">
                                <h4 className="text-sm font-bold text-white mb-4">Recent Activity</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs p-2 hover:bg-[#1a1a1a] rounded">
                                        <div className="flex items-center gap-3">
                                            <Globe size={14} className="text-gray-500" />
                                            <div>
                                                <div className="font-bold text-gray-300">New Login (Chrome)</div>
                                                <div className="text-gray-500">Riyadh, SA • 192.168.1.1</div>
                                            </div>
                                        </div>
                                        <div className="text-green-500 font-bold">Just Now</div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs p-2 hover:bg-[#1a1a1a] rounded">
                                        <div className="flex items-center gap-3">
                                            <Server size={14} className="text-gray-500" />
                                            <div>
                                                <div className="font-bold text-gray-300">API Key Created</div>
                                                <div className="text-gray-500">TradingView Bridge</div>
                                            </div>
                                        </div>
                                        <div className="text-gray-500">2 hours ago</div>
                                    </div>
                                </div>
                             </div>
                        </div>
                     )}

                    {/* --- API BRIDGE TAB (Enhanced) --- */}
                    {activeTab === 'bridge' && (
                        <div className="max-w-3xl animate-in fade-in duration-300 space-y-6">
                            
                            {/* Connected Platforms Grid */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="bg-[#1a1a1a] border border-green-500/50 p-4 rounded-xl relative overflow-hidden">
                                     <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ACTIVE
                                     </div>
                                     <div className="flex items-center gap-3 mb-3">
                                         <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-lg">MT5</div>
                                         <h4 className="font-bold text-sm text-white">MetaTrader 5</h4>
                                     </div>
                                     <div className="text-xs text-gray-400 mb-2">Account: 5002192</div>
                                     <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                         <div className="bg-green-500 h-full w-[95%]"></div>
                                     </div>
                                     <div className="text-[9px] text-gray-500 mt-1">Latency: 12ms</div>
                                 </div>

                                  <div className="bg-[#1a1a1a] border border-terminal-border p-4 rounded-xl relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                                     <div className="absolute top-2 right-2 text-[9px] font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                                         DISCONNECTED
                                     </div>
                                     <div className="flex items-center gap-3 mb-3">
                                         <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-lg">cT</div>
                                         <h4 className="font-bold text-sm text-white">cTrader</h4>
                                     </div>
                                     <button className="text-xs text-terminal-accent font-bold hover:underline">Connect Account</button>
                                 </div>
                             </div>

                            {/* Status Card */}
                            <div className="bg-[#2962FF]/10 border border-[#2962FF]/30 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Globe size={80} />
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 bg-[#2962FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                                        <Globe size={28} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">TradingView SaaS Bridge</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold text-green-500 uppercase tracking-wide">Active Connection</span>
                                            <span className="text-xs text-terminal-muted border-l border-terminal-border pl-2 ml-2">Synced to: Pikigvc/TV Cloud</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Webhook Configuration */}
                            <div className="bg-terminal-bg border border-terminal-border rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-bold text-sm text-terminal-text flex items-center gap-2">
                                            <Radio size={16} className="text-terminal-accent" />
                                            Alert Webhook Configuration
                                        </h3>
                                        <p className="text-xs text-terminal-muted mt-1">Use this URL in your TradingView alerts to trigger auto-trading.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-terminal-muted block mb-1">Secure Webhook URL</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-terminal-panel border border-terminal-border rounded flex items-center px-3 py-2">
                                                <span className="text-xs font-mono text-terminal-text truncate">
                                                    https://api.routiex.com/v1/hooks/tv-signal/{webhookVisible ? '8829-secure-ax' : '••••••••••••••'}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => setWebhookVisible(!webhookVisible)}
                                                className="p-2 bg-terminal-panel border border-terminal-border rounded hover:text-white text-terminal-muted"
                                            >
                                                {webhookVisible ? <Zap size={14}/> : <Lock size={14}/>}
                                            </button>
                                            <button className="p-2 bg-terminal-accent text-black rounded font-bold hover:bg-amber-400">
                                                <Copy size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* --- BILLING TAB --- */}
                    {activeTab === 'billing' && (
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-terminal-text">Bayanat Packages</h3>
                                <p className="text-sm text-terminal-muted">Choose the power level that fits your trading style.</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PLANS.map((plan) => (
                                    <div key={plan.id} className={`relative bg-terminal-bg border rounded-xl p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${plan.recommended ? 'border-terminal-accent ring-1 ring-terminal-accent/20' : 'border-terminal-border'}`}>
                                        {plan.recommended && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terminal-accent text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                                RECOMMENDED
                                            </div>
                                        )}
                                        
                                        <div className="mb-4 text-center pt-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-terminal-muted">{t(plan.name)}</h4>
                                            <div className="mt-4 text-4xl font-black text-terminal-text tracking-tight" style={{color: plan.recommended ? 'var(--accent)' : 'inherit'}}>{plan.price}<span className="text-sm font-medium text-terminal-muted ml-1">/mo</span></div>
                                        </div>

                                        <div className="flex-1 mt-4 mb-8 bg-terminal-panel/50 rounded-lg p-4 border border-terminal-border/50">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-xs font-medium text-terminal-text">
                                                        <div className="mt-0.5">
                                                            <Check size={12} className="text-terminal-success" strokeWidth={3} />
                                                        </div>
                                                        <span className="leading-tight opacity-90">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                                            plan.recommended 
                                            ? 'bg-terminal-accent text-black hover:bg-amber-400 shadow-lg shadow-terminal-accent/20' 
                                            : 'bg-terminal-panel border border-terminal-border text-terminal-text hover:bg-terminal-border'
                                        }`}>
                                            {plan.id === 'pro' ? t('currentPlan') : t('upgrade')}
                                            {plan.id !== 'pro' && <ArrowRight size={12} />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- PLATFORM TAB --- */}
                    {activeTab === 'platform' && (
                        <div className="max-w-2xl animate-in fade-in duration-300 space-y-8">
                            
                            <div className="bg-terminal-bg border border-terminal-border rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-lg text-terminal-text mb-4 flex items-center gap-2">
                                    <Layout size={20} className="text-terminal-accent"/>
                                    Chart Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-terminal-muted mb-2">Candlestick Style</label>
                                        <select className="w-full bg-terminal-panel border border-terminal-border rounded-md p-2.5 text-sm text-terminal-text outline-none focus:border-terminal-accent transition-colors">
                                            <option>Traditional (Green/Red)</option>
                                            <option>Hollow Candles</option>
                                            <option>Heikin Ashi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-terminal-muted mb-2">Timezone</label>
                                        <select className="w-full bg-terminal-panel border border-terminal-border rounded-md p-2.5 text-sm text-terminal-text outline-none focus:border-terminal-accent transition-colors">
                                            <option>UTC+0 (London)</option>
                                            <option>UTC-5 (New York)</option>
                                            <option>UTC+4 (Dubai)</option>
                                            <option>UTC+3 (Riyadh)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-terminal-bg border border-terminal-border rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-lg text-terminal-text mb-4 flex items-center gap-2">
                                    <Bell size={20} className="text-terminal-accent"/>
                                    Sound & Alerts
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-terminal-text">Trade Execution Sound</span>
                                        <input type="checkbox" className="accent-terminal-accent w-4 h-4" defaultChecked />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="text-sm text-terminal-text">Price Alert Popups</span>
                                        <input type="checkbox" className="accent-terminal-accent w-4 h-4" defaultChecked />
                                    </label>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* --- AI TAB --- */}
                    {activeTab === 'ai' && (
                        <div className="max-w-2xl animate-in fade-in duration-300">
                            <div className="space-y-6">
                                <div className="bg-terminal-bg border border-terminal-border rounded-lg p-6 shadow-sm">
                                    <label className="block text-sm font-bold text-terminal-text mb-2">Risk Appetite Profile</label>
                                    <select className="w-full bg-terminal-panel border border-terminal-border rounded-md p-3 text-sm text-terminal-text outline-none focus:border-terminal-accent transition-colors">
                                        <option>Conservative (Low Drawdown focus)</option>
                                        <option selected>Balanced (Standard Growth)</option>
                                        <option>Aggressive (High High Yield)</option>
                                    </select>
                                    <p className="text-xs text-terminal-muted mt-2">This sets the baseline for AI suggested Stop Losses and Lot sizing.</p>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-terminal-accent/10 border border-terminal-accent/30 rounded-lg text-terminal-accent text-sm font-medium">
                                    <Zap size={18} fill="currentColor" />
                                    <span>Gemini 2.5 Pro Model Active (Low Latency)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};