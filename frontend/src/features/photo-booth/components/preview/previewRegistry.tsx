import type { LayoutId } from "../../photoBooth.config";
import { LAYOUT_DECORATIONS, type LayoutDecoration } from "../../photoBooth.config";
import { Rect } from "./Rect";
import { Heart } from "./Heart";
import { PreviewBox } from "./PreviewBox";

type PreviewRenderer = (deco: LayoutDecoration) => React.ReactNode;

/**
 * previewRegistry - Maps LayoutId to a renderer that returns the
 * preview children (rects + hearts + custom marks). The outer
 * PreviewBox wrapping is handled by MiniPreview.
 */
const REGISTRY: Record<LayoutId, PreviewRenderer> = {
  single: () => <Rect x={6} y={6} w={88} h={88} rx={4} fill="url(#g1)" />,

  strip3: () => (
    <>
      <Rect x={20} y={6} w={60} h={26} rx={2} fill="url(#g1)" />
      <Rect x={20} y={37} w={60} h={26} rx={2} fill="url(#g2)" />
      <Rect x={20} y={68} w={60} h={26} rx={2} fill="url(#g3)" />
    </>
  ),

  strip4: () => (
    <>
      <Rect x={20} y={6} w={60} h={19} rx={2} fill="url(#g1)" />
      <Rect x={20} y={29} w={60} h={19} rx={2} fill="url(#g2)" />
      <Rect x={20} y={52} w={60} h={19} rx={2} fill="url(#g3)" />
      <Rect x={20} y={75} w={60} h={19} rx={2} fill="url(#g1)" />
    </>
  ),

  grid2x2: () => (
    <>
      <Rect x={20} y={6} w={29} h={42} rx={2} fill="url(#g1)" />
      <Rect x={51} y={6} w={29} h={42} rx={2} fill="url(#g2)" />
      <Rect x={20} y={52} w={29} h={42} rx={2} fill="url(#g3)" />
      <Rect x={51} y={52} w={29} h={42} rx={2} fill="url(#g1)" />
    </>
  ),

  grid3x2: () => (
    <>
      <Rect x={6} y={6} w={28} h={42} rx={2} fill="url(#g1)" />
      <Rect x={36} y={6} w={28} h={42} rx={2} fill="url(#g2)" />
      <Rect x={66} y={6} w={28} h={42} rx={2} fill="url(#g3)" />
      <Rect x={6} y={52} w={28} h={42} rx={2} fill="url(#g1)" />
      <Rect x={36} y={52} w={28} h={42} rx={2} fill="url(#g2)" />
      <Rect x={66} y={52} w={28} h={42} rx={2} fill="url(#g3)" />
    </>
  ),

  wide2: () => (
    <>
      <Rect x={6} y={14} w={42} h={72} rx={2} fill="url(#g1)" />
      <Rect x={52} y={14} w={42} h={72} rx={2} fill="url(#g2)" />
    </>
  ),

  cinematic3: () => (
    <>
      <Rect x={6} y={14} w={28} h={72} rx={2} fill="url(#g1)" />
      <Rect x={36} y={14} w={28} h={72} rx={2} fill="url(#g2)" />
      <Rect x={66} y={14} w={28} h={72} rx={2} fill="url(#g3)" />
    </>
  ),

  ultraWide: () => (
    <>
      <Rect x={6} y={6} w={42} h={42} rx={2} fill="url(#g1)" />
      <Rect x={52} y={6} w={42} h={42} rx={2} fill="url(#g2)" />
      <Rect x={6} y={52} w={42} h={42} rx={2} fill="url(#g3)" />
      <Rect x={52} y={52} w={42} h={42} rx={2} fill="url(#g1)" />
    </>
  ),

  classicStrip: () => (
    <>
      <Rect x={20} y={6} w={60} h={19} rx={1} fill="url(#g1)" />
      <Rect x={20} y={29} w={60} h={19} rx={1} fill="url(#g2)" />
      <Rect x={20} y={52} w={60} h={19} rx={1} fill="url(#g3)" />
      <Rect x={20} y={75} w={60} h={19} rx={1} fill="url(#g1)" />
    </>
  ),

  vintageStrip: (deco) => {
    const rx = 4 * deco.cellRadius * 10;
    return (
      <>
        <Rect x={20} y={6} w={60} h={19} rx={rx} fill="url(#g1)" />
        <Rect x={20} y={29} w={60} h={19} rx={rx} fill="url(#g2)" />
        <Rect x={20} y={52} w={60} h={19} rx={rx} fill="url(#g3)" />
        <Rect x={20} y={75} w={60} h={19} rx={rx} fill="url(#g1)" />
      </>
    );
  },

  withLove: () => (
    <>
      <Rect x={20} y={6} w={60} h={19} rx={2} fill="url(#g1)" />
      <Rect x={20} y={29} w={60} h={19} rx={2} fill="url(#g2)" />
      <Rect x={20} y={52} w={60} h={19} rx={2} fill="url(#g3)" />
      <Rect x={20} y={75} w={60} h={19} rx={2} fill="url(#g1)" />
      <Heart x={24} y={9} />
      <Heart x={24} y={32} />
      <Heart x={24} y={55} />
      <Heart x={24} y={78} />
    </>
  ),

  hearts: () => (
    <>
      <Rect x={20} y={6} w={60} h={19} rx={3} fill="url(#g1)" />
      <Rect x={20} y={29} w={60} h={19} rx={3} fill="url(#g2)" />
      <Rect x={20} y={52} w={60} h={19} rx={3} fill="url(#g3)" />
      <Rect x={20} y={75} w={60} h={19} rx={3} fill="url(#g1)" />
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="8"
        ry="8"
        fill="none"
        stroke="#E63946"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
    </>
  ),
};

/**
 * Render the children for a given layout's preview. Returns null
 * for unknown layout IDs.
 */
export function renderPreviewChildren(
  layoutId: LayoutId,
  deco: LayoutDecoration
): React.ReactNode {
  return REGISTRY[layoutId]?.(deco) ?? null;
}

/**
 * Return the PreviewBox border variant for a given layout, or
 * undefined for no border styling.
 */
export function getPreviewBorder(
  layoutId: LayoutId
): "thick" | "rounded" | undefined {
  if (layoutId === "classicStrip") return "thick";
  if (layoutId === "vintageStrip" || layoutId === "hearts") return "rounded";
  return undefined;
}
