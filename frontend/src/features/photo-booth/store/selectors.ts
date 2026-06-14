/**
 * Photo Booth Store - Selectors.
 * Convenience selectors for derived state.
 */

import { PHOTO_RATIOS, PHOTO_LAYOUTS, PHOTO_THEMES } from "../photoBooth.config";
import type { PhotoRatio, PhotoLayout } from "../photoBooth.config";
import type { PhotoBoothState } from "./types";

export const selectPhotoRatio = (s: PhotoBoothState): PhotoRatio =>
  PHOTO_RATIOS[s.selectedRatioId];

export const selectPhotoLayout = (s: PhotoBoothState): PhotoLayout =>
  PHOTO_LAYOUTS[s.selectedLayoutId];

export const selectRequiredShots = (s: PhotoBoothState): number =>
  PHOTO_LAYOUTS[s.selectedLayoutId].requiredShots;

export const selectPhotoTheme = (s: PhotoBoothState) =>
  PHOTO_THEMES[s.selectedTheme];

export const selectIsSessionActive = (s: PhotoBoothState): boolean =>
  s.phase === "countdown" ||
  s.phase === "capturing" ||
  s.phase === "processing";
