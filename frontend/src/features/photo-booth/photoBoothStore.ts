"use client";

import { createPhotoBoothStore } from "./store/slices";

/**
 * Re-export types from store/types.ts for consumers.
 */
export type {
  CapturePhase,
  FlowMode,
  SessionStep,
  ConfigSlice,
  CaptureSlice,
  UiSlice,
  CameraSlice,
  EditorSlice,
  GallerySlice,
  PhotoBoothState,
} from "./store/types";

/**
 * Re-export selectors from store/selectors.ts for consumers.
 */
export {
  selectPhotoRatio,
  selectPhotoLayout,
  selectRequiredShots,
  selectPhotoTheme,
  selectIsSessionActive,
} from "./store/selectors";

// Re-export config constants for convenience from store consumers.
export {
  PHOTO_RATIOS,
  PHOTO_LAYOUTS,
  PHOTO_FILTERS,
  PHOTO_THEMES,
  PHOTO_BACKGROUNDS,
  PHOTO_EFFECTS,
  PHOTO_QUALITIES,
  LAYOUT_DECORATIONS,
  FRAME_COLORS,
  RATIO_LIST,
  LAYOUT_LIST,
  TIMERS,
} from "./photoBooth.config";

// Re-export frame config
export {
  FRAME_STYLES,
  FRAME_MAP,
  DEFAULT_FRAME_ID,
} from "./config/frames";
export type { FrameId, FrameStyle, FrameDecor } from "./config/frames";

/** Export the main store instance */
export const usePhotoBoothStore = createPhotoBoothStore();
