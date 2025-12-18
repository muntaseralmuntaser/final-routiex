
import React, { useEffect, useState } from 'react';
import { Rabbit } from 'lucide-react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl', animated?: boolean }> = ({ size = 'md', animated = true }) => {
    const dim = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64;
    const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 32 : 40;
    
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!animated) return;
        
        // Trigger running animation every 30 seconds
        const interval = setInterval(() => {
            setIsRunning(true);
            // Stop running after 2 seconds
            setTimeout(() => setIsRunning(false), 2000); 
        }, 30000); 

        return () => clearInterval(interval);
    }, [animated]);

    return (
        <div className="relative group cursor-pointer select-none">
            {animated && (
                <div className="absolute inset-0 bg-terminal-accent/40 blur-xl rounded-full animate-pulse group-hover:bg-terminal-accent/60 transition-all"></div>
            )}
            <div 
                className={`relative flex items-center justify-center bg-gradient-to-br from-terminal-accent to-blue-900 rounded-xl text-white shadow-lg border border-white/10 z-10 overflow-hidden transition-all duration-300`} 
                style={{ width: dim, height: dim }}
            >
                 <div className={`transition-all duration-500 ${isRunning ? 'animate-rabbit-run' : ''}`}>
                    <Rabbit size={iconSize} strokeWidth={2.5} />
                 </div>
            </div>
            
            <style>{`
                @keyframes rabbit-run {
                    0% { transform: translateX(0) skewX(0deg); }
                    20% { transform: translateX(4px) skewX(-10deg) translateY(-2px); }
                    40% { transform: translateX(-2px) skewX(10deg) translateY(0); }
                    60% { transform: translateX(4px) skewX(-10deg) translateY(-2px); }
                    80% { transform: translateX(-2px) skewX(10deg) translateY(0); }
                    100% { transform: translateX(0) skewX(0deg); }
                }
                .animate-rabbit-run {
                    animation: rabbit-run 0.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};
