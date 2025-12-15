
import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { GameStatus } from '../../types';

export const PauseMenu: React.FC = () => {
    const { status, resumeGame } = useStore();
    const [countdown, setCountdown] = useState<number | null>(null);

    // Reset countdown when pausing again
    useEffect(() => {
        if (status === GameStatus.PAUSED) {
            setCountdown(null);
        }
    }, [status]);

    useEffect(() => {
        if (countdown === 0) {
            resumeGame();
            setCountdown(null);
        } else if (countdown !== null) {
            const timer = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, resumeGame]);

    if (status !== GameStatus.PAUSED) return null;

    const handleResume = () => {
        setCountdown(3);
    };

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            {countdown !== null ? (
                <div className="text-9xl font-cyber font-bold text-cyan-400 animate-pulse drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">
                    {countdown > 0 ? countdown : 'GO!'}
                </div>
            ) : (
                <div className="text-center animate-fade-in-up">
                    <h2 className="text-6xl md:text-8xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-12 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        PAUSED
                    </h2>

                    <button
                        onClick={handleResume}
                        className="group relative px-16 py-5 bg-cyan-500 hover:bg-cyan-400 text-black font-cyber font-bold text-2xl md:text-3xl rounded-sm transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            RESUME MISSION
                        </span>
                        <div className="absolute inset-0 bg-white/30 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                    </button>

                    <p className="mt-8 text-cyan-100/60 font-rajdhani text-xl tracking-wide uppercase">
                        Signal Lost... Waiting for Pilot
                    </p>
                </div>
            )}
        </div>
    );
};
