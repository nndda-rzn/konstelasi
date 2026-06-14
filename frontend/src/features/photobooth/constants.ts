/**
 * Photobooth feature constants and shared types.
 * Extracted to keep the page component focused on UI logic.
 */

export type Stage = 'landing' | 'setup' | 'countdown' | 'flash' | 'edit' | 'saving' | 'done';
export type FilterKey = 'normal' | 'grayscale' | 'sepia' | 'warm' | 'cool' | 'fade' | 'vivid';
export type LayoutKey = 'single' | 'strip3' | 'strip4' | 'grid4' | 'grid6' | 'wide2' | 'cinematic3' | 'ultrawide4';
export type EditTab = 'filter' | 'color' | 'sticker' | 'caption';
export type RatioKey = 'square' | 'portrait' | 'story' | 'landscape' | 'ultrawide';
export type QualityKey = 'standard' | 'hd' | 'ultra';
export type BackgroundKey = 'none' | 'softBlur' | 'cream' | 'gradient';
export type ZoomKey = 'ultrawide' | 'wide' | 'normal' | 'closeup';

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
  group: 'classic' | 'wide';
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

export const LAYOUTS: LayoutDef[] = [
  { key: 'single', label: '1 Foto', desc: 'Polaroid klasik', shots: 1, group: 'classic' },
  { key: 'strip3', label: 'Strip 3', desc: '3 foto vertikal', shots: 3, group: 'classic' },
  { key: 'strip4', label: 'Strip 4', desc: '4 foto vertikal', shots: 4, group: 'classic' },
  { key: 'grid4', label: 'Grid 2x2', desc: '4 foto kotak', shots: 4, group: 'classic' },
  { key: 'grid6', label: 'Grid 3x2', desc: '6 foto kolase', shots: 6, group: 'classic' },
  { key: 'wide2', label: 'Wide 2', desc: '2 foto berdampingan', shots: 2, group: 'wide' },
  { key: 'cinematic3', label: 'Cinematic 3', desc: 'Frame horizontal sinematik', shots: 3, group: 'wide' },
  { key: 'ultrawide4', label: 'Ultra Wide', desc: '4 foto • 21:9 panorama', shots: 4, group: 'wide' },
];

export const RATIOS: { key: RatioKey; label: string; desc: string; css: string; w: number; h: number }[] = [
  { key: 'square', label: '1:1', desc: 'Square', css: 'aspect-square', w: 1, h: 1 },
  { key: 'portrait', label: '4:5', desc: 'Portrait', css: 'aspect-[4/5]', w: 4, h: 5 },
  { key: 'story', label: '9:16', desc: 'Story', css: 'aspect-[9/16]', w: 9, h: 16 },
  { key: 'landscape', label: '16:9', desc: 'Landscape', css: 'aspect-video', w: 16, h: 9 },
  { key: 'ultrawide', label: '21:9', desc: 'Ultra Wide', css: 'aspect-[21/9]', w: 21, h: 9 },
];

export const ZOOM_LEVELS: { key: ZoomKey; scale: number; label: string; desc: string }[] = [
  { key: 'ultrawide', scale: 0.65, label: 'Ultra Lebar', desc: '0.65x' },
  { key: 'wide', scale: 0.82, label: 'Lebar', desc: '0.82x' },
  { key: 'normal', scale: 1.00, label: 'Normal', desc: '1.0x' },
  { key: 'closeup', scale: 1.30, label: 'Close-up', desc: '1.3x' },
];

export const TIMERS = [
  { value: 3, label: '3s', desc: 'Cepat' },
  { value: 5, label: '5s', desc: 'Standar' },
  { value: 10, label: '10s', desc: 'Santai' },
];

export const QUALITIES: { key: QualityKey; label: string; scale: number; desc: string }[] = [
  { key: 'standard', scale: 1.0, label: 'Standard', desc: '1080p' },
  { key: 'hd', scale: 1.5, label: 'HD', desc: '1620p' },
  { key: 'ultra', scale: 2.0, label: 'Ultra', desc: '2160p' },
];

export const BACKGROUNDS: { key: BackgroundKey; label: string; canvas: string }[] = [
  { key: 'none', label: 'Tanpa', canvas: 'none' },
  { key: 'softBlur', label: 'Soft Blur', canvas: 'softBlur' },
  { key: 'cream', label: 'Cream', canvas: 'cream' },
  { key: 'gradient', label: 'Gradient', canvas: 'gradient' },
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
