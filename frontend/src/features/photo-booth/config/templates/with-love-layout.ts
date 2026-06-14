/**
 * With Love Layout Template
 * Pink romantic, pearl + heart + "with love" footer.
 */
import type { TemplateConfig } from "./types";

const HEART_PATH = "M 0 -2 C -0.6 -3.5 -3 -3.5 -3 -1 C -3 1 0 3.5 0 5 C 0 3.5 3 1 3 -1 C 3 -3.5 0.6 -3.5 0 -2 Z";

export const withLoveLayout: TemplateConfig = {
  id: "with-love-layout",
  name: "With Love",
  category: "love",
  badge: "template",
  supportedLayouts: ["strip4", "withLove"],
  requiredShots: 4,
  tagline: "Romantis & personal",
  background: {
    type: "gradient",
    gradientAngle: 180,
    gradientStops: [
      { offset: 0, color: "#FFE4EA" },
      { offset: 1, color: "#FFD0DA" },
    ],
  },
  photoSlots: [
    { id: 0, x: 0.08, y: 0.05, w: 0.84, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#FFFFFF", width: 1.5 } },
    { id: 1, x: 0.08, y: 0.27, w: 0.84, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#FFFFFF", width: 1.5 } },
    { id: 2, x: 0.08, y: 0.49, w: 0.84, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#FFFFFF", width: 1.5 } },
    { id: 3, x: 0.08, y: 0.71, w: 0.84, h: 0.18, radius: 8, mask: "rounded", fit: "smartCenter", stroke: { color: "#FFFFFF", width: 1.5 } },
  ],
  overlays: [
    // Pearl-like circles
    { id: "pearl-1", shape: "circle", x: 0.05, y: 0.05, width: 2, height: 2, fill: "#FFFFFF", opacity: 0.7 },
    { id: "pearl-2", shape: "circle", x: 0.95, y: 0.05, width: 2, height: 2, fill: "#FFFFFF", opacity: 0.7 },
    { id: "pearl-3", shape: "circle", x: 0.05, y: 0.93, width: 2, height: 2, fill: "#FFFFFF", opacity: 0.6 },
    { id: "pearl-4", shape: "circle", x: 0.95, y: 0.93, width: 2, height: 2, fill: "#FFFFFF", opacity: 0.6 },
    // Heart accent
    { id: "heart-accent", shape: "heart", x: 0.92, y: 0.04, width: 5, height: 5, fill: "#E8919C", opacity: 0.8 },
  ],
  textElements: [
    { id: "with-love", text: "with love", x: 0.5, y: 0.93, fontSize: 14, fontFamily: '"Brush Script MT", "Segoe Script", cursive', fontStyle: "italic", fill: "#9D4E5C", align: "center", hideable: true },
    { id: "footer-brand", text: "Constella", x: 0.5, y: 0.975, fontSize: 7, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#9D4E5C", align: "center", hideable: true },
  ],
  defaultFilter: "warm",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(232, 148, 156, 0.3)",
    borderWidth: 1,
    borderStyle: "medium",
    surroundColor: "transparent",
    showDate: false,
    showBrand: true,
    footerText: "with love",
    footerColor: "#9D4E5C",
    footerFont: '"Brush Script MT", "Segoe Script", cursive',
  },
  footerHeight: 0.06,
};
