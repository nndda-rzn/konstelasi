"use client";

import { Rect } from "react-konva";
import type { TemplateConfig } from "../../config/templates";

interface FrameBorderLayerProps {
  template: TemplateConfig;
  stageWidth: number;
  stageHeight: number;
}

export function FrameBorderLayer({ template, stageWidth, stageHeight }: FrameBorderLayerProps) {
  if (!template.frame.hasOwnFrame) return null;
  if (template.frame.borderColor === "none" || template.frame.borderWidth <= 0) return null;

  return (
    <Rect
      x={template.frame.borderWidth / 2}
      y={template.frame.borderWidth / 2}
      width={stageWidth - template.frame.borderWidth}
      height={stageHeight - template.frame.borderWidth}
      stroke={template.frame.borderColor}
      strokeWidth={template.frame.borderWidth}
      fill="transparent"
      listening={false}
    />
  );
}
