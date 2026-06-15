/**
 * Check if a hex surround color is dark enough to require light
 * caption text. Uses standard luminance formula (0.299R + 0.587G + 0.114B).
 */
export function isDarkSurround(color: string): boolean {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
