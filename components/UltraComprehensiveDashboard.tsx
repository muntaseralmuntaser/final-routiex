import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
    Shield, Activity, DollarSign, Users, Server, Wifi, Cpu, HardDrive, 
    AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Bell, 
    LogOut, TrendingUp, TrendingDown, Zap, Globe, Lock, Unlock, Camera, Mic,
    Mail, Phone, MousePointer2, Clock, MonitorPlay, Database, Code,
    Plus, Settings, UserPlus, Crown, Award, Radio, CreditCard, Target,
    BarChart2, PieChart, FileText, Search, Download, Upload, RefreshCw,
    Play, Pause, RotateCw, AlertCircle, Info, Minimize2, Maximize2,
    GitBranch, Package, Layers, Cloud, HardDriveDownload, Network
} from 'lucide-react';

interface Props {
    onLogout: () => void;
    users: UserProfile[];
    setUsers: (users: UserProfile[]) => void;
}

export const UltraComprehensiveDashboard: React.FC<Props> = ({ onLogout, users, setUsers }) => {
    // System Metrics
    const [cpuUsage, setCpuUsage] = useState(24);
    const [ramUsage, setRamUsage] = useState(68);
    const [diskUsage, setDiskUsage] = useState(45);
    const [networkIn, setNetworkIn] = useState(1.2);
    const [networkOut, setNetworkOut] = useState(0.8);
    const [bandwidth, setBandwidth] = useState(89);
    const [activeProcesses, setActiveProcesses] = useState(342);

    // Enhanced Apps with LIVE details
    const [apps, setApps] = useState([
        { 
            name: 'Main Web App', 
            status: 'online', 
            users: 142, 
            version: 'v4.5.0',
            uptime: '45d 12h 34m',
            requests: 1247890,
            errors: 12,
            avgResponseTime: 45,
            cpu: 18,
            ram: 342,
            lastDeploy: '2h ago'
        },
        { 
            name: 'Mobile App (iOS)', 
            status: 'online', 
            users: 89, 
            version: 'v2.1.3',
            uptime: '23d 8h 15m',
            requests: 456789,
            errors: 5,
            avgResponseTime: 120,
            cpu: 12,
            ram: 256,
            lastDeploy: '1d ago'
        },
        { 
            name: 'Mobile App (Android)', 
            status: 'online', 
            users: 67, 
            version: 'v2.1.2',
            uptime: '23d 8h 15m',
            requests: 234567,
            errors: 8,
            avgResponseTime: 135,
            cpu: 10,
            ram: 198,
            lastDeploy: '1d ago'
        },
        { 
            name: 'Trading Terminal', 
            status: 'online', 
            users: 67, 
            version: 'v3.2.1',
            uptime: '12d 4h 56m',
            requests: 892345,
            errors: 23,
            avgResponseTime: 28,
            cpu: 25,
            ram: 512,
            lastDeploy: '5h ago'
        },
        { 
            name: 'Admin Portal', 
            status: 'online', 
            users: 3, 
            version: 'v5.0.0',
            uptime: '2d 14h 22m',
            requests: 4567,
            errors: 0,
            avgResponseTime: 15,
            cpu: 5,
            ram: 128,
            lastDeploy: '30m ago'
        },
        { 
            name: 'API Gateway', 
            status: 'online', 
            users: 298, 
            version: 'v1.8.4',
            uptime: '89d 2h 11m',
            requests: 5678901,
            errors: 156,
            avgResponseTime: 8,
            cpu: 35,
            ram: 768,
            lastDeploy: '7d ago'
        },
        { 
            name: 'WebSocket Server', 
            status: 'online', 
            users: 142, 
            version: 'v2.4.1',
            uptime: '45d 12h 34m',
            requests: 9876543,
            errors: 45,
            avgResponseTime: 2,
            cpu: 22,
            ram: 456,
            lastDeploy: '2h ago'
        },
        { 
            name: 'Background Worker', 
            status: 'online', 
            users: 0, 
            version: 'v1.2.0',
            uptime: '67d 18h 45m',
            requests: 234567,
            errors: 3,
            avgResponseTime: 500,
            cpu: 8,
            ram: 164,
            lastDeploy: '14d ago'
        },
    ]);

    // Comprehensive API Status
    const [apiServices, setApiServices] = useState([
        { name: 'Google Gemini AI', status: 'online', latency: 45, requests: 1247, uptime: 99.9, quota: 78 },
        { name: 'TradingView API', status: 'online', latency: 120, requests: 892, uptime: 99.5, quota: 45 },
        { name: 'MT5 Gateway', status: 'degraded', latency: 450, requests: 234, uptime: 95.2, quota: 92 },
        { name: 'MT4 Gateway', status: 'online', latency: 380, requests: 189, uptime: 98.1, quota: 67 },
        { name: 'Binance API', status: 'online', latency: 25, requests: 2341, uptime: 99.8, quota: 23 },
        { name: 'Coinbase API', status: 'online', latency: 78, requests: 567, uptime: 99.2, quota: 34 },
        { name: 'Payment Gateway (Stripe)', status: 'online', latency: 80, requests: 156, uptime: 99.9, quota: 12 },
        { name: 'Payment Gateway (PayPal)', status: 'online', latency: 95, requests: 89, uptime: 99.7, quota: 8 },
        { name: 'Email Service (SendGrid)', status: 'online', latency: 200, requests: 89, uptime: 99.6, quota: 45 },
        { name: 'SMS Provider (Twilio)', status: 'offline', latency: 0, requests: 0, uptime: 0, quota: 0 },
        { name: 'WhatsApp Business API', status: 'online', latency: 156, requests: 234, uptime: 98.9, quota: 56 },
        { name: 'Firebase Cloud Messaging', status: 'online', latency: 45, requests: 1892, uptime: 99.9, quota: 34 },
        { name: 'Google OAuth', status: 'online', latency: 67, requests: 456, uptime: 99.8, quota: 15 },
        { name: 'AWS S3 Storage', status: 'online', latency: 42, requests: 3456, uptime: 99.9, quota: 67 },
        { name: 'Redis Cache', status: 'online', latency: 2, requests: 45678, uptime: 99.9, quota: 89 },
    ]);

    // Trading Platforms
    const [tradingPlatforms, setTradingPlatforms] = useState([
        { name: 'MetaTrader 5', connected: 23, status: 'online', accounts: 45, volume: 1234567, trades: 892 },
        { name: 'MetaTrader 4', connected: 18, status: 'online', accounts: 34, volume: 892345, trades: 567 },
        { name: 'cTrader', connected: 12, status: 'online', accounts: 23, volume: 456789, trades: 234 },
        { name: 'TradingView', connected: 67, status: 'online', accounts: 89, volume: 0, trades: 0 },
        { name: 'Binance', connected: 34, status: 'online', accounts: 56, volume: 2345678, trades: 1234 },
    ]);

    // Social Media Integration
    const [socialMedia, setSocialMedia] = useState([
        { platform: 'Telegram', status: 'online', channels: 5, members: 12450, messages: 3456, bots: 3 },
        { platform: 'Discord', status: 'online', servers: 2, members: 8920, messages: 1892, bots: 2 },
        { platform: 'WhatsApp', status: 'online', groups: 8, members: 5670, messages: 2341, bots: 1 },
        { platform: 'Twitter/X', status: 'online', accounts: 3, followers: 45600, tweets: 234, api: true },
        { platform: 'YouTube', status: 'online', channels: 2, subscribers: 23400, streams: 1, live: true },
        { platform: 'Instagram', status: 'degraded', accounts: 2, followers: 12300, posts: 156, api: false },
    ]);

    // Database Stats
    const [databases, setDatabases] = useState([
        { name: 'PostgreSQL Main', status: 'online', size: '45.2 GB', tables: 156, connections: 23, queries: 45678 },
        { name: 'MongoDB Users', status: 'online', size: '12.8 GB', collections: 34, connections: 12, queries: 23456 },
        { name: 'Redis Cache', status: 'online', size: '2.4 GB', keys: 892345, connections: 45, hits: 98.9 },
        { name: 'MySQL Logs', status: 'online', size: '8.9 GB', tables: 23, connections: 8, queries: 12345 },
    ]);

    // Active IP Addresses with full details
    const [activeIPs, setActiveIPs] = useState([
        { 
            ip: '192.168.1.42', 
            user: 'trader_92', 
            location: 'Dubai, UAE',
            country: 'AE',
            isp: 'Emirates Telecom',
            device: 'Windows 11 - Chrome',
            sessions: 3,
            requests: 1247,
            bandwidth: '12.4 MB',
            duration: '4h 12m',
            lastActive: 'Just now',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '10.0.0.15', 
            user: 'admin_01', 
            location: 'London, UK',
            country: 'GB',
            isp: 'British Telecom',
            device: 'MacOS - Safari',
            sessions: 1,
            requests: 234,
            bandwidth: '3.2 MB',
            duration: '2h 45m',
            lastActive: '30s ago',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '172.16.0.8', 
            user: 'analyst_23', 
            location: 'New York, US',
            country: 'US',
            isp: 'Verizon',
            device: 'iOS - Safari',
            sessions: 2,
            requests: 892,
            bandwidth: '8.9 MB',
            duration: '1h 30m',
            lastActive: '2m ago',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '45.142.212.61', 
            user: 'guest_unknown', 
            location: 'Unknown',
            country: 'RU',
            isp: 'Unknown Provider',
            device: 'Linux - Firefox',
            sessions: 1,
            requests: 5,
            bandwidth: '0.1 MB',
            duration: '5m',
            lastActive: '10m ago',
            status: 'blocked',
            threat: 'suspicious',
            vpn: true
        },
        { 
            ip: '203.0.113.45', 
            user: 'vip_89', 
            location: 'Singapore',
            country: 'SG',
            isp: 'StarHub',
            device: 'Android - Chrome',
            sessions: 1,
            requests: 567,
            bandwidth: '5.6 MB',
            duration: '45m',
            lastActive: '5s ago',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '198.51.100.23', 
            user: 'pro_trader_45', 
            location: 'Tokyo, Japan',
            country: 'JP',
            isp: 'NTT Communications',
            device: 'Windows 10 - Edge',
            sessions: 2,
            requests: 1892,
            bandwidth: '18.9 MB',
            duration: '6h 23m',
            lastActive: '1m ago',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '185.220.101.34', 
            user: 'guest_456', 
            location: 'Frankfurt, Germany',
            country: 'DE',
            isp: 'Deutsche Telekom',
            device: 'Linux - Chrome',
            sessions: 1,
            requests: 23,
            bandwidth: '0.5 MB',
            duration: '15m',
            lastActive: '8m ago',
            status: 'suspicious',
            threat: 'warning',
            vpn: true
        },
        { 
            ip: '103.21.244.88', 
            user: 'analyst_pro_12', 
            location: 'Mumbai, India',
            country: 'IN',
            isp: 'Reliance Jio',
            device: 'Android - Chrome',
            sessions: 1,
            requests: 445,
            bandwidth: '4.5 MB',
            duration: '2h 10m',
            lastActive: '20s ago',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '104.26.15.123', 
            user: 'trader_premium_78', 
            location: 'Sydney, Australia',
            country: 'AU',
            isp: 'Telstra',
            device: 'MacOS - Chrome',
            sessions: 3,
            requests: 2341,
            bandwidth: '23.4 MB',
            duration: '8h 45m',
            lastActive: 'Just now',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
        { 
            ip: '162.158.89.67', 
            user: 'vip_institutional_5', 
            location: 'Zurich, Switzerland',
            country: 'CH',
            isp: 'Swisscom',
            device: 'Windows 11 - Chrome',
            sessions: 1,
            requests: 678,
            bandwidth: '6.8 MB',
            duration: '3h 20m',
            lastActive: '45s ago',
            status: 'active',
            threat: 'safe',
            vpn: false
        },
    ]);

    // IP Statistics
    const [ipStats, setIpStats] = useState({
        totalActive: 10,
        totalBlocked: 1,
        totalSuspicious: 1,
        totalSafe: 8,
        totalBandwidth: '84.2 MB',
        uniqueCountries: 10,
        vpnDetected: 2,
        threatLevel: 'low'
    });

    // Live User Activities
    const [liveActivities, setLiveActivities] = useState([
        { user: 'trader_92', action: 'Opened MT5 Terminal', time: 'Just now', ip: '192.168.1.42' },
        { user: 'analyst_45', action: 'Generated AI Signal', time: '5s ago', ip: '10.0.0.15' },
        { user: 'user_234', action: 'Subscribed to Pro Plan', time: '12s ago', ip: '172.16.0.8' },
        { user: 'vip_89', action: 'Joined Live Stream', time: '23s ago', ip: '192.168.1.67' },
        { user: 'admin_01', action: 'Modified User Permissions', time: '45s ago', ip: '10.0.0.1' },
    ]);

    // Enhanced Logs
    const [logs, setLogs] = useState([
        { time: '10:47:45', level: 'INFO', source: 'AUTH', message: 'User login successful: trader_92', ip: '192.168.1.42' },
        { time: '10:47:32', level: 'WARN', source: 'API', message: 'Rate limit approaching: 89% quota used', ip: 'System' },
        { time: '10:47:18', level: 'INFO', source: 'PAYMENT', message: 'Subscription renewed: $299 - Pro Plan', ip: '10.0.0.15' },
        { time: '10:47:04', level: 'ERROR', source: 'MT5', message: 'Connection timeout: retry attempt 2/3', ip: '172.16.0.8' },
        { time: '10:46:50', level: 'INFO', source: 'SECURITY', message: 'Firewall blocked suspicious IP', ip: '45.142.212.61' },
    ]);

    // Real-time Updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Update system metrics
            setCpuUsage(Math.floor(Math.random() * 30) + 15);
            setRamUsage(Math.floor(Math.random() * 20) + 60);
            setDiskUsage(Math.floor(Math.random() * 10) + 40);
            setNetworkIn((Math.random() * 2 + 0.5).toFixed(1) as any);
            setNetworkOut((Math.random() * 1.5 + 0.3).toFixed(1) as any);
            setBandwidth(Math.floor(Math.random() * 15) + 80);
            setActiveProcesses(Math.floor(Math.random() * 50) + 320);

            // Update apps
            setApps(prev => prev.map(app => ({
                ...app,
                requests: app.requests + Math.floor(Math.random() * 100),
                avgResponseTime: Math.floor(Math.random() * 50) + app.avgResponseTime * 0.9,
                cpu: Math.floor(Math.random() * 10) + app.cpu * 0.9,
            })));

            // Update API services
            setApiServices(prev => prev.map(api => ({
                ...api,
                requests: api.requests + Math.floor(Math.random() * 50),
                latency: Math.floor(Math.random() * 20) + api.latency * 0.9,
            })));

            // Add new live activity
            if (Math.random() > 0.6) {
                const actions = [
                    'Opened Trading Terminal',
                    'Generated AI Signal',
                    'Viewed Chart Analysis',
                    'Sent Chat Message',
                    'Updated Settings',
                    'Placed Trade Order',
                    'Joined Live Stream',
                    'Downloaded Report'
                ];
                const newActivity = {
                    user: `user_${Math.floor(Math.random() * 999)}`,
                    action: actions[Math.floor(Math.random() * actions.length)],
                    time: 'Just now',
                    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
                };
                setLiveActivities(prev => [newActivity, ...prev.slice(0, 4)]);
            }

            // Add new log
            if (Math.random() > 0.5) {
                const newLog = {
                    time: new Date().toLocaleTimeString(),
                    level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)] as any,
                    source: ['AUTH', 'API', 'PAYMENT', 'SECURITY', 'DATABASE'][Math.floor(Math.random() * 5)],
                    message: 'System event occurred',
                    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
                };
                setLogs(prev => [newLog, ...prev.slice(0, 4)]);
            }

            // Update IP last active times
            setActiveIPs(prev => prev.map(ipData => {
                if (ipData.status === 'active' && Math.random() > 0.7) {
                    return {
                        ...ipData,
                        requests: ipData.requests + Math.floor(Math.random() * 10),
                        lastActive: Math.random() > 0.5 ? 'Just now' : `${Math.floor(Math.random() * 60)}s ago`
                    };
                }
                return ipData;
            }));
        }, 2000); // Update every 2 seconds for more live feel

        return () => clearInterval(interval);
    }, []);

    // IP Management Handlers
    const handleBlockIP = (ip: string) => {
        setActiveIPs(prev => prev.map(ipData => 
            ipData.ip === ip ? { ...ipData, status: 'blocked', threat: 'suspicious' } : ipData
        ));
        setIpStats(prev => ({
            ...prev,
            totalBlocked: prev.totalBlocked + 1,
            totalActive: prev.totalActive - 1
        }));
    };

    const handleUnblockIP = (ip: string) => {
        setActiveIPs(prev => prev.map(ipData => 
            ipData.ip === ip ? { ...ipData, status: 'active', threat: 'safe' } : ipData
        ));
        setIpStats(prev => ({
            ...prev,
            totalBlocked: prev.totalBlocked - 1,
            totalActive: prev.totalActive + 1
        }));
    };

    const handleBlockAllSuspicious = () => {
        setActiveIPs(prev => prev.map(ipData => 
            ipData.threat === 'warning' || ipData.threat === 'suspicious' 
                ? { ...ipData, status: 'blocked' } 
                : ipData
        ));
        const suspiciousCount = activeIPs.filter(ip => ip.threat === 'warning' || ip.threat === 'suspicious').length;
        setIpStats(prev => ({
            ...prev,
            totalBlocked: prev.totalBlocked + suspiciousCount,
            totalActive: prev.totalActive - suspiciousCount,
            totalSuspicious: 0
        }));
    };

    const handleExportIPs = () => {
        const ipList = activeIPs.map(ip => ({
            ip: ip.ip,
            user: ip.user,
            location: ip.location,
            status: ip.status,
            threat: ip.threat
        }));
        const dataStr = JSON.stringify(ipList, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `ip_list_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'online': case 'active': return 'text-green-500 bg-green-500/10';
            case 'degraded': return 'text-yellow-500 bg-yellow-500/10';
            case 'offline': case 'error': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="flex h-screen bg-[#050000] text-white font-sans overflow-hidden">
            {/* Ultra Minimal Sidebar */}
            <div className="w-16 bg-[#0a0000] border-r border-red-900/30 flex flex-col items-center py-4 space-y-4">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    <Shield size={20} />
                </div>
                <div className="flex-1 flex flex-col space-y-3">
                    <button className="w-10 h-10 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                        <Activity size={16} />
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-black/50 text-gray-500 hover:bg-red-600/10 hover:text-red-500 transition-all flex items-center justify-center">
                        <Users size={16} />
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-black/50 text-gray-500 hover:bg-red-600/10 hover:text-red-500 transition-all flex items-center justify-center">
                        <Settings size={16} />
                    </button>
                </div>
                <button onClick={onLogout} className="w-10 h-10 rounded-lg bg-black/50 text-gray-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                    <LogOut size={16} />
                </button>
            </div>

            {/* Main Content - Ultra Wide Dashboard */}
            <div className="flex-1 overflow-hidden">
                {/* Compact Header */}
                <div className="h-12 bg-[#0a0000] border-b border-red-900/20 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-sm font-black uppercase tracking-wider text-red-600">LIVE CONTROL CENTER</h1>
                        <div className="flex items-center gap-2 text-[9px] font-mono">
                            <div className="flex items-center gap-1 text-green-500"><Wifi size={10} /> {Math.floor(Math.random() * 10) + 5}ms</div>
                            <div className="flex items-center gap-1 text-blue-500"><Cpu size={10} /> {cpuUsage}%</div>
                            <div className="flex items-center gap-1 text-purple-500"><HardDrive size={10} /> {ramUsage}%</div>
                            <div className="flex items-center gap-1 text-yellow-500"><Network size={10} /> {bandwidth}%</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-mono">{new Date().toLocaleTimeString()}</span>
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(220,38,38,0.4)]">AD</div>
                    </div>
                </div>

                {/* Ultra Wide Grid - 4 Columns */}
                <div className="grid grid-cols-5 gap-3 p-3" style={{height: 'calc(100vh - 48px)'}}>
                    {/* COLUMN 1 - System & Apps */}
                    <div className="space-y-3 overflow-y-auto custom-scrollbar">
                        {/* System Resources */}
                        <Panel title="System Resources" icon={Server} color="blue">
                            <div className="space-y-2">
                                <Metric label="CPU" value={cpuUsage} max={100} color="blue" />
                                <Metric label="RAM" value={ramUsage} max={100} color="purple" />
                                <Metric label="Disk" value={diskUsage} max={100} color="orange" />
                                <Metric label="Bandwidth" value={bandwidth} max={100} color="green" />
                                <div className="flex justify-between text-[9px] pt-1 border-t border-red-900/10">
                                    <span className="text-gray-500">Network ↓</span>
                                    <span className="text-green-500 font-bold">{networkIn} MB/s</span>
                                </div>
                                <div className="flex justify-between text-[9px]">
                                    <span className="text-gray-500">Network ↑</span>
                                    <span className="text-yellow-500 font-bold">{networkOut} MB/s</span>
                                </div>
                                <div className="flex justify-between text-[9px]">
                                    <span className="text-gray-500">Active Processes</span>
                                    <span className="text-white font-bold">{activeProcesses}</span>
                                </div>
                            </div>
                        </Panel>

                        {/* All Apps - Detailed */}
                        <Panel title="Applications" icon={Layers} color="cyan">
                            <div className="space-y-1.5">
                                {apps.map((app, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2 hover:bg-black/50 transition-all">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                                <span className="text-[10px] font-bold text-white">{app.name}</span>
                                            </div>
                                            <span className="text-[8px] text-gray-600">{app.version}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1 text-[8px]">
                                            <div className="text-gray-500">👥 {app.users}</div>
                                            <div className="text-blue-500">⚡ {app.avgResponseTime}ms</div>
                                            <div className={app.errors > 0 ? 'text-red-500' : 'text-green-500'}>
                                                {app.errors > 0 ? '❌' : '✅'} {app.errors}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-[8px] mt-1 pt-1 border-t border-red-900/10">
                                            <div className="text-gray-600">CPU: {Math.floor(app.cpu)}%</div>
                                            <div className="text-gray-600">RAM: {app.ram}MB</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Databases */}
                        <Panel title="Databases" icon={Database} color="purple">
                            <div className="space-y-1.5">
                                {databases.map((db, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-white">{db.name}</span>
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded ${getStatusColor(db.status)}`}>
                                                {db.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-[8px] text-gray-500">
                                            <div>Size: {db.size}</div>
                                            <div>Conn: {db.connections}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </div>

                    {/* COLUMN 2 - APIs & Services */}
                    <div className="space-y-3 overflow-y-auto custom-scrollbar">
                        {/* API Services */}
                        <Panel title="API Services" icon={Zap} color="yellow">
                            <div className="space-y-1">
                                {apiServices.map((api, i) => (
                                    <div key={i} className="flex items-center justify-between bg-black/30 rounded p-1.5 text-[9px]">
                                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                            <span className={`px-1 py-0.5 rounded text-[7px] font-black ${getStatusColor(api.status)}`}>
                                                {api.status === 'online' ? '●' : api.status === 'degraded' ? '◐' : '○'}
                                            </span>
                                            <span className="text-white font-bold truncate">{api.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[8px]">
                                            <span className="text-gray-500">{api.latency}ms</span>
                                            <span className="text-blue-500">{api.requests}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Trading Platforms */}
                        <Panel title="Trading Platforms" icon={TrendingUp} color="green">
                            <div className="space-y-1.5">
                                {tradingPlatforms.map((platform, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${platform.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                                <span className="text-[10px] font-bold text-white">{platform.name}</span>
                                            </div>
                                            <span className="text-[8px] text-green-500 font-bold">{platform.connected} LIVE</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1 text-[8px] text-gray-500">
                                            <div>Acc: {platform.accounts}</div>
                                            <div>Vol: {(platform.volume/1000).toFixed(0)}k</div>
                                            <div>Trades: {platform.trades}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Social Media */}
                        <Panel title="Social Media" icon={MessageSquare} color="pink">
                            <div className="space-y-1.5">
                                {socialMedia.map((social, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-white">{social.platform}</span>
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded ${getStatusColor(social.status)}`}>
                                                {social.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1 text-[8px] text-gray-500">
                                            <div>👥 {(social.members/1000).toFixed(1)}k</div>
                                            <div>💬 {social.messages}</div>
                                            <div>🤖 {social.bots || social.channels || social.servers}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </div>

                    {/* COLUMN 3 - Live Activities & Logs */}
                    <div className="space-y-3 overflow-y-auto custom-scrollbar">
                        {/* Live User Activities */}
                        <Panel title="Live Activities" icon={Activity} color="cyan" pulse>
                            <div className="space-y-1">
                                {liveActivities.map((activity, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2 hover:bg-black/50 transition-all animate-in slide-in-from-right">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[10px] font-bold text-cyan-500">{activity.user}</span>
                                            <span className="text-[8px] text-gray-600">{activity.time}</span>
                                        </div>
                                        <div className="text-[9px] text-white">{activity.action}</div>
                                        <div className="text-[8px] text-gray-600 font-mono mt-0.5">{activity.ip}</div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Live Logs */}
                        <Panel title="System Logs" icon={FileText} color="orange" pulse>
                            <div className="space-y-0.5 font-mono">
                                {logs.map((log, i) => (
                                    <div key={i} className="flex gap-1 bg-black/30 rounded p-1 text-[8px] hover:bg-black/50 transition-all">
                                        <span className="text-gray-600">{log.time.split(':').slice(1).join(':')}</span>
                                        <span className={`font-black ${
                                            log.level === 'INFO' ? 'text-blue-500' :
                                            log.level === 'WARN' ? 'text-yellow-500' : 'text-red-500'
                                        }`}>{log.level}</span>
                                        <span className="text-purple-500">[{log.source}]</span>
                                        <span className="text-gray-400 truncate flex-1">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Error Tracking */}
                        <Panel title="Error Tracking" icon={AlertTriangle} color="red">
                            <div className="space-y-1.5">
                                {[
                                    { app: 'MT5 Gateway', error: 'Connection timeout', count: 23, lastSeen: '2m ago' },
                                    { app: 'Main Web App', error: 'Database query slow', count: 12, lastSeen: '5m ago' },
                                    { app: 'Mobile App', error: 'API rate limit', count: 8, lastSeen: '8m ago' },
                                ].map((error, i) => (
                                    <div key={i} className="bg-red-900/10 border border-red-900/30 rounded p-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-red-500">{error.app}</span>
                                            <span className="text-[8px] text-gray-600">{error.lastSeen}</span>
                                        </div>
                                        <div className="text-[9px] text-white mb-1">{error.error}</div>
                                        <div className="text-[8px] text-red-500 font-bold">Count: {error.count}</div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    </div>

                    {/* COLUMN 4 - Security & Management */}
                    <div className="space-y-3 overflow-y-auto custom-scrollbar">
                        {/* Security Scanner */}
                        <Panel title="Security Scans" icon={Shield} color="red">
                            <div className="space-y-1.5">
                                {[
                                    { type: 'Port Scan', status: 'complete', threats: 0 },
                                    { type: 'Malware Scan', status: 'running', threats: 0 },
                                    { type: 'DDoS Detection', status: 'complete', threats: 0 },
                                    { type: 'SQL Injection', status: 'complete', threats: 0 },
                                    { type: 'XSS Protection', status: 'complete', threats: 0 },
                                    { type: 'Firewall Status', status: 'complete', threats: 0 },
                                ].map((scan, i) => (
                                    <div key={i} className="flex items-center justify-between bg-black/30 rounded p-1.5 text-[9px]">
                                        <div className="flex items-center gap-1.5">
                                            {scan.status === 'running' ? (
                                                <RefreshCw size={10} className="text-yellow-500 animate-spin" />
                                            ) : (
                                                <CheckCircle size={10} className="text-green-500" />
                                            )}
                                            <span className="text-white font-bold">{scan.type}</span>
                                        </div>
                                        <span className={scan.threats > 0 ? 'text-red-500 font-black' : 'text-green-500'}>
                                            {scan.threats} ⚠
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-2 py-1.5 bg-red-600 text-white text-[9px] font-black rounded hover:bg-red-700 transition-all uppercase">
                                Full Scan Now
                            </button>
                        </Panel>

                        {/* Network Sessions */}
                        <Panel title="Live Sessions" icon={Globe} color="cyan">
                            <div className="space-y-1.5">
                                {[
                                    { user: 'trader_92', ip: '192.168.1.42', location: 'Dubai, UAE', duration: '4h 12m' },
                                    { user: 'admin_01', ip: '10.0.0.1', location: 'London, UK', duration: '2h 45m' },
                                    { user: 'analyst_23', ip: '172.16.0.8', location: 'NYC, US', duration: '1h 30m' },
                                ].map((session, i) => (
                                    <div key={i} className="bg-black/30 rounded p-2">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-[10px] font-bold text-cyan-500">{session.user}</span>
                                            <span className="text-[8px] text-green-500">{session.duration}</span>
                                        </div>
                                        <div className="text-[8px] text-gray-500 font-mono">{session.ip}</div>
                                        <div className="text-[8px] text-gray-600">{session.location}</div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Payments */}
                        <Panel title="Payments" icon={DollarSign} color="green">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="bg-black/50 rounded p-2 text-center">
                                    <div className="text-[8px] text-gray-500">Today</div>
                                    <div className="text-sm font-black text-green-500">$12.4k</div>
                                </div>
                                <div className="bg-black/50 rounded p-2 text-center">
                                    <div className="text-[8px] text-gray-500">This Week</div>
                                    <div className="text-sm font-black text-green-500">$84.2k</div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                {[
                                    { user: 'user_234', plan: 'Pro Plan', amount: 299, status: 'success' },
                                    { user: 'trader_92', plan: 'Premium', amount: 499, status: 'success' },
                                    { user: 'analyst_45', plan: 'Starter', amount: 99, status: 'pending' },
                                ].map((payment, i) => (
                                    <div key={i} className="flex items-center justify-between bg-black/30 rounded p-1.5 text-[9px]">
                                        <div className="flex-1">
                                            <div className="text-white font-bold">{payment.user}</div>
                                            <div className="text-gray-500">{payment.plan}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-green-500 font-bold">${payment.amount}</div>
                                            <div className={payment.status === 'success' ? 'text-green-500' : 'text-yellow-500'}>
                                                {payment.status === 'success' ? '✓' : '⏳'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* Quick Stats */}
                        <Panel title="Quick Stats" icon={BarChart2} color="blue">
                            <div className="grid grid-cols-2 gap-2">
                                <StatCard label="Users" value={users.length + 140} icon={Users} color="blue" />
                                <StatCard label="Revenue" value="$342k" icon={DollarSign} color="green" />
                                <StatCard label="Requests" value="1.2M" icon={Activity} color="cyan" />
                                <StatCard label="Errors" value="43" icon={AlertCircle} color="red" />
                            </div>
                        </Panel>
                    </div>

                    {/* COLUMN 5 - ALL ACTIVE IPs */}
                    <div className="space-y-3 overflow-y-auto custom-scrollbar">
                        {/* IP Statistics Header */}
                        <Panel title="Active IP Addresses" icon={Globe} color="cyan">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-green-500/10 border border-green-500/30 rounded p-1.5 text-center">
                                    <div className="text-[10px] text-green-500 font-black">{ipStats.totalSafe}</div>
                                    <div className="text-[8px] text-gray-500">Safe IPs</div>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/30 rounded p-1.5 text-center">
                                    <div className="text-[10px] text-red-500 font-black">{ipStats.totalBlocked}</div>
                                    <div className="text-[8px] text-gray-500">Blocked</div>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-1.5 text-center">
                                    <div className="text-[10px] text-yellow-500 font-black">{ipStats.totalSuspicious}</div>
                                    <div className="text-[8px] text-gray-500">Suspicious</div>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-1.5 text-center">
                                    <div className="text-[10px] text-blue-500 font-black">{ipStats.uniqueCountries}</div>
                                    <div className="text-[8px] text-gray-500">Countries</div>
                                </div>
                            </div>
                            <div className="flex justify-between text-[9px] text-gray-500 border-t border-red-900/10 pt-2">
                                <span>Total Bandwidth: <span className="text-white font-bold">{ipStats.totalBandwidth}</span></span>
                                <span>VPN: <span className="text-yellow-500 font-bold">{ipStats.vpnDetected}</span></span>
                            </div>
                        </Panel>

                        {/* All Active IPs - Detailed List */}
                        <Panel title="IP Details" icon={Network} color="purple">
                            <div className="space-y-2">
                                {activeIPs.map((ipData, i) => (
                                    <div key={i} className={`rounded p-2 border ${
                                        ipData.status === 'blocked' ? 'bg-red-900/10 border-red-900/30' :
                                        ipData.status === 'suspicious' ? 'bg-yellow-900/10 border-yellow-900/30' :
                                        'bg-black/30 border-red-900/10'
                                    } hover:bg-black/50 transition-all`}>
                                        {/* IP Header */}
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${
                                                    ipData.status === 'active' ? 'bg-green-500 animate-pulse' :
                                                    ipData.status === 'blocked' ? 'bg-red-500' :
                                                    'bg-yellow-500 animate-pulse'
                                                }`}></span>
                                                <span className="text-[10px] font-mono font-bold text-cyan-500">{ipData.ip}</span>
                                                {ipData.vpn && (
                                                    <span className="text-[7px] px-1 py-0.5 bg-yellow-500/20 text-yellow-500 rounded font-black">VPN</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {ipData.threat === 'safe' && <CheckCircle size={10} className="text-green-500" />}
                                                {ipData.threat === 'warning' && <AlertTriangle size={10} className="text-yellow-500" />}
                                                {ipData.threat === 'suspicious' && <XCircle size={10} className="text-red-500" />}
                                            </div>
                                        </div>

                                        {/* User & Location */}
                                        <div className="text-[9px] mb-1">
                                            <div className="text-white font-bold">{ipData.user}</div>
                                            <div className="text-gray-500">{ipData.location} [{ipData.country}]</div>
                                        </div>

                                        {/* Connection Details */}
                                        <div className="grid grid-cols-2 gap-1 text-[8px] text-gray-500 mb-1">
                                            <div>ISP: {ipData.isp}</div>
                                            <div>Duration: {ipData.duration}</div>
                                            <div>Sessions: {ipData.sessions}</div>
                                            <div>Requests: {ipData.requests}</div>
                                        </div>

                                        {/* Device & Status */}
                                        <div className="flex items-center justify-between text-[8px] pt-1 border-t border-red-900/10">
                                            <span className="text-gray-600 truncate flex-1">{ipData.device}</span>
                                            <span className={
                                                ipData.lastActive === 'Just now' ? 'text-green-500 font-bold' :
                                                'text-gray-500'
                                            }>{ipData.lastActive}</span>
                                        </div>

                                        {/* Quick Actions */}
                                        {ipData.status !== 'blocked' && (
                                            <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-red-900/10">
                                                <button 
                                                    onClick={() => handleBlockIP(ipData.ip)}
                                                    className="flex-1 py-1 bg-red-600/10 border border-red-600/30 rounded text-[8px] text-red-500 hover:bg-red-600 hover:text-white transition-all font-bold"
                                                >
                                                    <Lock size={10} className="inline mr-1" />
                                                    Block
                                                </button>
                                                <button className="flex-1 py-1 bg-blue-600/10 border border-blue-600/30 rounded text-[8px] text-blue-500 hover:bg-blue-600 hover:text-white transition-all font-bold">
                                                    <Eye size={10} className="inline mr-1" />
                                                    Monitor
                                                </button>
                                            </div>
                                        )}
                                        {ipData.status === 'blocked' && (
                                            <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-red-900/10">
                                                <button 
                                                    onClick={() => handleUnblockIP(ipData.ip)}
                                                    className="flex-1 py-1 bg-green-600/10 border border-green-600/30 rounded text-[8px] text-green-500 hover:bg-green-600 hover:text-white transition-all font-bold"
                                                >
                                                    <Unlock size={10} className="inline mr-1" />
                                                    Unblock
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        {/* IP Actions */}
                        <Panel title="IP Management" icon={Shield} color="red">
                            <div className="space-y-1.5">
                                <button 
                                    onClick={handleBlockAllSuspicious}
                                    className="w-full py-2 bg-red-600 text-white text-[9px] font-black rounded hover:bg-red-700 transition-all uppercase"
                                >
                                    <Lock size={12} className="inline mr-1" />
                                    Block All Suspicious
                                </button>
                                <button 
                                    onClick={handleExportIPs}
                                    className="w-full py-2 bg-blue-600 text-white text-[9px] font-black rounded hover:bg-blue-700 transition-all uppercase"
                                >
                                    <Download size={12} className="inline mr-1" />
                                    Export IP List
                                </button>
                                <button className="w-full py-2 bg-purple-600 text-white text-[9px] font-black rounded hover:bg-purple-700 transition-all uppercase">
                                    <RefreshCw size={12} className="inline mr-1" />
                                    Refresh Geolocation
                                </button>
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const Panel = ({ title, icon: Icon, color, children, pulse }: any) => {
    const colorMap: any = {
        red: 'text-red-500 border-red-900/20',
        blue: 'text-blue-500 border-blue-900/20',
        green: 'text-green-500 border-green-900/20',
        yellow: 'text-yellow-500 border-yellow-900/20',
        purple: 'text-purple-500 border-purple-900/20',
        cyan: 'text-cyan-500 border-cyan-900/20',
        pink: 'text-pink-500 border-pink-900/20',
        orange: 'text-orange-500 border-orange-900/20',
    };

    return (
        <div className={`bg-[#0a0000] border ${colorMap[color]} rounded-lg p-2.5`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className={`text-[10px] font-black uppercase tracking-wider ${colorMap[color].split(' ')[0]} flex items-center gap-1.5`}>
                    <Icon size={12} className={pulse ? 'animate-pulse' : ''} />
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
};

const Metric = ({ label, value, max, color }: any) => {
    const percentage = (value / max) * 100;
    const colorMap: any = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500'
    };
    
    return (
        <div className="text-[9px]">
            <div className="flex justify-between mb-0.5">
                <span className="text-gray-400 font-bold">{label}</span>
                <span className="text-white font-bold">{value}%</span>
            </div>
            <div className="h-1 bg-black rounded-full overflow-hidden">
                <div className={`h-full ${colorMap[color]} transition-all duration-300`} style={{width: `${percentage}%`}}></div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => {
    const colorMap: any = {
        blue: 'text-blue-500 bg-blue-500/10',
        green: 'text-green-500 bg-green-500/10',
        cyan: 'text-cyan-500 bg-cyan-500/10',
        red: 'text-red-500 bg-red-500/10'
    };

    return (
        <div className="bg-black/50 rounded p-2 text-center">
            <Icon size={14} className={`mx-auto mb-1 ${colorMap[color].split(' ')[0]}`} />
            <div className="text-[10px] font-black text-white">{value}</div>
            <div className="text-[8px] text-gray-500">{label}</div>
        </div>
    );
};
