/**
 * Photo Booth general utilities.
 */

import type { RatioId, LayoutId } from "./photoBooth.config";

/** Compose a deterministic file name for a photobooth output. */
export function buildOutputFilename(
  ratioId: RatioId,
  layoutId: LayoutId,
  ts: number = Date.now()
): string {
  return `constella-photobooth-${layoutId}-${ratioId}-${ts}.png`;
}

/** Format today's date in Indonesian for the footer caption. */
export function formatDateID(d: Date = new Date()): string {
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Create a small uid without external deps. */
export function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Convert a dataURL to a Blob (returns null on parse failure). */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob | null> {
  try {
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch {
    return null;
  }
}

/** Load an image from a dataURL with a typed promise. */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
