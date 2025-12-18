

import React, { useState, useRef, useEffect } from 'react';
import { LanguageCode, ChatChannel } from '../types';
import { getTranslation } from '../utils/translations';
import { Search, MoreVertical, Mic, Send, Paperclip, Smile, Phone, Video, Users, Lock, Plus, Settings, Image, FileText, X, Megaphone, Hash, Check, CheckCheck, Sticker, Camera } from 'lucide-react';

interface Props {
    lang: LanguageCode;
    isAuthenticated?: boolean;
    onRequireAuth?: () => void;
}

const MOCK_CHANNELS: ChatChannel[] = [
    { id: '1', name: 'Routiex Official News', type: 'broadcast', activeUsers: 15420, lastMessage: '🚀 New V4.5 Update is LIVE! Check the changelog.', unread: 5, avatar: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=100', isVerified: true },
    { id: '2', name: 'Gold Whales (VIP)', type: 'vip', activeUsers: 420, lastMessage: 'Buy Order Limit 2035.00', unread: 12, avatar: 'https://images.unsplash.com/photo-1565514020176-db1444e30306?w=100' },
    { id: '3', name: 'Crypto Discussion', type: 'public', activeUsers: 8900, lastMessage: 'BTC pushing resistance!', avatar: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=100' },
    { id: '4', name: 'Ahmed Al-Saud', type: 'private_group', activeUsers: 2, lastMessage: 'Sent a photo.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
];

export const CommunityHub: React.FC<Props> = ({ lang, isAuthenticated = false, onRequireAuth }) => {
    const t = (key: string) => getTranslation(lang, key);
    const [activeChannel, setActiveChannel] = useState<ChatChannel>(MOCK_CHANNELS[0]);
    const [messageInput, setMessageInput] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState([
        { id: 1, user: 'Ahmed FX', text: 'Does anyone see the bearish divergence on 4H?', time: '10:42 AM', read: true, type: 'text' },
        { id: 2, user: 'Sarah Trade', text: 'Yes, RSI is clearly overbought. Looking for shorts below 2030.', time: '10:43 AM', read: true, type: 'text' },
        { id: 3, user: 'CryptoKing', text: 'Waiting for the retest of 52k before longing.', time: '10:45 AM', read: true, type: 'text' },
        { id: 4, user: 'Dr. Market', text: 'News in 5 minutes. Stay safe.', time: '10:48 AM', read: true, isAnalyst: true, type: 'text' },
        { id: 5, user: 'Me', text: 'Thanks for the heads up!', time: '10:50 AM', read: true, type: 'text' },
    ]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, activeChannel]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!messageInput.trim()) return;
        setMessages([...messages, { id: Date.now(), user: 'Me', text: messageInput, time: 'Now', read: false, type: 'text' }]);
        setMessageInput('');
    };

    const getChannelIcon = (type: string) => {
        switch(type) {
            case 'broadcast': return <Megaphone size={12} />;
            case 'vip': return <Lock size={12} className="text-yellow-500" />;
            case 'public': return <Hash size={12} />;
            default: return <Users size={12} />;
        }
    };

    return (
        <div className="flex h-full bg-[#0e1117] rounded-lg border border-[#1e2235] overflow-hidden relative shadow-2xl">
            {/* --- LEFT SIDEBAR (Telegram Style) --- */}
            <div className="hidden md:flex w-80 flex-col border-r border-[#1e2235] bg-[#0f111a]">
                {/* Header */}
                <div className="p-3 flex items-center gap-3">
                    <button className="p-2 hover:bg-[#1e2235] rounded-full text-gray-400"><Settings size={20} /></button>
                    <div className="flex-1 bg-[#1e2235] rounded-full flex items-center px-3 py-2 gap-2 focus-within:ring-1 focus-within:ring-terminal-accent transition-all">
                        <Search size={16} className="text-gray-500" />
                        <input type="text" placeholder="Search" className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-500" />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 px-2 pb-2 overflow-x-auto no-scrollbar">
                    {['All', 'Private', 'Groups', 'Channels', 'VIP'].map(f => (
                        <button key={f} className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#1e2235] text-gray-400 hover:text-white hover:bg-[#2a2f45] whitespace-nowrap">
                            {f}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {MOCK_CHANNELS.map(channel => (
                        <div 
                            key={channel.id} 
                            onClick={() => setActiveChannel(channel)}
                            className={`px-3 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                                activeChannel.id === channel.id 
                                ? 'bg-[#2b5278] text-white' 
                                : 'text-gray-300 hover:bg-[#1e2235]'
                            }`}
                        >
                            <div className="relative shrink-0">
                                <img src={channel.avatar} className="w-12 h-12 rounded-full object-cover bg-[#222]" />
                                {channel.type === 'vip' && <div className="absolute bottom-0 right-0 text-yellow-400 bg-black rounded-full p-0.5 border border-black"><Lock size={10} /></div>}
                                {channel.activeUsers > 0 && channel.type !== 'broadcast' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f111a]"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h3 className="font-bold text-sm truncate flex items-center gap-1">
                                        {channel.name}
                                        {channel.isVerified && <Check size={12} className="text-blue-400 bg-blue-400/20 rounded-full p-0.5" strokeWidth={4} />}
                                    </h3>
                                    <span className="text-[10px] opacity-60">10:45</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs opacity-70 truncate max-w-[180px]">
                                        {channel.lastMessage}
                                    </p>
                                    {channel.unread && channel.unread > 0 && (
                                        <span className="bg-gray-500/50 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                                            {channel.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Floating Action Button */}
                <div className="absolute bottom-6 right-6">
                    <button onClick={() => setShowCreateModal(true)} className="w-14 h-14 rounded-full bg-terminal-accent text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-terminal-accent/30">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* --- MAIN CHAT AREA --- */}
            <div className="flex-1 flex flex-col bg-[#0e1117] relative min-w-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                {/* Top Bar */}
                <div className="h-16 border-b border-[#1e2235] flex items-center justify-between px-4 bg-[#0f111a]/90 backdrop-blur shrink-0 z-10">
                    <div className="flex items-center gap-4 cursor-pointer">
                        <img src={activeChannel.avatar} className="w-10 h-10 rounded-full bg-[#222]" />
                        <div className="min-w-0">
                            <h3 className="font-bold text-white flex items-center gap-2 truncate">
                                {activeChannel.name}
                                {getChannelIcon(activeChannel.type)}
                            </h3>
                            <p className="text-xs text-blue-400 flex items-center gap-1 truncate">
                                {activeChannel.activeUsers.toLocaleString()} members
                                {activeChannel.type === 'broadcast' ? ' • subscribers' : ' • online'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-gray-400">
                        <button className="hover:text-white"><Search size={20} /></button>
                        <button className="hover:text-white"><Phone size={20} /></button>
                        <button className="hover:text-white"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Messages */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.user === 'Me' ? 'items-end' : 'items-start'}`}>
                             {/* Name for others */}
                             {msg.user !== 'Me' && activeChannel.type !== 'private_group' && (
                                <span className={`text-[10px] font-bold ml-3 mb-0.5 ${msg.isAnalyst ? 'text-yellow-500' : 'text-blue-400'}`}>
                                    {msg.user} {msg.isAnalyst && '★'}
                                </span>
                             )}
                            
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 relative text-sm leading-relaxed shadow-sm ${
                                msg.user === 'Me' 
                                ? 'bg-terminal-accent text-black rounded-br-none' 
                                : 'bg-[#1e2235] border border-[#2a2f45] text-white rounded-bl-none'
                            }`}>
                                {msg.text}
                                <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                                    <span className="text-[9px]">{msg.time}</span>
                                    {msg.user === 'Me' && (
                                        msg.read ? <CheckCheck size={12} /> : <Check size={12} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area (Telegram Style) */}
                <div className="p-3 bg-[#0f111a] shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                         <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors"><Paperclip size={24} /></button>
                         
                         <div className="flex-1 bg-[#1e2235] rounded-2xl flex items-center px-1 focus-within:ring-1 focus-within:ring-terminal-accent transition-all min-h-[48px]">
                            <input 
                                type="text" 
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder={isAuthenticated ? `Write a message...` : "Login to chat..."}
                                disabled={!isAuthenticated}
                                className="flex-1 bg-transparent outline-none text-sm text-white px-3 placeholder-gray-500 h-full"
                            />
                            <button type="button" className="p-2 text-gray-400 hover:text-white"><Sticker size={20} /></button>
                            <button type="button" className="p-2 text-gray-400 hover:text-white"><Smile size={20} /></button>
                         </div>

                         {messageInput.trim() ? (
                            <button type="submit" className="p-3 bg-terminal-accent rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                                <Send size={20} fill="currentColor" className="ml-0.5" />
                            </button>
                         ) : (
                            <button type="button" className="p-3 bg-[#1e2235] rounded-full text-gray-400 hover:text-white hover:bg-[#2a2f45] transition-colors">
                                <Mic size={24} />
                            </button>
                         )}
                    </form>
                </div>
            </div>

            {/* Create Channel Modal */}
            {showCreateModal && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-[#0f111a] border border-[#1e2235] w-96 rounded-xl shadow-2xl p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg">New Community</h3>
                            <button onClick={() => setShowCreateModal(false)}><X size={20} className="text-gray-500 hover:text-white"/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 bg-[#1e2235] rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-terminal-accent transition-colors">
                                    <Camera size={32} className="text-gray-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Channel Name</label>
                                <input type="text" className="w-full bg-[#1e2235] border border-transparent rounded-lg p-3 text-white outline-none focus:border-terminal-accent mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <textarea className="w-full bg-[#1e2235] border border-transparent rounded-lg p-3 text-white outline-none focus:border-terminal-accent mt-1 h-20 resize-none" />
                            </div>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#1e2235] rounded-lg flex-1 border border-transparent hover:border-terminal-accent">
                                    <input type="radio" name="type" className="accent-terminal-accent" />
                                    <span className="text-sm font-bold text-white">Public</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#1e2235] rounded-lg flex-1 border border-transparent hover:border-terminal-accent">
                                    <input type="radio" name="type" className="accent-terminal-accent" />
                                    <span className="text-sm font-bold text-white">Private</span>
                                </label>
                            </div>
                            <button className="w-full py-3 bg-terminal-accent text-black font-bold rounded-lg hover:bg-white transition-colors">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};