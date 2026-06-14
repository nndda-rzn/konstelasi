/**
 * Photo Booth - Layout decorations, frame colors, and timers.
 */

import type { LayoutId } from "./layouts";

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
