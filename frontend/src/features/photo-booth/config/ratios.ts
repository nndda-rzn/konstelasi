/**
 * Photo Booth - Ratio configuration.
 * Single source of truth for aspect ratios and output dimensions.
 */

export type RatioId =
  | "square"
  | "portrait"
  | "story"
  | "wide"
  | "ultraWide";

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
