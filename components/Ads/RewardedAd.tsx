/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, PlayCircle, Clock } from 'lucide-react';
import { AdsterraBanner } from './AdsterraBanner';

interface RewardedAdProps {
    onClose: () => void;
    onReward: () => void;
    rewardType: 'revive' | 'key';
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ onClose, onReward, rewardType }) => {
    const [step, setStep] = useState<'initial' | 'counting' | 'rewarded'>('initial');
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        let timer: any;
        if (step === 'counting' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (step === 'counting' && countdown === 0) {
            setStep('rewarded');
            onReward();
            // Automatically close after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        }
        return () => clearInterval(timer);
    }, [step, countdown, onReward, onClose]);

    const handleConfirmation = () => {
        setStep('counting');
    };

    const renderContent = () => {
        switch (step) {
            case 'initial':
                return (
                    <div className="text-center text-white">
                        <h2 className="text-2xl md:text-3xl font-black mb-3 font-cyber">COMPLETE A TASK FOR A REWARD</h2>
                        <p className="text-md text-purple-200 mb-4">
                            Please click the ad below and wait for 10 seconds to get your reward.
                        </p>

                        {/* Adsterra ad */}
                        <div className="my-4">
                            <AdsterraBanner />
                        </div>

                        <p className="text-xs text-gray-400 mb-6">
                            After clicking the ad, click the button below to start the timer.
                        </p>

                        <button
                            onClick={handleConfirmation}
                            className="w-full px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                        >
                            I have clicked the ad
                        </button>
                    </div>
                );
            case 'counting':
                return (
                    <div className="text-center text-white">
                        <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
                            <div className="text-6xl font-black font-mono text-yellow-400 animate-pulse">
                                {countdown}
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">VERIFYING...</h2>
                        <p className="text-lg text-purple-200 mb-4">
                            Please wait for the countdown to finish.
                        </p>
                    </div>
                );
            case 'rewarded':
                return (
                    <div className="text-center text-white">
                        <div className="inline-block p-6 bg-green-500/20 rounded-full mb-4">
                            <div className="text-6xl font-black font-mono text-green-400">
                                ✓
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">REWARD GRANTED!</h2>
                        <p className="text-lg text-green-200 mb-4">
                            {rewardType === 'revive' ? 'You have been revived!' : 'You got 1 extra key!'}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center pointer-events-auto">
            <div className="relative w-full max-w-2xl mx-4">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.5)] border border-purple-500/30">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
