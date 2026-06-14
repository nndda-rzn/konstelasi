/**
 * Magazine Layout Template
 * Editorial print look with title, date, caption. Grid 2x2 or Cinematic 3.
 */
import type { TemplateConfig } from "./types";

export const magazineLayout: TemplateConfig = {
  id: "magazine-layout",
  name: "Magazine",
  category: "editorial",
  supportedLayouts: ["grid2x2", "cinematic3"],
  requiredShots: 4,
  tagline: "Editorial print look",
  background: {
    type: "solid",
    color: "#F8F5F0",
  },
  photoSlots: [
    // Grid 2x2 (default); Cinematic 3 supported by template logic
    { id: 0, x: 0.06, y: 0.08, w: 0.40, h: 0.36, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.12)", width: 0.8 } },
    { id: 1, x: 0.54, y: 0.08, w: 0.40, h: 0.36, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.12)", width: 0.8 } },
    { id: 2, x: 0.06, y: 0.48, w: 0.40, h: 0.36, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.12)", width: 0.8 } },
    { id: 3, x: 0.54, y: 0.48, w: 0.40, h: 0.36, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.12)", width: 0.8 } },
  ],
  overlays: [
    // Thin rule lines (editorial)
    { id: "rule-top", shape: "line", x: 0.06, y: 0.06, width: 88, height: 0, stroke: "rgba(0,0,0,0.15)", strokeWidth: 0.4, opacity: 0.6 },
    { id: "rule-mid", shape: "line", x: 0.06, y: 0.46, width: 88, height: 0, stroke: "rgba(0,0,0,0.1)", strokeWidth: 0.3, opacity: 0.5 },
    { id: "rule-bot", shape: "line", x: 0.06, y: 0.86, width: 88, height: 0, stroke: "rgba(0,0,0,0.15)", strokeWidth: 0.4, opacity: 0.6 },
  ],
  textElements: [
    { id: "title", text: "Constella", x: 0.06, y: 0.03, fontSize: 11, fontFamily: '"Georgia", serif', fontStyle: "bold", fill: "#1A1418", align: "left", width: 0.5, hideable: true },
    { id: "issue", text: "ISSUE 01", x: 0.94, y: 0.03, fontSize: 7, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#5A3E4C", align: "right", width: 0.3, hideable: true },
    { id: "date", text: "14 jun 2026", x: 0.50, y: 0.94, fontSize: 8, fontFamily: '"Georgia", serif', fontStyle: "italic", fill: "#5A3E4C", align: "center", width: 0.4, hideable: true },
    { id: "footer-brand", text: "CONSTELLA STUDIO", x: 0.50, y: 0.97, fontSize: 6, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#5A3E4C", align: "center", width: 0.4, hideable: true },
  ],
  defaultFilter: "normal",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(0,0,0,0.12)",
    borderWidth: 0.8,
    borderStyle: "thin",
    surroundColor: "#F8F5F0",
    showDate: true,
    showBrand: true,
    footerText: "Constella",
    footerColor: "#5A3E4C",
    footerFont: '"Georgia", serif',
  },
  footerHeight: 0.06,
};
