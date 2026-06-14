/**
 * Cinema Strip Template
 * Horizontal/wide template for 16:9 and 21:9 formats.
 */
import type { TemplateConfig } from "./types";

export const cinemaStrip: TemplateConfig = {
  id: "cinema-strip",
  name: "Cinema Strip",
  category: "cinematic",
  badge: "template",
  supportedLayouts: ["wide2", "cinematic3", "ultraWide"],
  requiredShots: 2,
  tagline: "Untuk format lebar",
  background: {
    type: "gradient",
    gradientAngle: 90,
    gradientStops: [
      { offset: 0, color: "#14101A" },
      { offset: 1, color: "#1A1418" },
    ],
  },
  photoSlots: [
    // Wide 2 layout (default for ultraWide ratio)
    { id: 0, x: 0.04, y: 0.05, w: 0.44, h: 0.80, fit: "smartCenter", stroke: { color: "rgba(255,255,255,0.08)", width: 1 } },
    { id: 1, x: 0.52, y: 0.05, w: 0.44, h: 0.80, fit: "smartCenter", stroke: { color: "rgba(255,255,255,0.08)", width: 1 } },
  ],
  overlays: [],
  textElements: [
    { id: "footer-brand", text: "Constella · cinema", x: 0.5, y: 0.94, fontSize: 8, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "rgba(255,255,255,0.6)", align: "center", hideable: true },
  ],
  defaultFilter: "normal",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(255,255,255,0.05)",
    borderWidth: 0.6,
    borderStyle: "thin",
    surroundColor: "transparent",
    showDate: false,
    showBrand: true,
    footerText: "Constella · cinema",
    footerColor: "rgba(255,255,255,0.6)",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.08,
};
