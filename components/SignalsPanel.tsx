
import React, { useState } from 'react';
import { MarketSignal } from '../types';
import { 
    ArrowUpRight, ArrowDownRight, RefreshCw, Filter, Target, 
    History, PlayCircle, StopCircle, Clock, TrendingUp, 
    TrendingDown, AlertCircle, CheckCircle, BarChart2, 
    Maximize2, MoreHorizontal, ChevronRight, Check, Activity, Zap, Layers, X, ShieldCheck, Copy, Share2, Send, MessageCircle, Twitter, Globe, Facebook, Instagram, Linkedin, Video, Monitor, Mail, Printer, Link2, Download, DollarSign, Server, User, Star, Award
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Tooltip as RechartsTooltip } from 'recharts';

// Extended Interface for Pro Features
interface ProSignal extends MarketSignal {
  rr: string;
  pips: number;
  roi: number; // Return on Investment %
  analyst: {
      id: string;
      name: string;
      avatar: string;
      rank: string;
      winRate: number;
      totalPnl: string;
      riskScore: number;
  };
  timeOpened: string;
  tpStatus: 0 | 1 | 2 | 3; // How many TPs hit
  chartPattern: string; // e.g. "Bull Flag"
  leverage: string;
  slHit?: boolean;
}

const MOCK_SIGNALS: ProSignal[] = [
  { 
      id: '1', symbol: 'XAUUSD', type: 'BUY', entry: 2031.50, tp: 2045.00, sl: 2025.00, 
      confidence: 92, timestamp: '2 min ago', timeOpened: '10:42 AM', status: 'ACTIVE', 
      rr: '1:3.5', pips: +45, roi: 12.5, 
      analyst: { id: 'a1', name: 'Routiex AI', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100', rank: 'Elite', winRate: 88, totalPnl: '+$420k', riskScore: 2 },
      tpStatus: 1, chartPattern: 'Liquidity Sweep', leverage: '1:100' 
  },
  { 
      id: '2', symbol: 'EURUSD', type: 'SELL', entry: 1.0850, tp: 1.0800, sl: 1.0880, 
      confidence: 75, timestamp: '15 min ago', timeOpened: '10:30 AM', status: 'ACTIVE', 
      rr: '1:2.0', pips: +12, roi: 5.2, 
      analyst: { id: 'a2', name: 'Ahmed S.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', rank: 'Pro', winRate: 76, totalPnl: '+$85k', riskScore: 4 },
      tpStatus: 0, chartPattern: 'Break of Structure', leverage: '1:500' 
  },
  { 
      id: '3', symbol: 'US30', type: 'BUY', entry: 38900, tp: 39100, sl: 38800, 
      confidence: 88, timestamp: '45 min ago', timeOpened: '10:00 AM', status: 'PENDING', 
      rr: '1:4.0', pips: 0, roi: 0, 
      analyst: { id: 'a3', name: 'Sarah J.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', rank: 'Expert', winRate: 82, totalPnl: '+$120k', riskScore: 3 },
      tpStatus: 0, chartPattern: 'Double Bottom', leverage: '1:200' 
  },
  { 
      id: '4', symbol: 'GBPJPY', type: 'BUY', entry: 188.20, tp: 189.50, sl: 187.80, 
      confidence: 65, timestamp: '1 hr ago', timeOpened: '09:15 AM', status: 'CLOSED', 
      rr: '1:2.5', pips: +130, roi: 35.4, 
      analyst: { id: 'a1', name: 'Routiex AI', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100', rank: 'Elite', winRate: 88, totalPnl: '+$420k', riskScore: 2 },
      tpStatus: 3, chartPattern: 'Trend Continuation', leverage: '1:100' 
  },
  { 
      id: '5', symbol: 'BTCUSD', type: 'BUY', entry: 67200, tp: 69000, sl: 66500, 
      confidence: 95, timestamp: '2 hr ago', timeOpened: '08:00 AM', status: 'ACTIVE', 
      rr: '1:3.0', pips: +550, roi: 85.2, 
      analyst: { id: 'a4', name: 'WhaleWatch', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', rank: 'Inst.', winRate: 92, totalPnl: '+$1.2M', riskScore: 5 },
      tpStatus: 2, chartPattern: 'Triangle Breakout', leverage: '1:50' 
  },
];

// KPI Data
const WIN_RATE_DATA = [
  { name: 'Win', value: 87, color: '#10b981' },
  { name: 'Loss', value: 13, color: '#ef4444' },
];

const WEEKLY_PERFORMANCE = [
  { day: 'M', pips: 120 },
  { day: 'T', pips: 305 },
  { day: 'W', pips: -45 },
  { day: 'T', pips: 210 },
  { day: 'F', pips: 150 },
];

export const SignalsPanel: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'CLOSED'>('ALL');
  const [selectedSignal, setSelectedSignal] = useState<ProSignal | null>(null);
  const [selectedAnalyst, setSelectedAnalyst] = useState<ProSignal['analyst'] | null>(null);

  const filteredSignals = filter === 'ALL' ? MOCK_SIGNALS : MOCK_SIGNALS.filter(s => s.status === filter);

  const generateShareLink = (signal: ProSignal) => {
      return `https://routiex.com/s/${signal.symbol.toLowerCase()}-${Date.now().toString().slice(-4)}`;
  };

  const handleShare = (platform: string, signal: ProSignal) => {
      const url = generateShareLink(signal);
      const text = `🔥 ROUTIEX PRO SIGNAL: ${signal.type} ${signal.symbol} @ ${signal.entry}. TP: ${signal.tp} SL: ${signal.sl}. Confidence: ${signal.confidence}%. View full analysis: ${url}`;
      
      switch(platform) {
          case 'copy': navigator.clipboard.writeText(text); alert('Link Copied to Clipboard!'); break;
          case 'download': alert('Generating High-Res Image...'); break;
          default: alert(`Broadcasting to ${platform}...`); break;
      }
  };

  return (
    <div className="bg-[#050508] border border-terminal-border rounded-xl flex flex-col h-full shadow-lg overflow-hidden font-sans relative">
      
      {/* --- ANALYST PROFILE MODAL --- */}
      {selectedAnalyst && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-[#0f111a] border border-[#1e2235] w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col">
                  {/* Banner */}
                  <div className="h-32 bg-gradient-to-r from-blue-900 to-terminal-accent/20 relative">
                      <button onClick={() => setSelectedAnalyst(null)} className="absolute top-4 right-4 bg-black/40 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors text-white">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="px-8 pb-8 relative -mt-16 flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="relative mb-4 group">
                          <img src={selectedAnalyst.avatar} className="w-32 h-32 rounded-full border-4 border-[#0f111a] shadow-xl object-cover" />
                          <div className="absolute bottom-1 right-1 bg-green-500 text-black p-1.5 rounded-full border-4 border-[#0f111a]" title="Verified Pro">
                              <ShieldCheck size={20} />
                          </div>
                      </div>
                      
                      <h2 className="text-2xl font-black text-white flex items-center gap-2">
                          {selectedAnalyst.name} 
                          <span className="text-xs bg-terminal-accent text-black px-2 py-0.5 rounded font-bold uppercase">{selectedAnalyst.rank}</span>
                      </h2>
                      <p className="text-gray-400 text-xs mt-1">Institutional Trader • {selectedAnalyst.winRate}% Win Rate</p>

                      {/* Profile Stats */}
                      <div className="grid grid-cols-3 gap-3 w-full mt-8">
                          <div className="bg-[#1a1e2e] p-3 rounded-xl border border-[#2a2f45]">
                              <div className="text-[10px] text-gray-500 uppercase font-bold">Total PnL</div>
                              <div className="text-lg font-black text-green-500">{selectedAnalyst.totalPnl}</div>
                          </div>
                          <div className="bg-[#1a1e2e] p-3 rounded-xl border border-[#2a2f45]">
                              <div className="text-[10px] text-gray-500 uppercase font-bold">Risk Score</div>
                              <div className="text-lg font-black text-yellow-500">{selectedAnalyst.riskScore}/10</div>
                          </div>
                          <div className="bg-[#1a1e2e] p-3 rounded-xl border border-[#2a2f45]">
                              <div className="text-[10px] text-gray-500 uppercase font-bold">Active</div>
                              <div className="text-lg font-black text-white">4 Signals</div>
                          </div>
                      </div>

                      {/* Account Data Table */}
                      <div className="w-full mt-6 bg-[#1a1e2e]/50 rounded-xl overflow-hidden border border-[#2a2f45]">
                          <div className="p-3 bg-[#151720] border-b border-[#2a2f45] flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-300">Account Performance</span>
                              <BarChart2 size={14} className="text-terminal-accent"/>
                          </div>
                          <div className="p-4 space-y-3">
                              <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Balance</span>
                                  <span className="text-white font-mono font-bold">$124,500.00</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Equity</span>
                                  <span className="text-green-500 font-mono font-bold">$125,120.00</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Avg. Holding</span>
                                  <span className="text-white font-mono font-bold">4h 12m</span>
                              </div>
                          </div>
                      </div>

                      <button className="w-full mt-6 bg-terminal-accent text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors">
                          <Activity size={18} /> Copy Trading Enabled
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- SIGNAL DETAIL MODAL --- */}
      {selectedSignal && !selectedAnalyst && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-br from-[#0f111a] to-[#1a1a1a] border border-[#1e2235] w-full max-w-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative ring-1 ring-white/5">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${selectedSignal.type === 'BUY' ? 'from-green-500 via-emerald-400 to-green-500' : 'from-red-500 via-rose-400 to-red-500'}`}></div>
                  <div className="p-6 border-b border-[#1e2235] flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-sm border shadow-lg ${selectedSignal.type === 'BUY' ? 'bg-green-900/20 text-green-500 border-green-500/20 shadow-green-900/20' : 'bg-red-900/20 text-red-500 border-red-500/20 shadow-red-900/20'}`}>
                              {selectedSignal.type === 'BUY' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                              {selectedSignal.type}
                          </div>
                          <div>
                              <h2 className="text-3xl font-black text-white tracking-tighter">{selectedSignal.symbol}</h2>
                              <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs bg-[#1e2235] px-2 py-0.5 rounded text-gray-300 border border-[#333] font-mono">{selectedSignal.timestamp}</span>
                                  <button onClick={() => setSelectedAnalyst(selectedSignal.analyst)} className="text-xs text-terminal-accent font-bold flex items-center gap-1 hover:underline">
                                      <img src={selectedSignal.analyst.avatar} className="w-4 h-4 rounded-full"/> {selectedSignal.analyst.name}
                                  </button>
                              </div>
                          </div>
                      </div>
                      <button onClick={() => setSelectedSignal(null)} className="p-2 bg-black/40 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-all border border-transparent hover:border-red-500/30">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                      {/* KPI Grid */}
                      <div className="grid grid-cols-4 gap-4">
                          <div className="bg-[#151720] p-4 rounded-2xl border border-[#2a2f45] text-center shadow-inner relative overflow-hidden group">
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Entry Price</div>
                              <div className="text-xl font-mono font-black text-white">{selectedSignal.entry}</div>
                          </div>
                          <div className="bg-[#151720] p-4 rounded-2xl border border-[#2a2f45] text-center shadow-inner">
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Target (TP)</div>
                              <div className="text-xl font-mono font-black text-green-500">{selectedSignal.tp}</div>
                          </div>
                          <div className="bg-[#151720] p-4 rounded-2xl border border-[#2a2f45] text-center shadow-inner">
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Stop Loss</div>
                              <div className="text-xl font-mono font-black text-red-500">{selectedSignal.sl}</div>
                          </div>
                          <div className="bg-[#151720] p-4 rounded-2xl border border-[#2a2f45] text-center shadow-inner">
                              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Run PnL</div>
                              <div className={`text-xl font-mono font-black ${selectedSignal.pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {selectedSignal.pips > 0 ? '+' : ''}{selectedSignal.pips}
                              </div>
                          </div>
                      </div>

                      {/* Visual Trade Progress */}
                      <div className="bg-[#1a1e2e]/50 p-6 rounded-2xl border border-[#2a2f45] backdrop-blur-sm">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2"><Activity size={14} className="text-terminal-accent"/> Live Trade Tracking</h4>
                              <span className="text-[10px] font-mono text-gray-500">Updates every 1s</span>
                          </div>
                          <div className="relative h-4 bg-[#111] rounded-full overflow-hidden shadow-inner">
                              <div className="absolute left-0 w-[30%] h-full bg-red-900/30"></div> 
                              <div className="absolute left-[30%] w-[70%] h-full bg-green-900/30"></div> 
                              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-20 transition-all duration-1000" style={{ left: '45%' }}></div>
                              <div className={`absolute top-0 bottom-0 left-[30%] transition-all duration-1000 ${selectedSignal.pips >= 0 ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-l from-red-600 to-red-400'}`} style={{ width: '15%' }}></div>
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500 font-mono">
                              <span className="text-red-500">SL {selectedSignal.sl}</span>
                              <span className="text-white">ENTRY {selectedSignal.entry}</span>
                              <span className="text-green-500">TP {selectedSignal.tp}</span>
                          </div>
                      </div>

                      {/* Share Grid */}
                      <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                              <Share2 size={14} /> Broadcast Signal
                          </h4>
                          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                              {[
                                  { id: 'tg', icon: Send, color: '#229ED9', name: 'Telegram' },
                                  { id: 'wa', icon: MessageCircle, color: '#25D366', name: 'WhatsApp' },
                                  { id: 'x', icon: Twitter, color: '#fff', name: 'X' },
                                  { id: 'dc', icon: MessageCircle, color: '#5865F2', name: 'Discord' },
                                  { id: 'tv', icon: Globe, color: '#fff', name: 'TradingView' },
                                  { id: 'mt', icon: Monitor, color: '#2962FF', name: 'MetaTrader' },
                                  { id: 'em', icon: Mail, color: '#EA4335', name: 'Email' },
                                  { id: 'sms', icon: MessageCircle, color: '#34A853', name: 'SMS' },
                                  { id: 'lnk', icon: Link2, color: '#aaa', name: 'Copy Link', action: 'copy' },
                                  { id: 'dl', icon: Download, color: '#aaa', name: 'Save Img', action: 'download' },
                              ].map((app) => (
                                  <button 
                                      key={app.id} 
                                      onClick={() => handleShare(app.action || app.id, selectedSignal)}
                                      className="aspect-square bg-[#1e2235] rounded-xl flex items-center justify-center hover:bg-[#2a2f45] hover:scale-110 transition-all group relative border border-transparent hover:border-gray-600"
                                      title={app.name}
                                  >
                                      <app.icon size={18} color={app.color} />
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- TOP KPI DASHBOARD (New Charts) --- */}
      <div className="h-28 bg-[#0f111a] border-b border-[#1e2235] p-3 grid grid-cols-4 gap-3">
          {/* Win Rate Pie */}
          <div className="bg-[#1a1e2e] rounded-xl border border-[#2a2f45] flex items-center relative overflow-hidden p-2">
              <div className="w-20 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={WIN_RATE_DATA} innerRadius={15} outerRadius={25} dataKey="value" stroke="none">
                              {WIN_RATE_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Pie>
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white">87%</div>
              </div>
              <div className="flex-1 pl-2">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Win Rate</div>
                  <div className="text-sm font-black text-green-500">Excellent</div>
                  <div className="text-[9px] text-gray-600">Last 100 Trades</div>
              </div>
          </div>

          {/* Weekly PnL Bar */}
          <div className="bg-[#1a1e2e] rounded-xl border border-[#2a2f45] flex flex-col p-2 px-3">
              <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Weekly Net PnL</span>
                  <span className="text-[10px] text-green-500 font-black">+1,240 pips</span>
              </div>
              <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={WEEKLY_PERFORMANCE}>
                          <Bar dataKey="pips" fill="#2962FF" radius={[2, 2, 0, 0]} />
                          <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#000', border: '1px solid #333', fontSize: '10px'}} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Active Trades */}
          <div className="bg-[#1a1e2e] rounded-xl border border-[#2a2f45] flex flex-col justify-center items-center p-2 relative overflow-hidden">
              <Activity size={48} className="absolute text-white/5 -right-2 -bottom-2" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Signals</span>
              <span className="text-3xl font-black text-white mt-1">12</span>
              <span className="text-[9px] text-green-500 font-bold bg-green-900/20 px-2 rounded-full mt-1 animate-pulse">LIVE NOW</span>
          </div>

          {/* Avg R:R */}
          <div className="bg-[#1a1e2e] rounded-xl border border-[#2a2f45] flex flex-col justify-center items-center p-2">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg. Risk:Reward</span>
              <span className="text-2xl font-black text-terminal-accent mt-1">1:3.2</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div className="w-[70%] bg-terminal-accent h-full"></div>
              </div>
          </div>
      </div>

      {/* Main Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-[#151720] text-[9px] font-black text-gray-500 uppercase sticky top-0 border-b border-[#1e2235] tracking-wider z-10 items-center">
          <div className="col-span-2">Asset / Pattern</div>
          <div className="col-span-2">Signal By</div>
          <div className="col-span-1 text-center">Bias</div>
          <div className="col-span-3 text-center">Trade Visualizer</div>
          <div className="col-span-2 text-center">Targets (TP/SL)</div>
          <div className="col-span-2 text-right">Status</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050508]">
        {filteredSignals.map((signal, idx) => (
          <div 
            key={signal.id} 
            className={`grid grid-cols-12 gap-2 px-4 py-4 border-b border-[#1e2235] items-center hover:bg-[#1a1e2e] transition-all relative overflow-hidden group ${idx % 2 === 0 ? 'bg-[#0a0a0a]' : ''}`}
          >
            {/* Click Handler Wrapper for Row (excluding Analyst) */}
            <div className="absolute inset-0 z-0" onClick={() => setSelectedSignal(signal)}></div>

            {/* Asset & Pattern */}
            <div className="col-span-2 relative z-10 pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] text-white border ${signal.type === 'BUY' ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                        {signal.symbol.substring(0,3)}
                    </div>
                    <div>
                        <div className="font-black text-white text-sm leading-none mb-1">{signal.symbol}</div>
                        <div className="text-[9px] text-terminal-accent font-bold uppercase flex items-center gap-1">
                            <Layers size={10} /> {signal.chartPattern}
                        </div>
                    </div>
                </div>
            </div>

            {/* Signal By (Analyst) - CLICKABLE */}
            <div className="col-span-2 relative z-20">
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedAnalyst(signal.analyst); }}
                    className="flex items-center gap-2 hover:bg-[#2a2f45] p-1.5 rounded-lg transition-colors group/analyst text-left"
                >
                    <img src={signal.analyst.avatar} className="w-8 h-8 rounded-full border border-gray-600 group-hover/analyst:border-white object-cover" />
                    <div>
                        <div className="text-[10px] font-bold text-white group-hover/analyst:text-terminal-accent">{signal.analyst.name}</div>
                        <div className="text-[8px] text-gray-500 flex items-center gap-1">
                            <Star size={8} className="text-yellow-500 fill-current" /> {signal.analyst.rank}
                        </div>
                    </div>
                </button>
            </div>
            
            {/* Bias (Buy/Sell) */}
            <div className="col-span-1 flex flex-col items-center justify-center relative z-10 pointer-events-none">
                <span className={`text-xs font-black px-2 py-1 rounded flex items-center gap-1 ${signal.type === 'BUY' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {signal.type === 'BUY' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                    {signal.type}
                </span>
                <span className="text-[9px] text-gray-500 font-mono mt-1">@{signal.entry}</span>
            </div>

            {/* Trade Visualizer (Mini Chart) */}
            <div className="col-span-3 px-2 relative z-10 pointer-events-none">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase">
                        <span>Entry</span>
                        <span className="text-terminal-accent">Current</span>
                        <span>Target</span>
                    </div>
                    <div className="relative h-2 bg-[#222] rounded-full overflow-hidden">
                        <div 
                            className={`absolute top-0 bottom-0 transition-all duration-1000 ${signal.pips >= 0 ? 'bg-gradient-to-r from-gray-500 to-green-500' : 'bg-gradient-to-r from-gray-500 to-red-500'}`}
                            style={{ left: '0%', width: signal.status === 'PENDING' ? '5%' : signal.tpStatus === 3 ? '100%' : '45%' }}
                        ></div>
                        <div className="absolute top-0 bottom-0 w-[2px] bg-white left-0"></div>
                        <div className="absolute top-0 bottom-0 w-[2px] bg-green-500/50 left-[33%]"></div>
                        <div className="absolute top-0 bottom-0 w-[2px] bg-green-500/50 left-[66%]"></div>
                        <div className="absolute top-0 bottom-0 w-[2px] bg-green-500 left-[100%]"></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                        <span className="text-red-500 font-mono">SL {signal.sl}</span>
                        <span className="text-green-500 font-mono">TP {signal.tp}</span>
                    </div>
                </div>
            </div>

            {/* Targets Status */}
            <div className="col-span-2 flex items-center justify-center gap-2 relative z-10 pointer-events-none">
                {[1, 2, 3].map((tp) => (
                    <div key={tp} className={`flex flex-col items-center gap-1 ${signal.tpStatus >= tp ? 'opacity-100' : 'opacity-30 grayscale'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${signal.tpStatus >= tp ? 'bg-green-500 border-green-400 text-black' : 'bg-[#222] border-[#333] text-gray-500'}`}>
                            {signal.tpStatus >= tp ? <Check size={10} strokeWidth={4} /> : <span className="text-[8px] font-bold">{tp}</span>}
                        </div>
                        <span className={`text-[8px] font-bold ${signal.tpStatus >= tp ? 'text-green-500' : 'text-gray-600'}`}>TP{tp}</span>
                    </div>
                ))}
            </div>

            {/* Status & Action */}
            <div className="col-span-2 text-right relative z-10">
                 {signal.status === 'ACTIVE' && (
                     <button onClick={() => setSelectedSignal(signal)} className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-white bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded shadow-lg shadow-green-900/20 transition-all">
                         <Activity size={12} className="animate-pulse" /> COPY
                     </button>
                 )}
                 {signal.status === 'PENDING' && (
                     <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-yellow-500">
                         <Clock size={12} /> WAITING
                     </div>
                 )}
                 {signal.status === 'CLOSED' && (
                     <div className={`flex items-center justify-end gap-2 text-[10px] font-bold ${signal.pips >= 0 ? 'text-gray-400' : 'text-red-500'}`}>
                         <StopCircle size={12} /> {signal.pips >= 0 ? 'PROFIT' : 'LOSS'}
                     </div>
                 )}
            </div>

          </div>
        ))}
      </div>
      
      <div className="p-3 bg-[#0f111a] border-t border-[#1e2235] flex justify-between items-center text-[10px] text-gray-500">
          <div className="flex gap-4">
              <span className="flex items-center gap-1"><Zap size={10} className="text-terminal-accent" /> AI System Online</span>
              <span>Latency: <span className="text-green-500 font-bold">12ms</span></span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
              <RefreshCw size={12} /> Live Sync
          </div>
      </div>
    </div>
  );
};
