
import React, { useState } from 'react';
import { LanguageCode, Transaction } from '../types';
import { getTranslation } from '../utils/translations';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, Building, Bitcoin, RefreshCw, CheckCircle, History, TrendingUp, Maximize2, CreditCard as CardIcon, Globe, Shield, Wifi, ShieldCheck, Settings, Key, Server } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface Props {
    lang: LanguageCode;
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'tx-1', type: 'DEPOSIT', method: 'USDT (TRC20)', amount: 5000, status: 'COMPLETED', date: '2024-03-10 14:30' },
    { id: 'tx-2', type: 'WITHDRAWAL', method: 'Binance Pay', amount: 1200, status: 'COMPLETED', date: '2024-03-08 09:15' },
];

const PERFORMANCE_DATA = [
    { name: 'Mon', value: 10000 }, { name: 'Tue', value: 10500 }, { name: 'Wed', value: 10200 },
    { name: 'Thu', value: 11000 }, { name: 'Fri', value: 12500 }, { name: 'Sat', value: 12800 }, { name: 'Sun', value: 14250 },
];

export const PortfolioManager: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'deposit' | 'settings'>('overview');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [amount, setAmount] = useState('');

    const renderCardsTab = () => (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative group perspective-1000">
                <div className="w-[420px] h-[260px] bg-gradient-to-br from-[#0a0a0a] to-[#2a2a2a] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden transform transition-transform duration-500 group-hover:rotate-y-12 preserve-3d">
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div className="flex justify-between items-start"><span className="font-black text-2xl tracking-tighter text-white italic">ROUTIEX</span><Wifi size={24} className="text-gray-500 rotate-90" /></div>
                        <div className="flex items-center gap-4"><div className="w-12 h-8 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-md"></div><div className="flex items-center gap-2"><span className="text-white font-mono text-lg tracking-widest">•••• •••• •••• 4291</span></div></div>
                        <div className="flex justify-between items-end"><div><div className="text-[9px] text-gray-400 uppercase">Card Holder</div><div className="text-sm font-bold text-white tracking-widest uppercase">AHMED AL-SAUD</div></div><div className="text-white/80 font-bold italic text-xl">VISA</div></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                </div>
            </div>
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-black text-white mb-2">Routiex Black Card</h2>
                <p className="text-gray-400 text-sm mb-6">Spend your trading profits instantly worldwide. Up to 5% crypto-back rewards.</p>
                <button className="bg-terminal-accent text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-lg shadow-terminal-accent/20">Apply for Waitlist</button>
                <div className="mt-4 text-[10px] text-gray-600 uppercase font-bold">Coming Q4 2024</div>
            </div>
        </div>
    );

    const renderSettingsTab = () => (
        <div className="max-w-3xl mx-auto w-full space-y-6">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2"><Settings size={24} /> Payment Gateway Settings</h2>
            
            <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Server size={18} className="text-terminal-accent" /> API Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Merchant ID</label>
                        <input type="text" value="MERCH-8821-X92" readOnly className="w-full bg-[#050508] border border-[#1e2235] rounded p-3 text-sm text-gray-400 font-mono" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Secret Key</label>
                        <div className="flex gap-2">
                            <input type="password" value="sk_live_291039120391203" readOnly className="flex-1 bg-[#050508] border border-[#1e2235] rounded p-3 text-sm text-gray-400 font-mono" />
                            <button className="bg-[#1e2235] text-white px-4 rounded font-bold text-xs hover:bg-terminal-accent hover:text-black">Regenerate</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-green-500" /> Webhook Endpoints</h3>
                <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Deposit Notification URL</label>
                        <input type="text" placeholder="https://your-server.com/api/deposit" className="w-full bg-[#050508] border border-[#1e2235] rounded p-3 text-sm text-white outline-none focus:border-terminal-accent" />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button className="bg-terminal-accent text-black px-6 py-2 rounded-lg font-bold hover:bg-white">Save Configuration</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#050508] p-4 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-4 border-b border-[#1e2235] pb-2">
                <button onClick={() => setActiveTab('overview')} className={`pb-2 text-sm font-bold uppercase transition-colors ${activeTab === 'overview' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-gray-500'}`}>Overview</button>
                <button onClick={() => setActiveTab('cards')} className={`pb-2 text-sm font-bold uppercase transition-colors ${activeTab === 'cards' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-gray-500'}`}>Routiex Card</button>
                <button onClick={() => setActiveTab('deposit')} className={`pb-2 text-sm font-bold uppercase transition-colors ${activeTab === 'deposit' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-gray-500'}`}>Deposit / Withdraw</button>
                <button onClick={() => setActiveTab('settings')} className={`pb-2 text-sm font-bold uppercase transition-colors ${activeTab === 'settings' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-gray-500'}`}>Settings</button>
            </div>

            {activeTab === 'cards' && renderCardsTab()}
            {activeTab === 'settings' && renderSettingsTab()}

            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-gradient-to-br from-[#0f111a] to-[#1a1a1a] border border-[#1e2235] rounded-xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10 flex justify-between items-start mb-6"><div><span className="text-gray-500 text-sm font-bold uppercase tracking-widest">{t('walletBalance')}</span><h2 className="text-5xl font-black text-white mt-2 tracking-tight">$14,250<span className="text-2xl text-gray-500 font-medium">.00</span></h2></div><div className="p-2 bg-white/5 rounded-lg border border-white/10"><Maximize2 size={20} className="text-terminal-accent" /></div></div>
                            <div className="h-32 w-full" style={{ minHeight: 128 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PERFORMANCE_DATA}><defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} /><Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} /></AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6 flex flex-col gap-4">
                            <div className="text-sm font-bold text-gray-400 uppercase">Quick Actions</div>
                            <button className="w-full py-4 bg-terminal-accent text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"><ArrowDownLeft size={20} /> Deposit</button>
                            <button className="w-full py-4 bg-[#1e2235] text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#2a2f45] transition-colors"><ArrowUpRight size={20} /> Withdraw</button>
                            <div className="mt-auto pt-4 border-t border-[#1e2235]"><div className="text-xs text-gray-500 flex justify-between"><span>Monthly Limit</span><span className="text-white">$50,000 / $100,000</span></div><div className="w-full bg-[#111] h-1.5 rounded-full mt-2"><div className="h-full bg-blue-500 w-1/2 rounded-full"></div></div></div>
                        </div>
                    </div>
                    <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl flex-1 overflow-hidden">
                        <div className="p-4 border-b border-[#1e2235] flex justify-between items-center"><h3 className="font-bold text-white flex items-center gap-2"><History size={16} className="text-blue-500" /> Recent Transactions</h3></div>
                        <table className="w-full text-left"><thead className="bg-[#050508] text-xs font-bold text-gray-500 uppercase"><tr><th className="p-4">Type</th><th className="p-4">Method</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4 text-right">Amount</th></tr></thead><tbody className="text-xs text-white">{MOCK_TRANSACTIONS.map(tx => (<tr key={tx.id} className="border-b border-[#1e2235] hover:bg-[#1e2235]"><td className="p-4"><span className={`px-2 py-1 rounded font-bold text-[10px] ${tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{tx.type}</span></td><td className="p-4">{tx.method}</td><td className="p-4 text-gray-500">{tx.date}</td><td className="p-4 text-green-500 font-bold">{tx.status}</td><td className="p-4 text-right font-mono font-bold">{tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount}</td></tr>))}</tbody></table>
                    </div>
                </>
            )}

            {activeTab === 'deposit' && (
                <div className="max-w-2xl mx-auto w-full bg-[#0f111a] border border-[#1e2235] rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Select Payment Method</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">{[{ id: 'crypto', label: 'Crypto (USDT)', icon: Bitcoin, color: 'text-green-500' }, { id: 'card', label: 'Credit Card', icon: CreditCard, color: 'text-blue-500' }, { id: 'bank', label: 'Bank Transfer', icon: Building, color: 'text-gray-400' }, { id: 'binance', label: 'Binance Pay', icon: RefreshCw, color: 'text-yellow-500' }].map(m => (<button key={m.id} onClick={() => setSelectedMethod(m.id)} className={`p-4 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all h-32 ${selectedMethod === m.id ? 'bg-blue-900/20 border-blue-500 text-white' : 'bg-[#050508] border-[#1e2235] text-gray-500 hover:border-gray-400'}`}><m.icon size={32} className={m.color} /><span className="font-bold text-sm">{m.label}</span></button>))}</div>
                    <div className="space-y-4"><label className="text-xs font-bold text-gray-500 uppercase block">Amount (USD)</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min: $50.00" className="w-full bg-[#050508] border border-[#1e2235] rounded-lg p-4 text-xl font-mono text-white outline-none focus:border-terminal-accent" /><button className="w-full bg-terminal-accent text-black font-bold py-4 rounded-lg hover:bg-white transition-colors">Proceed to Payment</button><div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 mt-4"><ShieldCheck size={12} /> Secure 256-bit SSL Encrypted Payment</div></div>
                </div>
            )}
        </div>
    );
};
