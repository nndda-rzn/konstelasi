/**
 * Photo Booth - Theme, Background, and Quality configuration.
 */

export type QualityId = "standard" | "hd" | "ultra";
export type BackgroundId = "none" | "softBlur" | "cream" | "gradient";
export type ThemeId = "white" | "black" | "pink" | "warm";

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
/*  Backgrounds                                                         */
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
