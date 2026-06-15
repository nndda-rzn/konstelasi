/**
 * Calculate linear gradient start point based on angle.
 * 0° = left→right, 90° = top→bottom, 180° = right→left, 270° = bottom→top
 */
export function getGradientStart(
  w: number,
  h: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const cx = w / 2;
  const cy = h / 2;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const length = Math.max(w, h) / 2;
  return { x: cx - dx * length, y: cy - dy * length };
}

export function getGradientEnd(
  w: number,
  h: number,
  angleDeg: number
): { x: number; y: number } {
  const start = getGradientStart(w, h, angleDeg);
  return {
    x: start.x + (w - start.x) * 2,
    y: start.y + (h - start.y) * 2,
  };
}
