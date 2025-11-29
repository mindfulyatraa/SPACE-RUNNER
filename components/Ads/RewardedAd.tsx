/**
 * @license  
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, PlayCircle } from 'lucide-react';
import { AdMob, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';

interface RewardedAdProps {
    onClose: () => void;
    onReward: () => void;
    rewardType: 'revive' | 'key';
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ onClose, onReward, rewardType }) => {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isWatching, setIsWatching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(15); // 15 seconds timer for web ad

    // Check if running on native device
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform();

    // Get ad unit ID based on reward type
    const getAdUnitId = () => {
        const reviveUnit = 'ca-app-pub-4312395541510047/1104606797';
        const keyUnit = 'ca-app-pub-4312395541510047/3004738176';
        return rewardType === 'revive' ? reviveUnit : keyUnit;
    };

    useEffect(() => {
        let didReward = false;
        let retryCount = 0;
        const MAX_RETRIES = 2;

        // WEB SIMULATION: If not native, simulate ad ready immediately
        if (!isNative) {
            setIsReady(true);
            setIsLoading(false);
            return;
        }

        // NATIVE: Prepare AdMob ad
        const prepareAd = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const adUnitId = getAdUnitId();

                await AdMob.prepareRewardVideoAd({
                    adId: adUnitId,
                    isTesting: false,
                });

                console.log('Ad prepared successfully');
                setIsReady(true);
                setIsLoading(false);
            } catch (err) {
                console.error('Ad prepare error (attempt ' + (retryCount + 1) + '):', err);

                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log('Retrying ad preparation...');
                    setTimeout(() => prepareAd(), 1000);
                } else {
                    setError('Ad not available right now');
                    setIsLoading(false);
                    setIsReady(false);
                }
            }
        };

        // Setup listeners for Native AdMob
        if (isNative) {
            AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                if (!didReward) onClose();
            });

            AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
                didReward = true;
                onReward();
                onClose();
            });

            AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
                console.error('Ad failed:', error);
                setError('Ad failed to load');
                setIsWatching(false);
            });

            prepareAd();
        }

        return () => {
            if (isNative) AdMob.removeAllListeners();
        };
    }, [rewardType, isNative]);

    // Handle Web Timer
    useEffect(() => {
        let timer: any;
        if (isWatching && !isNative && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isWatching && !isNative && timeLeft === 0) {
            // Timer finished, grant reward
            onReward();
            onClose();
        }
        return () => clearInterval(timer);
    }, [isWatching, isNative, timeLeft]);

    const handleShowAd = async () => {
        if (!isReady) return;

        try {
            setIsWatching(true);
            setError(null);

            if (isNative) {
                await AdMob.showRewardVideoAd();
            } else {
                // Web: Start timer logic (handled by useEffect)
                console.log('Simulating web ad...');
            }
        } catch (err) {
            console.error('Show ad error:', err);
            setError('Ad failed to play');
            setIsWatching(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center pointer-events-auto">
            <div className="relative w-full max-w-2xl mx-4">
                {/* Close button - Only show if not watching or if it's web simulation (allow exit but no reward) */}
                {(!isWatching || (!isNative && isWatching)) && (
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                )}

                {/* Ad Container */}
                <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.5)] border border-purple-500/30">
                    {isLoading ? (
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-white/10 rounded-full mb-4 animate-pulse">
                                    <PlayCircle className="w-16 h-16 text-purple-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">LOADING AD...</h2>
                                <p className="text-lg text-purple-200">Please wait</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-red-500/20 rounded-full mb-4">
                                    <X className="w-16 h-16 text-red-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber text-red-400">AD NOT AVAILABLE</h2>
                                <p className="text-lg text-red-200 mb-2">{error}</p>
                                <button onClick={onClose} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors">CLOSE</button>
                            </div>
                        </div>
                    ) : !isWatching ? (
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
                                    <PlayCircle className="w-16 h-16 text-purple-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">REWARDED AD</h2>
                                <p className="text-lg text-purple-200 mb-2">Watch an ad to continue</p>
                                <div className="inline-block px-6 py-3 bg-yellow-500/20 rounded-full border border-yellow-500/50 mt-4">
                                    <p className="text-yellow-300 font-bold">
                                        {rewardType === 'revive' ? '🎁 Reward: Continue with 1 Life' : '🎁 Reward: 1 Extra Key'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleShowAd} className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                                WATCH AD {isNative ? '' : '(15s)'}
                            </button>
                        </div>
                    ) : (
                        // Ad Playing State
                        <div className="text-center text-white">
                            <div className="mb-6">
                                {isNative ? (
                                    <>
                                        <div className="inline-block p-6 bg-white/10 rounded-full mb-4 animate-pulse">
                                            <PlayCircle className="w-16 h-16 text-purple-300" />
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">AD PLAYING...</h2>
                                        <p className="text-lg text-purple-200">Please watch the entire ad</p>
                                    </>
                                ) : (
                                    // Web Simulation UI
                                    <>
                                        <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
                                            <div className="text-6xl font-black font-mono text-yellow-400 animate-pulse">
                                                {timeLeft}s
                                            </div>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">ADVERTISEMENT</h2>
                                        <p className="text-lg text-purple-200 mb-4">Reward in {timeLeft} seconds...</p>

                                        {/* Fake Ad Content */}
                                        <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 mb-4">
                                            <div className="text-center">
                                                <p className="text-cyan-400 font-bold text-xl mb-2">SPACE RUNNER PRO</p>
                                                <p className="text-gray-400 text-sm">Download the ultimate version now!</p>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500">Simulated Ad for Web Version</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
