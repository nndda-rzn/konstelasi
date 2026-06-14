/**
 * Photo Booth Configuration
 * Single source of truth for ratio, layout, filter, quality, background, theme.
 * Every part of the pipeline — preview, capture, compose, result, download,
 * save to canvas/gallery — reads from this file.
 */

export type RatioId =
  | "square"
  | "portrait"
  | "story"
  | "wide"
  | "ultraWide";

export type LayoutId =
  | "single"
  | "strip3"
  | "strip4"
  | "grid2x2"
  | "grid3x2"
  | "wide2"
  | "cinematic3"
  | "ultraWide"
  | "classicStrip"
  | "vintageStrip"
  | "withLove"
  | "hearts";

export type QualityId = "standard" | "hd" | "ultra";

export type BackgroundId = "none" | "softBlur" | "cream" | "gradient";

export type ThemeId = "white" | "black" | "pink" | "warm";

export type FilterId =
  | "normal"
  | "mono"
  | "sepia"
  | "warm"
  | "cool"
  | "fade"
  | "vivid";

export type EffectId = "off" | "soft" | "warm";

export type Stage =
  | "landing"
  | "setup"
  | "countdown"
  | "flash"
  | "edit"
  | "saving"
  | "done";

export type Mode = "camera" | "result";

/* ------------------------------------------------------------------ */
/*  Ratios                                                              */
/* ------------------------------------------------------------------ */

export interface PhotoRatio {
  id: RatioId;
  label: string;
  name: string;
  aspectRatio: number;
  outputWidth: number;
  outputHeight: number;
  /** CSS aspect-ratio utility class for the live preview container. */
  css: string;
}

export const PHOTO_RATIOS: Record<RatioId, PhotoRatio> = {
  square: {
    id: "square",
    label: "1:1",
    name: "Square",
    aspectRatio: 1 / 1,
    outputWidth: 1600,
    outputHeight: 1600,
    css: "aspect-square",
  },
  portrait: {
    id: "portrait",
    label: "4:5",
    name: "Portrait",
    aspectRatio: 4 / 5,
    outputWidth: 1600,
    outputHeight: 2000,
    css: "aspect-[4/5]",
  },
  story: {
    id: "story",
    label: "9:16",
    name: "Story",
    aspectRatio: 9 / 16,
    outputWidth: 1440,
    outputHeight: 2560,
    css: "aspect-[9/16]",
  },
  wide: {
    id: "wide",
    label: "16:9",
    name: "Wide",
    aspectRatio: 16 / 9,
    outputWidth: 1920,
    outputHeight: 1080,
    css: "aspect-video",
  },
  ultraWide: {
    id: "ultraWide",
    label: "21:9",
    name: "Ultra Wide",
    aspectRatio: 21 / 9,
    outputWidth: 2520,
    outputHeight: 1080,
    css: "aspect-[21/9]",
  },
};

export const RATIO_LIST: PhotoRatio[] = Object.values(PHOTO_RATIOS);

/* ------------------------------------------------------------------ */
/*  Layouts                                                             */
/* ------------------------------------------------------------------ */

export type LayoutType =
  | "single"
  | "vertical-strip"
  | "grid"
  | "horizontal-strip"
  | "cinematic"
  | "ultra-wide-collage";

export interface PhotoLayout {
  id: LayoutId;
  label: string;
  requiredShots: number;
  type: LayoutType;
  columns?: number;
  rows?: number;
}

export const PHOTO_LAYOUTS: Record<LayoutId, PhotoLayout> = {
  single: {
    id: "single",
    label: "1 Foto",
    requiredShots: 1,
    type: "single",
  },
  strip3: {
    id: "strip3",
    label: "Strip 3",
    requiredShots: 3,
    type: "vertical-strip",
  },
  strip4: {
    id: "strip4",
    label: "Strip 4",
    requiredShots: 4,
    type: "vertical-strip",
  },
  grid2x2: {
    id: "grid2x2",
    label: "Grid 2x2",
    requiredShots: 4,
    type: "grid",
    columns: 2,
    rows: 2,
  },
  grid3x2: {
    id: "grid3x2",
    label: "Grid 3x2",
    requiredShots: 6,
    type: "grid",
    columns: 3,
    rows: 2,
  },
  wide2: {
    id: "wide2",
    label: "Wide 2",
    requiredShots: 2,
    type: "horizontal-strip",
  },
  cinematic3: {
    id: "cinematic3",
    label: "Cinematic 3",
    requiredShots: 3,
    type: "cinematic",
  },
  ultraWide: {
    id: "ultraWide",
    label: "Ultra Wide",
    requiredShots: 4,
    type: "ultra-wide-collage",
    columns: 2,
    rows: 2,
  },
  classicStrip: {
    id: "classicStrip",
    label: "Classic Strip",
    requiredShots: 4,
    type: "vertical-strip",
  },
  vintageStrip: {
    id: "vintageStrip",
    label: "Vintage Strip",
    requiredShots: 4,
    type: "vertical-strip",
  },
  withLove: {
    id: "withLove",
    label: "With Love",
    requiredShots: 4,
    type: "vertical-strip",
  },
  hearts: {
    id: "hearts",
    label: "Hearts",
    requiredShots: 4,
    type: "vertical-strip",
  },
};

