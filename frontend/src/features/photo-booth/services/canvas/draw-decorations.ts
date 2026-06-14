/**
 * Canvas service - layout-specific decorations (hearts, borders).
 */

import type { CompositionLayout } from "../../photoBooth.config";
import { roundedRectPath } from "./draw-cells";

/**
 * Draw a small heart shape.
 */
export function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  fill: string
) {
  const w = size;
  const h = size;
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  // Two top circles
  ctx.arc(cx - w / 4, cy - h / 4, w / 4, 0, Math.PI * 2);
  ctx.arc(cx + w / 4, cy - h / 4, w / 4, 0, Math.PI * 2);
  // Bottom triangle
  ctx.moveTo(cx - w / 2, cy);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 1.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draw small heart markers in each cell (withLove / hearts layouts).
 */
export function drawCellHearts(
  ctx: CanvasRenderingContext2D,
  composition: CompositionLayout,
  cW: number,
  cH: number
) {
  const usableH = cH * (1 - composition.footer);
  composition.cells.forEach((cell) => {
    const cx = cell.x * cW + cell.w * cW * 0.06;
    const cy = cell.y * usableH + cell.h * usableH * 0.18;
    drawHeart(ctx, cx, cy, Math.max(18, cell.h * usableH * 0.12), "#E63946");
  });
}

/**
 * Draw a thin heart-themed border around the whole canvas (hearts layout).
 */
export function drawHeartBorder(
  ctx: CanvasRenderingContext2D,
  cW: number,
  cH: number
) {
  const inset = Math.max(20, Math.min(cW, cH) * 0.02);
  ctx.save();
  ctx.strokeStyle = "rgba(230, 57, 70, 0.25)";
  ctx.lineWidth = Math.max(4, Math.min(cW, cH) * 0.005);
  roundedRectPath(ctx, inset, inset, cW - inset * 2, cH - inset * 2, 24);
  ctx.stroke();
  // Small heart in each corner
  const size = Math.max(16, Math.min(cW, cH) * 0.015);
  drawHeart(ctx, inset + size, inset + size, size, "rgba(230, 57, 70, 0.45)");
  drawHeart(
    ctx,
    cW - inset - size,
    inset + size,
    size,
    "rgba(230, 57, 70, 0.45)"
  );
  drawHeart(
    ctx,
    inset + size,
    cH - inset - size,
    size,
    "rgba(230, 57, 70, 0.45)"
  );
  drawHeart(
    ctx,
    cW - inset - size,
    cH - inset - size,
    size,
    "rgba(230, 57, 70, 0.45)"
  );
  ctx.restore();
}
