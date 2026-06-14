/**
 * Holidays Layout Template
 * Festive soft cream with ribbon, stars, and small accents.
 */
import type { TemplateConfig } from "./types";

const STAR_PATH = "M 0 -3 L 0.6 -1 L 2.5 -0.8 L 0.6 -0.6 L 0 1.4 L -0.6 -0.6 L -2.5 -0.8 L -0.6 -1 Z";

export const holidaysLayout: TemplateConfig = {
  id: "holidays-layout",
  name: "Holidays",
  category: "holiday",
  badge: "holiday",
  supportedLayouts: ["strip4"],
  requiredShots: 4,
  tagline: "Seasonal festive",
  background: {
    type: "gradient",
    gradientAngle: 160,
    gradientStops: [
      { offset: 0, color: "#FBE7E0" },
      { offset: 1, color: "#F8D4D8" },
    ],
  },
  photoSlots: [
    { id: 0, x: 0.08, y: 0.05, w: 0.84, h: 0.19, radius: 4, fit: "smartCenter", stroke: { color: "#D8485C", width: 1 } },
    { id: 1, x: 0.08, y: 0.28, w: 0.84, h: 0.19, radius: 4, fit: "smartCenter", stroke: { color: "#D8485C", width: 1 } },
    { id: 2, x: 0.08, y: 0.51, w: 0.84, h: 0.19, radius: 4, fit: "smartCenter", stroke: { color: "#D8485C", width: 1 } },
    { id: 3, x: 0.08, y: 0.74, w: 0.84, h: 0.19, radius: 4, fit: "smartCenter", stroke: { color: "#D8485C", width: 1 } },
  ],
  overlays: [
    // Top ribbon
    { id: "ribbon-l", shape: "rect", x: 0.05, y: 0.01, width: 6, height: 1.2, fill: "#D8485C", opacity: 0.85 },
    { id: "ribbon-r", shape: "rect", x: 0.95, y: 0.01, width: 6, height: 1.2, fill: "#D8485C", opacity: 0.85 },
    { id: "ribbon-mid", shape: "rect", x: 0.45, y: 0.025, width: 10, height: 0.8, fill: "#9D2840", opacity: 0.9 },
    // Small stars
    { id: "star-1", shape: "star", x: 0.04, y: 0.94, width: 3, height: 3, fill: "#9D2840", opacity: 0.7 },
    { id: "star-2", shape: "star", x: 0.96, y: 0.94, width: 3, height: 3, fill: "#9D2840", opacity: 0.7 },
    { id: "star-3", shape: "star", x: 0.50, y: 0.245, width: 2.5, height: 2.5, fill: "#D8485C", opacity: 0.5 },
    { id: "star-4", shape: "star", x: 0.50, y: 0.475, width: 2, height: 2, fill: "#D8485C", opacity: 0.4 },
    { id: "star-5", shape: "star", x: 0.50, y: 0.705, width: 2.5, height: 2.5, fill: "#D8485C", opacity: 0.5 },
  ],
  textElements: [
    { id: "footer-brand", text: "Constella · holiday", x: 0.5, y: 0.965, fontSize: 8, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#9D2840", align: "center", hideable: true },
  ],
  defaultFilter: "normal",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(216, 72, 92, 0.3)",
    borderWidth: 1.5,
    borderStyle: "medium",
    surroundColor: "transparent",
    showDate: true,
    showBrand: true,
    footerText: "Constella · holiday",
    footerColor: "#9D2840",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.05,
};
