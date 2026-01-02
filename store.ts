
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { create } from 'zustand';
import { GameStatus, RUN_SPEED_BASE } from './types';

interface PlayerStats {
    totalRuns: number;
    highScore: number;
    totalGems: number;
    totalDistance: number;
    itemsCollected: number;
    playerName: string;
    achievements: string[];
    highestLevel: number;
    perfectRuns: number;
    totalKeys: number;
}

interface GameState {
    status: GameStatus;
    score: number;
    lives: number;
    maxLives: number;
    speed: number;
    collectedLetters: number[];
    level: number;
    laneCount: number;
    gemsCollected: number;
    distance: number;
    currentWord: string[];

    // Inventory / Abilities
    keys: number;
    hasDoubleJump: boolean;
    hasImmortality: boolean;
    isImmortalityActive: boolean;
    isMagnetActive: boolean;

    // Ad System
    canUseAdRevive: boolean;
    canUseAdKey: boolean;

    // Persistence
    stats: PlayerStats;

    // Profile Actions
    setPlayerName: (name: string) => void;
    checkAchievements: () => void;

    // Actions
    startGame: () => void;
    restartGame: () => void;
    reviveGame: () => void;
    takeDamage: () => void;
    collectHeart: () => void;
    collectKey: () => void;
    addScore: (amount: number) => void;
    collectGem: (value: number) => void;
    collectLetter: (index: number) => void;
    setStatus: (status: GameStatus) => void;
    setDistance: (dist: number) => void;
    pauseGame: () => void;
    resumeGame: () => void;

    // Shop / Abilities
    buyItem: (type: 'DOUBLE_JUMP' | 'MAX_LIFE' | 'HEAL' | 'IMMORTAL' | 'SPEED_BOOST' | 'SHIELD_BOOST' | 'LANE_ASSIST' | 'KEY', cost: number) => boolean;
    advanceLevel: () => void;
    openShop: () => void;
    closeShop: () => void;
    activateImmortality: () => void;

    // Ad Rewards
    continueWithAdRevive: () => void;
    continueWithAdKey: () => void;

    // Recording State
    isRecording: boolean;
    recordingDpr: number | null;
    recordingAspectRatio: 'landscape' | 'portrait';
    setIsRecording: (isRecording: boolean) => void;
    setRecordingDpr: (dpr: number | null) => void;
    setRecordingAspectRatio: (ratio: 'landscape' | 'portrait') => void;

    // Admin State
    isAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
}

const LEVEL_WORDS = [
    "SPACE", "STAR", "MOON", "MARS", "VOID",
    "ALIEN", "COMET", "ORBIT", "SOLAR", "ROBOT",
    "LASER", "EARTH", "VENUS", "PLUTO", "NEBULA",
    "COSMOS", "GALAXY", "PULSAR", "QUASAR", "ZODIAC",
    "ROCKET", "ASTRO", "LUNAR", "SATURN", "URANUS",
    "GRAVITY", "METEOR", "VORTEX", "INFINITY", "BEYOND"
];

const MAX_LEVEL = 30;

// Helper to update stats
const updateStats = (state: GameState, updates: Partial<PlayerStats>) => ({
    stats: { ...state.stats, ...updates }
});

