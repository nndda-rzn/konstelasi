/**
 * resizeImage
 *
 * Optional pica-based high-quality resize for thumbnails or down-sampled
 * previews. Falls back to native canvas if pica is not available.
 */

import { Pica } from "pica";

let picaInstance: Pica | null = null;
function getPica(): Pica | null {
  if (typeof window === "undefined") return null;
  if (!picaInstance) {
    try {
      picaInstance = new Pica();
    } catch {
      picaInstance = null;
    }
  }
  return picaInstance;
}

/**
 * Resize a source image (HTMLImageElement or HTMLCanvasElement) to the
 * target dimensions using pica for high-quality downscale. Returns a
 * canvas. Falls back to native canvas if pica is unavailable.
 */
export async function resizeImage(
  source: HTMLImageElement | HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): Promise<HTMLCanvasElement> {
  const target = document.createElement("canvas");
  target.width = targetWidth;
  target.height = targetHeight;

  const pica = getPica();
  if (pica) {
    try {
      await pica.resize(source, target, {
        quality: 2,
      } as unknown as Parameters<typeof pica.resize>[2]);
      return target;
    } catch {
      // fall through to native
    }
  }
  const ctx = target.getContext("2d");
  if (!ctx) return target;
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
  return target;
}

/**
 * Resize a dataURL string to the target dimensions and return a new
 * dataURL (image/jpeg by default).
 */
export async function resizeDataUrl(
  dataUrl: string,
  targetWidth: number,
  targetHeight: number,
  mime: "image/png" | "image/jpeg" = "image/jpeg",
  quality = 0.9
): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = (e) => reject(e);
    i.src = dataUrl;
  });
  const canvas = await resizeImage(img, targetWidth, targetHeight);
  return canvas.toDataURL(mime, mime === "image/jpeg" ? quality : undefined);
}
