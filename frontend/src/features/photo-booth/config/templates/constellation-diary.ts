/**
 * Constellation Diary Template
 * The signature Constella template. Soft cream with constellation lines,
 * star dots, and date. Brand utama.
 */
import type { TemplateConfig } from "./types";

const STAR_PATH = "M 0 -3 L 0.6 -1 L 2.5 -0.8 L 0.6 -0.6 L 0 1.4 L -0.6 -0.6 L -2.5 -0.8 L -0.6 -1 Z";

export const constellationDiary: TemplateConfig = {
  id: "constellation-diary",
  name: "Constellation Diary",
  category: "constellation",
  badge: "recommended",
  supportedLayouts: ["single", "strip3", "strip4", "grid2x2", "grid3x2", "wide2", "cinematic3", "ultraWide", "classicStrip", "vintageStrip", "withLove", "hearts"],
  requiredShots: 1,
  tagline: "Tanda tangan Constella",
  background: {
    type: "solid",
    color: "#F5EDE3",
  },
  photoSlots: [
    { id: 0, x: 0.08, y: 0.04, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(212, 165, 116, 0.3)", width: 1 } },
    { id: 1, x: 0.08, y: 0.27, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(212, 165, 116, 0.3)", width: 1 } },
    { id: 2, x: 0.08, y: 0.50, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(212, 165, 116, 0.3)", width: 1 } },
    { id: 3, x: 0.08, y: 0.73, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(212, 165, 116, 0.3)", width: 1 } },
  ],
  overlays: [
    { id: "star-tl", shape: "star", x: 0.04, y: 0.025, width: 2, height: 2, fill: "#D4A574", opacity: 0.6 },
    { id: "star-tm", shape: "star", x: 0.20, y: 0.012, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.45 },
    { id: "star-tr", shape: "star", x: 0.94, y: 0.025, width: 2, height: 2, fill: "#D4A574", opacity: 0.6 },
    { id: "star-mr", shape: "star", x: 0.96, y: 0.245, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.4 },
    { id: "star-ml", shape: "star", x: 0.03, y: 0.245, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.4 },
    { id: "star-mr2", shape: "star", x: 0.96, y: 0.475, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.4 },
    { id: "star-ml2", shape: "star", x: 0.03, y: 0.475, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.4 },
    { id: "star-mr3", shape: "star", x: 0.96, y: 0.705, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.4 },
    { id: "star-ml3", shape: "star", x: 0.03, y: 0.705, width: 1.5, height: 1.5, fill: "#D4A574", opacity: 0.4 },
    // Constellation lines (subtle)
    { id: "line-1", shape: "line", x: 0.04, y: 0.025, width: 16, height: 0, stroke: "rgba(212, 165, 116, 0.25)", strokeWidth: 0.3, opacity: 0.5, rotation: 8 },
    { id: "line-2", shape: "line", x: 0.96, y: 0.025, width: 16, height: 0, stroke: "rgba(212, 165, 116, 0.25)", strokeWidth: 0.3, opacity: 0.5, rotation: -8 },
  ],
  textElements: [
    { id: "date", text: "14 jun 2026", x: 0.5, y: 0.945, fontSize: 8, fontFamily: '"Inter", sans-serif', fontStyle: "italic", fill: "#9D7B3F", align: "center", hideable: true },
    { id: "brand", text: "Constella", x: 0.5, y: 0.975, fontSize: 8, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#9D7B3F", align: "center", hideable: true },
  ],
  defaultFilter: "normal",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(212, 165, 116, 0.35)",
    borderWidth: 1,
    borderStyle: "thin",
    surroundColor: "#F5EDE3",
    showDate: true,
    showBrand: true,
    footerText: "Constella",
    footerColor: "#9D7B3F",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.05,
};
