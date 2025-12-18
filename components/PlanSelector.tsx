
import React from 'react';
import { Check, Shield, Zap, Globe } from 'lucide-react';

interface Props {
    onSelect: (plan: string) => void;
}

export const PlanSelector: React.FC<Props> = ({ onSelect }) => {
    const plans = [
        {
            id: 'standard',
            name: 'Standard',
            price: '$0',
            period: 'Forever',
            features: ['15m Delayed Market Data', 'Basic Charting', 'Community Chat Access', 'Daily Market Summary'],
            color: 'border-gray-600',
            btnColor: 'bg-gray-700'
        },
        {
            id: 'pro',
            name: 'Professional',
            price: '$49',
            period: 'Per Month',
            features: ['Real-time NASDAQ/NYSE Data', 'AI Trading Assistant (Gemini)', 'Unlimited Signals', 'Copy Trading Integration', 'Priority Support'],
            recommended: true,
            color: 'border-terminal-accent',
            btnColor: 'bg-terminal-accent text-black'
        },
        {
            id: 'institutional',
            name: 'Institutional',
            price: '$199',
            period: 'Per Month',
            features: ['Level 2 Market Data', 'Dedicated Account Manager', 'FIX API Access', 'Private Mentor Group', '0% Commission Bridge'],
            color: 'border-yellow-500',
            btnColor: 'bg-yellow-500 text-black'
        }
    ];

    return (
        <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center p-6 animate-in fade-in">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Select Your Trading Power</h1>
                <p className="text-terminal-muted max-w-2xl mx-auto">Choose a plan to unlock the full potential of the Routiex Terminal. Upgrade or downgrade at any time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {plans.map((plan) => (
                    <div 
                        key={plan.id} 
                        className={`relative bg-[#0f111a] border-2 rounded-2xl p-8 flex flex-col transition-transform hover:-translate-y-2 duration-300 ${plan.color} ${plan.recommended ? 'shadow-[0_0_40px_rgba(41,98,255,0.15)]' : ''}`}
                    >
                        {plan.recommended && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-terminal-accent text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="text-center mb-8">
                            <h3 className="text-sm font-bold text-terminal-muted uppercase tracking-widest mb-2">{plan.name}</h3>
                            <div className="flex justify-center items-baseline gap-1">
                                <span className="text-4xl font-black text-white">{plan.price}</span>
                                <span className="text-sm text-terminal-muted font-medium">/ {plan.period}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => onSelect(plan.id)}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide hover:brightness-110 transition-all ${plan.btnColor}`}
                        >
                            Select {plan.name}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
