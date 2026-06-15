"use client";

import { Rect, Circle, Line, Path } from "react-konva";
import { heartPathData, starPathData } from "../utils/paths";
import type { OverlayElement } from "../../config/templates";

interface OverlayNodeProps {
  overlay: OverlayElement;
  stageWidth: number;
  stageHeight: number;
}

export function OverlayNode({ overlay, stageWidth, stageHeight }: OverlayNodeProps) {
  const x = overlay.x * stageWidth;
  const y = overlay.y * stageHeight;
  const w = (overlay.width ?? 5) * (stageWidth / 1000);
  const h = (overlay.height ?? 5) * (stageWidth / 1000);
  const rotation = overlay.rotation ?? 0;
  const strokeW = (overlay.strokeWidth ?? 0.5) * (stageWidth / 1000);

  if (overlay.shape === "rect" && overlay.fill) {
    return (
      <Rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rotation={rotation}
        opacity={overlay.opacity}
        fill={overlay.fill}
        listening={false}
      />
    );
  }
  if (overlay.shape === "circle" && overlay.fill) {
    return (
      <Circle
        x={x}
        y={y}
        radius={Math.max(w, h) / 2}
        rotation={rotation}
        opacity={overlay.opacity}
        fill={overlay.fill}
        listening={false}
      />
    );
  }
  if (overlay.shape === "line" && overlay.stroke) {
    return (
      <Line
        x={x - w / 2}
        y={y}
        points={[0, 0, w, 0]}
        stroke={overlay.stroke}
        strokeWidth={strokeW}
        rotation={rotation}
        opacity={overlay.opacity}
        listening={false}
      />
    );
  }
  if (overlay.shape === "heart" && overlay.fill) {
    return (
      <Path
        x={x - w / 2}
        y={y - h / 2}
        data={heartPathData(w, h)}
        fill={overlay.fill}
        rotation={rotation}
        opacity={overlay.opacity}
        listening={false}
      />
    );
  }
  if (overlay.shape === "star" && overlay.fill) {
    return (
      <Path
        x={x - w / 2}
        y={y - h / 2}
        data={starPathData(w, h)}
        fill={overlay.fill}
        rotation={rotation}
        opacity={overlay.opacity}
        listening={false}
      />
    );
  }
  return null;
}
