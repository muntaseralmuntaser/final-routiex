import React, { useEffect, useState } from 'react';
import { Rabbit, Zap } from 'lucide-react';

interface Props {
    onComplete: () => void;
}

export const IntroAnimation: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Timeline of animation
        setTimeout(() => setStep(1), 500); // Logo fade in
        setTimeout(() => setStep(2), 1500); // Text type in
        setTimeout(() => setStep(3), 2500); // Flash
        setTimeout(() => {
            setStep(4); // Slide up
            setTimeout(onComplete, 800); // Unmount
        }, 3500);
    }, []);

    if (step === 5) return null;

    return (
        <div className={`fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center transition-transform duration-700 ease-in-out ${step === 4 ? '-translate-y-full' : 'translate-y-0'}`}>
            <div className="relative">
                {/* Pulsing background */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-terminal-accent/20 rounded-full blur-[100px] transition-opacity duration-1000 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    {/* Logo - Rabbit */}
                    <div className={`w-32 h-32 bg-gradient-to-br from-terminal-accent to-blue-900 rounded-3xl flex items-center justify-center text-white shadow-[0_0_50px_rgba(14,165,233,0.6)] transition-all duration-1000 transform ${step >= 1 ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 -rotate-12'}`}>
                        <Rabbit size={64} strokeWidth={2} className="animate-bounce-slow" />
                    </div>

                    {/* Text */}
                    <div className="mt-8 text-center">
                        <h1 className={`text-5xl font-black text-white tracking-tighter transition-all duration-700 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            ROUTIEX
                        </h1>
                        <div className={`mt-2 flex items-center gap-2 justify-center text-terminal-muted text-sm font-mono uppercase tracking-[0.3em] transition-all duration-700 delay-100 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                            <Zap size={12} className="text-terminal-accent animate-pulse" fill="currentColor" />
                            TERMINAL PRO
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Loading Bar */}
            <div className="absolute bottom-20 w-64 h-1 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full bg-terminal-accent transition-all duration-[3000ms] ease-out ${step >= 1 ? 'w-full' : 'w-0'}`}></div>
            </div>
        </div>
    );
};