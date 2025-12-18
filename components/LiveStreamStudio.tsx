
import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { 
    Video, Mic, MessageSquare, Gift, Radio, Play, MonitorUp, MicOff, 
    VideoOff, Send, Smile, Smartphone, Monitor, Layout, Type, Sparkles, Users, 
    Settings, Share2, Youtube, Instagram, Facebook, X as XIcon, Plus, Trash2, Music, Cast,
    Calendar, PenTool, ArrowRight, BarChart2, Save, Scissors, Upload, Film, 
    Wifi, CheckCircle, Ghost, Cpu, Zap, Link as LinkIcon, Copy, StopCircle, 
    MoreVertical, Wand2, Layers, Download, Eye, Heart, Hash, Globe, MousePointer2, ShieldCheck,
    Ban, UserMinus, MessageSquareOff, Lock, Unlock, Siren, Gauge, Eraser, Sticker, MousePointer, Bell
} from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

// --- TYPES ---

type StudioMode = 'HOME' | 'WIZARD' | 'STUDIO' | 'EDITOR';
type ToolType = 'NONE' | 'POINTER' | 'PEN' | 'LASER' | 'STICKER' | 'ERASER';

interface Guest {
    id: string;
    name: string;
    avatar: string;
    role: 'GUEST' | 'CO-HOST';
    status: 'ONLINE' | 'CONNECTING';
    isMuted: boolean;
    isCamOff: boolean;
    ip: string;
    device: string;
    browser: string;
    networkScore: number; // 0-100
}

interface ChatMessage {
    id: string;
    user: string;
    text: string;
    color: string;
    isGift?: boolean;
    giftIcon?: any;
    giftName?: string;
    timestamp: string;
}

interface DrawingPath {
    id: string;
    points: {x: number, y: number}[];
    color: string;
    width: number;
    type: 'PEN' | 'LASER';
}

interface StickerItem {
    id: string;
    x: number;
    y: number;
    emoji: string;
}

// --- MOCK DATA ---

