

import React, { useState } from 'react';
import { LanguageCode, IntegrationApp } from '../types';
import { getTranslation } from '../utils/translations';
import { Check, Plus, Search, Link2, Youtube, Twitter, MessageCircle, Globe, DollarSign, BarChart3, Wallet, Cpu, Cloud, ShoppingCart, Server, Shield, CreditCard } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

// Helper to generate mock data
const generateApps = (): IntegrationApp[] => {
    const base: IntegrationApp[] = [
        { id: 'mt4', name: 'MetaTrader 4', category: 'Trading', icon: BarChart3, connected: true, description: 'Classic Forex Terminal' },
        { id: 'mt5', name: 'MetaTrader 5', category: 'Trading', icon: BarChart3, connected: true, description: 'Multi-asset Platform' },
        { id: 'ctrader', name: 'cTrader', category: 'Trading', icon: BarChart3, connected: false, description: 'Direct STP Access' },
        { id: 'tv', name: 'TradingView', category: 'Tools', icon: Globe, connected: true, description: 'Advanced Charting' },
        { id: 'binance', name: 'Binance', category: 'Crypto', icon: DollarSign, connected: true, description: 'Leading Crypto Exchange' },
        { id: 'coinbase', name: 'Coinbase', category: 'Crypto', icon: Wallet, connected: false, description: 'Secure Crypto Wallet' },
        { id: 'telegram', name: 'Telegram', category: 'Social', icon: MessageCircle, connected: true, description: 'Messaging & Signals' },
        { id: 'discord', name: 'Discord', category: 'Social', icon: MessageCircle, connected: false, description: 'Community Hub' },
        { id: 'twitter', name: 'X (Twitter)', category: 'Social', icon: Twitter, connected: true, description: 'News Feed Sync' },
        { id: 'youtube', name: 'YouTube', category: 'Social', icon: Youtube, connected: true, description: 'Live Streaming' },
        { id: 'tiktok', name: 'TikTok', category: 'Social', icon: MessageCircle, connected: false, description: 'Short Video Feed' },
        { id: 'openai', name: 'OpenAI', category: 'AI', icon: Cpu, connected: true, description: 'GPT-4 Analysis' },
        { id: 'gemini', name: 'Google Gemini', category: 'AI', icon: Cpu, connected: true, description: 'Google AI Engine' },
        { id: 'stripe', name: 'Stripe', category: 'Payment', icon: CreditCard, connected: false, description: 'Payment Gateway' },
        { id: 'paypal', name: 'PayPal', category: 'Payment', icon: CreditCard, connected: false, description: 'Global Payments' },
        { id: 'aws', name: 'AWS Cloud', category: 'Cloud', icon: Cloud, connected: false, description: 'Server Hosting' },
        { id: 'vps', name: 'ForexVPS', category: 'Tools', icon: Server, connected: true, description: 'Low Latency Server' },
    ];

    // Add fillers to reach ~50
    const fillers: IntegrationApp[] = [
        { name: 'Bybit', cat: 'Crypto', icon: DollarSign },
        { name: 'Kraken', cat: 'Crypto', icon: DollarSign },
        { name: 'KuCoin', cat: 'Crypto', icon: DollarSign },
        { name: 'OKX', cat: 'Crypto', icon: DollarSign },
        { name: 'Metamask', cat: 'Crypto', icon: Wallet },
        { name: 'TrustWallet', cat: 'Crypto', icon: Wallet },
        { name: 'Ledger', cat: 'Crypto', icon: Shield },
        { name: 'Trezor', cat: 'Crypto', icon: Shield },
        { name: 'Facebook', cat: 'Social', icon: MessageCircle },
        { name: 'Instagram', cat: 'Social', icon: MessageCircle },
        { name: 'LinkedIn', cat: 'Social', icon: MessageCircle },
        { name: 'Reddit', cat: 'Social', icon: MessageCircle },
        { name: 'ForexFactory', cat: 'Tools', icon: Globe },
        { name: 'MyFxBook', cat: 'Tools', icon: BarChart3 },
        { name: 'Investing.com', cat: 'Tools', icon: Globe },
        { name: 'Bloomberg', cat: 'Tools', icon: Globe },
        { name: 'Reuters', cat: 'Tools', icon: Globe },
        { name: 'Zoom', cat: 'Tools', icon: MessageCircle },
        { name: 'Slack', cat: 'Tools', icon: MessageCircle },
        { name: 'Notion', cat: 'Tools', icon: Server },
        { name: 'Google Cloud', cat: 'Cloud', icon: Cloud },
        { name: 'Azure', cat: 'Cloud', icon: Cloud },
        { name: 'DigitalOcean', cat: 'Cloud', icon: Cloud },
        { name: 'Shopify', cat: 'Payment', icon: ShoppingCart },
        { name: 'WooCommerce', cat: 'Payment', icon: ShoppingCart },
        { name: 'Square', cat: 'Payment', icon: CreditCard },
        { name: 'Skrill', cat: 'Payment', icon: CreditCard },
        { name: 'Neteller', cat: 'Payment', icon: CreditCard },
        { name: 'Anthropic', cat: 'AI', icon: Cpu },
        { name: 'Midjourney', cat: 'AI', icon: Cpu },
        { name: 'Jasper', cat: 'AI', icon: Cpu },
    ].map((f, i) => ({
        id: `filler-${i}`,
        name: f.name,
        category: f.cat as any,
        icon: f.icon,
        connected: Math.random() > 0.8,
        description: 'Integration Service'
    }));

    return [...base, ...fillers];
};

