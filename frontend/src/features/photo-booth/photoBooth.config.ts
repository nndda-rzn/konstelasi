/**
 * Photo Booth Configuration
 * DEPRECATED: Import from "./config/*" directly instead.
 * This file is kept as a re-export barrel for backward compatibility.
 */

export type { Stage, Mode } from "./config/types";

export type { RatioId, PhotoRatio } from "./config/ratios";
export { PHOTO_RATIOS, RATIO_LIST } from "./config/ratios";

export type {
  LayoutId,
  LayoutType,
  PhotoLayout,
  CellRect,
  CompositionLayout,
} from "./config/layouts";
export {
  PHOTO_LAYOUTS,
  LAYOUT_LIST,
  COMPOSITION_LAYOUTS,
  tagForLayout,
} from "./config/layouts";

export type { QualityId, BackgroundId, ThemeId } from "./config/themes";
export type { PhotoQuality, PhotoBackground, PhotoTheme } from "./config/themes";
export { PHOTO_QUALITIES, PHOTO_BACKGROUNDS, PHOTO_THEMES } from "./config/themes";

export type { FilterId, EffectId, PhotoFilter, PhotoEffect } from "./config/effects";
export { PHOTO_FILTERS, PHOTO_EFFECTS } from "./config/effects";

export type { LayoutDecoration, FrameColor } from "./config/decorations";
export { LAYOUT_DECORATIONS, FRAME_COLORS, TIMERS } from "./config/decorations";
