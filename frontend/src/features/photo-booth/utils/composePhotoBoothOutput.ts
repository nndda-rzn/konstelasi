/**
 * composePhotoBoothOutput
 *
 * The single function that produces the final photobooth output canvas.
 * Reads from PHOTO_RATIOS (output dimensions) and PHOTO_LAYOUTS (cell
 * arrangement), draws each captured frame into its cell with
 * object-cover via drawImageCover, applies filter + effect, draws
 * background, caption footer, brand mark, decorations, and stickers.
 * The resulting canvas is the single source of truth for preview,
 * result page, download, and save to canvas/gallery.
 */

import {
  COMPOSITION_LAYOUTS,
  LAYOUT_DECORATIONS,
  PHOTO_FILTERS,
  PHOTO_EFFECTS,
  PHOTO_QUALITIES,
  PHOTO_THEMES,
  type PhotoRatio,
  type PhotoLayout,
  type RatioId,
  type LayoutId,
  type FilterId,
  type EffectId,
  type BackgroundId,
  type ThemeId,
  type CompositionLayout,
} from "../photoBooth.config";
import type { ComposeOptions, ComposeResult } from "../photoBooth.types";
import { formatDateID, loadImage } from "../photoBooth.utils";
import { drawImageCover } from "./drawImageCover";

function buildFilterString(
  filterId: FilterId,
  effectId: EffectId
): string {
  const f = PHOTO_FILTERS[filterId];
  const e = PHOTO_EFFECTS[effectId];
  const parts: string[] = [];
  if (f.canvasFilter && f.canvasFilter !== "none") parts.push(f.canvasFilter);
  if (e.canvasFilter) parts.push(e.canvasFilter);
  return parts.join(" ");
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bgId: BackgroundId,
  theme: { bg: string },
  firstImage: HTMLImageElement | undefined
) {
  if (bgId === "cream") {
    ctx.fillStyle = "#FFF5E8";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (bgId === "gradient") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#FFE5E8");
    g.addColorStop(0.5, "#FFB8C0");
    g.addColorStop(1, "#FFE5E8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (bgId === "softBlur" && firstImage) {
    ctx.save();
    ctx.filter = "blur(50px) saturate(1.15)";
    ctx.drawImage(firstImage, -w * 0.1, -h * 0.1, w * 1.2, h * 1.2);
    ctx.restore();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);
}

function drawStickers(
  ctx: CanvasRenderingContext2D,
  stickers: ComposeOptions["stickers"],
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

function drawFooter(
  ctx: CanvasRenderingContext2D,
  cW: number,
  cH: number,
  footerHeight: number,
  text: string,
  color: string,
  font: string
) {
  if (footerHeight <= 0) return;
  const fY = cH * (1 - footerHeight);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = Math.max(14, Math.floor(cH * 0.022));
  ctx.font = `${fontSize}px ${font}`;
  ctx.fillText(text, cW / 2, fY + footerHeight * cH * 0.5);
}

/**
 * drawCellHearts - small heart marker in the top-left corner of each
 * cell. Used by withLove and Hearts layouts.
 */
function drawCellHearts(
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
 * drawHeartBorder - thin heart-themed rounded border around the whole
 * canvas. Used by Hearts layout.
 */
function drawHeartBorder(
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

/**
 * drawBrandMark - small "Constella" signature in the footer next to
 * the date. Always on by default.
 */
function drawBrandMark(
  ctx: CanvasRenderingContext2D,
  cW: number,
  cH: number,
  footerHeight: number
) {
  if (footerHeight <= 0) return;
  const fY = cH * (1 - footerHeight);
  ctx.save();
  ctx.fillStyle = "#9D0208";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const fontSize = Math.max(11, Math.floor(cH * 0.016));
  ctx.font = `${fontSize}px "Inter", system-ui, sans-serif`;
  // bullet dot
  ctx.textAlign = "left";
  const dotR = Math.max(2, fontSize * 0.18);
  const text = "Constella";
  const textWidth = ctx.measureText(text).width;
  const totalW = dotR * 2 + 6 + textWidth;
  const startX = cW - 16 - totalW;
  const dotY = fY + footerHeight * cH * 0.5;
  ctx.beginPath();
  ctx.arc(startX + dotR, dotY, dotR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(text, startX + dotR * 2 + 6, dotY);
  ctx.restore();
}

function drawHeart(
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

function roundedRectPath(
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

export async function composePhotoBoothOutput(
  opts: ComposeOptions
): Promise<ComposeResult> {
  const { selectedRatio, selectedLayout, selectedQuality } = opts;
  const composition = COMPOSITION_LAYOUTS[selectedLayout.id];
  const quality = PHOTO_QUALITIES[selectedQuality];
  const cW = Math.round(selectedRatio.outputWidth * quality.scale);
  const cH = Math.round(selectedRatio.outputHeight * quality.scale);
  const theme = PHOTO_THEMES[opts.selectedTheme];
  const filterStr = buildFilterString(
    opts.selectedFilter,
    opts.selectedEffect
  );
  const deco = LAYOUT_DECORATIONS[selectedLayout.id];

  const canvas = document.createElement("canvas");
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Load all captured frames
  const imgs = await Promise.all(opts.capturedFrames.map(loadImage));

  // Background
  drawBackground(ctx, cW, cH, opts.selectedBackground, theme, imgs[0]);

  // Draw each photo into its cell (with optional rounded clipping)
  const usableH = cH * (1 - composition.footer);
  const cellRadius = deco.cellRadius > 0 ? deco.cellRadius * Math.min(cW, usableH) : 0;
  opts.capturedFrames.forEach((_, i) => {
    const img = imgs[i];
    if (!img) return;
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

  // Stickers
  drawStickers(ctx, opts.stickers, cW, cH);

  // Layout-specific decorations
  if (deco.drawCellHeart) {
    drawCellHearts(ctx, composition, cW, cH);
  }
  if (deco.drawHeartBorder) {
    drawHeartBorder(ctx, cW, cH);
  }

  // Footer (caption or date)
  const captionText = opts.caption || formatDateID();
  drawFooter(
    ctx,
    cW,
    cH,
    composition.footer,
    captionText,
    theme.text,
    deco.captionFont
  );

  // Brand mark "Constella"
  if (deco.showBrand) {
    drawBrandMark(ctx, cW, cH, composition.footer);
  }

  // Encode
  const mime = quality.id === "ultra" ? "image/png" : "image/jpeg";
  const dataUrl =
    canvas.toDataURL(mime, mime === "image/jpeg" ? 0.92 : undefined);

  return {
    canvas,
    dataUrl,
    blob: null,
    width: cW,
    height: cH,
    ratioId: selectedRatio.id as RatioId,
    layoutId: selectedLayout.id as LayoutId,
    filterId: opts.selectedFilter,
    effectId: opts.selectedEffect,
    caption: opts.caption,
    createdAt: Date.now(),
  };
}
