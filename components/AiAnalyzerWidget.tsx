
import React, { useState, useEffect, useRef } from 'react';
import { Rabbit, Newspaper, Target, Zap, ExternalLink, Settings, Lock, CheckCircle, UserPlus, BrainCircuit, X, TrendingUp, TrendingDown, Layers, Activity, Hash, Shield, Gauge, Share2, Copy, Send, MessageCircle, Twitter, Globe, Mail, Smartphone, Link2, Monitor, Camera, Download, BarChart2, Radar, ScanLine, Code2, ArrowRight, Search, Filter, ArrowUp, ArrowDown, FileCode, Check } from 'lucide-react';
import { LanguageCode, TradingStrategy, AiSignalResponse, AiHistoryItem } from '../types';
import { getTranslation } from '../utils/translations';

interface Props {
    lang: LanguageCode;
    setView?: (view: string) => void;
    onGenerateSignal: (symbol: string, price: number, strategy: string, customScript?: string) => Promise<void>;
    isGenerating: boolean;
    usageCount: number;
    hasPlan: boolean;
    onUpgrade: () => void;
    aiSignal?: AiSignalResponse | null;
    onCloseSignal?: () => void;
    isModal?: boolean;
    history?: AiHistoryItem[];
    onSelectHistory?: (item: AiSignalResponse) => void;
}

const SCAN_STEPS = [
    "Initializing Neural Network Connection...",
    "Scanning 15m, 30m, 1h Timeframes...",
    "Applying Fibonacci (1D, 4H, 1H)...",
    "Checking Stochastic (14,4,4) & RSI...",
    "Calculating Order Blocks & SMC Flow...",
    "Detecting Double Bottom / H&S Patterns...",
    "Finalizing Institutional Confluence..."
];

