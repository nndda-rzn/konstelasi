/**
 * Canvas service - composePhotoBoothOutput orchestrator.
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
  PHOTO_QUALITIES,
  PHOTO_THEMES,
  type RatioId,
  type LayoutId,
} from "../../photoBooth.config";
import type { ComposeOptions, ComposeResult } from "../../photoBooth.types";
import { loadImage, formatDateID } from "../../photoBooth.utils";
import { buildFilterString } from "./build-filter";
import { drawBackground } from "./draw-background";
import { drawCells, roundedRectPath } from "./draw-cells";
import { drawStickers } from "./draw-stickers";
import { drawFooter, drawBrandMark } from "./draw-footer";
import { drawCellHearts, drawHeartBorder } from "./draw-decorations";

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
  drawCells(ctx, imgs, composition, cW, cH, filterStr, cellRadius);

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