export const useStore = create<GameState>((set, get) => ({
    status: GameStatus.MENU,
    score: 0,
    lives: 3,
    maxLives: 3,
    speed: 0,
    collectedLetters: [],
    level: 1,
    laneCount: 3,
    gemsCollected: 0,
    distance: 0,
    currentWord: LEVEL_WORDS[0].split(''),

    keys: 0,
    hasDoubleJump: false,
    hasImmortality: false,
    isImmortalityActive: false,
    isMagnetActive: false,

    canUseAdRevive: true,
    canUseAdKey: true,

    isRecording: false,
    recordingDpr: null,
    recordingAspectRatio: 'landscape',
    setIsRecording: (isRecording) => set({ isRecording }),
    setRecordingDpr: (dpr) => set({ recordingDpr: dpr }),
    setRecordingAspectRatio: (ratio) => set({ recordingAspectRatio: ratio }),

    isAdmin: false,
    setIsAdmin: (isAdmin) => set({ isAdmin }),

    stats: {
        totalRuns: 0,
        highScore: 0,
        totalGems: 0,
        totalDistance: 0,
        itemsCollected: 0,
        playerName: 'PILOT',
        achievements: [],
        highestLevel: 1,
        perfectRuns: 0,
        totalKeys: 0
    },

    startGame: () => set((state) => ({
        status: GameStatus.PLAYING,
        score: 0,
        lives: 3,
        maxLives: 3,
        speed: RUN_SPEED_BASE,
        collectedLetters: [],
        level: 1,
        laneCount: 3,
        gemsCollected: 0,
        distance: 0,
        currentWord: LEVEL_WORDS[0].split(''),
        hasDoubleJump: false,
        hasImmortality: false,
        isImmortalityActive: false,
        isMagnetActive: false,
        canUseAdRevive: true,
        canUseAdKey: true,
        // Increment run count
        stats: { ...state.stats, totalRuns: state.stats.totalRuns + 1 }
    })),

    restartGame: () => {
        const state = get();
        // Update high score before reset
        const newHighScore = Math.max(state.score, state.stats.highScore);

        set({
            status: GameStatus.PLAYING,
            score: 0,
            lives: 3,
            maxLives: 3,
            speed: RUN_SPEED_BASE,
            collectedLetters: [],
            level: 1,
            laneCount: 3,
            gemsCollected: 0,
            distance: 0,
            currentWord: LEVEL_WORDS[0].split(''),
            hasDoubleJump: false,
            hasImmortality: false,
            isImmortalityActive: false,
            isMagnetActive: false,
            canUseAdRevive: true,
            canUseAdKey: true,
            stats: { ...state.stats, highScore: newHighScore, totalRuns: state.stats.totalRuns + 1 }
        });
    },

    reviveGame: () => {
        const { keys, maxLives } = get();
        if (keys > 0) {
            set({
                lives: maxLives,
                keys: keys - 1,
                status: GameStatus.PLAYING,
                isImmortalityActive: true,
                speed: RUN_SPEED_BASE // Reset speed or keep it? Keeping it resets momentum usually better for revive
            });

            // Temporary invincibility after revive
            setTimeout(() => {
                set({ isImmortalityActive: false });
            }, 3000);
        }
    },

    takeDamage: () => {
        const { lives, isImmortalityActive } = get();
        if (isImmortalityActive) return;

        if (lives > 1) {
            set({ lives: lives - 1 });
        } else {
            const state = get();
            // Check for perfect run (no damage taken entire level)
            const isPerfectRun = state.lives === state.maxLives && state.level >= 1;
            // Update persistent stats on death
            set({
                lives: 0,
                status: GameStatus.GAME_OVER,
                speed: 0,
                stats: {
                    ...state.stats,
                    highScore: Math.max(state.score, state.stats.highScore),
                    totalDistance: state.stats.totalDistance + state.distance,
                    highestLevel: Math.max(state.level, state.stats.highestLevel),
                    perfectRuns: state.stats.perfectRuns + (isPerfectRun ? 1 : 0)
                }
            });
            // Check achievements after stats update
            setTimeout(() => get().checkAchievements(), 100);
        }
    },

    collectHeart: () => {
        const { lives, maxLives } = get();
        if (lives < maxLives) {
            set({ lives: lives + 1 });
        } else {
            get().addScore(500);
        }
    },

    collectKey: () => {
        set((state) => ({
            keys: state.keys + 1,
            stats: {
                ...state.stats,
                itemsCollected: state.stats.itemsCollected + 1,
                totalKeys: state.stats.totalKeys + 1
            }
        }));
        setTimeout(() => get().checkAchievements(), 100);
    },

    addScore: (amount) => set((state) => ({ score: state.score + amount })),

    collectGem: (value) => set((state) => ({
        score: state.score + value,
        gemsCollected: state.gemsCollected + 1,
        stats: {
            ...state.stats,
            totalGems: state.stats.totalGems + 1,
            itemsCollected: state.stats.itemsCollected + 1
        }
    })),

    setDistance: (dist) => set({ distance: dist }),

    collectLetter: (index) => {
        const { collectedLetters, level, speed, currentWord } = get();

        // Safety check: ensure we don't double collect
        if (!collectedLetters.includes(index)) {
            const newLetters = [...collectedLetters, index];

            const speedIncrease = RUN_SPEED_BASE * 0.05;
            const nextSpeed = speed + speedIncrease;

            set((state) => ({
                collectedLetters: newLetters,
                speed: nextSpeed,
                stats: { ...state.stats, itemsCollected: state.stats.itemsCollected + 1 }
            }));

            if (newLetters.length === currentWord.length) {
                if (level < MAX_LEVEL) {
                    get().advanceLevel();
                } else {
                    set((state) => ({
                        status: GameStatus.VICTORY,
                        score: state.score + 50000,
                        stats: {
                            ...state.stats,
                            highScore: Math.max(state.score + 50000, state.stats.highScore),
                            totalDistance: state.stats.totalDistance + state.distance
                        }
                    }));
                }
            }
        }
    },

    advanceLevel: () => {
        const { level, speed } = get();
        const nextLevel = level + 1;
        const nextWordIndex = (nextLevel - 1) % LEVEL_WORDS.length;

        // INCREASED DIFFICULTY: 30% speed increase per level (was 20%)
        const speedIncrease = RUN_SPEED_BASE * 0.30;
        const newSpeed = speed + speedIncrease;

        // FIXED 3 LANES: No lane count changes on level up
        // This prevents the runner from disappearing when lanes expand

        set({
            level: nextLevel,
            laneCount: 3, // ALWAYS 3 LANES
            status: GameStatus.PLAYING,
            speed: newSpeed,
            collectedLetters: [],
            currentWord: LEVEL_WORDS[nextWordIndex].split('')
        });
    },

    openShop: () => set({ status: GameStatus.SHOP }),

    closeShop: () => set({ status: GameStatus.PLAYING }),

    buyItem: (type, cost) => {
        const { score, maxLives, lives, speed, keys } = get();

        if (score >= cost) {
            set({ score: score - cost });

            switch (type) {
                case 'DOUBLE_JUMP':
                    set({ hasDoubleJump: true });
                    break;
                case 'MAX_LIFE':
                    set({ maxLives: maxLives + 1, lives: lives + 1 });
                    break;
                case 'HEAL':
                    set({ lives: Math.min(lives + 1, maxLives) });
                    break;
                case 'KEY':
                    set({ keys: keys + 1 });
                    break;
                case 'IMMORTAL':
                    set({ hasImmortality: true });
                    break;
                case 'SPEED_BOOST':
                    set({ speed: speed + 20, isImmortalityActive: true });
                    setTimeout(() => {
                        set(s => ({
                            speed: Math.max(RUN_SPEED_BASE, s.speed - 20),
                            isImmortalityActive: false
                        }));
                    }, 5000);
                    break;
                case 'SHIELD_BOOST':
                    set({ isImmortalityActive: true });
                    setTimeout(() => {
                        set({ isImmortalityActive: false });
                    }, 10000);
                    break;
                case 'LANE_ASSIST':
                    set({ isMagnetActive: true });
                    setTimeout(() => {
                        set({ isMagnetActive: false });
                    }, 15000);
                    break;
            }
            return true;
        }
        return false;
    },

    activateImmortality: () => {
        const { hasImmortality, isImmortalityActive } = get();
        if (hasImmortality && !isImmortalityActive) {
            set({ isImmortalityActive: true });
            setTimeout(() => {
                set({ isImmortalityActive: false });
            }, 5000);
        }
    },

    setPlayerName: (name) => set((state) => ({
        stats: { ...state.stats, playerName: name || 'PILOT' }
    })),

    checkAchievements: () => {
        const state = get();
        const newAchievements = [...state.stats.achievements];
        let updated = false;

        // Century Hunter - Score 100,000+
        if (state.score >= 100000 && !newAchievements.includes('CENTURY_HUNTER')) {
            newAchievements.push('CENTURY_HUNTER');
            updated = true;
        }

        // Speed Demon - Reach level 10+
        if (state.level >= 10 && !newAchievements.includes('SPEED_DEMON')) {
            newAchievements.push('SPEED_DEMON');
            updated = true;
        }

        // Gem Collector - Collect 500+ gems total
        if (state.stats.totalGems >= 500 && !newAchievements.includes('GEM_COLLECTOR')) {
            newAchievements.push('GEM_COLLECTOR');
            updated = true;
        }

        // Completionist - Complete 50+ runs
        if (state.stats.totalRuns >= 50 && !newAchievements.includes('COMPLETIONIST')) {
            newAchievements.push('COMPLETIONIST');
            updated = true;
        }

        // Perfect Run - stored separately
        if (state.stats.perfectRuns > 0 && !newAchievements.includes('PERFECT_RUN')) {
            newAchievements.push('PERFECT_RUN');
            updated = true;
        }

        // Key Master - Collect 10+ keys total
        if (state.stats.totalKeys >= 10 && !newAchievements.includes('KEY_MASTER')) {
            newAchievements.push('KEY_MASTER');
            updated = true;
        }

        if (updated) {
            set((s) => ({ stats: { ...s.stats, achievements: newAchievements } }));
        }
    },


    setStatus: (status) => set({ status }),
    pauseGame: () => {
        const { status } = get();
        if (status === GameStatus.PLAYING) {
            set({ status: GameStatus.PAUSED });
        }
    },
    resumeGame: () => {
        const { status } = get();
        if (status === GameStatus.PAUSED) {
            set({ status: GameStatus.PLAYING });
        }
    },
    increaseLevel: () => set((state) => ({ level: state.level + 1 })),

    continueWithAdRevive: () => {
        const { maxLives } = get();
        set({
            lives: 1,
            status: GameStatus.PLAYING,
            canUseAdRevive: false,
            isImmortalityActive: true,
            speed: RUN_SPEED_BASE
        });
        // Temporary invincibility after ad revive
        setTimeout(() => {
            set({ isImmortalityActive: false });
        }, 3000);
    },

    continueWithAdKey: () => {
        set((state) => ({
            keys: state.keys + 1,
            canUseAdKey: false,
            stats: {
                ...state.stats,
                totalKeys: state.stats.totalKeys + 1
            }
        }));
    },
}));

// LocalStorage persistence
const STORAGE_KEY = 'space_runner_stats';

// Load from localStorage on init
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const stats = JSON.parse(saved);
            useStore.setState({ stats });
        } catch (e) {
            console.error('Failed to load stats:', e);
        }
    }
}

// Save to localStorage on stats change
useStore.subscribe((state) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stats));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    }
});
