/**
 * Canvas service - draw footer (caption/date) and brand mark.
 */

import { formatDateID } from "../../photoBooth.utils";

export function drawFooter(
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
 * Draw "Constella" brand signature in the footer.
 */
export function drawBrandMark(
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
