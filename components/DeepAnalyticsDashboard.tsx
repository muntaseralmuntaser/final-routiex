
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, LineChart, Line, ScatterChart, Scatter, ZAxis } from 'recharts';
import { BrainCircuit, Globe, TrendingUp, Layers, Activity, Anchor, Zap, ShieldCheck, PieChart } from 'lucide-react';

const YIELD_CURVE_DATA = [
    { name: '1M', yield: 5.3 }, { name: '3M', yield: 5.4 }, { name: '6M', yield: 5.2 },
    { name: '1Y', yield: 5.0 }, { name: '2Y', yield: 4.6 }, { name: '5Y', yield: 4.2 },
    { name: '10Y', yield: 4.1 }, { name: '30Y', yield: 4.3 },
];

const DARK_POOL_DATA = [
    { time: '09:30', buy: 4000, sell: 2400 },
    { time: '10:00', buy: 3000, sell: 1398 },
    { time: '10:30', buy: 2000, sell: 5800 },
    { time: '11:00', buy: 2780, sell: 3908 },
    { time: '11:30', buy: 1890, sell: 4800 },
    { time: '12:00', buy: 2390, sell: 3800 },
    { time: '12:30', buy: 3490, sell: 4300 },
];

const SECTOR_ROTATION = [
    { name: 'Tech', val: 85, cycle: 'Expansion' },
    { name: 'Energy', val: 45, cycle: 'Late' },
    { name: 'Healthcare', val: -10, cycle: 'Recession' },
    { name: 'Consumer', val: 20, cycle: 'Recovery' },
    { name: 'Finance', val: 60, cycle: 'Expansion' },
];

const CORRELATION_MATRIX = [
    { x: 10, y: 30, z: 200, name: 'BTC/SPX' },
    { x: 50, y: 80, z: 500, name: 'USD/GOLD' },
    { x: 20, y: 50, z: 100, name: 'NVDA/AI' },
    { x: 80, y: 20, z: 300, name: 'OIL/CAD' },
    { x: 40, y: 40, z: 400, name: 'VIX/PUTS' },
];

export const DeepAnalyticsDashboard: React.FC = () => {
    return (
        <div className="h-full p-4 space-y-4 overflow-y-auto custom-scrollbar bg-[#050508]">
            {/* Header Stats - Macro View */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#0f111a] border border-[#1e2235] p-4 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 bg-terminal-accent/5 rounded-bl-full group-hover:bg-terminal-accent/10 transition-colors"></div>
                    <h3 className="text-xs font-bold text-terminal-muted uppercase tracking-wider mb-1">Global Risk Premium</h3>
                    <div className="text-2xl font-black text-white">1.24%</div>
                    <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                        <TrendingUp size={10} /> Risk On Environment
                    </div>
                </div>
                <div className="bg-[#0f111a] border border-[#1e2235] p-4 rounded-xl">
                    <h3 className="text-xs font-bold text-terminal-muted uppercase tracking-wider mb-1">Dark Pool Gamma</h3>
                    <div className="text-2xl font-black text-white">$42.5B</div>
                    <div className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <Activity size={10} /> High Selling Pressure
                    </div>
                </div>
                <div className="bg-[#0f111a] border border-[#1e2235] p-4 rounded-xl">
                    <h3 className="text-xs font-bold text-terminal-muted uppercase tracking-wider mb-1">Smart Money Flow</h3>
                    <div className="text-2xl font-black text-white">+8.2%</div>
                    <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                        <Zap size={10} /> Net Accumulation
                    </div>
                </div>
                <div className="bg-[#0f111a] border border-[#1e2235] p-4 rounded-xl">
                    <h3 className="text-xs font-bold text-terminal-muted uppercase tracking-wider mb-1">AI Sentiment Score</h3>
                    <div className="text-2xl font-black text-terminal-accent">88/100</div>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        Based on 4M+ Data points
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
                {/* Dark Pool Flow Chart */}
                <div className="lg:col-span-2 bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Layers size={18} className="text-blue-500" /> Institutional Dark Pool Volume
                        </h3>
                        <span className="text-[10px] bg-blue-900/20 text-blue-400 px-2 py-1 rounded">OFF-EXCHANGE</span>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={DARK_POOL_DATA}>
                                <defs>
                                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                                <Area type="monotone" dataKey="buy" stroke="#22c55e" fillOpacity={1} fill="url(#colorBuy)" strokeWidth={2} />
                                <Area type="monotone" dataKey="sell" stroke="#ef4444" fillOpacity={1} fill="url(#colorSell)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sector Rotation */}
                <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <PieChart size={18} className="text-yellow-500" /> Sector Rotation
                        </h3>
                    </div>
                    <div className="flex-1 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={SECTOR_ROTATION}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fill: '#888'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                                <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={20}>
                                    {SECTOR_ROTATION.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.val > 0 ? '#22c55e' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-80">
                 {/* Yield Curve */}
                 <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-white flex items-center gap-2">
                             <Activity size={18} className="text-purple-500" /> US Treasury Yield Curve
                         </h3>
                         <span className="text-[10px] text-red-400 font-bold">INVERTED (Recession Signal)</span>
                     </div>
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={YIELD_CURVE_DATA}>
                                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#666'}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                                <Line type="monotone" dataKey="yield" stroke="#8884d8" strokeWidth={3} dot={{r: 4, fill: '#8884d8'}} />
                            </LineChart>
                        </ResponsiveContainer>
                     </div>
                 </div>

                 {/* Multi-Asset Correlation */}
                 <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-4 flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-white flex items-center gap-2">
                             <BrainCircuit size={18} className="text-terminal-accent" /> AI Correlation Matrix
                         </h3>
                     </div>
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <XAxis type="number" dataKey="x" name="Volatility" hide />
                                <YAxis type="number" dataKey="y" name="Return" hide />
                                <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Volume" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#111', border: '1px solid #333'}} />
                                <Scatter name="Assets" data={CORRELATION_MATRIX} fill="var(--accent)" />
                            </ScatterChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="text-[10px] text-center text-gray-500 mt-2">
                         Cluster analysis suggests high correlation between BTC and Tech Stocks (0.89)
                     </div>
                 </div>
            </div>
            
            {/* On-Chain / Whale Alerts */}
            <div className="bg-[#0f111a] border border-[#1e2235] rounded-xl p-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Anchor size={18} className="text-blue-400" /> Deep Liquidity Hunts (Unusual Whales)
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { sym: 'NVDA', type: 'Call Sweep', prem: '$4.2M', exp: '24 Mar', sent: 'Bullish' },
                        { sym: 'TSLA', type: 'Block Trade', prem: '$12.1M', exp: 'Spot', sent: 'Bearish' },
                        { sym: 'BTC', type: 'OTC Buy', prem: '$55M', exp: 'Spot', sent: 'Bullish' },
                        { sym: 'SPX', type: '0DTE Puts', prem: '$8.5M', exp: 'Today', sent: 'Bearish' },
                    ].map((alert, i) => (
                        <div key={i} className="bg-[#050508] border border-[#1e2235] p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <div className="font-black text-white">{alert.sym}</div>
                                <div className="text-[10px] text-gray-500">{alert.type}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-white">{alert.prem}</div>
                                <div className={`text-[10px] font-bold ${alert.sent === 'Bullish' ? 'text-green-500' : 'text-red-500'}`}>{alert.sent}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
