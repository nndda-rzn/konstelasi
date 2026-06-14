/**
 * Photo Booth - Config barrel export.
 * Single source of truth for all configuration.
 */

// Types
export type { Stage, Mode } from "./types";

// Ratios
export type { RatioId, PhotoRatio } from "./ratios";
export { PHOTO_RATIOS, RATIO_LIST } from "./ratios";

// Layouts
export type {
  LayoutId,
  LayoutType,
  PhotoLayout,
  CellRect,
  CompositionLayout,
} from "./layouts";
export {
  PHOTO_LAYOUTS,
  LAYOUT_LIST,
  COMPOSITION_LAYOUTS,
  tagForLayout,
} from "./layouts";

// Effects
export type { FilterId, EffectId, PhotoFilter, PhotoEffect } from "./effects";
export { PHOTO_FILTERS, PHOTO_EFFECTS } from "./effects";

// Themes
export type {
  QualityId,
  BackgroundId,
  ThemeId,
  PhotoQuality,
  PhotoBackground,
  PhotoTheme,
} from "./themes";
export {
  PHOTO_QUALITIES,
  PHOTO_BACKGROUNDS,
  PHOTO_THEMES,
} from "./themes";

// Decorations
export type { LayoutDecoration, FrameColor } from "./decorations";
export {
  LAYOUT_DECORATIONS,
  FRAME_COLORS,
  TIMERS,
} from "./decorations";
