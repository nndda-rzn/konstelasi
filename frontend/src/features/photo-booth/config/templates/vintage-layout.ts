/**
 * Vintage Layout Template
 * Warm cream tone, editorial feel, good for sepia/warm filters.
 */
import type { TemplateConfig } from "./types";

export const vintageLayout: TemplateConfig = {
  id: "vintage-layout",
  name: "Vintage Layout",
  category: "vintage",
  supportedLayouts: ["strip4", "vintageStrip"],
  requiredShots: 4,
  tagline: "Tone hangat klasik",
  background: {
    type: "gradient",
    gradientAngle: 170,
    gradientStops: [
      { offset: 0, color: "#F5ECD7" },
      { offset: 1, color: "#E8D9BD" },
    ],
  },
  photoSlots: [
    { id: 0, x: 0.08, y: 0.05, w: 0.84, h: 0.19, radius: 3, fit: "smartCenter", stroke: { color: "rgba(155, 122, 90, 0.25)", width: 1 } },
    { id: 1, x: 0.08, y: 0.28, w: 0.84, h: 0.19, radius: 3, fit: "smartCenter", stroke: { color: "rgba(155, 122, 90, 0.25)", width: 1 } },
    { id: 2, x: 0.08, y: 0.51, w: 0.84, h: 0.19, radius: 3, fit: "smartCenter", stroke: { color: "rgba(155, 122, 90, 0.25)", width: 1 } },
    { id: 3, x: 0.08, y: 0.74, w: 0.84, h: 0.19, radius: 3, fit: "smartCenter", stroke: { color: "rgba(155, 122, 90, 0.25)", width: 1 } },
  ],
  overlays: [
    // Editorial corner marks (vintage feel)
    { id: "corner-tl", shape: "line", x: 0.04, y: 0.02, width: 5, height: 0, stroke: "rgba(155, 122, 90, 0.5)", strokeWidth: 0.5, opacity: 1 },
    { id: "corner-tr", shape: "line", x: 0.96, y: 0.02, width: 5, height: 0, stroke: "rgba(155, 122, 90, 0.5)", strokeWidth: 0.5, opacity: 1 },
    { id: "corner-bl", shape: "line", x: 0.04, y: 0.97, width: 5, height: 0, stroke: "rgba(155, 122, 90, 0.5)", strokeWidth: 0.5, opacity: 1 },
    { id: "corner-br", shape: "line", x: 0.96, y: 0.97, width: 5, height: 0, stroke: "rgba(155, 122, 90, 0.5)", strokeWidth: 0.5, opacity: 1 },
  ],
  textElements: [
    { id: "footer-brand", text: "CONSTELLA", x: 0.5, y: 0.96, fontSize: 8, fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontStyle: "italic", fill: "#9D7B3F", align: "center", hideable: true },
  ],
  defaultFilter: "sepia",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(155, 122, 90, 0.2)",
    borderWidth: 1,
    borderStyle: "medium",
    surroundColor: "#F5ECD7",
    showDate: true,
    showBrand: true,
    footerText: "CONSTELLA",
    footerColor: "#9D7B3F",
    footerFont: '"Brush Script MT", "Segoe Script", cursive',
  },
  footerHeight: 0.05,
};
