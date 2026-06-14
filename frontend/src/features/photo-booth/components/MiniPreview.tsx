"use client";

import { type LayoutId } from "../photoBooth.config";
import { LAYOUT_DECORATIONS } from "../photoBooth.config";

/**
 * MiniPreview - Tiny SVG mock of a layout's photo arrangement.
 * Renders a stack of rounded rectangles according to the layout's
 * composition (strip, grid, wide, etc.). No images needed.
 */
export function MiniPreview({
  layoutId,
  className = "",
}: {
  layoutId: LayoutId;
  className?: string;
}) {
  const deco = LAYOUT_DECORATIONS[layoutId];

  switch (layoutId) {
    case "single":
      return (
        <PreviewBox className={className}>
          <Rect x={6} y={6} w={88} h={88} rx={4} fill="url(#g1)" />
        </PreviewBox>
      );
    case "strip3":
      return (
        <PreviewBox className={className}>
          <Rect x={20} y={6} w={60} h={26} rx={2} fill="url(#g1)" />
          <Rect x={20} y={37} w={60} h={26} rx={2} fill="url(#g2)" />
          <Rect x={20} y={68} w={60} h={26} rx={2} fill="url(#g3)" />
        </PreviewBox>
      );
    case "strip4":
      return (
        <PreviewBox className={className}>
          <Rect x={20} y={6} w={60} h={19} rx={2} fill="url(#g1)" />
          <Rect x={20} y={29} w={60} h={19} rx={2} fill="url(#g2)" />
          <Rect x={20} y={52} w={60} h={19} rx={2} fill="url(#g3)" />
          <Rect x={20} y={75} w={60} h={19} rx={2} fill="url(#g1)" />
        </PreviewBox>
      );
    case "grid2x2":
      return (
        <PreviewBox className={className}>
          <Rect x={20} y={6} w={29} h={42} rx={2} fill="url(#g1)" />
          <Rect x={51} y={6} w={29} h={42} rx={2} fill="url(#g2)" />
          <Rect x={20} y={52} w={29} h={42} rx={2} fill="url(#g3)" />
          <Rect x={51} y={52} w={29} h={42} rx={2} fill="url(#g1)" />
        </PreviewBox>
      );
    case "grid3x2":
      return (
        <PreviewBox className={className}>
          <Rect x={6} y={6} w={28} h={42} rx={2} fill="url(#g1)" />
          <Rect x={36} y={6} w={28} h={42} rx={2} fill="url(#g2)" />
          <Rect x={66} y={6} w={28} h={42} rx={2} fill="url(#g3)" />
          <Rect x={6} y={52} w={28} h={42} rx={2} fill="url(#g1)" />
          <Rect x={36} y={52} w={28} h={42} rx={2} fill="url(#g2)" />
          <Rect x={66} y={52} w={28} h={42} rx={2} fill="url(#g3)" />
        </PreviewBox>
      );
    case "wide2":
      return (
        <PreviewBox className={className}>
          <Rect x={6} y={14} w={42} h={72} rx={2} fill="url(#g1)" />
          <Rect x={52} y={14} w={42} h={72} rx={2} fill="url(#g2)" />
        </PreviewBox>
      );
    case "cinematic3":
      return (
        <PreviewBox className={className}>
          <Rect x={6} y={14} w={28} h={72} rx={2} fill="url(#g1)" />
          <Rect x={36} y={14} w={28} h={72} rx={2} fill="url(#g2)" />
          <Rect x={66} y={14} w={28} h={72} rx={2} fill="url(#g3)" />
        </PreviewBox>
      );
    case "ultraWide":
      return (
        <PreviewBox className={className}>
          <Rect x={6} y={6} w={42} h={42} rx={2} fill="url(#g1)" />
          <Rect x={52} y={6} w={42} h={42} rx={2} fill="url(#g2)" />
          <Rect x={6} y={52} w={42} h={42} rx={2} fill="url(#g3)" />
          <Rect x={52} y={52} w={42} h={42} rx={2} fill="url(#g1)" />
        </PreviewBox>
      );
    case "classicStrip":
      return (
        <PreviewBox className={className} border="thick">
          <Rect x={20} y={6} w={60} h={19} rx={1} fill="url(#g1)" />
          <Rect x={20} y={29} w={60} h={19} rx={1} fill="url(#g2)" />
          <Rect x={20} y={52} w={60} h={19} rx={1} fill="url(#g3)" />
          <Rect x={20} y={75} w={60} h={19} rx={1} fill="url(#g1)" />
        </PreviewBox>
      );
    case "vintageStrip":
      return (
        <PreviewBox className={className} border="rounded">
          <Rect x={20} y={6} w={60} h={19} rx={4 * deco.cellRadius * 10} fill="url(#g1)" />
          <Rect x={20} y={29} w={60} h={19} rx={4 * deco.cellRadius * 10} fill="url(#g2)" />
          <Rect x={20} y={52} w={60} h={19} rx={4 * deco.cellRadius * 10} fill="url(#g3)" />
          <Rect x={20} y={75} w={60} h={19} rx={4 * deco.cellRadius * 10} fill="url(#g1)" />
        </PreviewBox>
      );
    case "withLove":
      return (
        <PreviewBox className={className}>
          <Rect x={20} y={6} w={60} h={19} rx={2} fill="url(#g1)" />
          <Rect x={20} y={29} w={60} h={19} rx={2} fill="url(#g2)" />
          <Rect x={20} y={52} w={60} h={19} rx={2} fill="url(#g3)" />
          <Rect x={20} y={75} w={60} h={19} rx={2} fill="url(#g1)" />
          {/* Heart markers per cell */}
          <Heart x={24} y={9} />
          <Heart x={24} y={32} />
          <Heart x={24} y={55} />
          <Heart x={24} y={78} />
        </PreviewBox>
      );
    case "hearts":
      return (
        <PreviewBox className={className} border="rounded">
          <Rect x={20} y={6} w={60} h={19} rx={3} fill="url(#g1)" />
          <Rect x={20} y={29} w={60} h={19} rx={3} fill="url(#g2)" />
          <Rect x={20} y={52} w={60} h={19} rx={3} fill="url(#g3)" />
          <Rect x={20} y={75} w={60} h={19} rx={3} fill="url(#g1)" />
          {/* Heart border outline */}
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
        </PreviewBox>
      );
    default:
      return null;
  }
}

function PreviewBox({
  children,
  className = "",
  border,
}: {
  children: React.ReactNode;
  className?: string;
  border?: "thick" | "rounded";
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`h-full w-full ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE5E8" />
          <stop offset="1" stopColor="#FFB8C0" />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5ECD7" />
          <stop offset="1" stopColor="#E8D4B0" />
        </linearGradient>
        <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EDE7F6" />
          <stop offset="1" stopColor="#B9A6D6" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx={border === "rounded" ? "8" : "4"}
        fill={border === "thick" ? "#FAF8F5" : "transparent"}
        stroke={border === "thick" ? "#E8E0DC" : "transparent"}
        strokeWidth={border === "thick" ? "1.5" : "0"}
      />
      {children}
    </svg>
  );
}

function Rect({
  x,
  y,
  w,
  h,
  rx,
  fill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  fill: string;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />;
}

function Heart({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.05)`} fill="#E63946" opacity="0.7">
      <path d="M100 50 C100 22 78 0 50 0 C22 0 0 22 0 50 C0 88 50 100 50 100 C50 100 100 88 100 50 Z" />
    </g>
  );
}
