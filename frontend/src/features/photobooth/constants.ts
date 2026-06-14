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
export type EffectKey = 'off' | 'soft' | 'warm';

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

/**
 * PhotoRatio - Single source of truth for output dimensions.
 * Output canvas for capture / compose / result / download / save
 * always uses these width/height multiplied by quality.scale.
 */
export interface PhotoRatio {
  id: RatioKey;
  /** Alias for `id` to keep backward-compat with code that used `r.key`. */
  key: RatioKey;
  label: string;
  desc: string;
  css: string;
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
}

export const PHOTO_RATIOS: Record<RatioKey, PhotoRatio> = {
  square: {
    id: 'square',
    key: 'square',
    label: '1:1',
    desc: 'Square',
    css: 'aspect-square',
    aspectRatio: 1,
    outputWidth: 1600,
    outputHeight: 1600,
  },
  portrait: {
    id: 'portrait',
    key: 'portrait',
    label: '4:5',
    desc: 'Portrait',
    css: 'aspect-[4/5]',
    aspectRatio: 4 / 5,
    outputWidth: 1600,
    outputHeight: 2000,
  },
  story: {
    id: 'story',
    key: 'story',
    label: '9:16',
    desc: 'Story',
    css: 'aspect-[9/16]',
    aspectRatio: 9 / 16,
    outputWidth: 1440,
    outputHeight: 2560,
  },
  landscape: {
    id: 'landscape',
    key: 'landscape',
    label: '16:9',
    desc: 'Landscape',
    css: 'aspect-video',
    aspectRatio: 16 / 9,
    outputWidth: 1920,
    outputHeight: 1080,
  },
  ultrawide: {
    id: 'ultrawide',
    key: 'ultrawide',
    label: '21:9',
    desc: 'Ultra Wide',
    css: 'aspect-[21/9]',
    aspectRatio: 21 / 9,
    outputWidth: 2520,
    outputHeight: 1080,
  },
};

export const RATIOS: PhotoRatio[] = Object.values(PHOTO_RATIOS);

/**
 * LayoutCell - Position of a photo slot within the output canvas,
 * expressed as fractions of the canvas (0..1).
 */
export interface LayoutCell {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutGeometry {
  cells: LayoutCell[];
  /**
   * Reserved bottom area for caption/date, as fraction of canvas height.
   * Photos occupy the top (1 - footer) of the canvas.
   */
  footer: number;
}

/**
 * LAYOUT_GEOMETRY - Source of truth for how each layout arranges
 * photos inside the output canvas. Cells are fractions of the canvas
 * and stay within the top (1 - footer) area. The composer reads this
 * and never hardcodes cell sizes.
 */
export const LAYOUT_GEOMETRY: Record<LayoutKey, LayoutGeometry> = {
  single: {
    cells: [{ x: 0, y: 0, w: 1, h: 1 }],
    footer: 0,
  },
  strip3: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.31 },
      { x: 0, y: 0.325, w: 1, h: 0.31 },
      { x: 0, y: 0.65, w: 1, h: 0.31 },
    ],
    footer: 0.04,
  },
  strip4: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.23 },
      { x: 0, y: 0.245, w: 1, h: 0.23 },
      { x: 0, y: 0.49, w: 1, h: 0.23 },
      { x: 0, y: 0.735, w: 1, h: 0.23 },
    ],
    footer: 0.04,
  },
  grid4: {
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.48 },
      { x: 0.5, y: 0, w: 0.5, h: 0.48 },
      { x: 0, y: 0.48, w: 0.5, h: 0.48 },
      { x: 0.5, y: 0.48, w: 0.5, h: 0.48 },
    ],
    footer: 0.04,
  },
  grid6: {
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 0.48 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 0.48 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 0.48 },
      { x: 0, y: 0.48, w: 1 / 3, h: 0.48 },
      { x: 1 / 3, y: 0.48, w: 1 / 3, h: 0.48 },
      { x: 2 / 3, y: 0.48, w: 1 / 3, h: 0.48 },
    ],
    footer: 0.04,
  },
  wide2: {
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.96 },
      { x: 0.5, y: 0, w: 0.5, h: 0.96 },
    ],
    footer: 0.04,
  },
  cinematic3: {
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 0.96 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 0.96 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 0.96 },
    ],
    footer: 0.04,
  },
  ultrawide4: {
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.48 },
      { x: 0.5, y: 0, w: 0.5, h: 0.48 },
      { x: 0, y: 0.48, w: 0.5, h: 0.48 },
      { x: 0.5, y: 0.48, w: 0.5, h: 0.48 },
    ],
    footer: 0.04,
  },
};

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

export const TIMERS = [
  { value: 3, label: '3s', desc: 'Cepat' },
  { value: 5, label: '5s', desc: 'Standar' },
  { value: 10, label: '10s', desc: 'Santai' },
];

export const ZOOM_LEVELS: { key: ZoomKey; scale: number; label: string; desc: string }[] = [
  { key: 'ultrawide', scale: 0.65, label: 'Ultra Lebar', desc: '0.65x' },
  { key: 'wide', scale: 0.82, label: 'Lebar', desc: '0.82x' },
  { key: 'normal', scale: 1.0, label: 'Normal', desc: '1.0x' },
  { key: 'closeup', scale: 1.3, label: 'Close-up', desc: '1.3x' },
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
