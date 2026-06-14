/**
 * composePhotoBoothOutput
 *
 * The single function that produces the final photobooth output canvas.
 * Reads from PHOTO_RATIOS (output dimensions) and PHOTO_LAYOUTS (cell
 * arrangement), draws each captured frame into its cell with
 * object-cover via drawImageCover, applies filter + effect, draws
 * background, caption footer, and stickers. The resulting canvas is
 * the single source of truth for preview, result page, download, and
 * save to canvas/gallery.
 */

import {
  COMPOSITION_LAYOUTS,
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
  // "none" falls back to theme paper color.
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
  color: string
) {
  if (footerHeight <= 0) return;
  const fY = cH * (1 - footerHeight);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = Math.max(14, Math.floor(cH * 0.022));
  ctx.font = `${fontSize}px "Segoe Script", "Lucida Handwriting", cursive`;
  ctx.fillText(text, cW / 2, fY + footerHeight * cH * 0.5);
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

  const canvas = document.createElement("canvas");
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Load all captured frames
  const imgs = await Promise.all(opts.capturedFrames.map(loadImage));

  // Background
  drawBackground(ctx, cW, cH, opts.selectedBackground, theme, imgs[0]);

  // Draw each photo into its cell
  const usableH = cH * (1 - composition.footer);
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
    drawImageCover(ctx, img, cellX, cellY, cellW, cellH);
    ctx.restore();
  });

  // Stickers
  drawStickers(ctx, opts.stickers, cW, cH);

  // Footer (caption or date)
  const captionText = opts.caption || formatDateID();
  drawFooter(
    ctx,
    cW,
    cH,
    composition.footer,
    captionText,
    theme.text
  );

  // Encode
  const mime = quality.id === "ultra" ? "image/png" : "image/jpeg";
  const dataUrl =
    canvas.toDataURL(mime, mime === "image/jpeg" ? 0.92 : undefined);

  return {
    canvas,
    dataUrl,
    blob: null, // populated by exportCanvas if needed
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
