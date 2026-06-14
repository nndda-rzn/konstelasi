/**
 * Canvas service - draw background onto canvas.
 */

import type { BackgroundId, PhotoTheme } from "../../photoBooth.config";

export function drawBackground(
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