const SOCIALS = [
    { id: 'tk', name: 'TikTok', icon: Music, color: 'text-pink-500' },
    { id: 'yt', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
    { id: 'fb', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'ig', name: 'Instagram', icon: Instagram, color: 'text-purple-600' },
    { id: 'x', name: 'X / Twitter', icon: XIcon, color: 'text-white' },
];

const STICKERS = ['🔥', '🚀', '💰', '📉', '📈', '🤡', '❤️', '✅'];

export const LiveStreamStudio: React.FC<Props> = ({ lang }) => {
    
    // --- STATE ---
    const [mode, setMode] = useState<StudioMode>('HOME');
    const [wizardStep, setWizardStep] = useState(0); // 0: Dest, 1: Hardware, 2: Network, 3: System
    
    // Broadcast Settings
    const [streamTitle, setStreamTitle] = useState("Market Analysis & Live Trading 🔴");
    const [quality, setQuality] = useState<'1080p' | '4k'>('4k');
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['tk', 'yt']);
    const [isLive, setIsLive] = useState(false);
    const [duration, setDuration] = useState(0);
    const [viewers, setViewers] = useState(1240);
    
    // Hardware State
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [screenShare, setScreenShare] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    // Tools & Interactive
    const [activeTool, setActiveTool] = useState<ToolType>('NONE');
    const [drawColor, setDrawColor] = useState('#ef4444');
    const [paths, setPaths] = useState<DrawingPath[]>([]);
    const [stickers, setStickers] = useState<StickerItem[]>([]);
    const [currentPath, setCurrentPath] = useState<DrawingPath | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Guests & Management
    const [guests, setGuests] = useState<Guest[]>([]);
    const [chatLocked, setChatLocked] = useState(false);
    const [entryLocked, setEntryLocked] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showGuestDiagnostics, setShowGuestDiagnostics] = useState<string | null>(null); // ID of guest to show info

    // Diagnostics Data (Mock)
    const [netSpeed, setNetSpeed] = useState(0);
    const [jitter, setJitter] = useState(0);
    
    // --- EFFECTS ---

    // Audio Level Sim
    useEffect(() => {
        const interval = setInterval(() => {
            if(micOn) setAudioLevel(Math.random() * 100);
            else setAudioLevel(0);
        }, 100);
        return () => clearInterval(interval);
    }, [micOn]);

    // Live Timer & Chat Sim
    useEffect(() => {
        let interval: any;
        if (isLive) {
            interval = setInterval(() => {
                setDuration(p => p + 1);
                // Random Chat
                if (Math.random() > 0.7 && !chatLocked) {
                    const msgs = ["Nice chart!", "Is gold bullish?", "Sound clear ✅", "Rocket!", "Can I join?"];
                    setMessages(prev => [...prev.slice(-10), {
                        id: Date.now().toString(),
                        user: `Viewer${Math.floor(Math.random()*100)}`,
                        text: msgs[Math.floor(Math.random()*msgs.length)],
                        color: 'text-gray-300',
                        timestamp: new Date().toLocaleTimeString()
                    }]);
                }
                // Random Guest Request
                if (Math.random() > 0.98 && !entryLocked && guests.length < 2) {
                    addGuest();
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLive, chatLocked, entryLocked, guests]);

    // Network Test Sim
    useEffect(() => {
        if (mode === 'WIZARD' && wizardStep === 2) {
            const interval = setInterval(() => {
                setNetSpeed(Math.floor(Math.random() * 100) + 800); // 800-900 Mbps
                setJitter(Math.floor(Math.random() * 5));
            }, 200);
            return () => clearInterval(interval);
        }
    }, [mode, wizardStep]);

    // --- HANDLERS ---

    const addGuest = () => {
        const id = Date.now().toString();
        const newGuest: Guest = {
            id,
            name: `Guest_${id.slice(-3)}`,
            avatar: `https://i.pravatar.cc/150?u=${id}`,
            role: 'GUEST',
            status: 'CONNECTING',
            isMuted: false,
            isCamOff: false,
            ip: `192.168.1.${Math.floor(Math.random()*255)}`,
            device: 'iPhone 15 Pro Max',
            browser: 'Safari Mobile 17.0',
            networkScore: 98
        };
        setGuests(prev => [...prev, newGuest]);
        
        // Simulate Connection Lag
        setTimeout(() => {
            setGuests(prev => prev.map(g => g.id === id ? { ...g, status: 'ONLINE' } : g));
            setShowGuestDiagnostics(id); // Auto show diagnostics on join
        }, 1500);
    };

    const handleCanvasInteract = (e: React.MouseEvent) => {
        if (activeTool === 'NONE') return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (activeTool === 'STICKER') {
            setStickers([...stickers, { id: Date.now().toString(), x, y, emoji: STICKERS[0] }]); // Default to first for demo
        } else if (activeTool === 'PEN' || activeTool === 'LASER') {
            if (e.type === 'mousedown') {
                setCurrentPath({ id: Date.now().toString(), points: [{x, y}], color: drawColor, width: activeTool === 'LASER' ? 6 : 3, type: activeTool });
            } else if (e.type === 'mousemove' && currentPath) {
                setCurrentPath({ ...currentPath, points: [...currentPath.points, {x, y}] });
            } else if (e.type === 'mouseup') {
                if (currentPath) {
                    if (activeTool === 'PEN') setPaths([...paths, currentPath]);
                    // Laser disappears automatically (simulated by not saving to paths)
                    setCurrentPath(null);
                }
            }
        }
    };

    const toggleDestination = (id: string) => {
        if (selectedDestinations.includes(id)) {
            setSelectedDestinations(prev => prev.filter(d => d !== id));
        } else {
            setSelectedDestinations(prev => [...prev, id]);
        }
    };

    // --- RENDERERS ---

    const renderWizard = () => (
        <div className="flex flex-col h-full items-center justify-center p-8 bg-[#050508] animate-in fade-in">
            <div className="w-full max-w-3xl bg-[#0f111a] border border-[#1e2235] rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1e2235]">
                    <div className="h-full bg-terminal-accent transition-all duration-500" style={{ width: `${((wizardStep + 1) / 4) * 100}%` }}></div>
                </div>

                <div className="p-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2">BROADCAST SETUP</h2>
                            <p className="text-gray-400">Step {wizardStep + 1} of 4: {['Destinations', 'Hardware Check', 'Network Analysis', 'System Diagnostics'][wizardStep]}</p>
                        </div>
                        <button onClick={() => setMode('HOME')} className="text-gray-500 hover:text-white"><XIcon size={24}/></button>
                    </div>

                    <div className="min-h-[300px]">
                        {/* STEP 0: DESTINATIONS */}
                        {wizardStep === 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-full mb-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Stream Title</label>
                                    <input 
                                        value={streamTitle}
                                        onChange={e => setStreamTitle(e.target.value)}
                                        className="w-full bg-[#151720] border border-[#2a2f45] rounded-xl p-4 text-white font-bold outline-none focus:border-terminal-accent"
                                    />
                                </div>
                                {SOCIALS.map(s => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => toggleDestination(s.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedDestinations.includes(s.id) ? 'bg-terminal-accent/10 border-terminal-accent' : 'bg-[#151720] border-[#2a2f45] opacity-60'}`}
                                    >
                                        <s.icon size={24} className={selectedDestinations.includes(s.id) ? s.color : 'text-gray-500'} />
                                        <span className="font-bold text-white">{s.name}</span>
                                        {selectedDestinations.includes(s.id) && <CheckCircle size={18} className="ml-auto text-terminal-accent" />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* STEP 1: HARDWARE */}
                        {wizardStep === 1 && (
                            <div className="space-y-6">
                                <div className="bg-[#151720] p-6 rounded-2xl border border-[#2a2f45] flex items-center gap-6">
                                    <div className="w-32 h-20 bg-black rounded-lg border border-[#333] flex items-center justify-center relative overflow-hidden">
                                        <Video size={32} className="text-gray-500" />
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white mb-1">Video Source</h4>
                                        <p className="text-sm text-gray-400">Sony ZV-E10 (4K Capture)</p>
                                    </div>
                                    <div className="text-green-500 font-bold text-sm flex items-center gap-2"><CheckCircle size={16}/> Ready</div>
                                </div>
                                <div className="bg-[#151720] p-6 rounded-2xl border border-[#2a2f45] flex items-center gap-6">
                                    <div className="w-32 h-20 bg-black rounded-lg border border-[#333] flex items-center justify-center relative">
                                        <Mic size={32} className="text-gray-500" />
                                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${audioLevel}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white mb-1">Audio Input</h4>
                                        <p className="text-sm text-gray-400">Shure SM7B (USB Interface)</p>
                                    </div>
                                    <div className="text-green-500 font-bold text-sm flex items-center gap-2"><CheckCircle size={16}/> Active</div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: NETWORK */}
                        {wizardStep === 2 && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="relative mb-8">
                                    <Gauge size={80} className="text-terminal-accent animate-pulse" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-8">
                                        <div className="text-4xl font-black text-white">{netSpeed}</div>
                                        <div className="text-xs text-gray-500 uppercase font-bold">Mbps</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-8 w-full max-w-lg text-center">
                                    <div className="bg-[#151720] p-4 rounded-xl border border-[#2a2f45]">
                                        <div className="text-gray-500 text-xs font-bold uppercase mb-1">Upload</div>
                                        <div className="text-xl font-black text-green-500">945 Mbps</div>
                                    </div>
                                    <div className="bg-[#151720] p-4 rounded-xl border border-[#2a2f45]">
                                        <div className="text-gray-500 text-xs font-bold uppercase mb-1">Jitter</div>
                                        <div className="text-xl font-black text-yellow-500">{jitter} ms</div>
                                    </div>
                                    <div className="bg-[#151720] p-4 rounded-xl border border-[#2a2f45]">
                                        <div className="text-gray-500 text-xs font-bold uppercase mb-1">Stability</div>
                                        <div className="text-xl font-black text-blue-500">99.9%</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SYSTEM */}
                        {wizardStep === 3 && (
                            <div className="space-y-4">
                                <div className="bg-[#151720] p-4 rounded-xl border border-[#2a2f45] flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Cpu size={24} className="text-blue-500" />
                                        <div>
                                            <div className="font-bold text-white">Processor Load</div>
                                            <div className="text-xs text-gray-400">12% Usage (Optimal)</div>
                                        </div>
                                    </div>
                                    <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[12%]"></div>
                                    </div>
                                </div>
                                <div className="bg-[#151720] p-4 rounded-xl border border-[#2a2f45] flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Zap size={24} className="text-yellow-500" />
                                        <div>
                                            <div className="font-bold text-white">GPU Acceleration</div>
                                            <div className="text-xs text-gray-400">RTX 4090 Detected</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded">ENABLED</div>
                                </div>
                                <div className="bg-[#151720] p-4 rounded-xl border border-[#2a2f45] flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Globe size={24} className="text-purple-500" />
                                        <div>
                                            <div className="font-bold text-white">Browser Engine</div>
                                            <div className="text-xs text-gray-400">WebRTC V.112 Supported</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded">COMPATIBLE</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#1e2235]">
                        {wizardStep > 0 && (
                            <button onClick={() => setWizardStep(p => p - 1)} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-[#1e2235]">Back</button>
                        )}
                        <button 
                            onClick={() => wizardStep < 3 ? setWizardStep(p => p + 1) : setMode('STUDIO')}
                            className="px-8 py-3 bg-terminal-accent text-black rounded-xl font-black uppercase tracking-wider hover:bg-white transition-colors shadow-lg shadow-terminal-accent/20"
                        >
                            {wizardStep === 3 ? 'Enter Studio' : 'Next Step'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStudio = () => (
        <div className="flex h-full bg-[#050508] overflow-hidden">
            {/* --- LEFT: TOOLS SIDEBAR --- */}
            <div className="w-16 bg-[#0f111a] border-r border-[#1e2235] flex flex-col items-center py-4 gap-2 z-20">
                <button onClick={() => setMode('HOME')} className="mb-4 p-2 bg-[#1e2235] rounded-xl text-gray-400 hover:text-white"><ArrowRight className="rotate-180" size={20}/></button>
                
                <div className="w-full h-[1px] bg-[#1e2235] my-2"></div>
                
                {[
                    { id: 'POINTER', icon: MousePointer2, label: 'Pointer' },
                    { id: 'PEN', icon: PenTool, label: 'Pen' },
                    { id: 'LASER', icon: Wand2, label: 'Laser' },
                    { id: 'STICKER', icon: Sticker, label: 'Sticker' },
                    { id: 'ERASER', icon: Eraser, label: 'Clear' },
                ].map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => {
                            if (tool.id === 'ERASER') {
                                setPaths([]);
                                setStickers([]);
                            } else {
                                setActiveTool(tool.id as ToolType);
                            }
                        }}
                        className={`p-3 rounded-xl transition-all relative group ${activeTool === tool.id ? 'bg-terminal-accent text-black' : 'text-gray-400 hover:text-white hover:bg-[#1e2235]'}`}
                    >
                        <tool.icon size={20} />
                        <span className="absolute left-full ml-4 bg-black px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-[#333] z-50 pointer-events-none">{tool.label}</span>
                    </button>
                ))}

                <div className="mt-auto">
                    <button className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={20}/></button>
                </div>
            </div>

            {/* --- CENTER: MAIN CANVAS --- */}
            <div className="flex-1 flex flex-col relative min-w-0 bg-[#000]">
                {/* Top Control Bar */}
                <div className="h-16 bg-[#0f111a] border-b border-[#1e2235] flex items-center justify-between px-6 shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full font-black text-xs flex items-center gap-2 ${isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-[#1e2235] text-gray-400'}`}>
                            <Radio size={12} /> {isLive ? 'ON AIR' : 'OFFLINE'}
                        </div>
                        {isLive && <span className="text-white font-mono text-sm">{new Date(duration * 1000).toISOString().substr(11, 8)}</span>}
                        {quality === '4k' && <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded border border-purple-400/50">4K HDR</span>}
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setMicOn(!micOn)} className={`p-2 rounded-full border ${micOn ? 'bg-[#1e2235] border-[#333] text-white' : 'bg-red-500 border-red-500 text-white'}`}>{micOn ? <Mic size={18}/> : <MicOff size={18}/>}</button>
                        <button onClick={() => setCamOn(!camOn)} className={`p-2 rounded-full border ${camOn ? 'bg-[#1e2235] border-[#333] text-white' : 'bg-red-500 border-red-500 text-white'}`}>{camOn ? <Video size={18}/> : <VideoOff size={18}/>}</button>
                        <button onClick={() => setScreenShare(!screenShare)} className={`p-2 rounded-full border ${screenShare ? 'bg-green-500 border-green-500 text-black' : 'bg-[#1e2235] border-[#333] text-white'}`}><MonitorUp size={18}/></button>
                        
                        <div className="h-8 w-[1px] bg-[#333] mx-2"></div>
                        
                        <button 
                            onClick={() => setIsLive(!isLive)}
                            className={`px-6 py-2 rounded-lg font-black uppercase text-xs flex items-center gap-2 transition-all ${isLive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-terminal-accent hover:bg-white text-black'}`}
                        >
                            {isLive ? <StopCircle size={16} /> : <Cast size={16} />}
                            {isLive ? 'End Stream' : 'Go Live'}
                        </button>
                    </div>
                </div>

                {/* Video Area */}
                <div className="flex-1 relative overflow-hidden bg-[#050508] flex items-center justify-center">
                    <div 
                        ref={canvasRef}
                        className={`relative aspect-video w-full max-w-6xl bg-[#111] shadow-2xl overflow-hidden cursor-${activeTool === 'NONE' ? 'default' : 'crosshair'}`}
                        onMouseDown={handleCanvasInteract}
                        onMouseMove={handleCanvasInteract}
                        onMouseUp={handleCanvasInteract}
                    >
                        {/* Background / Camera Feed */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1600&q=80')` }}></div>
                        {!camOn && <div className="absolute inset-0 bg-black flex items-center justify-center flex-col text-gray-500"><VideoOff size={64}/><span className="mt-4 font-bold">CAMERA DISABLED</span></div>}

                        {/* Drawing Layer (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                            {paths.map(p => (
                                <path 
                                    key={p.id} 
                                    d={`M ${p.points.map(pt => `${pt.x} ${pt.y}`).join(' L ')}`} 
                                    stroke={p.color} 
                                    strokeWidth={p.width} 
                                    fill="none" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            ))}
                            {currentPath && (
                                <path 
                                    d={`M ${currentPath.points.map(pt => `${pt.x} ${pt.y}`).join(' L ')}`} 
                                    stroke={currentPath.color} 
                                    strokeWidth={currentPath.width} 
                                    fill="none" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                />
                            )}
                        </svg>

                        {/* Sticker Layer */}
                        {stickers.map(s => (
                            <div key={s.id} className="absolute text-4xl pointer-events-none z-10 animate-in zoom-in spin-in-3" style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)' }}>
                                {s.emoji}
                            </div>
                        ))}

                        {/* Guests Grid Overlay */}
                        {guests.length > 0 && (
                            <div className="absolute bottom-4 right-4 flex gap-4 z-20">
                                {guests.map(g => (
                                    <div key={g.id} className="w-48 aspect-video bg-gray-900 rounded-lg border border-gray-700 relative overflow-hidden shadow-xl group">
                                        <img src={g.avatar} className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                                            {g.isMuted && <MicOff size={8} className="text-red-500" />} {g.name}
                                        </div>
                                        {/* Admin Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setShowGuestDiagnostics(g.id)} className="p-2 bg-[#1e2235] rounded-full hover:text-terminal-accent"><Settings size={14}/></button>
                                            <button className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"><UserMinus size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: CONTROL PANEL --- */}
            <div className="w-80 bg-[#0f111a] border-l border-[#1e2235] flex flex-col shrink-0 z-20">
                {/* Host Controls */}
                <div className="p-4 border-b border-[#1e2235] bg-[#151720]">
                    <h3 className="text-xs font-black text-gray-400 uppercase mb-3 flex items-center gap-2"><ShieldCheck size={12}/> Room Management</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setChatLocked(!chatLocked)}
                            className={`p-2 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-2 ${chatLocked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#1e2235] border-transparent text-gray-300 hover:text-white'}`}
                        >
                            {chatLocked ? <MessageSquareOff size={14}/> : <MessageSquare size={14}/>} Chat
                        </button>
                        <button 
                            onClick={() => setEntryLocked(!entryLocked)}
                            className={`p-2 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-2 ${entryLocked ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[#1e2235] border-transparent text-gray-300 hover:text-white'}`}
                        >
                            {entryLocked ? <Lock size={14}/> : <Unlock size={14}/>} Entry
                        </button>
                        <button className="p-2 rounded-lg text-[10px] font-bold bg-[#1e2235] hover:bg-red-900/20 hover:text-red-500 text-gray-300 flex items-center justify-center gap-2">
                            <MicOff size={14}/> Mute All
                        </button>
                        <button className="p-2 rounded-lg text-[10px] font-bold bg-[#1e2235] hover:bg-terminal-accent/10 hover:text-terminal-accent text-gray-300 flex items-center justify-center gap-2">
                            <LinkIcon size={14}/> Invite
                        </button>
                    </div>
                </div>

                {/* Chat */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-3 border-b border-[#1e2235] flex justify-between items-center">
                        <span className="text-xs font-bold text-white">Live Chat</span>
                        <span className="text-[10px] text-gray-500">{viewers} watching</span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-[#050508]">
                        {messages.map(msg => (
                            <div key={msg.id} className="text-xs">
                                <span className={`font-bold ${msg.color} mr-2`}>{msg.user}:</span>
                                <span className="text-gray-300">{msg.text}</span>
                            </div>
                        ))}
                    </div>
                    {/* Send Box */}
                    <div className="p-3 bg-[#151720] border-t border-[#1e2235]">
                        <div className="flex gap-2">
                            <input disabled={chatLocked} placeholder={chatLocked ? "Chat Locked" : "Send message..."} className="flex-1 bg-[#050508] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-terminal-accent disabled:opacity-50"/>
                            <button className="bg-terminal-accent text-black p-2 rounded hover:bg-white"><Send size={16}/></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GUEST DIAGNOSTICS MODAL --- */}
            {showGuestDiagnostics && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-[#0f111a] border border-[#1e2235] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-[#1e2235] flex justify-between items-center bg-[#151720]">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <Siren size={20} className="text-terminal-accent" /> Security Scan
                            </h3>
                            <button onClick={() => setShowGuestDiagnostics(null)}><XIcon size={20} className="text-gray-500 hover:text-white"/></button>
                        </div>
                        {guests.filter(g => g.id === showGuestDiagnostics).map(g => (
                            <div key={g.id} className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <img src={g.avatar} className="w-16 h-16 rounded-full border-2 border-[#333]" />
                                    <div>
                                        <h4 className="text-xl font-black text-white">{g.name}</h4>
                                        <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">VERIFIED USER</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#050508] p-3 rounded border border-[#2a2f45]">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">IP Address</div>
                                        <div className="text-sm text-white font-mono">{g.ip}</div>
                                    </div>
                                    <div className="bg-[#050508] p-3 rounded border border-[#2a2f45]">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">Device</div>
                                        <div className="text-sm text-white">{g.device}</div>
                                    </div>
                                    <div className="bg-[#050508] p-3 rounded border border-[#2a2f45]">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">Browser</div>
                                        <div className="text-sm text-white">{g.browser}</div>
                                    </div>
                                    <div className="bg-[#050508] p-3 rounded border border-[#2a2f45]">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold">Connection Score</div>
                                        <div className="text-sm text-green-500 font-black">{g.networkScore}/100</div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => { setGuests(prev => prev.filter(gu => gu.id !== g.id)); setShowGuestDiagnostics(null); }} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2">
                                        <Ban size={18} /> Kick User
                                    </button>
                                    <button onClick={() => setShowGuestDiagnostics(null)} className="flex-1 bg-[#1e2235] text-white py-3 rounded-lg font-bold hover:bg-[#2a2f45]">
                                        Close
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderHome = () => (
        <div className="flex flex-col h-full bg-[#050508] p-8 animate-in fade-in overflow-y-auto custom-scrollbar">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#1e2235] pb-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                        <Radio className="text-red-500 animate-pulse" /> LIVE STUDIO <span className="text-terminal-accent">PRO</span>
                    </h1>
                    <p className="text-gray-400">Institutional Broadcasting & Content Suite</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <button onClick={() => setMode('WIZARD')} className="group relative h-64 bg-[#0f111a] border border-[#1e2235] rounded-3xl p-6 flex flex-col justify-between hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all text-left overflow-hidden">
                    <div className="z-10">
                        <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"><Cast size={28} /></div>
                        <h3 className="text-2xl font-bold text-white leading-tight">Go Live</h3>
                        <p className="text-sm text-gray-400 mt-2">Start multicast stream with full diagnostics.</p>
                    </div>
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm group-hover:translate-x-2 transition-transform">START WIZARD <ArrowRight size={16} /></div>
                </button>

                <button className="group relative h-64 bg-[#0f111a] border border-[#1e2235] rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all text-left overflow-hidden">
                    <div className="z-10">
                        <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"><Wand2 size={28} /></div>
                        <h3 className="text-2xl font-bold text-white leading-tight">AI Editor</h3>
                        <p className="text-sm text-gray-400 mt-2">Auto-caption and trim VODs for TikTok/Reels.</p>
                    </div>
                    <div className="flex items-center gap-2 text-purple-500 font-bold text-sm group-hover:translate-x-2 transition-transform">OPEN EDITOR <ArrowRight size={16} /></div>
                </button>

                <button className="group relative h-64 bg-[#0f111a] border border-[#1e2235] rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all text-left overflow-hidden">
                    <div className="z-10">
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"><Users size={28} /></div>
                        <h3 className="text-2xl font-bold text-white leading-tight">Meeting</h3>
                        <p className="text-sm text-gray-400 mt-2">Host private webinars with secure links.</p>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm group-hover:translate-x-2 transition-transform">CREATE LINK <ArrowRight size={16} /></div>
                </button>

                <button onClick={() => alert("Notification sent to followers!")} className="group relative h-64 bg-[#0f111a] border border-[#1e2235] rounded-3xl p-6 flex flex-col justify-between hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all text-left overflow-hidden">
                    <div className="z-10">
                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"><Bell size={28} /></div>
                        <h3 className="text-2xl font-bold text-white leading-tight">Notify</h3>
                        <p className="text-sm text-gray-400 mt-2">Send push notification to all 12k followers.</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-500 font-bold text-sm group-hover:translate-x-2 transition-transform">SEND ALERT <ArrowRight size={16} /></div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full font-sans text-white bg-[#050508]">
            {mode === 'HOME' && renderHome()}
            {mode === 'WIZARD' && renderWizard()}
            {mode === 'STUDIO' && renderStudio()}
        </div>
    );
};
