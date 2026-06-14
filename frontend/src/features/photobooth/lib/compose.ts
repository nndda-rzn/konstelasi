"use client";

import {
  PHOTO_RATIOS,
  LAYOUT_GEOMETRY,
  FILTERS,
  STRIP_COLORS,
  QUALITIES,
  BACKGROUNDS,
  ZOOM_LEVELS,
  type FilterKey,
  type LayoutKey,
  type QualityKey,
  type BackgroundKey,
  type StickerItem,
  type PhotoRatio,
  type ZoomKey,
} from "../constants";

export interface ComposeOptions {
  /** Captured frames, already aspect-corrected by captureFrameFromVideo. */
  capturedFrames: string[];
  selectedLayout: LayoutKey;
  selectedRatio: PhotoRatio;
  caption: string;
  filter: FilterKey;
  selectedBackground: BackgroundKey;
  selectedStripColor: string;
  selectedEffect: "off" | "soft" | "warm";
  zoomLevelKey: ZoomKey;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function todayLabel(): string {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Center-crop an image so it covers the target cell with object-cover
 * behavior. Returns the source crop rectangle to be passed to
 * ctx.drawImage with 9 arguments.
 */
function computeCoverCrop(
  img: HTMLImageElement,
  cellW: number,
  cellH: number
): { sx: number; sy: number; sw: number; sh: number } {
  const cellAspect = cellW / cellH;
  const imgAspect = img.width / img.height;
  if (imgAspect > cellAspect) {
    const sw = img.height * cellAspect;
    return { sx: (img.width - sw) / 2, sy: 0, sw, sh: img.height };
  }
  const sh = img.width / cellAspect;
  return { sx: 0, sy: (img.height - sh) / 2, sw: img.width, sh };
}

/**
 * applyFilter - Build the canvas filter string from the active filter
 * and the effect tri-state. Returns "" when no filter is needed.
 */
function buildFilterString(
  filter: FilterKey,
  selectedEffect: ComposeOptions["selectedEffect"],
  zoomScale: number
): string {
  const f = FILTERS.find((x) => x.key === filter);
  const parts: string[] = [];
  if (f && f.canvas !== "none") parts.push(f.canvas);

  if (selectedEffect === "warm") {
    parts.push("saturate(140%) hue-rotate(10deg) brightness(1.05)");
  } else if (selectedEffect === "soft") {
    parts.push("blur(0.5px) saturate(1.1) brightness(1.04) contrast(0.98)");
  }

  if (zoomScale > 1) {
    // Zoom-in levels crop more from center; this is handled by
    // computeCoverCrop below. No extra filter string required.
  }

  return parts.join(" ");
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bgKey: BackgroundKey,
  fallbackColor: string,
  imgs: HTMLImageElement[]
) {
  if (bgKey === "cream") {
    ctx.fillStyle = "#FFF5E8";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (bgKey === "gradient") {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#FFE5E8");
    g.addColorStop(0.5, "#FFB8C0");
    g.addColorStop(1, "#FFE5E8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  if (bgKey === "softBlur" && imgs.length > 0) {
    ctx.save();
    ctx.filter = "blur(50px) saturate(1.15)";
    ctx.drawImage(imgs[0], -w * 0.1, -h * 0.1, w * 1.2, h * 1.2);
    ctx.restore();
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fillRect(0, 0, w, h);
    return;
  }
  // "none" and any unknown key fall back to the strip color.
  ctx.fillStyle = fallbackColor;
  ctx.fillRect(0, 0, w, h);
}

function drawStickers(
  ctx: CanvasRenderingContext2D,
  stickers: StickerItem[],
  cW: number,
  cH: number
) {
  // Size the sticker emoji relative to canvas height; ~3% of height.
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

/**
 * composePhotoBoothOutput - Single source of truth for the final output.
 * Reads selectedRatio (output dimensions) and selectedLayout (cell
 * arrangement) from PHOTO_RATIOS and LAYOUT_GEOMETRY, then composes
 * all captured frames into a single canvas. Result is a dataURL
 * (image/jpeg or image/png for ultra) used by preview, download, and
 * save without re-rendering.
 */
export async function composePhotoBoothOutput(
  opts: ComposeOptions
): Promise<string> {
  const ratio = opts.selectedRatio;
  const geometry = LAYOUT_GEOMETRY[opts.selectedLayout];
  const quality = QUALITIES.find((q) => q.key === opts.selectedQuality) || QUALITIES[0];
  const cW = Math.round(ratio.outputWidth * quality.scale);
  const cH = Math.round(ratio.outputHeight * quality.scale);
  const zoom = ZOOM_LEVELS.find((z) => z.key === opts.zoomLevelKey) || ZOOM_LEVELS[2];
  const stripColor =
    STRIP_COLORS.find((c) => c.key === opts.selectedStripColor) || STRIP_COLORS[0];

  const canvas = document.createElement("canvas");
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // 1. Load all captured frames
  const imgs = await Promise.all(opts.capturedFrames.map(loadImg));

  // 2. Background
  drawBackground(ctx, cW, cH, opts.selectedBackground, stripColor.bg, imgs);

  // 3. Draw each photo into its cell with object-cover and active filter
  const filterStr = buildFilterString(opts.filter, opts.selectedEffect, zoom.scale);

  opts.capturedFrames.forEach((_, i) => {
    const img = imgs[i];
    if (!img) return;
    const cell = geometry.cells[i];
    if (!cell) return;
    const cellX = cell.x * cW;
    const cellY = cell.y * cH * (1 - geometry.footer);
    const cellW = cell.w * cW;
    const cellH = cell.h * cH * (1 - geometry.footer);

    const crop = computeCoverCrop(img, cellW, cellH);

    ctx.save();
    if (filterStr) ctx.filter = filterStr;
    ctx.drawImage(
      img,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      cellX,
      cellY,
      cellW,
      cellH
    );
    ctx.restore();
  });

  // 4. Stickers (positioned as % of full canvas, regardless of cells)
  drawStickers(ctx, opts.capturedFrames.length > 0 ? [] : [], cW, cH);

  // 5. Footer (caption or date)
  const captionText = opts.caption || todayLabel();
  drawFooter(ctx, cW, cH, geometry.footer, captionText, stripColor.text);

  const mime = quality.key === "ultra" ? "image/png" : "image/jpeg";
  const qualityArg = mime === "image/jpeg" ? 0.92 : undefined;
  return canvas.toDataURL(mime, qualityArg);
}

/**
 * Helper to fetch a PhotoRatio by key.
 */
export function getPhotoRatioByKey(
  key: keyof typeof PHOTO_RATIOS
): PhotoRatio {
  return PHOTO_RATIOS[key];
}
