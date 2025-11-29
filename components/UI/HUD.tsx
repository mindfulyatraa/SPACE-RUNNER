
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play, RotateCcw, Magnet, ShieldCheck, Key, User, Home, Tv } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, LETTER_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';
import spaceRunnerImg from '../../space_runner.jpg';

import { RewardedAd } from '../Ads/RewardedAd';
import { AdSenseBanner } from '../Ads/AdSenseBanner';

// AdSense Slot IDs (Real IDs from Google AdSense console)
const AD_SLOTS = {
    MENU_BOTTOM: '7961728996', // Space Runner Menu Banner
    GAME_OVER: '3722282840',   // Space Runner Game Over
    PROFILE_BOTTOM: '2585171438' // Space Runner Profile Banner
};

// Available Shop Items
const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'DOUBLE JUMP',
        description: 'Jump again in mid-air. Essential for high obstacles.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'MAX LIFE UP',
        description: 'Permanently adds a heart slot and heals you.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'REPAIR KIT',
        description: 'Restores 1 Life point instantly.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMMORTALITY',
        description: 'Unlock Ability: Press Space/Tap to be invincible for 5s.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    },
    {
        id: 'SPEED_BOOST',
        name: 'SPEED BOOST',
        description: 'Temporary +50% Speed & Invincibility (5s).',
        cost: 800,
        icon: Zap
    },
    {
        id: 'SHIELD_BOOST',
        name: 'SHIELD RECHARGE',
        description: 'Activate temporary invincibility shield (10s).',
        cost: 1200,
        icon: ShieldCheck
    },
    {
        id: 'LANE_ASSIST',
        name: 'LANE ASSIST',
        description: 'Magnetizes items from adjacent lanes (15s).',
        cost: 1000,
        icon: Magnet
    },
    {
        id: 'KEY',
        name: 'MYSTIC KEY',
        description: 'A rare artifact that can revive you from death.',
        cost: 5000,
        icon: Key
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        // Select 3 random items, filtering out one-time items already bought
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });

        // Shuffle and pick 3
        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, []);

    return (
        <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                <h2 className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 font-cyber tracking-widest text-center">CYBER SHOP</h2>
                <div className="flex items-center text-yellow-400 mb-6 md:mb-8">
                    <span className="text-base md:text-lg mr-2">AVAILABLE CREDITS:</span>
                    <span className="text-xl md:text-2xl font-bold">{score.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full mb-8">
                    {items.map(item => {
                        const Icon = item.icon;
                        const canAfford = score >= item.cost;
                        return (
                            <div key={item.id} className="bg-gray-900/80 border border-gray-700 p-4 md:p-6 rounded-xl flex flex-col items-center text-center hover:border-cyan-500 transition-colors">
                                <div className="bg-gray-800 p-3 md:p-4 rounded-full mb-3 md:mb-4">
                                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-2">{item.name}</h3>
                                <p className="text-gray-400 text-xs md:text-sm mb-4 h-10 md:h-12 flex items-center justify-center">{item.description}</p>
                                <button
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 md:px-6 py-2 rounded font-bold w-full text-sm md:text-base ${canAfford ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110' : 'bg-gray-700 cursor-not-allowed opacity-50'}`}
                                >
                                    {item.cost} GEMS
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={closeShop}
                    className="flex items-center px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                >
                    RESUME MISSION <Play className="ml-2 w-5 h-5" fill="white" />
                </button>
            </div>
        </div>
    );
};

// Achievement definitions
const ACHIEVEMENTS = [
    { id: 'CENTURY_HUNTER', name: 'Century Hunter', description: 'Score 100,000+ in single run', icon: Trophy, color: '#FFD700' },
    { id: 'SPEED_DEMON', name: 'Speed Demon', description: 'Reach level 10+', icon: Zap, color: '#FF4500' },
    { id: 'GEM_COLLECTOR', name: 'Gem Collector', description: 'Collect 500+ gems total', icon: Diamond, color: '#00CED1' },
    { id: 'COMPLETIONIST', name: 'Completionist', description: 'Complete 50+ runs', icon: Rocket, color: '#9370DB' },
    { id: 'PERFECT_RUN', name: 'Perfect Run', description: 'Complete level without damage', icon: Shield, color: '#32CD32' },
    { id: 'KEY_MASTER', name: 'Key Master', description: 'Collect 10+ keys total', icon: Key, color: '#FFA500' }
];

const ProfileScreen: React.FC = () => {
    const { stats, setStatus, setPlayerName } = useStore();
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(stats.playerName);

    const MAX_LEVEL = 30;
    const progressPercentage = (stats.highestLevel / MAX_LEVEL) * 100;
    const averageScore = stats.totalRuns > 0 ? Math.floor(stats.highScore / stats.totalRuns) : 0;

    const handleNameSave = () => {
        if (nameInput.trim()) {
            setPlayerName(nameInput.trim());
        }
        setIsEditingName(false);
    };

    return (
        <div className="absolute inset-0 bg-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
            <div className="flex flex-col items-center justify-start min-h-full py-8 px-4">
                {/* Header with player name */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3 font-cyber tracking-widest">
                        PILOT PROFILE
                    </h2>

                    {isEditingName ? (
                        <div className="flex items-center justify-center gap-2">
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                maxLength={20}
                                className="bg-gray-800 border border-cyan-500 px-4 py-2 rounded text-center font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                autoFocus
                            />
                            <button
                                onClick={handleNameSave}
                                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded font-bold transition-colors"
                            >
                                ✓
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditingName(true)}
                            className="cursor-pointer inline-flex items-center gap-2 px-6 py-2 bg-gray-800/50 rounded-full border border-gray-700 hover:border-cyan-500 transition-all"
                        >
                            <User className="w-4 h-4 text-cyan-400" />
                            <span className="text-lg font-bold text-cyan-300">{stats.playerName}</span>
                            <span className="text-xs text-gray-500">✎</span>
                        </div>
                    )}
                </div>

                {/* Achievements Section */}
                <div className="w-full max-w-3xl mb-6">
                    <div className="text-center mb-3">
                        <h3 className="text-xl font-bold text-cyan-400">⭐ ACHIEVEMENTS</h3>
                        <p className="text-sm text-gray-400">{stats.achievements.length}/{ACHIEVEMENTS.length} Unlocked</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ACHIEVEMENTS.map((achievement) => {
                            const isUnlocked = stats.achievements.includes(achievement.id);
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={achievement.id}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${isUnlocked
                                        ? 'bg-gray-800/80 border-cyan-500 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                                        : 'bg-gray-900/50 border-gray-700 opacity-40 grayscale'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div
                                            className={`p-3 rounded-full mb-2 ${isUnlocked ? 'bg-gray-700' : 'bg-gray-800'
                                                }`}
                                            style={{
                                                boxShadow: isUnlocked ? `0 0 20px ${achievement.color}50` : 'none'
                                            }}
                                        >
                                            <Icon
                                                className="w-6 h-6"
                                                style={{ color: isUnlocked ? achievement.color : '#4B5563' }}
                                            />
                                        </div>
                                        <h4 className="text-xs font-bold mb-1">{achievement.name}</h4>
                                        <p className="text-[10px] text-gray-400">{achievement.description}</p>
                                        {isUnlocked && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs">✓</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="w-full max-w-3xl mb-6">
                    <h3 className="text-xl font-bold text-cyan-400 text-center mb-3">📊 STATISTICS</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-gradient-to-br from-purple-900/50 to-gray-900/50 p-4 rounded-xl border border-purple-700/30">
                            <div className="text-gray-400 text-xs mb-1">TOTAL RUNS</div>
                            <div className="text-2xl font-bold font-mono text-white">{stats.totalRuns}</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-900/50 to-gray-900/50 p-4 rounded-xl border border-yellow-700/30">
                            <div className="text-gray-400 text-xs mb-1">HIGH SCORE</div>
                            <div className="text-2xl font-bold font-mono text-yellow-400">{stats.highScore.toLocaleString()}</div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-900/50 to-gray-900/50 p-4 rounded-xl border border-cyan-700/30">
                            <div className="text-gray-400 text-xs mb-1">TOTAL GEMS</div>
                            <div className="text-2xl font-bold font-mono text-cyan-400">{stats.totalGems.toLocaleString()}</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-900/50 to-gray-900/50 p-4 rounded-xl border border-pink-700/30">
                            <div className="text-gray-400 text-xs mb-1">DISTANCE</div>
                            <div className="text-2xl font-bold font-mono text-pink-400">{Math.floor(stats.totalDistance)} LY</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-900/50 to-gray-900/50 p-4 rounded-xl border border-green-700/30">
                            <div className="text-gray-400 text-xs mb-1">ITEMS</div>
                            <div className="text-2xl font-bold font-mono text-green-400">{stats.itemsCollected}</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-900/50 to-gray-900/50 p-4 rounded-xl border border-orange-700/30">
                            <div className="text-gray-400 text-xs mb-1">AVG SCORE</div>
                            <div className="text-2xl font-bold font-mono text-orange-400">{averageScore.toLocaleString()}</div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-900/50 to-gray-900/50 p-4 rounded-xl border border-indigo-700/30">
                            <div className="text-gray-400 text-xs mb-1">PERFECT RUNS</div>
                            <div className="text-2xl font-bold font-mono text-indigo-400">{stats.perfectRuns}</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-900/50 to-gray-900/50 p-4 rounded-xl border border-yellow-700/30">
                            <div className="text-gray-400 text-xs mb-1">TOTAL KEYS</div>
                            <div className="text-2xl font-bold font-mono text-yellow-400">{stats.totalKeys}</div>
                        </div>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="w-full max-w-3xl mb-6">
                    <h3 className="text-xl font-bold text-cyan-400 text-center mb-3">🎯 PROGRESS</h3>
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">HIGHEST LEVEL REACHED</span>
                            <span className="text-lg font-bold text-purple-400">{stats.highestLevel}/{MAX_LEVEL}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-500 flex items-center justify-center text-xs font-bold"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            >
                                {progressPercentage >= 15 && `${Math.floor(progressPercentage)}%`}
                            </div>
                        </div>
                        {progressPercentage < 15 && (
                            <div className="text-center mt-1 text-xs text-gray-500">{Math.floor(progressPercentage)}%</div>
                        )}
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => setStatus(GameStatus.MENU)}
                    className="px-8 py-3 bg-gray-800 border border-gray-600 hover:border-white text-white font-bold rounded transition-all hover:scale-105"
                >
                    BACK TO MENU
                </button>

                {/* AdSense Banner - Bottom of Profile */}
                {/* TEMPORARILY DISABLED FOR RECORDING */}
                {/* <div className="w-full mt-8 flex justify-center">
                    <AdSenseBanner slot={AD_SLOTS.PROFILE_BOTTOM} style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px' }} />
                </div> */}

            </div>
        </div>
    );
}

export const HUD: React.FC = () => {
    const { score, lives, maxLives, keys, collectedLetters, status, level, restartGame, reviveGame, startGame, gemsCollected, distance, isImmortalityActive, speed, currentWord, setStatus, canUseAdRevive, canUseAdKey, continueWithAdRevive, continueWithAdKey } = useStore();

    const [showAd, setShowAd] = useState(false);
    const [adRewardType, setAdRewardType] = useState<'revive' | 'key'>('revive');

    const target = currentWord || ['S', 'P', 'A', 'C', 'E'];
    const containerClass = "absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-8 z-50";

    if (status === GameStatus.SHOP) return <ShopScreen />;
    if (status === GameStatus.PROFILE) return <ProfileScreen />;

    if (status === GameStatus.MENU) {
        return (
            <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)] border border-white/10 animate-in zoom-in-95 duration-500 bg-gray-900">

                    <div className="relative w-full">
                        <img
                            src={spaceRunnerImg}
                            alt="Space Runner Cover"
                            className="w-full h-auto block"
                        />

                        {/* Improved Overlay: Darker at bottom for buttons */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>

                        {/* Content positioned at the bottom of the card */}
                        <div className="absolute inset-0 flex flex-col justify-end items-center p-6 pb-8 text-center z-20 gap-3">
                            <button
                                onClick={() => { audio.init(); startGame(); }}
                                className="w-full group relative px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-xl rounded-xl hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:border-cyan-400 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-pink-500/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                <span className="relative z-10 tracking-widest flex items-center justify-center">
                                    LETS PLAY <Play className="ml-2 w-5 h-5 fill-white" />
                                </span>
                            </button>

                            <button
                                onClick={() => setStatus(GameStatus.PROFILE)}
                                className="w-full px-6 py-3 bg-black/40 backdrop-blur-md border border-white/10 text-gray-300 font-bold text-sm rounded-xl hover:bg-black/60 hover:text-white transition-all flex items-center justify-center"
                            >
                                <User className="w-4 h-4 mr-2" /> PILOT PROFILE
                            </button>
                        </div>
                    </div>
                </div>


            </div>

        );
    }

    if (status === GameStatus.GAME_OVER) {
        return (
            <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-sm overflow-y-auto">
                <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] font-cyber text-center">GAME OVER</h1>

                    <div className="grid grid-cols-1 gap-3 md:gap-4 text-center mb-8 w-full max-w-md">
                        <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                            <div className="flex items-center text-yellow-400 text-sm md:text-base"><Trophy className="mr-2 w-4 h-4 md:w-5 md:h-5" /> LEVEL</div>
                            <div className="text-xl md:text-2xl font-bold font-mono">{level}</div>
                        </div>
                        <div className="bg-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                            <div className="flex items-center text-cyan-400 text-sm md:text-base"><Diamond className="mr-2 w-4 h-4 md:w-5 md:h-5" /> GEMS</div>
                            <div className="text-xl md:text-2xl font-bold font-mono">{gemsCollected}</div>
                        </div>
                        <div className="bg-gray-800/50 p-3 md:p-4 rounded-lg flex items-center justify-between mt-2">
                            <div className="flex items-center text-white text-sm md:text-base">TOTAL SCORE</div>
                            <div className="text-2xl md:text-3xl font-bold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">{score.toLocaleString()}</div>
                        </div>
                    </div>


                    <div className="flex flex-col gap-3 w-full max-w-md">
                        {keys > 0 && (
                            <button
                                onClick={() => { audio.init(); reviveGame(); }}
                                className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-lg rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center justify-center animate-pulse"
                            >
                                <Key className="w-5 h-5 mr-2" fill="black" /> REVIVE WITH KEY ({keys})
                            </button>
                        )}

                        {/* Ad Reward Buttons */}
                        {(canUseAdRevive || canUseAdKey) && (
                            <div className="w-full border-t border-gray-700 pt-3 mt-2">
                                <p className="text-center text-sm text-gray-400 mb-3">Watch an ad to continue</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {canUseAdRevive && (
                                        <button
                                            onClick={() => { setAdRewardType('revive'); setShowAd(true); }}
                                            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2"
                                        >
                                            <Tv className="w-5 h-5" />
                                            <span>REVIVE</span>
                                        </button>
                                    )}
                                    {canUseAdKey && (
                                        <button
                                            onClick={() => { setAdRewardType('key'); setShowAd(true); }}
                                            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                                        >
                                            <Tv className="w-5 h-5" />
                                            <span>+1 KEY</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}


                        <div className="flex gap-3">
                            <button
                                onClick={() => { audio.init(); setStatus(GameStatus.PROFILE); }}
                                className="px-4 py-3 bg-gray-900/80 border border-gray-600 text-gray-300 font-bold rounded hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center group"
                            >
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            </button>

                            <button
                                onClick={() => { audio.init(); restartGame(); }}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                            >
                                RUN AGAIN
                            </button>
                        </div>


                        {/* Rewarded Ad Modal */}
                        {showAd && (
                            <RewardedAd
                                onClose={() => setShowAd(false)}
                                onReward={() => {
                                    setShowAd(false);
                                    if (adRewardType === 'revive') {
                                        continueWithAdRevive();
                                    } else {
                                        continueWithAdKey();
                                    }
                                }}
                                rewardType={adRewardType}
                            />
                        )}

                        {/* AdSense Banner - Bottom of Game Over */}
                        {/* TEMPORARILY DISABLED FOR RECORDING */}
                        {/* <div className="w-full mt-6 flex justify-center">
                            <AdSenseBanner slot={AD_SLOTS.GAME_OVER} format="rectangle" style={{ display: 'block', width: '100%', maxWidth: '336px', height: '280px' }} />
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }

    if (status === GameStatus.VICTORY) {
        return (
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-black/95 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto">
                <div className="flex flex-col items-center justify-center min-h-full py-8 px-4">
                    <Rocket className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
                    <h1 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-500 to-pink-500 mb-2 drop-shadow-[0_0_20px_rgba(255,165,0,0.6)] font-cyber text-center leading-tight">
                        MISSION COMPLETE
                    </h1>
                    <p className="text-cyan-300 text-sm md:text-2xl font-mono mb-8 tracking-widest text-center">
                        THE UNIVERSE HAS BEEN CONQUERED
                    </p>

                    <div className="grid grid-cols-1 gap-4 text-center mb-8 w-full max-w-md">
                        <div className="bg-black/60 p-6 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                            <div className="text-xs md:text-sm text-gray-400 mb-1 tracking-wider">FINAL SCORE</div>
                            <div className="text-3xl md:text-4xl font-bold font-cyber text-yellow-400">{score.toLocaleString()}</div>
                        </div>
                    </div>

                    <button
                        onClick={() => { audio.init(); restartGame(); }}
                        className="px-8 md:px-12 py-4 md:py-5 bg-white text-black font-black text-lg md:text-xl rounded hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] tracking-widest"
                    >
                        RESTART MISSION
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            {/* Top Bar */}
            <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                    <div className="text-3xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_#00ffff] font-cyber">
                        {score.toLocaleString()}
                    </div>
                    {keys > 0 && (
                        <div className="flex items-center text-yellow-400 mt-1">
                            <Key className="w-4 h-4 mr-1" /> <span className="font-mono font-bold">{keys}</span>
                        </div>
                    )}
                </div>

                <div className="flex space-x-1 md:space-x-2">
                    {[...Array(maxLives)].map((_, i) => (
                        <Heart
                            key={i}
                            className={`w-6 h-6 md:w-8 md:h-8 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800 fill-gray-800'} drop-shadow-[0_0_5px_#ff0054]`}
                        />
                    ))}
                </div>
            </div>

            {/* Level Indicator - Moved to Top Center aligned with Score/Hearts */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-sm md:text-lg text-purple-300 font-bold tracking-wider font-mono bg-black/50 px-3 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm z-50">
                LEVEL {level}
            </div>

            {/* Active Skill Indicator */}
            {isImmortalityActive && (
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl md:text-2xl animate-pulse flex items-center drop-shadow-[0_0_10px_gold]">
                    <Shield className="mr-2 fill-yellow-400" /> IMMORTAL
                </div>
            )}

            {/* Collection Status - Just below Top Bar */}
            <div className="absolute top-16 md:top-24 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3">
                {target.map((char, idx) => {
                    const isCollected = collectedLetters.includes(idx);
                    const color = LETTER_COLORS[idx % LETTER_COLORS.length];

                    return (
                        <div
                            key={idx}
                            style={{
                                borderColor: isCollected ? color : 'rgba(55, 65, 81, 1)',
                                color: isCollected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(55, 65, 81, 1)',
                                boxShadow: isCollected ? `0 0 20px ${color}` : 'none',
                                backgroundColor: isCollected ? color : 'rgba(0, 0, 0, 0.9)'
                            }}
                            className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center border-2 font-black text-lg md:text-xl font-cyber rounded-lg transform transition-all duration-300`}
                        >
                            {char}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Overlay */}
            <div className="w-full flex justify-end items-end">
                <div className="flex items-center space-x-2 text-cyan-500 opacity-70">
                    <Zap className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                    <span className="font-mono text-base md:text-xl">SPEED {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
                </div>
            </div>
        </div>
    );
};
