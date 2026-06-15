"use client";

import { Rect, Text, Group } from "react-konva";
import type { Sticker } from "../../photoBooth.types";

/**
 * StickerNodeLegacy - Renders an emoji sticker (legacy mode).
 */
export function StickerNodeLegacy({
  sticker,
  stageWidth,
  stageHeight,
}: {
  sticker: Sticker;
  stageWidth: number;
  stageHeight: number;
}) {
  const x = (sticker.x / 100) * stageWidth;
  const y = (sticker.y / 100) * stageHeight;
  const fontSize = Math.max(28, stageWidth * 0.04);
  return (
    <Text
      x={x - fontSize}
      y={y - fontSize * 0.6}
      text={sticker.emoji}
      fontSize={fontSize * 1.6}
      fontFamily='"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", serif'
      listening={false}
    />
  );
}

/**
 * StarDecor - Small filled star used for star + constellation decor.
 */
export function StarDecor({ x, y, size }: { x: number; y: number; size: number }) {
  const path =
    `M ${x} ${y - size} L ${x + size * 0.3} ${y - size * 0.3} L ${x + size} ${y} ` +
    `L ${x + size * 0.3} ${y + size * 0.3} L ${x} ${y + size} L ${x - size * 0.3} ${y + size * 0.3} ` +
    `L ${x - size} ${y} L ${x - size * 0.3} ${y - size * 0.3} Z`;
  return (
    <Group>
      <Rect
        x={0}
        y={0}
        width={0}
        height={0}
        fill="#D4A574"
        sceneFunc={(context, shape) => {
          const p = new Path2D(path);
          context.fillStyle = "#D4A574";
          context.fill(p);
          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
}

/**
 * FilmPerforationDecor - Film-strip perforation dots on both vertical edges.
 */
export function FilmPerforationDecor({
  stageWidth,
  stageHeight,
}: {
  stageWidth: number;
  stageHeight: number;
}) {
  const dotSize = Math.max(3, stageWidth * 0.005);
  const margin = Math.max(8, stageWidth * 0.012);
  const count = Math.floor((stageHeight - margin * 2) / (dotSize * 2.5));
  const dots: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    dots.push({
      x: margin,
      y: margin + (i * (stageHeight - margin * 2)) / count,
    });
    dots.push({
      x: stageWidth - margin,
      y: margin + (i * (stageHeight - margin * 2)) / count,
    });
  }
  return (
    <Group>
      {dots.map((d, i) => (
        <Rect
          key={i}
          x={d.x}
          y={d.y}
          width={dotSize}
          height={dotSize}
          fill="rgba(255,255,255,0.18)"
          cornerRadius={0.5}
        />
      ))}
    </Group>
  );
}

/**
 * HeartsDecor - Two hearts (top-left and bottom-right).
 */
export function HeartsDecor({
  stageWidth,
  stageHeight,
}: {
  stageWidth: number;
  stageHeight: number;
}) {
  const size = Math.max(8, stageWidth * 0.012);
  const margin = Math.max(12, stageWidth * 0.018);
  return (
    <Group>
      <Rect
        x={margin}
        y={margin}
        width={0}
        height={0}
        fill="#E8919C"
        opacity={0.7}
        sceneFunc={(context, shape) => {
          const cx = margin + size / 2;
          const cy = margin + size / 2;
          context.beginPath();
          context.moveTo(cx, margin + size);
          context.bezierCurveTo(margin, margin + size * 0.6, margin, margin + size * 0.2, cx, margin + size * 0.4);
          context.bezierCurveTo(margin + size, margin + size * 0.2, margin + size, margin + size * 0.6, cx, margin + size);
          context.closePath();
          context.fillStyle = "#E8919C";
          context.fill();
          context.fillStrokeShape(shape);
        }}
      />
      <Rect
        x={stageWidth - margin - size}
        y={stageHeight - margin - size}
        width={0}
        height={0}
        fill="#E8919C"
        opacity={0.7}
        sceneFunc={(context, shape) => {
          const cx = stageWidth - margin - size + size / 2;
          const cy = stageHeight - margin - size + size / 2;
          context.beginPath();
          context.moveTo(cx, stageHeight - margin);
          context.bezierCurveTo(
            stageWidth - margin - size,
            stageHeight - margin - size * 0.4,
            stageWidth - margin - size,
            stageHeight - margin - size * 0.8,
            cx,
            stageHeight - margin - size * 0.6
          );
          context.bezierCurveTo(
            stageWidth - margin,
            stageHeight - margin - size * 0.8,
            stageWidth - margin,
            stageHeight - margin - size * 0.4,
            cx,
            stageHeight - margin
          );
          context.closePath();
          context.fillStyle = "#E8919C";
          context.fill();
          context.fillStrokeShape(shape);
        }}
      />
    </Group>
  );
}
