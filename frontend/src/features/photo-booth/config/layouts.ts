/**
 * Photo Booth - Layout configuration.
 * Single source of truth for layout definitions, composition geometry,
 * and required shot counts.
 */

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
/*  Composition layout rules                                           */
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

/**
 * Utility: get a human-readable tag for a layout type.
 */
export function tagForLayout(l: { type: string }): string {
  switch (l.type) {
    case "single":
      return "Single";
    case "vertical-strip":
      return "Strip";
    case "grid":
      return "Grid";
    case "horizontal-strip":
      return "Wide";
    case "cinematic":
      return "Cinematic";
    case "ultra-wide-collage":
      return "Panorama";
    default:
      return l.type;
  }
}
