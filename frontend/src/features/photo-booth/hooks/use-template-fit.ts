/**
 * use-template-fit - Pure functions for photo fit modes in templates.
 *
 * Three modes:
 *  - cover: fill slot, crop excess (current drawImageCover)
 *  - contain: fit inside slot, center, may leave padding
 *  - smartCenter: center-crop with 10% reduced crop margin so the
 *    subject (e.g. face) is less likely to be cut off
 *
 * Output values are normalized 0..1 fractions of the slot, suitable
 * for direct use as image crop params in a 2D context.
 */
import type { FitMode } from "../config/templates";

export interface FitResult {
  /** Source x in image space (0..1). */
  sx: number;
  /** Source y in image space (0..1). */
  sy: number;
  /** Source width in image space (0..1). */
  sw: number;
  /** Source height in image space (0..1). */
  sh: number;
}

export interface FitInput {
  /** Slot aspect (slotW / slotH). */
  slotAspect: number;
  /** Image aspect (imageW / imageH). */
  imageAspect: number;
  /** Fit mode. */
  mode: FitMode;
}

/**
 * Calculate the source crop rectangle in the image to fit a slot.
 */
export function calculateFit(input: FitInput): FitResult {
  const { slotAspect, imageAspect, mode } = input;

  // Default: full image
  if (mode === "contain") {
    // contain: no crop, full image shown, may have padding
    return { sx: 0, sy: 0, sw: 1, sh: 1 };
  }

  // Determine crop direction
  // If image is wider than slot → crop horizontally
  // If image is taller than slot → crop vertically
  let sw: number;
  let sh: number;

  if (imageAspect > slotAspect) {
    // Image wider — crop horizontally
    sh = 1;
    sw = slotAspect / imageAspect;
  } else if (imageAspect < slotAspect) {
    // Image taller — crop vertically
    sw = 1;
    sh = imageAspect / slotAspect;
  } else {
    // Same aspect — no crop needed
    return { sx: 0, sy: 0, sw: 1, sh: 1 };
  }

  // Center the crop
  let sx = (1 - sw) / 2;
  let sy = (1 - sh) / 2;

  // Smart-center: reduce crop by ~10% so more of the scene is preserved
  if (mode === "smartCenter") {
    const reduction = 0.10;
    if (sw < 1) {
      // crop was horizontal — reduce horizontal crop margin
      const newSw = Math.min(1, sw + reduction * (1 - sw));
      sx = (1 - newSw) / 2;
      return { sx, sy, sw: newSw, sh };
    } else {
      // crop was vertical — reduce vertical crop margin
      const newSh = Math.min(1, sh + reduction * (1 - sh));
      sy = (1 - newSh) / 2;
      return { sx, sy, sw, sh: newSh };
    }
  }

  // cover mode
  return { sx, sy, sw, sh };
}

/**
 * Apply the fit result to actual pixel coordinates on a 2D canvas.
 */
export function fitToPixelCrop(
  fit: FitResult,
  imageW: number,
  imageH: number,
  slotX: number,
  slotY: number,
  slotW: number,
  slotH: number
): { sx: number; sy: number; sw: number; sh: number; dx: number; dy: number; dw: number; dh: number } {
  return {
    sx: fit.sx * imageW,
    sy: fit.sy * imageH,
    sw: fit.sw * imageW,
    sh: fit.sh * imageH,
    dx: slotX,
    dy: slotY,
    dw: slotW,
    dh: slotH,
  };
}
