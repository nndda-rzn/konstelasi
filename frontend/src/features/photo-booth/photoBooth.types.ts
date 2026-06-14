/**
 * Photo Booth Type Definitions
 * Re-exports config + shared types used across components and utils.
 */

import type { FrameId } from "./config/frames";
import type {
  RatioId,
  LayoutId,
  QualityId,
  BackgroundId,
  ThemeId,
  FilterId,
  EffectId,
  Stage,
  Mode,
  PhotoRatio,
  PhotoLayout,
  PhotoQuality,
  PhotoFilter,
  PhotoEffect,
  PhotoBackground,
  PhotoTheme,
  CompositionLayout,
  CellRect,
} from "./photoBooth.config";

export type {
  RatioId,
  LayoutId,
  QualityId,
  BackgroundId,
  ThemeId,
  FilterId,
  EffectId,
  Stage,
  Mode,
  PhotoRatio,
  PhotoLayout,
  PhotoQuality,
  PhotoFilter,
  PhotoEffect,
  PhotoBackground,
  PhotoTheme,
  CompositionLayout,
  CellRect,
};

export interface Sticker {
  id: string;
  emoji: string;
  /** Position as percent of preview/canvas (0..100). */
  x: number;
  y: number;
}

export const EMOJI_PALETTE: string[] = [
  "🎀",
  "✨",
  "💖",
  "🌸",
  "🍒",
  "🦋",
  "🧸",
  "💌",
  "☁️",
  "🍓",
  "⭐",
  "🌷",
  "🩷",
  "🫧",
  "🪄",
  "🎂",
];

export interface ComposeOptions {
  capturedFrames: string[];
  selectedRatio: PhotoRatio;
  selectedLayout: PhotoLayout;
  selectedQuality: QualityId;
  selectedTheme: ThemeId;
  selectedBackground: BackgroundId;
  selectedFilter: FilterId;
  selectedEffect: EffectId;
  caption: string;
  stickers: Sticker[];
}

export interface ComposeResult {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob | null;
  width: number;
  height: number;
  ratioId: RatioId;
  layoutId: LayoutId;
  filterId: FilterId;
  effectId: EffectId;
  /**
   * Optional. The composer doesn't apply frames (those are applied by
   * the Konva stage in Result/Edit). The frame is recorded here when
   * the result is finalized for save/download.
   */
  frameId?: FrameId;
  caption: string;
  createdAt: number;
}

export interface GalleryMetadata {
  id: string;
  url: string;
  thumbnailUrl: string;
  createdAt: number;
  source: "photo-booth";
  layoutId: LayoutId;
  ratioId: RatioId;
  filterId: FilterId;
  effectId: EffectId;
  frameId: FrameId;
  templateId: string | null;
  width: number;
  height: number;
  caption: string;
}

export interface CaptureResult {
  dataUrl: string;
  blob: Blob | null;
  width: number;
  height: number;
}
