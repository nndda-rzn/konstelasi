/**
 * Hearts Layout Template
 * Soft pink with heart accents between photos.
 */
import type { TemplateConfig } from "./types";

const HEART_PATH = "M 0 -2 C -0.6 -3.5 -3 -3.5 -3 -1 C -3 1 0 3.5 0 5 C 0 3.5 3 1 3 -1 C 3 -3.5 0.6 -3.5 0 -2 Z";

export const heartsLayout: TemplateConfig = {
  id: "hearts-layout",
  name: "Hearts Layout",
  category: "love",
  badge: "template",
  supportedLayouts: ["strip4", "withLove", "hearts"],
  requiredShots: 4,
  tagline: "Sentuhan heart lembut",
  background: {
    type: "solid",
    color: "#FFF0F3",
  },
  photoSlots: [
    { id: 0, x: 0.08, y: 0.04, w: 0.84, h: 0.19, radius: 6, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C4CC", width: 1 } },
    { id: 1, x: 0.08, y: 0.27, w: 0.84, h: 0.19, radius: 6, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C4CC", width: 1 } },
    { id: 2, x: 0.08, y: 0.50, w: 0.84, h: 0.19, radius: 6, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C4CC", width: 1 } },
    { id: 3, x: 0.08, y: 0.73, w: 0.84, h: 0.19, radius: 6, mask: "rounded", fit: "smartCenter", stroke: { color: "#E8C4CC", width: 1 } },
  ],
  overlays: [
    // Hearts between photos
    { id: "heart-1", shape: "heart", x: 0.50, y: 0.245, width: 5, height: 5, fill: "#E8919C", opacity: 0.7 },
    { id: "heart-2", shape: "heart", x: 0.50, y: 0.475, width: 4, height: 4, fill: "#F5A6B0", opacity: 0.6 },
    { id: "heart-3", shape: "heart", x: 0.50, y: 0.705, width: 5, height: 5, fill: "#E8919C", opacity: 0.7 },
    // Corner hearts
    { id: "heart-tl", shape: "heart", x: 0.03, y: 0.02, width: 6, height: 6, fill: "#E8919C", opacity: 0.5 },
    { id: "heart-br", shape: "heart", x: 0.94, y: 0.95, width: 6, height: 6, fill: "#F5A6B0", opacity: 0.4 },
  ],
  textElements: [
    { id: "footer-brand", text: "Constella", x: 0.5, y: 0.97, fontSize: 9, fontFamily: "Inter, system-ui", fontStyle: "bold", fill: "#B87A85", align: "center", hideable: true },
  ],
  defaultFilter: "warm",
  frame: {
    hasOwnFrame: true,
    borderColor: "rgba(232, 148, 156, 0.3)",
    borderWidth: 1.2,
    borderStyle: "medium",
    surroundColor: "#FFF0F3",
    showDate: true,
    showBrand: true,
    footerText: "Constella",
    footerColor: "#B87A85",
    footerFont: "Inter, system-ui",
  },
  footerHeight: 0.05,
};
