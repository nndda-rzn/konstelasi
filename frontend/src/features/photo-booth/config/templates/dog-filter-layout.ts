/**
 * Dog Filter Layout Template
 * Playful with original Constella-branded ear/paw decorative overlays.
 */
import type { TemplateConfig } from "./types";

export const dogFilterLayout: TemplateConfig = {
  id: "dog-filter-layout",
  name: "Puppy Play",
  category: "cute",
  badge: "try_it",
  supportedLayouts: ["strip4"],
  requiredShots: 4,
  tagline: "Playful & lembut",
  background: {
    type: "solid",
    color: "#FFF6E8",
  },
  photoSlots: [
    { id: 0, x: 0.10, y: 0.06, w: 0.80, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C8A0", width: 1.2 } },
    { id: 1, x: 0.10, y: 0.28, w: 0.80, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C8A0", width: 1.2 } },
    { id: 2, x: 0.10, y: 0.50, w: 0.80, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C8A0", width: 1.2 } },
    { id: 3, x: 0.10, y: 0.72, w: 0.80, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C8A0", width: 1.2 } },
  ],
  overlays: [
    // Original "ear" decor (Constella design, not copied)
    { id: "ear-left", shape: "circle", x: 0.08, y: 0.025, width: 10, height: 10, fill: "#B8895A", opacity: 0.5 },
    { id: "ear-right", shape: "circle", x: 0.92, y: 0.025, width: 10, height: 10, fill: "#B8895A", opacity: 0.5 },
    // "Paw" decor (Constella-branded original)
    { id: "paw-1", shape: "circle", x: 0.10, y: 0.96, width: 3, height: 3, fill: "#B8895A", opacity: 0.5 },
    { id: "paw-2", shape: "circle", x: 0.20, y: 0.965, width: 2, height: 2, fill: "#B8895A", opacity: 0.4 },
    { id: "paw-3", shape: "circle", x: 0.30, y: 0.97, width: 2, height: 2, fill: "#B8895A", opacity: 0.4 },
    { id: "paw-4", shape: "circle", x: 0.78, y: 0.965, width: 2, height: 2, fill: "#B8895A", opacity: 0.4 },
    { id: "paw-5", shape: "circle", x: 0.88, y: 0.97, width: 2, height: 2, fill: "#B8895A", opacity: 0.4 },
  ],
  textElements: [
    { id: "footer-brand", text: "Constella", x: 0.5, y: 0.97, fontSize: 9, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#9D7B3F", align: "center", hideable: true },
  ],
  defaultFilter: "warm",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(184, 137, 90, 0.3)",
    borderWidth: 1.2,
    borderStyle: "medium",
    surroundColor: "#FFF6E8",
    showDate: true,
    showBrand: true,
    footerText: "Constella",
    footerColor: "#9D7B3F",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.05,
};
