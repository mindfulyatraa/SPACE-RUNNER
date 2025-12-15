
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  SHOP = 'SHOP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY',
  PROFILE = 'PROFILE',
  PAUSED = 'PAUSED'
}

export enum ObjectType {
  OBSTACLE = 'OBSTACLE',
  GEM = 'GEM',
  LETTER = 'LETTER',
  SHOP_PORTAL = 'SHOP_PORTAL',
  ALIEN = 'ALIEN',
  MISSILE = 'MISSILE',
  HEART = 'HEART',
  KEY = 'KEY'
}

export interface GameObject {
  id: string;
  type: ObjectType;
  position: [number, number, number]; // x, y, z
  active: boolean;
  value?: string; // For letters (S, P, A, C, E)
  color?: string;
  targetIndex?: number; // Index in the target word
  points?: number; // Score value for gems
  hasFired?: boolean; // For Aliens
}

export const LANE_WIDTH = 2.2;
export const JUMP_HEIGHT = 2.5;
export const JUMP_DURATION = 0.6; // seconds
export const RUN_SPEED_BASE = 22.5;
export const SPAWN_DISTANCE = 120;
export const REMOVE_DISTANCE = 20; // Behind player

// Neon Colors for letters
export const LETTER_COLORS = [
  '#2979ff', // Blue
  '#ff1744', // Red
  '#ffea00', // Yellow
  '#00e676', // Green
  '#d500f9', // Purple
  '#ff9100', // Orange
  '#00bcd4', // Cyan
  '#f50057', // Pink
];

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: any; // Lucide icon component
  oneTime?: boolean; // If true, remove from pool after buying
}
