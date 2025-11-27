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

        // Prepare ad with retry mechanism
        const prepareAd = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const adUnitId = getAdUnitId();

                // Prepare the rewarded ad
                await AdMob.prepareRewardVideoAd({
                    adId: adUnitId,
                    isTesting: false, // REAL ADS - Revenue mode! 💰
                });

                console.log('Ad prepared successfully');
                setIsReady(true);
                setIsLoading(false);
            } catch (err) {
                console.error('Ad prepare error (attempt ' + (retryCount + 1) + '):', err);

                // Retry logic
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log('Retrying ad preparation...');
                    setTimeout(() => prepareAd(), 1000); // Retry after 1 second
                } else {
                    // Max retries reached
                    setError('Ad not available right now');
                    setIsLoading(false);
                    setIsReady(false);
                }
            }
        };

        // Setup listeners
        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            console.log('Ad dismissed');
            if (!didReward) {
                onClose();
            }
        });

        AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
            console.log('User rewarded:', reward);
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

        return () => {
            // Cleanup
        };
    }, [rewardType]);

    const handleShowAd = async () => {
        if (!isReady) return;

        try {
            setIsWatching(true);
            setError(null);
            await AdMob.showRewardVideoAd();
        } catch (err) {
            console.error('Show ad error:', err);
            setError('Ad failed to play');
            setIsWatching(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center pointer-events-auto">
            <div className="relative w-full max-w-2xl mx-4">
                {/* Close button */}
                {!isWatching && (
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
                        // Loading state
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-white/10 rounded-full mb-4 animate-pulse">
                                    <PlayCircle className="w-16 h-16 text-purple-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">
                                    LOADING AD...
                                </h2>
                                <p className="text-lg text-purple-200">
                                    Please wait
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        // Error state
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-red-500/20 rounded-full mb-4">
                                    <X className="w-16 h-16 text-red-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber text-red-400">
                                    AD NOT AVAILABLE
                                </h2>
                                <p className="text-lg text-red-200 mb-2">
                                    {error}
                                </p>
                                <p className="text-sm text-gray-300 mb-4">
                                    Try again in a few minutes
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    ) : !isWatching ? (
                        // Ready to show ad
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-white/10 rounded-full mb-4">
                                    <PlayCircle className="w-16 h-16 text-purple-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">
                                    REWARDED AD
                                </h2>
                                <p className="text-lg text-purple-200 mb-2">
                                    Watch an ad to continue
                                </p>
                                <div className="inline-block px-6 py-3 bg-yellow-500/20 rounded-full border border-yellow-500/50 mt-4">
                                    <p className="text-yellow-300 font-bold">
                                        {rewardType === 'revive' ? '🎁 Reward: Continue with 1 Life' : '🎁 Reward: 1 Extra Key'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleShowAd}
                                className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                            >
                                WATCH AD
                            </button>
                        </div>
                    ) : (
                        // Ad is playing
                        <div className="text-center text-white">
                            <div className="mb-6">
                                <div className="inline-block p-6 bg-white/10 rounded-full mb-4 animate-pulse">
                                    <PlayCircle className="w-16 h-16 text-purple-300" />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-3 font-cyber">
                                    AD PLAYING...
                                </h2>
                                <p className="text-lg text-purple-200">
                                    Please watch the entire ad
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