export const AppsIntegrationGrid: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [apps, setApps] = useState(generateApps());

    const categories = ['All', 'Trading', 'Social', 'Tools', 'Crypto', 'AI', 'Payment', 'Cloud'];
    
    const toggleApp = (id: string) => {
        setApps(apps.map(app => app.id === id ? { ...app, connected: !app.connected } : app));
    };

    const filteredApps = apps.filter(app => {
        const matchesFilter = filter === 'All' || app.category === filter;
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="bg-[#0f111a] border border-[#1e2235] rounded-lg p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Link2 size={24} className="text-terminal-accent" />
                        App Ecosystem
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Manage {apps.length} available integrations. {apps.filter(a => a.connected).length} Connected.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search apps..." 
                            className="bg-[#050508] border border-[#1e2235] rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-terminal-accent outline-none" 
                        />
                    </div>
                    <button onClick={() => setApps(apps.map(a => ({...a, connected: true})))} className="bg-terminal-accent text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-colors flex items-center gap-2">
                        <Check size={16} /> Connect All
                    </button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                            filter === cat 
                            ? 'bg-terminal-accent text-black border-terminal-accent' 
                            : 'bg-[#0f111a] text-gray-400 border-[#1e2235] hover:text-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar pb-6">
                {filteredApps.map(app => (
                    <div key={app.id} className={`bg-[#0f111a] border rounded-xl p-4 transition-all group relative flex flex-col h-40 hover:-translate-y-1 ${app.connected ? 'border-terminal-accent/50 shadow-[0_0_15px_rgba(41,98,255,0.1)]' : 'border-[#1e2235]'}`}>
                        {app.connected && (
                            <div className="absolute top-0 right-0 bg-green-500/20 text-green-500 text-[9px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-green-500/20 flex items-center gap-1">
                                <Check size={8} strokeWidth={4} />
                            </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${app.connected ? 'bg-white text-black' : 'bg-[#1e2235] text-gray-500'}`}>
                                <app.icon size={24} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-sm text-white truncate">{app.name}</h3>
                                <span className="text-[10px] text-gray-500 bg-[#1e2235] px-1.5 py-0.5 rounded">{app.category}</span>
                            </div>
                        </div>
                        
                        <p className="text-[10px] text-gray-400 leading-tight line-clamp-2 flex-1">{app.description}</p>
                        
                        <button 
                            onClick={() => toggleApp(app.id)}
                            className={`w-full mt-2 text-[10px] font-bold py-2 rounded transition-colors uppercase tracking-wider ${
                                app.connected 
                                ? 'bg-[#1e2235] text-gray-300 border border-transparent hover:bg-red-900/20 hover:text-red-500' 
                                : 'bg-terminal-accent/10 text-terminal-accent border border-terminal-accent/20 hover:bg-terminal-accent hover:text-black'
                            }`}
                        >
                            {app.connected ? 'Configure' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};