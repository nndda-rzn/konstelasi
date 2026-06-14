"use client";

import { PHOTO_RATIOS, type PhotoRatio, type QualityKey, QUALITIES } from "../constants";

/**
 * captureFrameFromVideo - Reads a <video> element, center-crops the
 * current frame to the target aspect ratio, and draws it onto a canvas
 * at the target output dimensions from the PHOTO_RATIOS config.
 *
 * Returns a base64 PNG (image/png) sized to the target ratio × quality.
 * The returned image is the source-of-truth for the photobooth pipeline:
 * preview, compose, result page, download, and save all see the same
 * aspect-corrected, dimension-corrected frame.
 */
export interface CaptureOptions {
  ratio: PhotoRatio;
  quality: QualityKey;
}

export async function captureFrameFromVideo(
  video: HTMLVideoElement,
  opts: CaptureOptions
): Promise<string> {
  const sourceW = video.videoWidth || 1280;
  const sourceH = video.videoHeight || 720;
  const q = QUALITIES.find((x) => x.key === opts.quality) || QUALITIES[0];
  const outW = Math.round(opts.ratio.outputWidth * q.scale);
  const outH = Math.round(opts.ratio.outputHeight * q.scale);
  const targetAspect = outW / outH;
  const sourceAspect = sourceW / sourceH;

  // Center-crop the source so the resulting crop matches the target aspect.
  let sx = 0;
  let sy = 0;
  let sw = sourceW;
  let sh = sourceH;
  if (sourceAspect > targetAspect) {
    // Source wider than target -> crop left/right.
    sw = sourceH * targetAspect;
    sx = (sourceW - sw) / 2;
  } else if (sourceAspect < targetAspect) {
    // Source taller than target -> crop top/bottom.
    sh = sourceW / targetAspect;
    sy = (sourceH - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);
  return canvas.toDataURL("image/png");
}

/**
 * Helper to resolve a ratio key into a fully-typed PhotoRatio config.
 */
export function getPhotoRatio(ratioKey: keyof typeof PHOTO_RATIOS): PhotoRatio {
  return PHOTO_RATIOS[ratioKey];
}
