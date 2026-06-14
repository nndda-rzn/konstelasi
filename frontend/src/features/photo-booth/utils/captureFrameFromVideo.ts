/**
 * captureFrameFromVideo
 *
 * Reads a <video> element, center-crops the current frame to the target
 * aspect ratio from PHOTO_RATIOS, and draws it onto a canvas at the
 * target output dimensions (multiplied by quality scale).
 *
 * Returns a CaptureResult with a dataURL and dimensions. No stretch,
 * no distortion, no hardcoded width/height.
 */

import { PHOTO_QUALITIES, type PhotoRatio, type QualityId } from "../photoBooth.config";
import type { CaptureResult } from "../photoBooth.types";
import { dataUrlToBlob } from "../photoBooth.utils";

export async function captureFrameFromVideo(
  video: HTMLVideoElement,
  ratio: PhotoRatio,
  quality: QualityId = "standard"
): Promise<CaptureResult> {
  const sourceW = video.videoWidth || 1280;
  const sourceH = video.videoHeight || 720;
  const q = PHOTO_QUALITIES[quality];
  const outW = Math.round(ratio.outputWidth * q.scale);
  const outH = Math.round(ratio.outputHeight * q.scale);
  const targetAspect = outW / outH;
  const sourceAspect = sourceW / sourceH;

  // Center-crop the source so the resulting crop matches the target aspect.
  let sx = 0;
  let sy = 0;
  let sw = sourceW;
  let sh = sourceH;
  if (sourceAspect > targetAspect) {
    sw = sourceH * targetAspect;
    sx = (sourceW - sw) / 2;
  } else if (sourceAspect < targetAspect) {
    sh = sourceW / targetAspect;
    sy = (sourceH - sh) / 2;
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);
  const dataUrl = canvas.toDataURL("image/png");
  const blob = await dataUrlToBlob(dataUrl);

  return {
    dataUrl,
    blob,
    width: outW,
    height: outH,
  };
}
