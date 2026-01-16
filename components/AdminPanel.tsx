import React, { useState, useEffect } from 'react';
import { UserProfile, UserStatus, MarketplaceItem } from '../types';
import { 
    Users, Activity, DollarSign, Shield, Ban, Lock, Unlock, 
    Search, MoreVertical, Trash2, PlayCircle, StopCircle, 
    MessageSquare, Settings, Bell, LogOut, CheckCircle, AlertTriangle, 
    ShoppingBag, FileText, XCircle, Server, Globe, Cpu, Wifi, Zap, 
    Power, RefreshCw, Clock, MousePointer2, LogIn, ExternalLink, BarChart2,
    Camera, Mic, Eye, MessageCircleMore, MonitorPlay, Radio
} from 'lucide-react';

interface Props {
    onLogout: () => void;
    users: UserProfile[];
    setUsers: (users: UserProfile[]) => void;
    marketItems: MarketplaceItem[];
    setMarketItems: (items: MarketplaceItem[]) => void;
}

export const AdminPanel: React.FC<Props> = ({ onLogout, users, setUsers, marketItems, setMarketItems }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'server' | 'finance' | 'marketplace' | 'logs'>('dashboard');
    const [search, setSearch] = useState('');
    const [latency, setLatency] = useState(12);
    const [serverLoad, setServerLoad] = useState(24);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * 10) + 5);
            setServerLoad(Math.floor(Math.random() * 15) + 15);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Enhanced Mock User Stats for Advanced Monitoring
    const getUserStats = (userId: string) => {
        const isActive = Math.random() > 0.3;
        return {
            launches: Math.floor(Math.random() * 500) + 10,
            closes: Math.floor(Math.random() * 480) + 5,
            clicks: Math.floor(Math.random() * 15000) + 100,
            avgSession: '4h 12m',
            lastIp: '192.168.1.' + Math.floor(Math.random() * 255),
            expires: '2025-06-12',
            // New monitoring features
            sessionActive: isActive,
            currentView: isActive ? ['Dashboard', 'Trading', 'AI Analysis', 'Market Center'][Math.floor(Math.random() * 4)] : 'Offline',
            mouseActivity: isActive ? Math.floor(Math.random() * 1000) + 100 : 0,
            cameraStatus: Math.random() > 0.7 ? 'Active' : 'Disabled',
            micStatus: Math.random() > 0.6 ? 'Active' : 'Muted',
            chatMessages: Math.floor(Math.random() * 50),
            lastAction: isActive ? ['Clicked Signal', 'Opened Chat', 'Viewed Chart', 'Changed Settings'][Math.floor(Math.random() * 4)] : 'No Activity'
        };
    };

    const updateUserStatus = (id: string, status: UserStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    };

    const getStatusColor = (status: UserStatus) => {
        switch(status) {
            case 'active': return 'text-green-500 bg-green-500/10';
            case 'suspended': return 'text-yellow-500 bg-yellow-500/10';
            case 'banned': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex h-screen bg-[#050000] text-white font-sans selection:bg-red-600 selection:text-white">
            {/* Sidebar - Admin Red Theme */}
            <div className="w-64 bg-[#0a0000] border-r border-red-900/30 flex flex-col">
                <div className="p-6 border-b border-red-900/30 flex flex-col gap-1">
                    <h1 className="text-2xl font-black tracking-tighter text-red-600 flex items-center gap-2">
                        <Shield size={28} fill="currentColor" className="opacity-20" /> ROUTIEX
                    </h1>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">Administrator Account</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { id: 'dashboard', label: 'Cpanel Home', icon: Activity },
                        { id: 'users', label: 'User Monitoring', icon: Users },
                        { id: 'marketplace', label: 'Store Control', icon: ShoppingBag },
                        { id: 'server', label: 'Server & API', icon: Server },
                        { id: 'finance', label: 'Subscriptions', icon: DollarSign },
                        { id: 'logs', label: 'Global Logs', icon: FileText },
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${activeTab === item.id ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'text-gray-500 hover:bg-red-900/10 hover:text-red-400'}`}
                        >
                            <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'group-hover:text-red-500'} /> 
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-red-900/20 bg-[#070000]">
                    <div className="mb-4 px-2">
                         <div className="text-[9px] text-gray-600 font-bold uppercase mb-1">Server Status</div>
                         <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-gray-900 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 w-[24%]" />
                            </div>
                            <span className="text-[9px] font-mono text-red-500">24%</span>
                         </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-red-600 rounded-lg transition-all">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-[#050000] relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                
                <header className="h-16 border-b border-red-900/20 bg-[#0a0000]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-black uppercase tracking-[0.2em] text-red-600">{activeTab}</h2>
                        <div className="h-4 w-px bg-red-900/30"></div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-green-500">
                                <Wifi size={14} /> {latency}ms
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-blue-500">
                                <Cpu size={14} /> {serverLoad}% CPU
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-red-600/10 text-red-500 rounded-lg border border-red-900/20 hover:bg-red-600/20 transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
                        </button>
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(220,38,38,0.5)]">AD</div>
                    </div>
                </header>

                <main className="p-8 relative z-10">
                    {/* CPANEL DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <AdminStatCard label="Live Terminals" value={users.length + 142} change="+12.4%" icon={Activity} color="text-red-500" />
                                <AdminStatCard label="Subscription Rev" value="$84.2k" change="+5.2%" icon={DollarSign} color="text-green-500" />
                                <AdminStatCard label="API Requests (24h)" value="1.2M" change="Normal" icon={Zap} color="text-blue-500" />
                                <AdminStatCard label="System Security" value="100%" change="Locked" icon={Shield} color="text-red-600" />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-[#0a0000] border border-red-900/20 rounded-2xl p-6 relative overflow-hidden h-80">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                        <BarChart2 size={200} />
                                    </div>
                                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Traffic Analysis (Real-time)</h3>
                                    <div className="flex items-end gap-2 h-48 px-4">
                                        {Array.from({length: 30}).map((_, i) => (
                                            <div key={i} className="flex-1 bg-red-600/20 rounded-t-sm group relative" style={{ height: `${Math.random() * 80 + 20}%` }}>
                                                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-[#0a0000] border border-red-900/20 rounded-2xl p-6 h-80">
                                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6">Recent Admin Actions</h3>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'User Suspended', user: 'trader_92', time: '2m ago' },
                                            { action: 'API Key Revoked', user: 'institutional_4', time: '15m ago' },
                                            { action: 'Server Restart', user: 'SYSTEM', time: '1h ago' },
                                            { action: 'New Plan Added', user: 'ADMIN', time: '4h ago' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex justify-between items-center text-xs border-b border-red-900/10 pb-3">
                                                <div>
                                                    <div className="text-red-500 font-bold">{log.action}</div>
                                                    <div className="text-gray-500 text-[10px]">{log.user}</div>
                                                </div>
                                                <span className="text-gray-600">{log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS MONITORING TAB */}
                    {activeTab === 'users' && (
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-red-900/20 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0d0000]">
                                <div className="relative flex-1 max-w-md">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900" />
                                    <input 
                                        type="text" 
                                        placeholder="Monitor User ID, IP, or Email..." 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-black border border-red-900/30 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-red-600 transition-all placeholder-red-900/50"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest">Broadcast Global Alert</button>
                                    <button className="p-2 bg-black border border-red-900/30 rounded-lg text-red-500 hover:text-white"><RefreshCw size={18} /></button>
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black text-[10px] uppercase text-red-900 font-black tracking-widest border-b border-red-900/20">
                                        <tr>
                                            <th className="p-6">System Identity</th>
                                            <th className="p-6">Live Session Data</th>
                                            <th className="p-6">Subscription</th>
                                            <th className="p-6">Network / IP</th>
                                            <th className="p-6 text-right">Control Panel</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-900/10">
                                        {users.concat(Array.from({length: 5}).map((_, i) => ({
                                            id: `m-${i}`, name: `Live_Trader_${i+102}`, email: `t${i}@node.internal`, role: 'user', status: 'active', plan: i % 2 === 0 ? 'Pro' : 'Institutional', joinedDate: '', lastLogin: '', ip: '', isSeller: false, balance: 0, aiUsageToday: 0
                                        })) as any).filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => {
                                            const stats = getUserStats(user.id);
                                            return (
                                                <tr key={user.id} className="hover:bg-red-600/[0.03] transition-colors group">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-black border border-red-600/30 flex items-center justify-center font-black text-red-600 group-hover:scale-110 transition-transform">{user.name.substring(0,2)}</div>
                                                            <div>
                                                                <div className="font-black text-white text-sm group-hover:text-red-500 transition-colors">{user.name}</div>
                                                                <div className="text-[10px] text-gray-500 font-mono">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${stats.sessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`}></span>
                                                                <span className="text-[10px] font-bold text-white">{stats.currentView}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                                <div className="text-[10px] flex items-center gap-1.5"><MousePointer2 size={10} className="text-blue-500"/> <span className="text-gray-500">{stats.mouseActivity}/min</span></div>
                                                                <div className="text-[10px] flex items-center gap-1.5"><MessageCircleMore size={10} className="text-purple-500"/> <span className="text-gray-500">{stats.chatMessages} msgs</span></div>
                                                                <div className="text-[10px] flex items-center gap-1.5"><Camera size={10} className={stats.cameraStatus === 'Active' ? 'text-green-500' : 'text-gray-700'}/> <span className="text-gray-500">{stats.cameraStatus}</span></div>
                                                                <div className="text-[10px] flex items-center gap-1.5"><Mic size={10} className={stats.micStatus === 'Active' ? 'text-green-500' : 'text-gray-700'}/> <span className="text-gray-500">{stats.micStatus}</span></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className={`text-xs font-black uppercase mb-1 ${user.plan === 'Institutional' ? 'text-yellow-500' : 'text-blue-400'}`}>{user.plan}</div>
                                                        <div className="text-[9px] text-gray-600 flex items-center gap-1">EXPIRES: <span className="text-red-900 font-bold">{stats.expires}</span></div>
                                                    </td>
                                                    <td className="p-6 font-mono text-[11px]">
                                                        <div className="text-white font-bold">{stats.lastIp}</div>
                                                        <div className="text-gray-600 text-[9px]">MAC: FF:0E:44:A1:99:B2</div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button title="Live Screen View" className="p-2 bg-black border border-red-900/30 rounded-lg text-blue-500 hover:text-blue-400 hover:border-blue-600 transition-all"><MonitorPlay size={16}/></button>
                                                            <button title="View Chat History" className="p-2 bg-black border border-red-900/30 rounded-lg text-purple-500 hover:text-purple-400 hover:border-purple-600 transition-all"><MessageCircleMore size={16}/></button>
                                                            <button title="View Full Terminal Logs" className="p-2 bg-black border border-red-900/30 rounded-lg text-red-900 hover:text-red-500 hover:border-red-600 transition-all"><FileText size={16}/></button>
                                                            <button onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')} className={`p-2 rounded-lg border transition-all ${user.status === 'active' ? 'bg-black border-red-900/30 text-red-900 hover:bg-red-600 hover:text-white' : 'bg-red-600 text-white border-red-600'}`}>
                                                                {user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                                                            </button>
                                                            <button title="Force Kill App Process" className="p-2 bg-red-900/10 text-red-600 border border-red-900/20 rounded-lg hover:bg-red-600 hover:text-white transition-all"><XCircle size={16}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SERVER & API TAB */}
                    {activeTab === 'server' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
                            <div className="bg-[#0a0000] border border-red-900/20 rounded-2xl p-8 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                    <Server size={24} className="text-red-600" /> API Gateway Management
                                </h3>
                                <div className="space-y-6">
                                    <div className="p-4 bg-black rounded-xl border border-red-900/20 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-300">Google Gemini Interface</div>
                                            <div className="text-[10px] text-green-500 font-mono">STATUS: OPERATIONAL</div>
                                        </div>
                                        <button className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black rounded hover:bg-red-700 transition-all">FLUSH CACHE</button>
                                    </div>
                                    <div className="p-4 bg-black rounded-xl border border-red-900/20 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-gray-300">TradingView Webhook Bridge</div>
                                            <div className="text-[10px] text-green-500 font-mono">STATUS: OPERATIONAL</div>
                                        </div>
                                        <button className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black rounded hover:bg-red-700 transition-all">RESTART NODE</button>
                                    </div>
                                    <div className="p-4 bg-black rounded-xl border border-red-900/20 flex justify-between items-center opacity-50">
                                        <div>
                                            <div className="font-bold text-gray-300">Bloomberg Terminal Pipe</div>
                                            <div className="text-[10px] text-red-500 font-mono">STATUS: MAINTENANCE</div>
                                        </div>
                                        <button className="px-4 py-1.5 bg-gray-800 text-gray-500 text-[10px] font-black rounded cursor-not-allowed">OFFLINE</button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0a0000] border border-red-900/20 rounded-2xl p-8 shadow-xl">
                                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                    <Shield size={24} className="text-red-600" /> System Protocols
                                </h3>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between p-4 bg-black rounded-xl border border-red-900/10 cursor-pointer hover:border-red-600/30 transition-all group">
                                        <div>
                                            <div className="font-bold text-gray-200">Force 2FA Global</div>
                                            <p className="text-[10px] text-gray-600">Require all users to link Google Auth</p>
                                        </div>
                                        <div className="w-10 h-5 bg-red-900/20 rounded-full relative p-1 group-hover:bg-red-600/20">
                                            <div className="w-3 h-3 bg-red-600 rounded-full shadow-lg"></div>
                                        </div>
                                    </label>
                                    <label className="flex items-center justify-between p-4 bg-black rounded-xl border border-red-900/10 cursor-pointer hover:border-red-600/30 transition-all group">
                                        <div>
                                            <div className="font-bold text-gray-200">Maintenance Mode</div>
                                            <p className="text-[10px] text-gray-600">Restrict all terminal access except admin</p>
                                        </div>
                                        <div className="w-10 h-5 bg-gray-900 rounded-full relative p-1">
                                            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                                        </div>
                                    </label>
                                </div>
                                <button className="w-full mt-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                    Deploy System Updates
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const AdminStatCard = ({ label, value, change, icon: Icon, color }: any) => (
    <div className="bg-[#0a0000] border border-red-900/20 rounded-2xl p-6 relative overflow-hidden group hover:border-red-600/50 transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={48} />
        </div>
        <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</p>
            <div className={`p-2 rounded-lg bg-red-900/10`}>
                <Icon size={18} className={color} />
            </div>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
        <div className="mt-4 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${change.includes('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {change}
            </span>
            <span className="text-[9px] text-gray-600 font-bold uppercase">vs. Last Week</span>
        </div>
    </div>
);