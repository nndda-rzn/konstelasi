"use client";

import { Rect } from "react-konva";
import { getGradientStart, getGradientEnd } from "../utils/gradient";
import type { TemplateConfig } from "../../config/templates";

interface BackgroundLayerProps {
  template: TemplateConfig;
  stageWidth: number;
  stageHeight: number;
}

export function BackgroundLayer({ template, stageWidth, stageHeight }: BackgroundLayerProps) {
  const bgStops = template.background.gradientStops;

  if (template.background.type === "solid") {
    return (
      <Rect
        x={0}
        y={0}
        width={stageWidth}
        height={stageHeight}
        fill={template.background.color || "#FFFFFF"}
        listening={false}
      />
    );
  }

  if (bgStops) {
    return (
      <Rect
        x={0}
        y={0}
        width={stageWidth}
        height={stageHeight}
        fillLinearGradientStartPoint={getGradientStart(
          stageWidth,
          stageHeight,
          template.background.gradientAngle ?? 180
        )}
        fillLinearGradientEndPoint={getGradientEnd(
          stageWidth,
          stageHeight,
          template.background.gradientAngle ?? 180
        )}
        fillLinearGradientColorStops={bgStops.flatMap((s) => [s.offset, s.color])}
        listening={false}
      />
    );
  }

  return null;
}