export const AiAnalyzerWidget: React.FC<Props> = ({ lang, setView, onGenerateSignal, isGenerating, usageCount, hasPlan, onUpgrade, aiSignal, onCloseSignal, isModal = false, history = [], onSelectHistory }) => {
  const t = (key: string) => getTranslation(lang, key);
  const [activeTab, setActiveTab] = useState<'analysis' | 'news'>('analysis');
  const [symbolInput, setSymbolInput] = useState('XAUUSD');
  const [scanStep, setScanStep] = useState(0);
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  // Strategy Builder State
  const [strategyMode, setStrategyMode] = useState<'PRESET' | 'SCRIPT' | 'CONNECTED'>('PRESET');
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy>('SMC');
  const [pineScript, setPineScript] = useState('// Paste your Pine Script Strategy here\nstudy("My Custom Strategy")\nrs = rsi(close, 14)\nlong = crossover(rs, 30)\nshort = crossunder(rs, 70)\nplot(rs)');
  const [isConnectedTV, setIsConnectedTV] = useState(false);

  // History Filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [historySort, setHistorySort] = useState<'NEWEST' | 'CONFIDENCE'>('NEWEST');

  const timelineRef = useRef<HTMLDivElement>(null);

  const USAGE_LIMIT = 1;
  const isLimitReached = usageCount >= USAGE_LIMIT && !hasPlan;

  useEffect(() => {
    if (isGenerating) {
        setScanStep(0);
        const interval = setInterval(() => {
            setScanStep(prev => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
        }, 600); 
        return () => clearInterval(interval);
    }
  }, [isGenerating]);

  useEffect(() => {
    if (activeTab === 'news' && timelineRef.current) {
        timelineRef.current.innerHTML = '';
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
        script.async = true;
        script.type = 'text/javascript';
        script.innerHTML = JSON.stringify({
            "feedMode": "all_symbols",
            "isTransparent": true,
            "displayMode": "regular",
            "width": "100%",
            "height": "100%",
            "colorTheme": "dark",
            "locale": "en"
        });
        timelineRef.current.appendChild(script);
    }
  }, [activeTab]);

  const handleRunAnalysis = () => {
      if (isLimitReached) {
          onUpgrade();
          return;
      }
      
      let finalStrategy = selectedStrategy;
      let script = undefined;

      if (strategyMode === 'SCRIPT') {
          finalStrategy = 'Custom Script' as any;
          script = pineScript;
      } else if (strategyMode === 'CONNECTED') {
          finalStrategy = 'TradingView Profile' as any;
      }

      onGenerateSignal(symbolInput, 0, finalStrategy, script);
  };

  const handleShare = (platform: string, signal: AiSignalResponse) => {
      const text = `🚀 ROUTIEX AI SIGNAL\n\nSymbol: ${signal.symbol}\nAction: ${signal.action} ${signal.action === 'BUY' ? '🟢' : '🔴'}\nEntry: ${signal.entryZone}\n\n🎯 TP1: ${signal.tp1}\n🎯 TP2: ${signal.tp2}\n🎯 TP3: ${signal.tp3}\n🛑 SL: ${signal.stopLoss}\n\nConfidence: ${signal.confidence}%\nReasoning: ${signal.reasoning}\n\nAnalyzed via Routiex Pro Terminal`;
      const url = `https://routiex.com/signals/${signal.symbol}`;
      const encodedText = encodeURIComponent(text);
      
      switch(platform) {
          case 'Telegram': window.open(`https://t.me/share/url?url=${url}&text=${encodedText}`, '_blank'); break;
          case 'WhatsApp': window.open(`https://wa.me/?text=${encodedText}`, '_blank'); break;
          case 'X': window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank'); break;
          case 'Discord': 
             navigator.clipboard.writeText(text);
             setShowCopyToast(true);
             setTimeout(() => setShowCopyToast(false), 2000);
             break; 
          case 'Email': window.open(`mailto:?subject=Routiex Signal ${signal.symbol}&body=${encodedText}`, '_blank'); break;
          case 'SMS': window.open(`sms:?body=${encodedText}`, '_blank'); break;
          case 'Copy': 
            navigator.clipboard.writeText(text);
            setShowCopyToast(true);
            setTimeout(() => setShowCopyToast(false), 2000);
            return;
          case 'T.View': 
            window.open(`https://www.tradingview.com/chart?symbol=${signal.symbol}`, '_blank'); 
            return;
          case 'MT4/5': 
            alert('Signal sent to connected MT4/5 Bridge (Simulated).'); 
            return;
          case 'Insta': 
            alert('Generating Story Image... (Simulated Download)'); 
            return;
          default: return;
      }
  };

  const getFilteredHistory = () => {
      let filtered = history.filter(item => {
          const matchesSearch = item.symbol.toUpperCase().includes(historySearch.toUpperCase());
          const matchesType = historyFilter === 'ALL' || item.data.action === historyFilter;
          return matchesSearch && matchesType;
      });

      return filtered.sort((a, b) => {
          if (historySort === 'CONFIDENCE') return b.data.confidence - a.data.confidence;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  };

  return (
    <>
    {/* --- GLOBAL OVERLAY FOR LOADING & RESULTS --- */}
    {(isGenerating || aiSignal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            
            {/* LOADING ANIMATION STATE */}
            {isGenerating && (
                <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
                    <div className="relative w-48 h-48">
                        <div className="absolute inset-0 border-4 border-terminal-accent/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-terminal-accent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-2 border-dashed border-terminal-accent/30 rounded-full animate-spin-slow direction-reverse"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ScanLine size={48} className="text-terminal-accent animate-pulse" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-terminal-accent to-transparent -translate-x-1/2 -translate-y-1/2 animate-ping opacity-50"></div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">ROUTIEX AI ANALYZING</h2>
                        <div className="h-6 overflow-hidden relative">
                            <p key={scanStep} className="text-sm font-mono text-terminal-accent animate-slide-in font-bold uppercase tracking-wider">
                                {SCAN_STEPS[scanStep]}
                            </p>
                        </div>
                    </div>

                    <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-terminal-accent transition-all duration-500 ease-out" 
                            style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="text-[10px] text-gray-600 font-mono text-left w-full opacity-50">
                        <div>{`> Strategy: INSTITUTIONAL_MULTI_TF`}</div>
                        <div>{`> Analyzing: 15m | 30m | 1h`}</div>
                        <div>{`> Indicators: STOCH_14_4_4 | RSI | SUPERTREND`}</div>
                    </div>
                </div>
            )}

            {/* RESULT CARD STATE */}
            {!isGenerating && aiSignal && (
                <div className="bg-[#0f111a] border border-terminal-border w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col my-auto animate-in zoom-in-95 duration-300 max-h-[90vh]">
                    
                    {/* Card Header */}
                    <div className="relative p-4 border-b border-terminal-border bg-gradient-to-r from-[#0f111a] to-[#1a1a1a] overflow-hidden shrink-0 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-terminal-accent rounded-xl flex items-center justify-center text-black shadow-lg shadow-terminal-accent/20">
                                <Rabbit size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-white tracking-tighter leading-none">ROUTIEX <span className="text-terminal-accent">AI</span></h2>
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Pro Analysis Terminal</span>
                            </div>
                        </div>
                        <button onClick={onCloseSignal} className="p-2 bg-black/30 hover:bg-red-500 hover:text-white rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Card Body - The Shareable Image Area */}
                    <div className="flex-1 p-0 relative bg-[#131722] overflow-y-auto custom-scrollbar">
                        
                        {/* 1. CHART GRID BACKGROUND */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                             style={{
                                 backgroundImage: 'linear-gradient(#2a2e39 1px, transparent 1px), linear-gradient(90deg, #2a2e39 1px, transparent 1px)', 
                                 backgroundSize: '40px 40px'
                             }}>
                        </div>

                        {/* 2. WATERMARK */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none overflow-hidden">
                            <div className="transform -rotate-12 text-9xl font-black text-white whitespace-nowrap">ROUTIEX</div>
                        </div>

                        {/* 3. CONTENT LAYER */}
                        <div className="relative z-10 p-6 lg:p-8 flex flex-col h-full">
                            
                            {/* Asset Header */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-lg">{aiSignal.symbol}</h1>
                                        <span className="text-lg font-bold text-gray-400 bg-[#1e2235] px-2 py-0.5 rounded">Multi-TF Confluence</span>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-1 ${aiSignal.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                        {aiSignal.action === 'BUY' ? <TrendingUp size={20} strokeWidth={3} /> : <TrendingDown size={20} strokeWidth={3} />}
                                        <span className="text-xl font-black uppercase tracking-wide">
                                            {aiSignal.confidence >= 90 ? `STRONG ${aiSignal.action}` : `${aiSignal.action} SIGNAL`}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="text-right bg-[#1e2235]/80 backdrop-blur p-3 rounded-xl border border-[#333]">
                                        <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Institutional Conviction</div>
                                        <div className="text-3xl font-black text-terminal-accent drop-shadow-[0_0_10px_rgba(41,98,255,0.5)]">{aiSignal.confidence}%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                
                                {/* Left: Trade Setup Visualizer (The "Chart") */}
                                <div className="lg:col-span-2 bg-[#1e2235]/30 backdrop-blur border border-white/10 rounded-xl p-1 relative flex flex-col min-h-[350px] overflow-hidden">
                                    
                                    {/* Chart Canvas Area */}
                                    <div className="flex-1 relative flex flex-col w-full h-full">
                                        
                                        {/* Zones - Flex Grow to simulate chart space */}
                                        {aiSignal.action === 'BUY' ? (
                                            <>
                                                {/* Profit Zone (TP3 to Entry) */}
                                                <div className="flex-1 bg-gradient-to-b from-green-500/20 to-green-500/5 border-b border-blue-500/50 relative flex flex-col justify-between p-4">
                                                    {/* TP Lines */}
                                                    <div className="absolute top-0 right-0 left-0 border-t border-dashed border-green-500/50 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-green-400 bg-[#131722] px-1 -mt-2.5">TP3: {aiSignal.tp3}</span>
                                                    </div>
                                                    <div className="absolute top-1/3 right-0 left-0 border-t border-dashed border-green-500/30 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-green-500/80 bg-[#131722] px-1 -mt-2.5">TP2: {aiSignal.tp2}</span>
                                                    </div>
                                                    <div className="absolute top-2/3 right-0 left-0 border-t border-dashed border-green-500/30 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-green-500/60 bg-[#131722] px-1 -mt-2.5">TP1: {aiSignal.tp1}</span>
                                                    </div>
                                                    
                                                    {/* Simulated Projected Path */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" preserveAspectRatio="none">
                                                        <path d="M 10,100 Q 50,90 100,100 T 200,50 T 300,10" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
                                                    </svg>
                                                </div>

                                                {/* Entry Line */}
                                                <div className="h-0 border-t-2 border-blue-500 relative z-10">
                                                    <div className="absolute right-2 -top-3 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">
                                                        ENTRY: {aiSignal.entryZone}
                                                    </div>
                                                    <div className="absolute left-2 -top-6 bg-black/50 text-white text-[10px] px-2 py-1 rounded border border-white/10">
                                                        Risk/Reward: 1:{((parseFloat(aiSignal.tp3) - parseFloat(aiSignal.entryZone)) / (parseFloat(aiSignal.entryZone) - parseFloat(aiSignal.stopLoss))).toFixed(1)}
                                                    </div>
                                                </div>

                                                {/* Loss Zone (Entry to SL) */}
                                                <div className="h-1/4 bg-gradient-to-b from-red-500/5 to-red-500/20 relative p-4">
                                                    <div className="absolute bottom-0 right-0 left-0 border-b border-red-500/50 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-red-500 bg-[#131722] px-1 -mb-2.5">STOP: {aiSignal.stopLoss}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            // SELL SCENARIO (Inverted)
                                            <>
                                                {/* Loss Zone (SL to Entry) */}
                                                <div className="h-1/4 bg-gradient-to-b from-red-500/20 to-red-500/5 relative p-4 border-b border-blue-500/50">
                                                    <div className="absolute top-0 right-0 left-0 border-t border-red-500/50 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-red-500 bg-[#131722] px-1 -mt-2.5">STOP: {aiSignal.stopLoss}</span>
                                                    </div>
                                                </div>

                                                {/* Entry Line */}
                                                <div className="h-0 border-t-2 border-blue-500 relative z-10">
                                                    <div className="absolute right-2 -top-3 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg">
                                                        ENTRY: {aiSignal.entryZone}
                                                    </div>
                                                </div>

                                                {/* Profit Zone (Entry to TP3) */}
                                                <div className="flex-1 bg-gradient-to-b from-green-500/5 to-green-500/20 relative p-4">
                                                    <div className="absolute top-1/3 right-0 left-0 border-t border-dashed border-green-500/30 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-green-500/60 bg-[#131722] px-1 -mt-2.5">TP1: {aiSignal.tp1}</span>
                                                    </div>
                                                    <div className="absolute top-2/3 right-0 left-0 border-t border-dashed border-green-500/30 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-green-500/80 bg-[#131722] px-1 -mt-2.5">TP2: {aiSignal.tp2}</span>
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 left-0 border-b border-dashed border-green-500/50 flex justify-end px-2">
                                                        <span className="text-xs font-bold text-green-400 bg-[#131722] px-1 -mb-2.5">TP3: {aiSignal.tp3}</span>
                                                    </div>
                                                    
                                                    {/* Simulated Projected Path (Down) */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" preserveAspectRatio="none">
                                                        <path d="M 10,0 Q 50,20 100,10 T 200,150 T 300,250" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                                                    </svg>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Indicators & Reasoning */}
                                <div className="col-span-1 space-y-4">
                                    {/* Indicators Grid */}
                                    <div className="bg-[#1e2235]/50 backdrop-blur border border-white/5 rounded-xl p-4">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                            <Activity size={12} /> Institutional Indicators
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                                <span className="text-gray-400">RSI (14)</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-20 h-1.5 bg-[#333] rounded-full overflow-hidden`}>
                                                        <div className={`h-full transition-all duration-1000 ${aiSignal.action === 'BUY' ? 'bg-green-500 w-[15%]' : 'bg-red-500 w-[85%]'}`}></div>
                                                    </div>
                                                    <span className={`font-bold ${aiSignal.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                                        {aiSignal.action === 'BUY' ? '< 10' : '> 90'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                                <span className="text-gray-400">Stochastic (14,4,4)</span>
                                                <span className={`font-bold ${aiSignal.action === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {aiSignal.action === 'BUY' ? 'Extreme Oversold' : 'Extreme Overbought'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                                <span className="text-gray-400">Supertrend</span>
                                                <span className={`font-bold ${aiSignal.action === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {aiSignal.action === 'BUY' ? 'Bullish' : 'Bearish'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs pt-1">
                                                <span className="text-gray-400">Timeframes</span>
                                                <span className="font-bold text-terminal-accent">15m | 30m | 1h</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reasoning Box */}
                                    <div className="bg-terminal-accent/5 border border-terminal-accent/20 rounded-xl p-4 flex-1 flex flex-col">
                                        <div className="text-[10px] font-bold text-terminal-accent uppercase mb-2 flex items-center gap-2">
                                            <BrainCircuit size={12} /> AI Reasoning
                                        </div>
                                        <p className="text-xs text-gray-300 italic leading-relaxed flex-1">
                                            "{aiSignal.reasoning}"
                                        </p>
                                    </div>

                                    {/* Patterns Box */}
                                    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 shrink-0">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Detected Patterns</div>
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="px-2 py-0.5 rounded bg-terminal-panel border border-[#333] text-[9px] font-bold text-white uppercase">SMC / Order Block</span>
                                            <span className="px-2 py-0.5 rounded bg-terminal-panel border border-[#333] text-[9px] font-bold text-white uppercase">Fib Retracement</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Branding */}
                            <div className="mt-auto flex justify-between items-end opacity-50 pt-4 border-t border-white/5">
                                <div className="text-[10px] text-gray-500 font-mono">
                                    Signal ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} • PRO ANALYTICS ACTIVE
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-white">
                                    <Globe size={12} /> www.routiex.com
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Grid - 10 Apps Sharing */}
                    <div className="p-4 bg-[#0a0a0a] border-t border-terminal-border shrink-0 relative">
                        {showCopyToast && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-black px-4 py-2 rounded-lg font-bold text-xs shadow-lg animate-in slide-in-from-bottom-2 fade-in flex items-center gap-2 z-50">
                                <CheckCircle size={14} /> Signal Copied to Clipboard!
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Share2 size={14} /> Broadcast Signal
                            </span>
                            <button onClick={() => alert('Image Generated & Downloaded')} className="flex items-center gap-2 text-xs font-bold text-terminal-accent hover:text-white bg-[#1e2235] px-3 py-1 rounded transition-colors">
                                <Download size={14} /> Download Image
                            </button>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                            {[
                                { name: 'Telegram', icon: Send, bg: 'bg-[#229ED9]', hover: 'hover:bg-[#1e8dbf]' },
                                { name: 'WhatsApp', icon: MessageCircle, bg: 'bg-[#25D366]', hover: 'hover:bg-[#20b858]' },
                                { name: 'X', icon: Twitter, bg: 'bg-black border border-gray-700', hover: 'hover:bg-gray-900' },
                                { name: 'Discord', icon: MessageCircle, bg: 'bg-[#5865F2]', hover: 'hover:bg-[#4752c4]' },
                                { name: 'Copy', icon: Copy, bg: 'bg-gray-700', hover: 'hover:bg-gray-600' },
                                { name: 'T.View', icon: Globe, bg: 'bg-[#131722] border border-gray-700', hover: 'hover:bg-black' },
                                { name: 'MT4/5', icon: Monitor, bg: 'bg-[#FF9900]', hover: 'hover:bg-[#e68a00]' },
                                { name: 'Insta', icon: Camera, bg: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500', hover: 'hover:brightness-110' },
                                { name: 'Email', icon: Mail, bg: 'bg-red-500', hover: 'hover:bg-red-600' },
                                { name: 'SMS', icon: Smartphone, bg: 'bg-green-600', hover: 'hover:bg-green-700' }
                            ].map((app, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleShare(app.name, aiSignal)}
                                    className={`h-10 rounded-lg flex items-center justify-center text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${app.bg} ${app.hover}`} 
                                    title={app.name}
                                >
                                    <app.icon size={16} fill={app.name === 'Telegram' || app.name === 'X' ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )}

    <div className={`bg-terminal-panel border border-terminal-border rounded-xl flex flex-col shadow-sm overflow-hidden relative ${isModal ? 'h-auto' : 'h-full'}`}>
      {/* Sidebar Header Tabs */}
      {!isModal && (
          <div className="flex border-b border-terminal-border bg-terminal-bg shrink-0">
            <button 
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'analysis' ? 'bg-terminal-panel text-terminal-accent border-b-2 border-terminal-accent' : 'text-terminal-muted hover:text-terminal-text'}`}
            >
                <BrainCircuit size={14} /> Routiex AI
            </button>
            <button 
                 onClick={() => setActiveTab('news')}
                 className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide transition-colors ${activeTab === 'news' ? 'bg-terminal-panel text-terminal-accent border-b-2 border-terminal-accent' : 'text-terminal-muted hover:text-terminal-text'}`}
            >
                <Newspaper size={14} /> News
            </button>
          </div>
      )}

      <div className="flex-1 p-0 overflow-hidden relative bg-terminal-bg/30">
          {activeTab === 'analysis' && !isModal && (
            <div className="p-4 space-y-4 animate-slide-in h-full overflow-y-auto custom-scrollbar flex flex-col">
                
                {/* Controls Area */}
                <div className="bg-[#0a0a0a] border border-terminal-border rounded-lg p-3 space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-terminal-muted uppercase">Scan Settings</span>
                        <div className="text-[9px] text-terminal-muted flex items-center gap-1">
                            {!hasPlan && <span>{Math.max(0, USAGE_LIMIT - usageCount)} free scan left</span>}
                            {hasPlan && <span className="text-terminal-accent flex items-center gap-1"><Zap size={8} fill="currentColor"/> UNLIMITED</span>}
                        </div>
                    </div>
                    
                    <div className="relative">
                         <input 
                            type="text" 
                            value={symbolInput}
                            onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                            className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-xs font-bold text-white uppercase" 
                            placeholder="SYMBOL"
                         />
                    </div>

                    {/* STRATEGY SOURCE SELECTOR */}
                    <div className="bg-[#151720] rounded-lg p-1 flex gap-1">
                        {[
                            { id: 'PRESET', label: 'Institutional' },
                            { id: 'SCRIPT', label: 'Pine Script' },
                            { id: 'CONNECTED', label: 'Profile' }
                        ].map(mode => (
                            <button 
                                key={mode.id}
                                onClick={() => setStrategyMode(mode.id as any)}
                                className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded transition-colors ${strategyMode === mode.id ? 'bg-terminal-accent text-black' : 'text-gray-500 hover:text-white'}`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    {/* DYNAMIC SETTINGS BASED ON MODE */}
                    {strategyMode === 'PRESET' && (
                        <div className="relative">
                            <label className="text-[9px] font-bold text-gray-500 mb-1 block">Institutional Logic</label>
                            <select 
                                value={selectedStrategy}
                                onChange={(e) => setSelectedStrategy(e.target.value as TradingStrategy)}
                                className="w-full bg-terminal-bg border border-terminal-border rounded p-2 text-xs font-bold text-white outline-none"
                            >
                                <option value="SMC">SMC / Order Blocks</option>
                                <option value="Elliott Wave">Elliott Wave</option>
                                <option value="Scalping">Multi-TF Scalp (15m/30m/1h)</option>
                                <option value="Swing">Institutional Swing</option>
                                <option value="Price Action">Pure Price Action</option>
                            </select>
                        </div>
                    )}

                    {strategyMode === 'SCRIPT' && (
                        <div className="relative">
                            <label className="text-[9px] font-bold text-gray-500 mb-1 block flex items-center gap-1"><Code2 size={10}/> Custom Logic</label>
                            <textarea 
                                value={pineScript}
                                onChange={(e) => setPineScript(e.target.value)}
                                className="w-full bg-[#050508] border border-terminal-border rounded p-2 text-[10px] font-mono text-green-400 outline-none h-24 resize-none"
                                placeholder="// Paste TradingView Pine Script here..."
                            />
                        </div>
                    )}

                    {strategyMode === 'CONNECTED' && (
                        <div className="relative p-2 bg-[#151720] rounded border border-[#2a2f45] text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isConnectedTV ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                    <Globe size={16} />
                                </div>
                                <div className="text-[10px] text-gray-400">
                                    {isConnectedTV ? 'Profile Connected' : 'Link TradingView'}
                                </div>
                                {!isConnectedTV ? (
                                    <button onClick={() => setIsConnectedTV(true)} className="text-[9px] bg-blue-600 text-white px-3 py-1 rounded font-bold hover:bg-blue-500">Connect Account</button>
                                ) : (
                                    <div className="flex flex-col w-full gap-1 mt-1">
                                        <div className="text-[9px] text-green-500 flex items-center justify-center gap-1"><Check size={10}/> Scripts Synced</div>
                                        <select className="bg-black text-[9px] text-white p-1 rounded border border-[#333]">
                                            <option>My Favorites (SMC + RSI)</option>
                                            <option>SuperTrend Pro</option>
                                            <option>MACD Divergence</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleRunAnalysis}
                        disabled={isGenerating}
                        className={`w-full py-2 rounded font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${
                            isLimitReached 
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                            : 'bg-terminal-accent text-black hover:bg-sky-400 shadow-lg shadow-terminal-accent/10'
                        }`}
                    >
                        {isLimitReached ? 'Register to Continue' : 'Run Analysis'}
                        {isLimitReached ? <Lock size={12} /> : <Rabbit size={14} />}
                    </button>
                </div>

                {/* Paywall / Registration Overlay for Usage Limit */}
                {isLimitReached && (
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-terminal-border rounded-lg p-4 text-center relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-terminal-accent/5 animate-pulse"></div>
                        <UserPlus size={24} className="text-terminal-accent mx-auto mb-2" />
                        <h4 className="font-bold text-white text-sm">Create Account</h4>
                        <p className="text-[10px] text-terminal-muted mb-3 mt-1">
                            You've used your 1 free guest scan. Please register a free account to continue using Routiex AI.
                        </p>
                        <button onClick={onUpgrade} className="bg-terminal-accent text-black text-xs font-bold px-4 py-2 rounded hover:bg-white transition-colors w-full">
                            Register Now
                        </button>
                    </div>
                )}

                {/* History List (Right Side Retention) */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-bold text-terminal-muted uppercase tracking-wider flex items-center gap-1">
                            <Target size={12} /> Scan History
                        </h4>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setHistorySort('NEWEST')} title="Newest" className={`p-1 rounded hover:bg-gray-800 ${historySort === 'NEWEST' ? 'text-terminal-accent' : 'text-gray-500'}`}><ArrowDown size={12}/></button>
                            <button onClick={() => setHistorySort('CONFIDENCE')} title="High Confidence" className={`p-1 rounded hover:bg-gray-800 ${historySort === 'CONFIDENCE' ? 'text-terminal-accent' : 'text-gray-500'}`}><Activity size={12}/></button>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"/>
                            <input 
                                value={historySearch}
                                onChange={(e) => setHistorySearch(e.target.value)}
                                placeholder="Filter..." 
                                className="w-full bg-[#0a0a0a] border border-[#1e2235] rounded py-1 pl-6 pr-2 text-[10px] text-white outline-none focus:border-terminal-accent"
                            />
                        </div>
                        <div className="flex bg-[#0a0a0a] rounded border border-[#1e2235] p-0.5">
                            {['ALL', 'BUY', 'SELL'].map(f => (
                                <button key={f} onClick={() => setHistoryFilter(f as any)} className={`px-2 py-0.5 text-[8px] font-bold rounded ${historyFilter === f ? (f === 'BUY' ? 'bg-green-500 text-black' : f === 'SELL' ? 'bg-red-500 text-white' : 'bg-terminal-accent text-black') : 'text-gray-500 hover:text-white'}`}>{f}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                        {getFilteredHistory().length === 0 && (
                            <div className="text-center py-4 text-[10px] text-gray-600">No matching scans.</div>
                        )}
                        {getFilteredHistory().map((item, i) => (
                            <div 
                                key={i} 
                                onClick={() => onSelectHistory && onSelectHistory(item.data)}
                                className="bg-terminal-panel border border-terminal-border rounded-lg p-3 flex items-center justify-between group hover:border-terminal-accent transition-all cursor-pointer hover:bg-[#1a1a1a] relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.data.action === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div className="flex items-center gap-3 pl-2">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${item.data.action === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                        {item.data.action === 'BUY' ? 'B' : 'S'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-terminal-text">{item.symbol}</div>
                                        <div className="text-[9px] text-terminal-muted">{new Date(item.timestamp).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-mono font-bold text-terminal-accent">{item.data.confidence}%</div>
                                    <div className="text-[9px] text-gray-500">Score</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'news' && !isModal && (
             <div className="tradingview-widget-container w-full h-full" ref={timelineRef}>
                 <div className="tradingview-widget-container__widget"></div>
             </div>
          )}
      </div>
    </div>
    </>
  );
};
