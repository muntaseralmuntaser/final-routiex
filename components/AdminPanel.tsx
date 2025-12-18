
import React, { useState } from 'react';
import { UserProfile, UserStatus, MarketplaceItem } from '../types';
import { 
    Users, Activity, DollarSign, Shield, Ban, Lock, Unlock, 
    Search, MoreVertical, Trash2, PlayCircle, StopCircle, 
    MessageSquare, Settings, Bell, LogOut, CheckCircle, AlertTriangle, ShoppingBag, FileText, XCircle
} from 'lucide-react';

interface Props {
    onLogout: () => void;
    users: UserProfile[];
    setUsers: (users: UserProfile[]) => void;
    marketItems: MarketplaceItem[];
    setMarketItems: (items: MarketplaceItem[]) => void;
}

export const AdminPanel: React.FC<Props> = ({ onLogout, users, setUsers, marketItems, setMarketItems }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'live' | 'finance' | 'marketplace'>('dashboard');
    const [search, setSearch] = useState('');

    // User Management Actions
    const updateUserStatus = (id: string, status: UserStatus) => {
        setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    };

    const toggleUserSeller = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, isSeller: !u.isSeller } : u));
    };

    // Market Item Actions
    const updateItemStatus = (id: string, status: MarketplaceItem['status']) => {
        setMarketItems(marketItems.map(i => i.id === id ? { ...i, status } : i));
    };

    const deleteItem = (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            setMarketItems(marketItems.filter(i => i.id !== id));
        }
    };

    const getStatusColor = (status: UserStatus) => {
        switch(status) {
            case 'active': return 'text-green-500 bg-green-500/10';
            case 'suspended': return 'text-yellow-500 bg-yellow-500/10';
            case 'frozen': return 'text-blue-500 bg-blue-500/10';
            case 'banned': return 'text-red-500 bg-red-500/10';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="flex h-screen bg-[#050508] text-white font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-[#0f111a] border-r border-[#1e2235] flex flex-col">
                <div className="p-6 border-b border-[#1e2235]">
                    <h1 className="text-xl font-black tracking-tight text-red-500 flex items-center gap-2">
                        <Shield size={24} /> ADMIN
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">System Control Panel</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-red-500 text-white font-bold' : 'text-gray-400 hover:bg-[#1e2235]'}`}>
                        <Activity size={18} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-red-500 text-white font-bold' : 'text-gray-400 hover:bg-[#1e2235]'}`}>
                        <Users size={18} /> User Manager
                    </button>
                    <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'marketplace' ? 'bg-red-500 text-white font-bold' : 'text-gray-400 hover:bg-[#1e2235]'}`}>
                        <ShoppingBag size={18} /> Marketplace
                    </button>
                    <button onClick={() => setActiveTab('live')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'live' ? 'bg-red-500 text-white font-bold' : 'text-gray-400 hover:bg-[#1e2235]'}`}>
                        <PlayCircle size={18} /> Live Control
                    </button>
                    <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'finance' ? 'bg-red-500 text-white font-bold' : 'text-gray-400 hover:bg-[#1e2235]'}`}>
                        <DollarSign size={18} /> Subscriptions
                    </button>
                </nav>

                <div className="p-4 border-t border-[#1e2235]">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-[#1e2235] rounded-lg">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-[#050508]">
                <header className="h-16 border-b border-[#1e2235] bg-[#0f111a] flex items-center justify-between px-8 sticky top-0 z-20">
                    <h2 className="text-lg font-bold uppercase tracking-widest">{activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            System Healthy
                        </div>
                        <Bell size={18} className="text-gray-400 cursor-pointer hover:text-white" />
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold">A</div>
                    </div>
                </header>

                <main className="p-8">
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard label="Total Users" value={users.length} change="+12%" icon={Users} color="text-blue-500" />
                                <StatCard label="Market Revenue" value="$142.5k" change="+8.4%" icon={DollarSign} color="text-green-500" />
                                <StatCard label="Pending Products" value={marketItems.filter(i => i.status === 'PENDING').length} change="Action Req" icon={ShoppingBag} color="text-yellow-500" />
                                <StatCard label="Live Streams" value="12" change="Active" icon={PlayCircle} color="text-red-500" />
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6 h-64 flex items-center justify-center text-gray-500">
                                    User Activity Chart Placeholder
                                </div>
                                <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6 h-64 flex items-center justify-center text-gray-500">
                                    Marketplace Sales Chart Placeholder
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-[#1e2235] flex justify-between items-center">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input 
                                        type="text" 
                                        placeholder="Search ID, Name, IP..." 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="bg-[#050508] border border-[#1e2235] rounded-lg py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-red-500 w-64"
                                    />
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#050508] text-xs uppercase text-gray-500 font-bold">
                                    <tr>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Seller Mode</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2235]">
                                    {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map(user => (
                                        <tr key={user.id} className="hover:bg-[#1e2235]/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="uppercase text-xs font-bold">{user.role}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${getStatusColor(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button 
                                                    onClick={() => toggleUserSeller(user.id)}
                                                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${user.isSeller ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30' : 'bg-[#1e2235] text-gray-500'}`}
                                                >
                                                    {user.isSeller ? 'Enabled' : 'Disabled'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {user.status === 'active' ? (
                                                        <>
                                                            <button onClick={() => updateUserStatus(user.id, 'frozen')} title="Freeze" className="p-1.5 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500 hover:text-white"><Lock size={14}/></button>
                                                            <button onClick={() => updateUserStatus(user.id, 'suspended')} title="Suspend" className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white"><AlertTriangle size={14}/></button>
                                                            <button onClick={() => updateUserStatus(user.id, 'banned')} title="Ban" className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white"><Ban size={14}/></button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => updateUserStatus(user.id, 'active')} title="Activate" className="p-1.5 bg-green-500/10 text-green-500 rounded hover:bg-green-500 hover:text-white"><Unlock size={14}/></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* MARKETPLACE TAB */}
                    {activeTab === 'marketplace' && (
                        <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-[#1e2235] flex justify-between items-center">
                                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Product Management</h3>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20">Pending: {marketItems.filter(i => i.status === 'PENDING').length}</span>
                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20">Live: {marketItems.filter(i => i.status === 'APPROVED').length}</span>
                                </div>
                            </div>
                            <table className="w-full text-left">
                                <thead className="bg-[#050508] text-xs uppercase text-gray-500 font-bold">
                                    <tr>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Author</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">File</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e2235]">
                                    {marketItems.map(item => (
                                        <tr key={item.id} className="hover:bg-[#1e2235]/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white">{item.title}</div>
                                                <div className="text-xs text-gray-500">{item.category}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-300">{item.author}</td>
                                            <td className="p-4 text-sm text-green-400 font-mono">${item.price}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    item.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' :
                                                    item.status === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <FileText size={12} />
                                                    {item.fileType?.toUpperCase() || 'FILE'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {item.status === 'PENDING' && (
                                                        <>
                                                            <button onClick={() => updateItemStatus(item.id, 'APPROVED')} title="Approve" className="p-1.5 bg-green-500/10 text-green-500 rounded hover:bg-green-500 hover:text-white"><CheckCircle size={14}/></button>
                                                            <button onClick={() => updateItemStatus(item.id, 'REJECTED')} title="Reject" className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white"><XCircle size={14}/></button>
                                                        </>
                                                    )}
                                                    {item.status === 'APPROVED' && (
                                                         <button onClick={() => updateItemStatus(item.id, 'PENDING')} title="Suspend" className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white"><Lock size={14}/></button>
                                                    )}
                                                    <button onClick={() => deleteItem(item.id)} title="Delete" className="p-1.5 bg-gray-800 text-gray-500 rounded hover:bg-red-600 hover:text-white"><Trash2 size={14}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, change, icon: Icon, color }: any) => (
    <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-6">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
                <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon size={20} className={color} />
            </div>
        </div>
        <div className="mt-4 text-xs font-medium text-green-500 bg-green-500/5 inline-block px-2 py-0.5 rounded">
            {change}
        </div>
    </div>
);
