
import React, { useEffect, useRef } from 'react';
import { LanguageCode } from '../types';
import { getTranslation } from '../utils/translations';
import { Search, Filter, Plus } from 'lucide-react';

interface Props {
    lang: LanguageCode;
}

export const WatchlistPanel: React.FC<Props> = ({ lang }) => {
    const t = (key: string) => getTranslation(lang, key);
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (widgetRef.current) {
            widgetRef.current.innerHTML = '';
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
            script.async = true;
            script.type = 'text/javascript';
            script.innerHTML = JSON.stringify({
                "colorTheme": "dark",
                "dateRange": "12M",
                "showChart": true,
                "locale": "en",
                "largeChartUrl": "",
                "isTransparent": true,
                "showSymbolLogo": true,
                "showFloatingTooltip": true,
                "width": "100%",
                "height": "100%",
                "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
                "plotLineColorFalling": "rgba(255, 0, 0, 1)",
                "gridLineColor": "rgba(42, 46, 57, 0)",
                "scaleFontColor": "rgba(209, 213, 219, 1)",
                "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
                "belowLineFillColorFalling": "rgba(255, 0, 0, 0.12)",
                "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
                "belowLineFillColorFallingBottom": "rgba(255, 0, 0, 0)",
                "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
                "tabs": [
                    {
                        "title": "Indices",
                        "symbols": [
                            { "s": "FOREXCOM:SPXUSD" },
                            { "s": "FOREXCOM:NSXUSD" },
                            { "s": "FOREXCOM:DJI" },
                            { "s": "INDEX:NKY" }
                        ],
                        "originalTitle": "Indices"
                    },
                    {
                        "title": "Stocks",
                        "symbols": [
                            { "s": "NASDAQ:NVDA" },
                            { "s": "NASDAQ:TSLA" },
                            { "s": "NASDAQ:AAPL" },
                            { "s": "NASDAQ:AMZN" },
                            { "s": "NASDAQ:MSFT" },
                            { "s": "NYSE:BABA" }
                        ],
                        "originalTitle": "Stocks"
                    },
                    {
                        "title": "Futures",
                        "symbols": [
                            { "s": "CME_MINI:ES1!", "d": "S&P 500" },
                            { "s": "CME:6E1!", "d": "Euro" },
                            { "s": "COMEX:GC1!", "d": "Gold" },
                            { "s": "NYMEX:CL1!", "d": "Oil" }
                        ],
                        "originalTitle": "Futures"
                    },
                    {
                        "title": "Forex",
                        "symbols": [
                            { "s": "FX:EURUSD" },
                            { "s": "FX:GBPUSD" },
                            { "s": "FX:USDJPY" },
                            { "s": "FX:USDCHF" }
                        ],
                        "originalTitle": "Forex"
                    },
                    {
                        "title": "Crypto",
                        "symbols": [
                            { "s": "BINANCE:BTCUSDT" },
                            { "s": "BINANCE:ETHUSDT" },
                            { "s": "BINANCE:SOLUSDT" },
                            { "s": "BINANCE:XRPUSDT" }
                        ],
                        "originalTitle": "Crypto"
                    },
                    {
                        "title": "Bonds",
                        "symbols": [
                            { "s": "TVC:US10Y" },
                            { "s": "TVC:US02Y" },
                            { "s": "TVC:DE10Y" }
                        ],
                        "originalTitle": "Bonds"
                    }
                ]
            });
            widgetRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="bg-terminal-panel border border-terminal-border rounded-lg h-full flex flex-col shadow-sm overflow-hidden">
            <div className="p-3 border-b border-terminal-border flex justify-between items-center bg-terminal-bg">
                <h3 className="text-xs font-bold text-terminal-text flex items-center gap-2 uppercase tracking-wider">
                    {t('watchlist')}
                </h3>
                <div className="flex items-center gap-2">
                     <button className="text-terminal-muted hover:text-terminal-text transition-colors">
                        <Search size={14} />
                    </button>
                    <button className="text-terminal-accent hover:bg-terminal-accent/10 p-1 rounded transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden bg-terminal-bg/20 relative">
                 <div className="tradingview-widget-container h-full w-full" ref={widgetRef}>
                     <div className="tradingview-widget-container__widget"></div>
                 </div>
            </div>
        </div>
    );
};