export const LAYOUT_LIST: PhotoLayout[] = Object.values(PHOTO_LAYOUTS);

/* ------------------------------------------------------------------ */
/*  Quality                                                             */
/* ------------------------------------------------------------------ */

export interface PhotoQuality {
  id: QualityId;
  label: string;
  /** Multiplier on the ratio's outputWidth/outputHeight. */
  scale: number;
  desc: string;
}

export const PHOTO_QUALITIES: Record<QualityId, PhotoQuality> = {
  standard: { id: "standard", label: "Standard", scale: 1.0, desc: "1080p" },
  hd: { id: "hd", label: "HD", scale: 1.5, desc: "1620p" },
  ultra: { id: "ultra", label: "Ultra", scale: 2.0, desc: "2160p" },
};

/* ------------------------------------------------------------------ */
/*  Filters (canvas filter strings)                                    */
/* ------------------------------------------------------------------ */

export interface PhotoFilter {
  id: FilterId;
  label: string;
  canvasFilter: string;
  cssFilter: string;
}

export const PHOTO_FILTERS: Record<FilterId, PhotoFilter> = {
  normal: { id: "normal", label: "Normal", canvasFilter: "none", cssFilter: "none" },
  mono: {
    id: "mono",
    label: "Mono",
    canvasFilter: "grayscale(1)",
    cssFilter: "grayscale(1)",
  },
  sepia: {
    id: "sepia",
    label: "Sepia",
    canvasFilter: "sepia(0.45)",
    cssFilter: "sepia(0.45)",
  },
  warm: {
    id: "warm",
    label: "Warm",
    canvasFilter: "sepia(0.2) saturate(1.1) brightness(1.04)",
    cssFilter: "sepia(0.2) saturate(1.1) brightness(1.04)",
  },
  cool: {
    id: "cool",
    label: "Cool",
    canvasFilter: "saturate(0.95) hue-rotate(8deg)",
    cssFilter: "saturate(0.95) hue-rotate(8deg)",
  },
  fade: {
    id: "fade",
    label: "Fade",
    canvasFilter: "contrast(0.9) brightness(1.05)",
    cssFilter: "contrast(0.9) brightness(1.05)",
  },
  vivid: {
    id: "vivid",
    label: "Vivid",
    canvasFilter: "saturate(1.25) contrast(1.08)",
    cssFilter: "saturate(1.25) contrast(1.08)",
  },
};

/* ------------------------------------------------------------------ */
/*  Effects (overlays — soft / warm)                                    */
/* ------------------------------------------------------------------ */

export interface PhotoEffect {
  id: EffectId;
  label: string;
  canvasFilter: string;
  cssFilter: string;
}

export const PHOTO_EFFECTS: Record<EffectId, PhotoEffect> = {
  off: { id: "off", label: "Off", canvasFilter: "", cssFilter: "" },
  soft: {
    id: "soft",
    label: "Soft",
    canvasFilter: "blur(0.5px) saturate(1.1) brightness(1.04) contrast(0.98)",
    cssFilter: "blur(0.5px) saturate(1.1) brightness(1.04) contrast(0.98)",
  },
  warm: {
    id: "warm",
    label: "Warm",
    canvasFilter: "saturate(140%) hue-rotate(10deg) brightness(1.05)",
    cssFilter: "saturate(140%) hue-rotate(10deg) brightness(1.05)",
  },
};

/* ------------------------------------------------------------------ */
/*  Backgrounds                                                          */
/* ------------------------------------------------------------------ */

export interface PhotoBackground {
  id: BackgroundId;
  label: string;
  css: string;
}

export const PHOTO_BACKGROUNDS: Record<BackgroundId, PhotoBackground> = {
  none: { id: "none", label: "Tanpa", css: "Tanpa" },
  softBlur: { id: "softBlur", label: "Soft Blur", css: "Soft Blur" },
  cream: { id: "cream", label: "Cream", css: "Cream" },
  gradient: { id: "gradient", label: "Gradient", css: "Gradient" },
};

