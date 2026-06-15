"use client";

import { Text } from "react-konva";
import type { TextElement } from "../../config/templates";

interface TextNodeProps {
  text: TextElement;
  stageWidth: number;
  stageHeight: number;
  caption: string;
}

export function TextNode({ text, stageWidth, stageHeight, caption }: TextNodeProps) {
  const x = text.x * stageWidth;
  const y = text.y * stageHeight;
  const w = (text.width ?? 1) * stageWidth;
  const fontSize = (text.fontSize / 1000) * stageWidth;
  const displayText =
    text.id === "caption" || text.text.toLowerCase() === "{caption}"
      ? caption || text.text
      : text.text;

  return (
    <Text
      x={x - w / 2}
      y={y - fontSize / 2}
      width={w}
      text={displayText}
      fontSize={fontSize}
      fontFamily={text.fontFamily}
      fontStyle={text.fontStyle}
      fill={text.fill}
      align={text.align || "center"}
      rotation={text.rotation ?? 0}
      listening={false}
    />
  );
}
