/**
 * Classic Layout Template
 * Clean, minimal strip 4 with Constella brand.
 */
import type { TemplateConfig } from "./types";

export const classicLayout: TemplateConfig = {
  id: "classic-layout",
  name: "Classic Layout",
  category: "classic",
  badge: "popular",
  supportedLayouts: ["strip4", "classicStrip"],
  requiredShots: 4,
  tagline: "Bersih, tak lekang waktu",
  background: {
    type: "solid",
    color: "#FFFCF8",
  },
  photoSlots: [
    { id: 0, x: 0.08, y: 0.04, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.06)", width: 1 } },
    { id: 1, x: 0.08, y: 0.27, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.06)", width: 1 } },
    { id: 2, x: 0.08, y: 0.50, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.06)", width: 1 } },
    { id: 3, x: 0.08, y: 0.73, w: 0.84, h: 0.20, radius: 4, fit: "smartCenter", stroke: { color: "rgba(0,0,0,0.06)", width: 1 } },
  ],
  overlays: [],
  textElements: [
    { id: "footer-brand", text: "Constella", x: 0.5, y: 0.965, fontSize: 9, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#5A3E4C", align: "center", hideable: true },
  ],
  defaultFilter: "normal",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(0,0,0,0.08)",
    borderWidth: 1,
    borderStyle: "thin",
    surroundColor: "#FFFCF8",
    showDate: true,
    showBrand: true,
    footerText: "Constella",
    footerColor: "#5A3E4C",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.05,
};
