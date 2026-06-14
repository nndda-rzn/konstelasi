/**
 * Photo Booth - Filter & Effect configuration.
 * Canvas filter strings for composition and CSS filter strings for preview.
 */

export type FilterId =
  | "normal"
  | "mono"
  | "sepia"
  | "warm"
  | "cool"
  | "fade"
  | "vivid";

export type EffectId = "off" | "soft" | "warm";

export interface PhotoFilter {
  id: FilterId;
  label: string;
  canvasFilter: string;
  cssFilter: string;
}

export interface PhotoEffect {
  id: EffectId;
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
