/**
 * Photobooth canvas rendering utilities.
 * Pure functions that compose photos into final layouts.
 * Supported features: Dynamic Ratios, Quality levels, Background modes, Beauty filter.
 */

import { 
  FILTERS, 
  STRIP_COLORS, 
  RATIOS,
  QUALITIES,
  BACKGROUNDS,
  type FilterKey, 
  type StickerItem, 
  type RatioKey, 
  type QualityKey, 
  type BackgroundKey, 
  type ZoomKey,
  ZOOM_LEVELS
} from './constants';

interface RenderOptions {
  photos: string[];
  filter: FilterKey;
  colorKey: string;
  ratio: RatioKey;
  quality: QualityKey;
  background: BackgroundKey;
  stickers: StickerItem[];
  caption: string;
  zoomScale: number;
  isBeautyEnabled: boolean;
}

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

/**
 * Computes base dimensions based on quality and ratio.
 */
function getCanvasSize(ratioKey: RatioKey, qualityKey: QualityKey) {
  const r = RATIOS.find(x => x.key === ratioKey) || RATIOS[0];
  const q = QUALITIES.find(x => x.key === qualityKey) || QUALITIES[0];
  
  // Base size for 1:1 is 1080. For wider/taller, we scale accordingly.
  const BASE = 1080 * q.scale;
  
  let w = BASE;
  let h = BASE;
  
  if (r.w > r.h) {
    h = BASE * (r.h / r.w);
  } else if (r.h > r.w) {
    w = BASE * (r.w / r.h);
  }
  
  return { w, h, ratio: r };
}

/**
 * Applies background layer (none/cream/gradient/blur).
 */
