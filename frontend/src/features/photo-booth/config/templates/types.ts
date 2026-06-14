/**
 * Photo Booth - Custom Template Layout type system.
 *
 * A Template is a full design recipe for the final photobooth output:
 * background, photo slot positions, decorative overlays, text elements,
 * fit modes, and masks. Templates are CONSTELLLA-branded original
 * designs (not copies of any external reference).
 *
 * Pipeline:
 *   1. Capture → raw capturedFrames (no composition)
 *   2. Template renderer → Konva stage draws each photo into its
 *      Template-defined slot using the slot's fit mode
 *   3. Export = Konva stage.toDataURL() (preview = download = save)
 */

export type TemplateId =
  | "classic-layout"
  | "vintage-layout"
  | "hearts-layout"
  | "with-love-layout"
  | "solace-layout"
  | "dog-filter-layout"
  | "holidays-layout"
  | "constellation-diary"
  | "magazine-layout"
  | "cinema-strip";

export type TemplateCategory =
  | "classic"
  | "cute"
  | "vintage"
  | "love"
  | "holiday"
  | "cinematic"
  | "constellation"
  | "minimal"
  | "editorial";

export type BadgeType =
  | "new"
  | "try_it"
  | "holiday"
  | "template"
  | "popular"
  | "recommended";

export type FitMode = "cover" | "contain" | "smartCenter";

export type MaskType =
  | "rectangle"
  | "rounded"
  | "heart"
  | "circle"
  | "filmFrame"
  | "none";

export type BorderStyle = "thin" | "medium" | "thick" | "none";

export interface PhotoSlot {
  /** Index into capturedFrames (0-based). */
  id: number;
  /** Normalized 0..1 canvas position. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius in px (relative to 1000-wide canvas). */
  radius?: number;
  /** Optional mask shape for the photo. */
  mask?: MaskType;
  /** How the photo fits inside the slot. */
  fit: FitMode;
  /** Optional stroke around the photo. */
  stroke?: { color: string; width: number };
  /** Optional rotation in degrees. */
  rotation?: number;
}

export interface TextElement {
  id: string;
  text: string;
  /** Normalized 0..1 canvas position. */
  x: number;
  y: number;
  /** Optional width (0..1 fraction). Defaults to 1. */
  width?: number;
  /** Font size relative to 1000-wide canvas. */
  fontSize: number;
  fontFamily: string;
  fontStyle?: "normal" | "italic" | "bold";
  fill: string;
  align?: "left" | "center" | "right";
  rotation?: number;
  /** True for date/brand lines that may be hidden by the user. */
  hideable?: boolean;
}

export type OverlayShape = "rect" | "circle" | "line" | "heart" | "star";

export interface OverlayElement {
  id: string;
  shape: OverlayShape;
  /** Normalized 0..1 canvas position (center). */
  x: number;
  y: number;
  /** Width/height in px (relative to 1000-wide canvas). */
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity: number;
  /** Rotation in degrees. */
  rotation?: number;
}

export interface TemplateBackground {
  type: "solid" | "gradient";
  /** Solid color. */
  color?: string;
  /** Linear gradient stops (used when type = "gradient"). */
  gradientStops?: { offset: number; color: string }[];
  /** Gradient angle in degrees. */
  gradientAngle?: number;
}

export interface TemplateFrameStyle {
  /** Whether the template defines its own border/styling. */
  hasOwnFrame: boolean;
  /** Inner border color (or "none"). */
  borderColor: string;
  /** Border thickness in px (relative to 1000-wide canvas). */
  borderWidth: number;
  /** Surround color outside the photo area. */
  surroundColor: string;
  /** Optional border style (thin/medium/thick/none). */
  borderStyle?: BorderStyle;
  /** Whether to show the date in the footer. */
  showDate: boolean;
  /** Whether to show the brand mark in the footer. */
  showBrand: boolean;
  /** Default footer text. */
  footerText: string;
  /** Default footer text color. */
  footerColor: string;
  /** Default footer font family. */
  footerFont: string;
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  badge?: BadgeType;
  /** Layout IDs this template supports. */
  supportedLayouts: string[];
  /** Ratio IDs this template supports (empty = all). */
  supportedRatios?: string[];
  /** Minimum captured photos required. */
  requiredShots: number;
  /** Short tagline shown in tooltip. */
  tagline: string;
  /** Background recipe. */
  background: TemplateBackground;
  /** Photo slot positions. */
  photoSlots: PhotoSlot[];
  /** Decorative overlay elements (drawn on top of photos). */
  overlays: OverlayElement[];
  /** Text elements (caption, title, date, brand, footer). */
  textElements: TextElement[];
  /** Default filter applied when this template is selected. */
  defaultFilter?: string;
  /** Frame style recipe. */
  frame: TemplateFrameStyle;
  /** Footer area height as fraction of canvas (0 = no footer). */
  footerHeight: number;
}