/* ------------------------------------------------------------------ */
/*  Themes (frame / paper colors)                                      */
/* ------------------------------------------------------------------ */

export interface PhotoTheme {
  id: ThemeId;
  label: string;
  bg: string;
  text: string;
  /** CSS color for the preview surface. */
  cssBg: string;
  cssText: string;
}

export const PHOTO_THEMES: Record<ThemeId, PhotoTheme> = {
  white: {
    id: "white",
    label: "Putih",
    bg: "#FFFAF7",
    text: "#5A3E4C",
    cssBg: "#FFFAF7",
    cssText: "#5A3E4C",
  },
  black: {
    id: "black",
    label: "Hitam",
    bg: "#1a1a1a",
    text: "rgba(255,255,255,0.85)",
    cssBg: "#1a1a1a",
    cssText: "rgba(255,255,255,0.85)",
  },
  pink: {
    id: "pink",
    label: "Soft Pink",
    bg: "#FFE5E8",
    text: "#5A3E4C",
    cssBg: "#FFE5E8",
    cssText: "#5A3E4C",
  },
  warm: {
    id: "warm",
    label: "Warm Paper",
    bg: "#F5ECD7",
    text: "#5A3E4C",
    cssBg: "#F5ECD7",
    cssText: "#5A3E4C",
  },
};

/* ------------------------------------------------------------------ */
/*  Frame colors (themed frames shown in the result editor)             */
/* ------------------------------------------------------------------ */

export interface FrameColor {
  id: string;
  label: string;
  /** CSS color of the frame surface. */
  bg: string;
  /** CSS color of the foreground text on this frame. */
  text: string;
  /** Short display tag (e.g. "Strip", "Grid"). */
  tag: string;
}

export const FRAME_COLORS: FrameColor[] = [
  { id: "cream", label: "Cream", bg: "#FFF5E8", text: "#5A3E4C", tag: "Strip" },
  { id: "white", label: "White", bg: "#FFFAF7", text: "#5A3E4C", tag: "Strip" },
  { id: "pink", label: "Pink", bg: "#FFE5E8", text: "#5A3E4C", tag: "Strip" },
  { id: "red", label: "Red", bg: "#F8E0E0", text: "#9D0208", tag: "Strip" },
  { id: "softGold", label: "Soft Gold", bg: "#F5ECD7", text: "#5A3E4C", tag: "Strip" },
  { id: "lavender", label: "Lavender", bg: "#EDE7F6", text: "#3F2A35", tag: "Strip" },
];

/* ------------------------------------------------------------------ */
/*  Timers                                                              */
/* ------------------------------------------------------------------ */

export const TIMERS: { value: number; label: string; desc: string }[] = [
  { value: 3, label: "3s", desc: "Cepat" },
  { value: 5, label: "5s", desc: "Standar" },
  { value: 10, label: "10s", desc: "Santai" },
];

/* ------------------------------------------------------------------ */
/*  Composition layout rules                                            */
/* ------------------------------------------------------------------ */

/**
 * A single photo slot inside the composition canvas, expressed as
 * fractions of the canvas (0..1). Read by composePhotoBoothOutput.
 */
export interface CellRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CompositionLayout {
  cells: CellRect[];
  /** Bottom strip fraction reserved for caption/date. 0 for layouts with caption embedded. */
  footer: number;
  /** Whether to draw a vertical strip of photos. */
  vertical: boolean;
}

