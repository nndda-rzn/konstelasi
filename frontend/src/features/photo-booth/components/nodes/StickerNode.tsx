"use client";

import { Text } from "react-konva";

interface StickerNodeProps {
  sticker: { id: string; emoji: string; x: number; y: number };
  stageWidth: number;
  stageHeight: number;
}

export function StickerNode({ sticker, stageWidth, stageHeight }: StickerNodeProps) {
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
