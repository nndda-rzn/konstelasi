/**
 * Canvas service - draw stickers onto canvas.
 */

import type { Sticker } from "../../photoBooth.types";

export function drawStickers(
  ctx: CanvasRenderingContext2D,
  stickers: Sticker[],
  cW: number,
  cH: number
) {
  if (stickers.length === 0) return;
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.max(36, Math.floor(cH * 0.04))}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", serif`;
  stickers.forEach((s) => {
    ctx.fillText(s.emoji, (s.x / 100) * cW, (s.y / 100) * cH);
  });
  ctx.restore();
}
