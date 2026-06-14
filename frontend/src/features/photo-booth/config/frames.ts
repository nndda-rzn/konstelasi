/**
 * Photo Booth - Frame style definitions for Result/Edit.
 *
 * A frame is a visual wrapper drawn around the base composed output.
 * Frames NEVER crop or transform the underlying image — they only add
 * border, padding, footer, decoration, and caption.
 */

export type FrameId =
  | "softDiary"
  | "classicStrip"
  | "cleanPrint"
  | "polaroid"
  | "constellation"
  | "filmFrame"
  | "borderless"
  | "vintageCream"
  | "magazine"
  | "wideCinema"
  | "minimalRedAccent"
  | "cuteHearts";

export interface FrameStyle {
  id: FrameId;
  name: string;
  /** Short tagline shown in tooltip / sub-label. */
  tagline: string;
  /** Background color of the frame surround (the area outside the image). */
  surroundColor: string;
  /** Outer border color, or "none". */
  borderColor: string;
  /** Outer border width in pixels (relative to 1000-wide output). */
  borderWidth: number;
  /** Inner padding (between border and image) in pixels (relative to 1000). */
  padding: number;
  /** Bottom-area reserved for polaroid-style caption. */
  captionArea: number;
  /** Special: if true, frame is minimal (no visible surround). */
  minimal?: boolean;
  /** A "preview descriptor" used to draw a small inline thumbnail marker. */
  decor: FrameDecor;
}

export type FrameDecor =
  | "star" // tiny star + date
  | "strip" // vertical strip with footer
  | "none" // clean
  | "polaroid" // thick bottom border
  | "constellation" // star dots + line
  | "film" // perforation dots
  | "vintage" // warm cream tone
  | "magazine" // editorial label
  | "cinema" // wide footer
  | "accent" // small red dot accent
  | "hearts"; // tiny hearts

export const FRAME_STYLES: FrameStyle[] = [
  {
    id: "softDiary",
    name: "Soft Diary",
    tagline: "Default Constella",
    surroundColor: "#F5EDE3",
    borderColor: "rgba(212, 165, 116, 0.35)",
    borderWidth: 1.2,
    padding: 18,
    captionArea: 28,
    decor: "star",
  },
  {
    id: "classicStrip",
    name: "Classic Strip",
    tagline: "Photo booth klasik",
    surroundColor: "#FAF8F5",
    borderColor: "rgba(0, 0, 0, 0.08)",
    borderWidth: 1,
    padding: 12,
    captionArea: 24,
    decor: "strip",
  },
  {
    id: "cleanPrint",
    name: "Clean Print",
    tagline: "Minimal, modern",
    surroundColor: "#FFFFFF",
    borderColor: "rgba(0, 0, 0, 0.04)",
    borderWidth: 0.6,
    padding: 8,
    captionArea: 0,
    decor: "none",
  },
  {
    id: "polaroid",
    name: "Polaroid",
    tagline: "Border bawah tebal",
    surroundColor: "#FFFCF7",
    borderColor: "rgba(0, 0, 0, 0.06)",
    borderWidth: 0.8,
    padding: 14,
    captionArea: 90, // large bottom for handwritten caption
    decor: "polaroid",
  },
  {
    id: "constellation",
    name: "Constellation",
    tagline: "Star dots & garis",
    surroundColor: "#F0E8E0",
    borderColor: "rgba(212, 165, 116, 0.3)",
    borderWidth: 1,
    padding: 16,
    captionArea: 20,
    decor: "constellation",
  },
  {
    id: "filmFrame",
    name: "Film Frame",
    tagline: "Perforation soft",
    surroundColor: "#1A1418", // dark but soft
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 0.8,
    padding: 22, // room for perf dots
    captionArea: 22,
    decor: "film",
  },
  {
    id: "borderless",
    name: "Borderless",
    tagline: "Foto lebih penuh",
    surroundColor: "#FFFFFF",
    borderColor: "none",
    borderWidth: 0,
    padding: 0,
    captionArea: 0,
    minimal: true,
    decor: "none",
  },
  {
    id: "vintageCream",
    name: "Vintage Cream",
    tagline: "Tone hangat klasik",
    surroundColor: "#EFE3CD",
    borderColor: "rgba(155, 122, 90, 0.2)",
    borderWidth: 0.8,
    padding: 14,
    captionArea: 22,
    decor: "vintage",
  },
  {
    id: "magazine",
    name: "Magazine",
    tagline: "Editorial print",
    surroundColor: "#F8F5F0",
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderWidth: 0.8,
    padding: 18,
    captionArea: 32,
    decor: "magazine",
  },
  {
    id: "wideCinema",
    name: "Wide Cinema",
    tagline: "Untuk 16:9 & 21:9",
    surroundColor: "#14101A",
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 0.6,
    padding: 16,
    captionArea: 36,
    decor: "cinema",
  },
  {
    id: "minimalRedAccent",
    name: "Red Accent",
    tagline: "Aksen merah halus",
    surroundColor: "#FFFFFF",
    borderColor: "rgba(230, 57, 70, 0.3)",
    borderWidth: 1.2,
    padding: 14,
    captionArea: 20,
    decor: "accent",
  },
  {
    id: "cuteHearts",
    name: "Cute Hearts",
    tagline: "Heart detail lembut",
    surroundColor: "#FCE4E8",
    borderColor: "rgba(230, 57, 70, 0.15)",
    borderWidth: 0.8,
    padding: 14,
    captionArea: 22,
    decor: "hearts",
  },
];

export const FRAME_MAP: Record<FrameId, FrameStyle> = FRAME_STYLES.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<FrameId, FrameStyle>
);

export const DEFAULT_FRAME_ID: FrameId = "softDiary";
