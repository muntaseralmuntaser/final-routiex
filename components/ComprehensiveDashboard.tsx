import React, { useState, useEffect } from 'react';
import { UserProfile, MarketplaceItem } from '../types';
import { 
    Shield, Activity, DollarSign, Users, Server, Wifi, Cpu, HardDrive, 
    AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Bell, 
    LogOut, TrendingUp, TrendingDown, Zap, Globe, Lock, Unlock,
    Mail, Phone, Camera, Mic, MousePointer2, Clock, MonitorPlay,
    Plus, Settings, UserPlus, UserCog, Crown, Award, Radio,
    CreditCard, Percent, Target, BarChart2, PieChart, Database,
    FileText, Search, Filter, Download, Upload, RefreshCw
} from 'lucide-react';

interface Props {
    onLogout: () => void;
    users: UserProfile[];
    setUsers: (users: UserProfile[]) => void;
}

export const ComprehensiveDashboard: React.FC<Props> = ({ onLogout, users, setUsers }) => {
    // Real-time stats
    const [cpuUsage, setCpuUsage] = useState(24);
    const [ramUsage, setRamUsage] = useState(68);
    const [networkIn, setNetworkIn] = useState(1.2);
    const [networkOut, setNetworkOut] = useState(0.8);
    const [apiLatency, setApiLatency] = useState(12);
    const [activeUsers, setActiveUsers] = useState(142);
    const [revenue, setRevenue] = useState(84200);
    const [threats, setThreats] = useState(0);

    // Live Logs
    const [logs, setLogs] = useState([
        { time: '10:32:45', level: 'INFO', source: 'AUTH', message: 'User login successful: trader_92' },
        { time: '10:32:12', level: 'WARN', source: 'API', message: 'Rate limit approaching: 89% quota used' },
        { time: '10:31:58', level: 'INFO', source: 'PAYMENT', message: 'Subscription renewed: $299 - Pro Plan' },
        { time: '10:31:44', level: 'ERROR', source: 'MT5', message: 'Connection timeout: retry attempt 2/3' },
        { time: '10:31:20', level: 'INFO', source: 'SECURITY', message: 'Firewall blocked suspicious IP: 45.142.212.61' },
    ]);

    // API Status
    const [apiStatus, setApiStatus] = useState([
        { name: 'Google Gemini AI', status: 'online', latency: 45, requests: 1247 },
        { name: 'TradingView API', status: 'online', latency: 120, requests: 892 },
        { name: 'MT5 Gateway', status: 'degraded', latency: 450, requests: 234 },
        { name: 'Payment Gateway', status: 'online', latency: 80, requests: 156 },
        { name: 'Email Service', status: 'online', latency: 200, requests: 89 },
        { name: 'SMS Provider', status: 'offline', latency: 0, requests: 0 },
    ]);

    // Apps Status
    const [appsStatus, setAppsStatus] = useState([
        { name: 'Main Web App', users: 142, status: 'online', version: 'v4.5.0' },
        { name: 'Mobile App', users: 89, status: 'online', version: 'v2.1.3' },
        { name: 'Trading Terminal', users: 67, status: 'online', version: 'v3.2.1' },
        { name: 'Admin Portal', users: 3, status: 'online', version: 'v1.0.0' },
    ]);

    // Advertisements
    const [ads, setAds] = useState([
        { id: '1', position: 'Header Banner', size: '728x90', color: '#FF0000', status: 'active', clicks: 1247, ctr: '3.2%' },
        { id: '2', position: 'Sidebar', size: '300x250', color: '#00FF00', status: 'active', clicks: 892, ctr: '2.8%' },
        { id: '3', position: 'Footer', size: '970x90', color: '#0000FF', status: 'paused', clicks: 234, ctr: '1.5%' },
    ]);

    // User Roles
    const [roleStats, setRoleStats] = useState({
        admin: 2,
        subAdmin: 5,
        manager: 12,
        user: 123
    });

    // Payment Stats
    const [paymentStats, setPaymentStats] = useState({
        today: 12400,
        thisWeek: 84200,
        thisMonth: 342000,
        pending: 8,
        failed: 2,
        success: 234
    });

    // Security Scans
    const [securityScans, setSecurityScans] = useState([
        { type: 'Port Scan', status: 'complete', threats: 0, lastScan: '2m ago' },
        { type: 'Malware Scan', status: 'running', threats: 0, lastScan: 'Now' },
        { type: 'DDoS Detection', status: 'complete', threats: 0, lastScan: '5m ago' },
        { type: 'SQL Injection', status: 'complete', threats: 0, lastScan: '8m ago' },
        { type: 'XSS Protection', status: 'complete', threats: 0, lastScan: '10m ago' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate real-time updates
            setCpuUsage(Math.floor(Math.random() * 30) + 15);
            setRamUsage(Math.floor(Math.random() * 20) + 60);
            setNetworkIn((Math.random() * 2 + 0.5).toFixed(1) as any);
            setNetworkOut((Math.random() * 1.5 + 0.3).toFixed(1) as any);
            setApiLatency(Math.floor(Math.random() * 20) + 5);
            setActiveUsers(Math.floor(Math.random() * 20) + 130);
            
            // Add new log every 5 seconds
            if (Math.random() > 0.7) {
                const newLog = {
                    time: new Date().toLocaleTimeString(),
                    level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
                    source: ['AUTH', 'API', 'PAYMENT', 'SECURITY'][Math.floor(Math.random() * 4)],
                    message: 'System event occurred'
                };
                setLogs(prev => [newLog, ...prev.slice(0, 4)]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'online': case 'active': case 'complete': return 'text-green-500 bg-green-500/10';
            case 'degraded': case 'running': return 'text-yellow-500 bg-yellow-500/10';
            case 'offline': case 'paused': case 'error': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getLogColor = (level: string) => {
        switch(level) {
            case 'INFO': return 'text-blue-500';
            case 'WARN': return 'text-yellow-500';
            case 'ERROR': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex h-screen bg-[#050000] text-white font-sans selection:bg-red-600 selection:text-white overflow-hidden">
            {/* Minimal Sidebar */}
            <div className="w-20 bg-[#0a0000] border-r border-red-900/30 flex flex-col items-center py-6 space-y-6">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <Shield size={24} />
                </div>
                <div className="flex-1 flex flex-col space-y-4">
                    <button className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                        <Activity size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-xl bg-black/50 text-gray-500 hover:bg-red-600/10 hover:text-red-500 transition-all flex items-center justify-center">
                        <Users size={20} />
                    </button>
                    <button className="w-12 h-12 rounded-xl bg-black/50 text-gray-500 hover:bg-red-600/10 hover:text-red-500 transition-all flex items-center justify-center">
                        <Settings size={20} />
                    </button>
                </div>
                <button onClick={onLogout} className="w-12 h-12 rounded-xl bg-black/50 text-gray-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Main Dashboard - ONE PAGE NO SCROLL */}
            <div className="flex-1 overflow-hidden p-4">
                {/* Header */}
                <div className="h-16 bg-[#0a0000] border border-red-900/20 rounded-xl px-6 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-black uppercase tracking-[0.2em] text-red-600">CONTROL CENTER</h1>
                        <div className="flex items-center gap-3 text-[10px] font-mono">
                            <div className="flex items-center gap-1.5 text-green-500"><Wifi size={12} /> {apiLatency}ms</div>
                            <div className="flex items-center gap-1.5 text-blue-500"><Cpu size={12} /> {cpuUsage}%</div>
                            <div className="flex items-center gap-1.5 text-purple-500"><HardDrive size={12} /> {ramUsage}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 bg-red-600 text-white text-xs font-black rounded-lg hover:bg-red-700 transition-all uppercase">
                            <Plus size={14} className="inline mr-1" /> New User
                        </button>
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-black shadow-[0_0_15px_rgba(220,38,38,0.4)]">AD</div>
                    </div>
                </div>

                {/* Dashboard Grid - Perfectly Sized for One Page */}
                <div className="grid grid-cols-6 gap-4" style={{height: 'calc(100vh - 120px)'}}>
                    {/* LEFT COLUMN - Stats & Monitoring */}
                    <div className="col-span-2 space-y-4 overflow-y-auto custom-scrollbar">
                        {/* System Status */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-red-500 uppercase mb-3">System Health</h3>
                            <div className="space-y-2">
                                <SystemMetric label="CPU" value={cpuUsage} max={100} color="blue" />
                                <SystemMetric label="RAM" value={ramUsage} max={100} color="purple" />
                                <SystemMetric label="Network ↓" value={networkIn as any} max={5} color="green" unit="MB/s" />
                                <SystemMetric label="Network ↑" value={networkOut as any} max={5} color="yellow" unit="MB/s" />
                            </div>
                        </div>

                        {/* Payment Stats */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-green-500 uppercase mb-3 flex items-center gap-2">
                                <DollarSign size={14} /> Revenue
                            </h3>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-black/50 rounded-lg p-2">
                                    <div className="text-[9px] text-gray-500">Today</div>
                                    <div className="text-sm font-black text-white">${(paymentStats.today/1000).toFixed(1)}k</div>
                                </div>
                                <div className="bg-black/50 rounded-lg p-2">
                                    <div className="text-[9px] text-gray-500">This Week</div>
                                    <div className="text-sm font-black text-white">${(paymentStats.thisWeek/1000).toFixed(1)}k</div>
                                </div>
                                <div className="bg-black/50 rounded-lg p-2">
                                    <div className="text-[9px] text-gray-500">This Month</div>
                                    <div className="text-sm font-black text-white">${(paymentStats.thisMonth/1000).toFixed(0)}k</div>
                                </div>
                                <div className="bg-black/50 rounded-lg p-2">
                                    <div className="text-[9px] text-gray-500">Transactions</div>
                                    <div className="text-sm font-black text-white">{paymentStats.success}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 text-[9px]">
                                <span className="text-yellow-500">{paymentStats.pending} Pending</span>
                                <span className="text-red-500">{paymentStats.failed} Failed</span>
                            </div>
                        </div>

                        {/* User Roles */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-purple-500 uppercase mb-3 flex items-center gap-2">
                                <UserCog size={14} /> Roles
                            </h3>
                            <div className="space-y-2">
                                <RoleStat icon={Crown} label="Admin" count={roleStats.admin} color="red" />
                                <RoleStat icon={Award} label="Sub-Admin" count={roleStats.subAdmin} color="yellow" />
                                <RoleStat icon={UserCog} label="Manager" count={roleStats.manager} color="blue" />
                                <RoleStat icon={Users} label="Users" count={roleStats.user} color="green" />
                            </div>
                        </div>

                        {/* Apps Status */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-blue-500 uppercase mb-3 flex items-center gap-2">
                                <Globe size={14} /> Apps
                            </h3>
                            <div className="space-y-2">
                                {appsStatus.map((app, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] bg-black/30 rounded p-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${app.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`}></span>
                                            <span className="text-white font-bold">{app.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">{app.users} <Users size={10} className="inline" /></span>
                                            <span className="text-gray-600">{app.version}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN - APIs & Logs */}
                    <div className="col-span-2 space-y-4 overflow-y-auto custom-scrollbar">
                        {/* API Status */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-yellow-500 uppercase mb-3 flex items-center gap-2">
                                <Zap size={14} /> API Status
                            </h3>
                            <div className="space-y-2">
                                {apiStatus.map((api, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] bg-black/30 rounded p-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black ${getStatusColor(api.status)}`}>
                                                {api.status.toUpperCase()}
                                            </span>
                                            <span className="text-white font-bold">{api.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500">{api.latency}ms</span>
                                            <span className="text-blue-500">{api.requests} req</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Logs */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4 flex-1">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-black text-cyan-500 uppercase flex items-center gap-2">
                                    <Radio size={14} className="animate-pulse" /> Live Logs
                                </h3>
                                <button className="text-gray-500 hover:text-white transition-all">
                                    <RefreshCw size={12} />
                                </button>
                            </div>
                            <div className="space-y-1 font-mono text-[9px]">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-2 bg-black/30 rounded p-1.5 hover:bg-black/50 transition-all">
                                        <span className="text-gray-600">{log.time}</span>
                                        <span className={`font-black ${getLogColor(log.level)}`}>{log.level}</span>
                                        <span className="text-purple-500">[{log.source}]</span>
                                        <span className="text-gray-400 truncate">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-pink-500 uppercase mb-3 flex items-center gap-2">
                                <Bell size={14} /> Notifications
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <NotificationBtn icon={Mail} label="Email" count={12} />
                                <NotificationBtn icon={Phone} label="SMS" count={5} />
                                <NotificationBtn icon={MessageSquare} label="WhatsApp" count={8} />
                                <NotificationBtn icon={Bell} label="In-App" count={24} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Security & Ads */}
                    <div className="col-span-2 space-y-4 overflow-y-auto custom-scrollbar">
                        {/* Security Scanner */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-red-500 uppercase mb-3 flex items-center gap-2">
                                <Shield size={14} /> Security Scans
                            </h3>
                            <div className="space-y-2">
                                {securityScans.map((scan, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] bg-black/30 rounded p-2">
                                        <div className="flex items-center gap-2">
                                            {scan.status === 'running' ? (
                                                <RefreshCw size={10} className="text-yellow-500 animate-spin" />
                                            ) : (
                                                <CheckCircle size={10} className="text-green-500" />
                                            )}
                                            <span className="text-white font-bold">{scan.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={scan.threats > 0 ? 'text-red-500 font-black' : 'text-green-500'}>
                                                {scan.threats} threats
                                            </span>
                                            <span className="text-gray-600">{scan.lastScan}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-3 py-2 bg-red-600 text-white text-[10px] font-black rounded-lg hover:bg-red-700 transition-all uppercase">
                                Run Full Scan
                            </button>
                        </div>

                        {/* Network Sessions */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-cyan-500 uppercase mb-3 flex items-center gap-2">
                                <Globe size={14} /> Active Sessions
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { ip: '192.168.1.42', user: 'trader_92', location: 'Dubai, UAE', duration: '4h 12m' },
                                    { ip: '10.0.0.15', user: 'admin_01', location: 'London, UK', duration: '2h 45m' },
                                    { ip: '172.16.0.8', user: 'analyst_23', location: 'New York, US', duration: '1h 30m' },
                                ].map((session, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2 text-[9px]">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-white font-bold">{session.user}</span>
                                            <span className="text-green-500">{session.duration}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span className="font-mono">{session.ip}</span>
                                            <span>{session.location}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Advertisement Manager */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-black text-orange-500 uppercase flex items-center gap-2">
                                    <Target size={14} /> Ads
                                </h3>
                                <button className="px-2 py-1 bg-orange-600 text-white text-[9px] font-black rounded hover:bg-orange-700 transition-all">
                                    + New Ad
                                </button>
                            </div>
                            <div className="space-y-2">
                                {ads.map((ad) => (
                                    <div key={ad.id} className="bg-black/30 rounded p-2 text-[9px]">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded" style={{backgroundColor: ad.color}}></div>
                                                <span className="text-white font-bold">{ad.position}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black ${getStatusColor(ad.status)}`}>
                                                {ad.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>{ad.size}</span>
                                            <span>{ad.clicks} clicks</span>
                                            <span className="text-green-500">{ad.ctr} CTR</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-[#0a0000] border border-red-900/20 rounded-xl p-4">
                            <h3 className="text-xs font-black text-gray-500 uppercase mb-3">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <button className="p-3 bg-black border border-red-900/20 rounded-lg text-[10px] font-bold text-white hover:bg-red-600 hover:border-red-600 transition-all">
                                    <UserPlus size={16} className="mx-auto mb-1" />
                                    Add User
                                </button>
                                <button className="p-3 bg-black border border-red-900/20 rounded-lg text-[10px] font-bold text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
                                    <Database size={16} className="mx-auto mb-1" />
                                    Backup DB
                                </button>
                                <button className="p-3 bg-black border border-red-900/20 rounded-lg text-[10px] font-bold text-white hover:bg-green-600 hover:border-green-600 transition-all">
                                    <Download size={16} className="mx-auto mb-1" />
                                    Export Logs
                                </button>
                                <button className="p-3 bg-black border border-red-900/20 rounded-lg text-[10px] font-bold text-white hover:bg-purple-600 hover:border-purple-600 transition-all">
                                    <Settings size={16} className="mx-auto mb-1" />
                                    Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const SystemMetric = ({ label, value, max, color, unit = '%' }: any) => {
    const percentage = (value / max) * 100;
    const colorMap: any = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500'
    };
    
    return (
        <div className="text-[10px]">
            <div className="flex justify-between mb-1">
                <span className="text-gray-400 font-bold">{label}</span>
                <span className="text-white font-bold">{value}{unit}</span>
            </div>
            <div className="h-1.5 bg-black rounded-full overflow-hidden">
                <div className={`h-full ${colorMap[color]} transition-all duration-300`} style={{width: `${percentage}%`}}></div>
            </div>
        </div>
    );
};

const RoleStat = ({ icon: Icon, label, count, color }: any) => {
    const colorMap: any = {
        red: 'text-red-500',
        yellow: 'text-yellow-500',
        blue: 'text-blue-500',
        green: 'text-green-500'
    };

    return (
        <div className="flex items-center justify-between bg-black/30 rounded p-2">
            <div className="flex items-center gap-2">
                <Icon size={14} className={colorMap[color]} />
                <span className="text-white text-[10px] font-bold">{label}</span>
            </div>
            <span className={`${colorMap[color]} text-sm font-black`}>{count}</span>
        </div>
    );
};

const NotificationBtn = ({ icon: Icon, label, count }: any) => (
    <button className="p-3 bg-black border border-red-900/20 rounded-lg hover:bg-red-600/10 hover:border-red-600/50 transition-all relative group">
        <Icon size={16} className="mx-auto mb-1 text-gray-500 group-hover:text-red-500 transition-colors" />
        <div className="text-[9px] text-gray-400 font-bold">{label}</div>
        {count > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {count}
            </span>
        )}
    </button>
);
