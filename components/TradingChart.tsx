
import React, { useEffect, useRef } from 'react';
import { BrainCircuit, Maximize2, Zap } from 'lucide-react';

interface TradingChartProps {
    isDark?: boolean;
    onScan?: (symbol: string, price: number) => void;
}

declare global {
    interface Window {
        TradingView: any;
    }
}

export const TradingChart: React.FC<TradingChartProps> = ({ isDark = true, onScan }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Use a stable unique ID for the container to prevent collisions during remounts
    const containerId = useRef(`tv_chart_${Math.random().toString(36).substring(7)}`);

    useEffect(() => {
        let mounted = true;
        let checkInterval: any = null;

        const initWidget = () => {
            if (mounted && window.TradingView && containerRef.current) {
                // Explicitly clear container before initializing
                containerRef.current.innerHTML = '';
                
                new window.TradingView.widget({
                    "autosize": true,
                    "symbol": "OANDA:XAUUSD",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": isDark ? "dark" : "light",
                    "style": "1",
                    "locale": "en",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": containerId.current,
                    "hide_side_toolbar": false,
                    "toolbar_bg": isDark ? "#0f111a" : "#f1f3f6",
                    "withdateranges": true,
                    "details": true,
                    "hotlist": true,
                    "calendar": true,
                    "studies": [
                        "STD;Supertrend",
                        "STD;RSI"
                    ]
                });
            }
        };

        if (window.TradingView) {
            initWidget();
        } else {
            // Check for existing script injected by other components
            if (!document.getElementById('tv-widget-lib')) {
                const script = document.createElement('script');
                script.id = 'tv-widget-lib';
                script.src = 'https://s3.tradingview.com/tv.js';
                script.async = true;
                script.onload = () => {
                    if (window.TradingView) initWidget();
                };
                document.head.appendChild(script);
            }

            // Robust polling in case onload fired elsewhere or hasn't fired yet
            checkInterval = setInterval(() => {
                if (window.TradingView) {
                    clearInterval(checkInterval);
                    initWidget();
                }
            }, 100);
        }

        return () => {
            mounted = false;
            if (checkInterval) clearInterval(checkInterval);
        };
    }, [isDark]);

    return (
        <div className="w-full h-full flex flex-col bg-terminal-panel border border-terminal-border rounded-lg overflow-hidden relative group shadow-sm">
            
            {/* TradingView Container with Unique ID */}
            <div id={containerId.current} ref={containerRef} className="w-full h-full relative z-0" />

            {/* AI SIGNAL BUTTON OVERLAY - Prominent and Glowing */}
            <div className="absolute top-20 right-4 md:top-4 md:right-24 z-50 animate-in slide-in-from-top-4 duration-700 pointer-events-auto">
                <button 
                    onClick={() => onScan && onScan("XAUUSD", 2035)} 
                    className="group relative overflow-hidden bg-black/80 backdrop-blur-sm border-2 border-terminal-accent text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full shadow-[0_0_30px_rgba(41,98,255,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 hover:bg-terminal-accent/10"
                >
                    <div className="absolute inset-0 bg-terminal-accent/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                    
                    {/* Pulsing Glow Effect */}
                    <div className="absolute inset-0 rounded-full border border-terminal-accent/50 animate-pulse"></div>
                    
                    <div className="bg-terminal-accent text-black p-1.5 rounded-full shadow-lg shadow-terminal-accent/50">
                        <BrainCircuit size={16} className="animate-spin-slow" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[8px] font-black text-terminal-accent uppercase tracking-widest leading-none mb-0.5">Routiex AI</span>
                        <span className="text-xs md:text-sm font-black text-white leading-none tracking-wide shadow-black drop-shadow-md">GENERATE SIGNAL</span>
                    </div>
                </button>
            </div>

            {/* Watermark Overlay */}
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-30 z-10 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                <div className="text-[10px] font-black text-terminal-muted uppercase tracking-widest">
                    Routiex by Bayanat Tech Group
                </div>
            </div>
        </div>
    );
};
