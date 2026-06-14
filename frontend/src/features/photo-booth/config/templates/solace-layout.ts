/**
 * Solace Layout Template
 * Editorial mood, maroon/dusty rose, mature and cinematic.
 */
import type { TemplateConfig } from "./types";

export const solaceLayout: TemplateConfig = {
  id: "solace-layout",
  name: "Solace Layout",
  category: "editorial",
  badge: "new",
  supportedLayouts: ["strip4", "cinematic3"],
  requiredShots: 4,
  tagline: "Mature & sinematik",
  background: {
    type: "gradient",
    gradientAngle: 175,
    gradientStops: [
      { offset: 0, color: "#3D1F2A" },
      { offset: 1, color: "#5A2C3A" },
    ],
  },
  photoSlots: [
    { id: 0, x: 0.06, y: 0.04, w: 0.88, h: 0.18, radius: 2, fit: "smartCenter", stroke: { color: "rgba(232, 196, 188, 0.3)", width: 1 } },
    { id: 1, x: 0.06, y: 0.25, w: 0.88, h: 0.18, radius: 2, fit: "smartCenter", stroke: { color: "rgba(232, 196, 188, 0.3)", width: 1 } },
    { id: 2, x: 0.06, y: 0.46, w: 0.88, h: 0.18, radius: 2, fit: "smartCenter", stroke: { color: "rgba(232, 196, 188, 0.3)", width: 1 } },
    { id: 3, x: 0.06, y: 0.67, w: 0.88, h: 0.18, radius: 2, fit: "smartCenter", stroke: { color: "rgba(232, 196, 188, 0.3)", width: 1 } },
  ],
  overlays: [],
  textElements: [
    // Editorial quote at top
    { id: "quote-top", text: "· small moments, kept ·", x: 0.5, y: 0.93, fontSize: 9, fontFamily: '"Georgia", serif', fontStyle: "italic", fill: "#E8C4BC", align: "center", width: 0.6, hideable: true },
    { id: "footer-brand", text: "CONSTELLA", x: 0.5, y: 0.965, fontSize: 7, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#E8C4BC", align: "center", hideable: true },
  ],
  defaultFilter: "sepia",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(232, 196, 188, 0.2)",
    borderWidth: 0.8,
    borderStyle: "thin",
    surroundColor: "transparent",
    showDate: false,
    showBrand: true,
    footerText: "CONSTELLA",
    footerColor: "#E8C4BC",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.08,
};