export const COMPOSITION_LAYOUTS: Record<LayoutId, CompositionLayout> = {
  single: {
    cells: [{ x: 0, y: 0, w: 1, h: 1 }],
    footer: 0,
    vertical: false,
  },
  strip3: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.31 },
      { x: 0, y: 0.325, w: 1, h: 0.31 },
      { x: 0, y: 0.65, w: 1, h: 0.31 },
    ],
    footer: 0.04,
    vertical: true,
  },
  strip4: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.23 },
      { x: 0, y: 0.245, w: 1, h: 0.23 },
      { x: 0, y: 0.49, w: 1, h: 0.23 },
      { x: 0, y: 0.735, w: 1, h: 0.23 },
    ],
    footer: 0.04,
    vertical: true,
  },
  grid2x2: {
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.48 },
      { x: 0.5, y: 0, w: 0.5, h: 0.48 },
      { x: 0, y: 0.48, w: 0.5, h: 0.48 },
      { x: 0.5, y: 0.48, w: 0.5, h: 0.48 },
    ],
    footer: 0.04,
    vertical: false,
  },
  grid3x2: {
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 0.48 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 0.48 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 0.48 },
      { x: 0, y: 0.48, w: 1 / 3, h: 0.48 },
      { x: 1 / 3, y: 0.48, w: 1 / 3, h: 0.48 },
      { x: 2 / 3, y: 0.48, w: 1 / 3, h: 0.48 },
    ],
    footer: 0.04,
    vertical: false,
  },
  wide2: {
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.96 },
      { x: 0.5, y: 0, w: 0.5, h: 0.96 },
    ],
    footer: 0.04,
    vertical: false,
  },
  cinematic3: {
    cells: [
      { x: 0, y: 0, w: 1 / 3, h: 0.96 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 0.96 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 0.96 },
    ],
    footer: 0.04,
    vertical: false,
  },
  ultraWide: {
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.96 },
      { x: 0.5, y: 0, w: 0.5, h: 0.96 },
      { x: 0, y: 0.5, w: 0.5, h: 0.46 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.46 },
    ],
    footer: 0.04,
    vertical: false,
  },
  // Themed variants — all use Strip 4 cell geometry with composer-driven
  // decorations (see LAYOUT_DECORATIONS below).
  classicStrip: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.23 },
      { x: 0, y: 0.245, w: 1, h: 0.23 },
      { x: 0, y: 0.49, w: 1, h: 0.23 },
      { x: 0, y: 0.735, w: 1, h: 0.23 },
    ],
    footer: 0.05,
    vertical: true,
  },
  vintageStrip: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.23 },
      { x: 0, y: 0.245, w: 1, h: 0.23 },
      { x: 0, y: 0.49, w: 1, h: 0.23 },
      { x: 0, y: 0.735, w: 1, h: 0.23 },
    ],
    footer: 0.05,
    vertical: true,
  },
  withLove: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.23 },
      { x: 0, y: 0.245, w: 1, h: 0.23 },
      { x: 0, y: 0.49, w: 1, h: 0.23 },
      { x: 0, y: 0.735, w: 1, h: 0.23 },
    ],
    footer: 0.05,
    vertical: true,
  },
  hearts: {
    cells: [
      { x: 0, y: 0, w: 1, h: 0.23 },
      { x: 0, y: 0.245, w: 1, h: 0.23 },
      { x: 0, y: 0.49, w: 1, h: 0.23 },
      { x: 0, y: 0.735, w: 1, h: 0.23 },
    ],
    footer: 0.05,
    vertical: true,
  },
};

/* ------------------------------------------------------------------ */
/*  Layout decorations (themed variants)                                */
/* ------------------------------------------------------------------ */

/**
 * Decoration parameters for a layout. Read by the composer to apply
 * per-layout visual treatment (rounded cells, heart overlays, etc).
 */
export interface LayoutDecoration {
  /** Rounded-corner radius for each cell, as fraction of cell width. */
  cellRadius: number;
  /** Inset gap between cells (pixels for the composer to scale). */
  cellInset: number;
  /** Whether to draw the Constella brand watermark in the footer. */
  showBrand: boolean;
  /** Whether to draw a small heart icon in each cell. */
  drawCellHeart: boolean;
  /** Whether to draw a heart-themed border around the whole canvas. */
  drawHeartBorder: boolean;
  /** Caption font family (e.g. serif for vintage). */
  captionFont: string;
}

const DEFAULT_DECORATION: LayoutDecoration = {
  cellRadius: 0,
  cellInset: 0,
  showBrand: true,
  drawCellHeart: false,
  drawHeartBorder: false,
  captionFont: '"Segoe Script", "Lucida Handwriting", cursive',
};

export const LAYOUT_DECORATIONS: Record<LayoutId, LayoutDecoration> = {
  single: { ...DEFAULT_DECORATION },
  strip3: { ...DEFAULT_DECORATION, cellInset: 8 },
  strip4: { ...DEFAULT_DECORATION, cellInset: 8 },
  grid2x2: { ...DEFAULT_DECORATION, cellInset: 8 },
  grid3x2: { ...DEFAULT_DECORATION, cellInset: 6 },
  wide2: { ...DEFAULT_DECORATION, cellInset: 8 },
  cinematic3: { ...DEFAULT_DECORATION, cellInset: 8 },
  ultraWide: { ...DEFAULT_DECORATION, cellInset: 8 },
  classicStrip: {
    ...DEFAULT_DECORATION,
    cellInset: 14,
  },
  vintageStrip: {
    ...DEFAULT_DECORATION,
    cellRadius: 0.04,
    cellInset: 14,
    captionFont: '"Brush Script MT", "Segoe Script", cursive',
  },
  withLove: {
    ...DEFAULT_DECORATION,
    cellInset: 12,
    drawCellHeart: true,
  },
  hearts: {
    ...DEFAULT_DECORATION,
    cellInset: 10,
    drawCellHeart: true,
    drawHeartBorder: true,
  },
};
