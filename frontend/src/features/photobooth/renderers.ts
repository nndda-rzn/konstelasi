/**
 * Photobooth canvas rendering utilities.
 * Pure functions that compose photos into final layouts (single, strip, grid).
 */

import { FILTERS, STRIP_COLORS, type FilterKey, type StickerItem } from './constants';

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((r) => {
    const i = new Image();
    i.onload = () => r(i);
    i.src = src;
  });
}

function drawStickers(
  ctx: CanvasRenderingContext2D,
  stickers: StickerItem[],
  cW: number,
  cH: number
) {
  stickers.forEach((s) => {
    ctx.font = '64px serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.emoji, (s.x / 100) * cW, (s.y / 100) * cH);
  });
}

function todayLabel() {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function renderSingle(
  src: string,
  filter: FilterKey,
  stickers: StickerItem[],
  caption: string
): Promise<string> {
  const S = 1080,
    P = 54,
    B = 160;
  const cW = S + P * 2,
    cH = S + P * 2 + B;
  const canvas = document.createElement('canvas');
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFAF7';
  ctx.fillRect(0, 0, cW, cH);
  const img = await loadImg(src);
  const f = FILTERS.find((x) => x.key === filter)!;
  if (f.canvas !== 'none') ctx.filter = f.canvas;
  ctx.drawImage(img, P, P, S, S);
  ctx.filter = 'none';
  const d = caption || todayLabel();
  ctx.fillStyle = '#5A3E4C';
  ctx.font = '24px "Segoe Script","Lucida Handwriting",cursive';
  ctx.textAlign = 'center';
  ctx.fillText(d, cW / 2, S + P + 68);
  drawStickers(ctx, stickers, cW, cH);
  return canvas.toDataURL('image/png');
}

export async function renderStrip(
  photos: string[],
  filter: FilterKey,
  colorKey: string,
  stickers: StickerItem[],
  caption: string
): Promise<string> {
  const W = 800,
    H = 800,
    PAD = 40,
    GAP = 18,
    FOOT = 110;
  const cW = W + PAD * 2;
  const cH = H * photos.length + GAP * (photos.length - 1) + PAD * 2 + FOOT;
  const color = STRIP_COLORS.find((c) => c.key === colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find((x) => x.key === filter)!;
  const canvas = document.createElement('canvas');
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color.bg;
  ctx.fillRect(0, 0, cW, cH);
  const imgs = await Promise.all(photos.map(loadImg));
  imgs.forEach((img, i) => {
    if (f.canvas !== 'none') ctx.filter = f.canvas;
    ctx.drawImage(img, PAD, PAD + i * (H + GAP), W, H);
    ctx.filter = 'none';
  });
  const d = caption || todayLabel();
  ctx.fillStyle = color.text;
  ctx.font = 'bold 16px "Segoe Script","Lucida Handwriting",cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Konstelasi', cW / 2, cH - FOOT / 2 - 6);
  ctx.font = '12px "Segoe Script","Lucida Handwriting",cursive';
  ctx.fillText(d, cW / 2, cH - FOOT / 2 + 16);
  drawStickers(ctx, stickers, cW, cH);
  return canvas.toDataURL('image/png');
}

export async function renderGrid(
  photos: string[],
  filter: FilterKey,
  colorKey: string,
  cols: number,
  stickers: StickerItem[],
  caption: string
): Promise<string> {
  const CELL = 540,
    PAD = 36,
    GAP = 14,
    FOOT = 100;
  const rows = Math.ceil(photos.length / cols);
  const cW = CELL * cols + GAP * (cols - 1) + PAD * 2;
  const cH = CELL * rows + GAP * (rows - 1) + PAD * 2 + FOOT;
  const color = STRIP_COLORS.find((c) => c.key === colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find((x) => x.key === filter)!;
  const canvas = document.createElement('canvas');
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color.bg;
  ctx.fillRect(0, 0, cW, cH);
  const imgs = await Promise.all(photos.map(loadImg));
  imgs.forEach((img, i) => {
    const col = i % cols,
      row = Math.floor(i / cols);
    const x = PAD + col * (CELL + GAP),
      y = PAD + row * (CELL + GAP);
    if (f.canvas !== 'none') ctx.filter = f.canvas;
    ctx.drawImage(img, x, y, CELL, CELL);
    ctx.filter = 'none';
  });
  const d = caption || todayLabel();
  ctx.fillStyle = color.text;
  ctx.font = 'bold 16px "Segoe Script","Lucida Handwriting",cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Konstelasi  •  ' + d, cW / 2, cH - FOOT / 2 + 4);
  drawStickers(ctx, stickers, cW, cH);
  return canvas.toDataURL('image/png');
}
