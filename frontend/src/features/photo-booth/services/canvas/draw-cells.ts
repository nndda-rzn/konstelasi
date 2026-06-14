/**
 * Canvas service - draw captured frames into layout cells with object-cover.
 */

import type { CompositionLayout } from "../../photoBooth.config";
import { drawImageCover } from "../../utils/drawImageCover";

/**
 * Draw a rounded rectangle path (used for clipping cells).
 */
export function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Draw all captured frames into their composition cells.
 */
export function drawCells(
  ctx: CanvasRenderingContext2D,
  imgs: HTMLImageElement[],
  composition: CompositionLayout,
  cW: number,
  cH: number,
  filterStr: string,
  cellRadius: number
) {
  const usableH = cH * (1 - composition.footer);

  imgs.forEach((img, i) => {
    const cell = composition.cells[i];
    if (!cell) return;
    const cellX = cell.x * cW;
    const cellY = cell.y * usableH;
    const cellW = cell.w * cW;
    const cellH = cell.h * usableH;

    ctx.save();
    if (filterStr) ctx.filter = filterStr;

    if (cellRadius > 0) {
      ctx.beginPath();
      roundedRectPath(ctx, cellX, cellY, cellW, cellH, cellRadius);
      ctx.clip();
    }

    drawImageCover(ctx, img, cellX, cellY, cellW, cellH);
    ctx.restore();
  });
}
