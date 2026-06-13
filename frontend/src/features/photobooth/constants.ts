/**
 * Photobooth feature constants and shared types.
 * Extracted to keep the page component focused on UI logic.
 */

export type Stage = 'landing' | 'setup' | 'countdown' | 'flash' | 'edit' | 'saving' | 'done';
export type FilterKey = 'normal' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'fade' | 'vivid';
export type LayoutKey = 'single' | 'strip3' | 'strip4' | 'grid4' | 'grid6';
export type EditTab = 'filter' | 'color' | 'sticker' | 'caption';

export interface StickerItem {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export interface LayoutDef {
  key: LayoutKey;
  label: string;
  desc: string;
  shots: number;
}

export const FILTERS = [
  { key: 'normal' as FilterKey, label: 'Normal', css: '', canvas: 'none' },
  { key: 'grayscale' as FilterKey, label: 'Mono', css: 'grayscale(100%)', canvas: 'grayscale(100%)' },
  { key: 'sepia' as FilterKey, label: 'Sepia', css: 'sepia(80%)', canvas: 'sepia(80%)' },
  { key: 'warm' as FilterKey, label: 'Warm', css: 'saturate(140%) hue-rotate(10deg) brightness(1.05)', canvas: 'saturate(140%) hue-rotate(10deg) brightness(1.05)' },
  { key: 'cool' as FilterKey, label: 'Cool', css: 'saturate(80%) hue-rotate(-20deg) brightness(1.08)', canvas: 'saturate(80%) hue-rotate(-20deg) brightness(1.08)' },
  { key: 'fade' as FilterKey, label: 'Fade', css: 'contrast(0.78) brightness(1.12) saturate(0.65)', canvas: 'contrast(0.78) brightness(1.12) saturate(0.65)' },
  { key: 'vivid' as FilterKey, label: 'Vivid', css: 'saturate(180%) contrast(1.08)', canvas: 'saturate(180%) contrast(1.08)' },
];

export const LAYOUTS = [
  { key: 'single' as LayoutKey, label: '1 Foto', desc: 'Polaroid klasik', shots: 1 },
  { key: 'strip3' as LayoutKey, label: 'Strip 3', desc: '3 foto vertikal', shots: 3 },
  { key: 'strip4' as LayoutKey, label: 'Strip 4', desc: '4 foto vertikal', shots: 4 },
  { key: 'grid4' as LayoutKey, label: 'Grid 2x2', desc: '4 foto kotak', shots: 4 },
  { key: 'grid6' as LayoutKey, label: 'Grid 3x2', desc: '6 foto kolase', shots: 6 },
];

export const TIMERS = [
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
];

export const STRIP_COLORS = [
  { key: 'white', label: 'Putih', bg: '#FFFAF7', text: '#5A3E4C' },
  { key: 'black', label: 'Hitam', bg: '#1a1a1a', text: 'rgba(255,255,255,0.8)' },
  { key: 'pink', label: 'Soft Pink', bg: '#FFE5E8', text: '#5A3E4C' },
  { key: 'warm', label: 'Warm Paper', bg: '#F5ECD7', text: '#5A3E4C' },
];

export const EMOJI_PALETTE = [
  '🎀', '✨', '💖', '🌸', '🍒', '🦋', '🧸', '💌',
  '☁️', '🍓', '⭐', '🌷', '🩷', '🫧', '🪄', '🎂',
];
