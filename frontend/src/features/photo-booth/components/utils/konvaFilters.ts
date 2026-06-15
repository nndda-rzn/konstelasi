import Konva from "konva";

/**
 * Convert CSS filter string to Konva filter function.
 * Konva supports: Brighten, Contrast, Grayscale, Invert, Sepia, Noise, Pixelate.
 */
export function getKonvaFilter(cssFilter: string) {
  if (cssFilter.includes("grayscale")) return Konva.Filters.Grayscale;
  if (cssFilter.includes("sepia")) return Konva.Filters.Sepia;
  if (cssFilter.includes("invert")) return Konva.Filters.Invert;
  if (cssFilter.includes("brightness")) return Konva.Filters.Brighten;
  if (cssFilter.includes("contrast")) return Konva.Filters.Contrast;
  if (cssFilter.includes("noise")) return Konva.Filters.Noise;
  if (cssFilter.includes("pixelate")) return Konva.Filters.Pixelate;
  return Konva.Filters.Grayscale;
}