async function applyBackground(
  ctx: CanvasRenderingContext2D, 
  w: number, 
  h: number, 
  bgKey: BackgroundKey, 
  colorBg: string,
  imgs: HTMLImageElement[]
) {
  if (bgKey === 'none') {
    ctx.fillStyle = colorBg;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  
  if (bgKey === 'cream') {
    ctx.fillStyle = '#FFF5E8';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  
  if (bgKey === 'gradient') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#FFE5E8');
    g.addColorStop(0.5, '#FFB8C0');
    g.addColorStop(1, '#FFE5E8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    return;
  }
  
  if (bgKey === 'softBlur' && imgs.length > 0) {
    ctx.save();
    ctx.filter = 'blur(40px) saturate(1.2)';
    // Draw first image scaled up as background
    ctx.drawImage(imgs[0], -w * 0.1, -h * 0.1, w * 1.2, h * 1.2);
    ctx.restore();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, w, h);
  }
}

/**
 * Computes source crop rectangle based on zoom.
 */
function getSourceCrop(img: HTMLImageElement, zoomScale: number) {
  // Source is 1920x1920 (square).
  // If zoomScale > 1, we crop a smaller center area.
  // If zoomScale < 1, we still take the full source (max info).
  const scale = Math.max(zoomScale, 1);
  const sw = img.width / scale;
  const sh = img.height / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  return { sx, sy, sw, sh };
}

export async function renderSingle(opts: RenderOptions): Promise<string> {
  const { w, h } = getCanvasSize(opts.ratio, opts.quality);
  const PAD = w * 0.05;
  const FOOT = h * 0.12;
  const iW = w - PAD * 2;
  const iH = h - PAD * 2 - FOOT;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const img = await loadImg(opts.photos[0]);
  const color = STRIP_COLORS.find(c => c.key === opts.colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find(x => x.key === opts.filter)!;

  await applyBackground(ctx, w, h, opts.background, color.bg, [img]);

  const { sx, sy, sw, sh } = getSourceCrop(img, opts.zoomScale);
  
  if (f.canvas !== 'none') ctx.filter = f.canvas;
  if (opts.isBeautyEnabled) ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 'blur(0.5px) saturate(1.1) brightness(1.04)';
  
  ctx.drawImage(img, sx, sy, sw, sh, PAD, PAD, iW, iH);
  ctx.filter = 'none';

  const d = opts.caption || todayLabel();
  ctx.fillStyle = color.text;
  ctx.font = `${Math.floor(w * 0.025)}px "Segoe Script","Lucida Handwriting",cursive`;
  ctx.textAlign = 'center';
  ctx.fillText(d, w / 2, h - FOOT / 2);

  drawStickers(ctx, opts.stickers, w, h);
  return canvas.toDataURL(opts.quality === 'ultra' ? 'image/png' : 'image/jpeg', 0.92);
}

export async function renderStrip(opts: RenderOptions): Promise<string> {
  const { w: baseW, h: baseH } = getCanvasSize(opts.ratio, opts.quality);
  const photos = opts.photos;
  const n = photos.length;
  
  const PAD = baseW * 0.05;
  const GAP = baseW * 0.02;
  const FOOT = baseH * 0.1;
  
  const cW = baseW;
  const iW = cW - PAD * 2;
  const iH = (baseH - PAD * 2 - FOOT - GAP * (n - 1)) / n;
  const cH = baseH;

  const canvas = document.createElement('canvas');
  canvas.width = cW;
  canvas.height = cH;
  const ctx = canvas.getContext('2d')!;

  const imgs = await Promise.all(photos.map(loadImg));
  const color = STRIP_COLORS.find(c => c.key === opts.colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find(x => x.key === opts.filter)!;

  await applyBackground(ctx, cW, cH, opts.background, color.bg, imgs);

  imgs.forEach((img, i) => {
    const { sx, sy, sw, sh } = getSourceCrop(img, opts.zoomScale);
    if (f.canvas !== 'none') ctx.filter = f.canvas;
    if (opts.isBeautyEnabled) ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 'blur(0.5px) saturate(1.1) brightness(1.04)';
    
    ctx.drawImage(img, sx, sy, sw, sh, PAD, PAD + i * (iH + GAP), iW, iH);
    ctx.filter = 'none';
  });

  const d = opts.caption || todayLabel();
  ctx.fillStyle = color.text;
  ctx.font = `bold ${Math.floor(cW * 0.02)}px "Segoe Script","Lucida Handwriting",cursive`;
  ctx.textAlign = 'center';
  ctx.fillText('Konstelasi', cW / 2, cH - FOOT / 2 - 8);
  ctx.font = `${Math.floor(cW * 0.015)}px "Segoe Script","Lucida Handwriting",cursive`;
  ctx.fillText(d, cW / 2, cH - FOOT / 2 + 12);

  drawStickers(ctx, opts.stickers, cW, cH);
  return canvas.toDataURL(opts.quality === 'ultra' ? 'image/png' : 'image/jpeg', 0.92);
}

export async function renderGrid(opts: RenderOptions, cols: number): Promise<string> {
  const { w, h } = getCanvasSize(opts.ratio, opts.quality);
  const photos = opts.photos;
  const rows = Math.ceil(photos.length / cols);
  
  const PAD = w * 0.04;
  const GAP = w * 0.02;
  const FOOT = h * 0.08;
  
  const iW = (w - PAD * 2 - GAP * (cols - 1)) / cols;
  const iH = (h - PAD * 2 - FOOT - GAP * (rows - 1)) / rows;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const imgs = await Promise.all(photos.map(loadImg));
  const color = STRIP_COLORS.find(c => c.key === opts.colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find(x => x.key === opts.filter)!;

  await applyBackground(ctx, w, h, opts.background, color.bg, imgs);

  imgs.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const { sx, sy, sw, sh } = getSourceCrop(img, opts.zoomScale);
    
    const dx = PAD + col * (iW + GAP);
    const dy = PAD + row * (iH + GAP);

    if (f.canvas !== 'none') ctx.filter = f.canvas;
    if (opts.isBeautyEnabled) ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 'blur(0.5px) saturate(1.1) brightness(1.04)';
    
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, iW, iH);
    ctx.filter = 'none';
  });

  const d = opts.caption || todayLabel();
  ctx.fillStyle = color.text;
  ctx.font = `bold ${Math.floor(w * 0.018)}px "Segoe Script","Lucida Handwriting",cursive`;
  ctx.textAlign = 'center';
  ctx.fillText('Konstelasi  •  ' + d, w / 2, h - FOOT / 2 + 4);

  drawStickers(ctx, opts.stickers, w, h);
  return canvas.toDataURL(opts.quality === 'ultra' ? 'image/png' : 'image/jpeg', 0.92);
}

export async function renderWide(opts: RenderOptions, mode: '2' | '3' | '4'): Promise<string> {
  const { w, h } = getCanvasSize(opts.ratio, opts.quality);
  const photos = opts.photos;
  
  const PAD = w * 0.04;
  const GAP = w * 0.02;
  const FOOT = h * 0.1;
  
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const imgs = await Promise.all(photos.map(loadImg));
  const color = STRIP_COLORS.find(c => c.key === opts.colorKey) || STRIP_COLORS[0];
  const f = FILTERS.find(x => x.key === opts.filter)!;

  await applyBackground(ctx, w, h, opts.background, color.bg, imgs);

  if (mode === '2') {
    const iW = (w - PAD * 2 - GAP) / 2;
    const iH = h - PAD * 2 - FOOT;
    imgs.forEach((img, i) => {
      const { sx, sy, sw, sh } = getSourceCrop(img, opts.zoomScale);
      if (f.canvas !== 'none') ctx.filter = f.canvas;
      if (opts.isBeautyEnabled) ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 'blur(0.5px) saturate(1.1) brightness(1.04)';
      ctx.drawImage(img, sx, sy, sw, sh, PAD + i * (iW + GAP), PAD, iW, iH);
      ctx.filter = 'none';
    });
  } else if (mode === '3') {
    const iW = (w - PAD * 2 - GAP * 2) / 3;
    const iH = h - PAD * 2 - FOOT;
    imgs.forEach((img, i) => {
      const { sx, sy, sw, sh } = getSourceCrop(img, opts.zoomScale);
      if (f.canvas !== 'none') ctx.filter = f.canvas;
      if (opts.isBeautyEnabled) ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 'blur(0.5px) saturate(1.1) brightness(1.04)';
      ctx.drawImage(img, sx, sy, sw, sh, PAD + i * (iW + GAP), PAD, iW, iH);
      ctx.filter = 'none';
    });
  } else { // 2x2 wide
    const iW = (w - PAD * 2 - GAP) / 2;
    const iH = (h - PAD * 2 - FOOT - GAP) / 2;
    imgs.forEach((img, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const { sx, sy, sw, sh } = getSourceCrop(img, opts.zoomScale);
      if (f.canvas !== 'none') ctx.filter = f.canvas;
      if (opts.isBeautyEnabled) ctx.filter = (ctx.filter === 'none' ? '' : ctx.filter + ' ') + 'blur(0.5px) saturate(1.1) brightness(1.04)';
      ctx.drawImage(img, sx, sy, sw, sh, PAD + col * (iW + GAP), PAD + row * (iH + GAP), iW, iH);
      ctx.filter = 'none';
    });
  }

  const d = opts.caption || todayLabel();
  ctx.fillStyle = color.text;
  ctx.font = `bold ${Math.floor(w * 0.015)}px "Segoe Script","Lucida Handwriting",cursive`;
  ctx.textAlign = 'center';
  ctx.fillText('Konstelasi  •  ' + d, w / 2, h - FOOT / 2 + 6);

  drawStickers(ctx, opts.stickers, w, h);
  return canvas.toDataURL(opts.quality === 'ultra' ? 'image/png' : 'image/jpeg', 0.92);
}
