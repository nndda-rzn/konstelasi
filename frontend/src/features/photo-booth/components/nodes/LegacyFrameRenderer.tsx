"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Line,
  Circle,
} from "react-konva";
import type Konva from "konva";
import { usePhotoBoothStore } from "../../photoBoothStore";
import { FRAME_MAP } from "../../config/frames";
import type { KonvaResultPreviewHandle } from "../KonvaTemplateRenderer";
import {
  StickerNodeLegacy,
  StarDecor,
  FilmPerforationDecor,
  HeartsDecor,
} from "./LegacyDecor";

interface LegacyFrameRendererProps {
  displayWidth?: number;
  maxHeight?: number;
}

/**
 * LegacyFrameRenderer - Single composed image + frame + sticker mode.
 * Preserved for backward compatibility (used when no template is selected).
 */
export const LegacyFrameRenderer = forwardRef<
  KonvaResultPreviewHandle,
  LegacyFrameRendererProps
>(({ displayWidth = 720, maxHeight = 640 }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);

  const composed = usePhotoBoothStore((s) => s.composed);
  const processing = usePhotoBoothStore((s) => s.processing);
  const selectedFrame = usePhotoBoothStore((s) => s.selectedFrame);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const caption = usePhotoBoothStore((s) => s.caption);

  const frame = FRAME_MAP[selectedFrame];

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!composed?.dataUrl) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = composed.dataUrl;
  }, [composed?.dataUrl]);

  const aspect =
    composed && composed.width && composed.height
      ? composed.width / composed.height
      : 1;
  const stageWidth = composed?.width || Math.round(displayWidth);
  const stageHeight = composed?.height || Math.round(displayWidth / aspect);

  const paddingPx = frame ? (frame.padding / 1000) * stageWidth : 0;
  const captionPx = frame ? (frame.captionArea / 1000) * stageWidth : 0;
  const borderWidthPx = frame ? (frame.borderWidth / 1000) * stageWidth : 0;

  const innerX = paddingPx;
  const innerY = paddingPx;
  const innerW = Math.max(0, stageWidth - paddingPx * 2);
  const innerH = Math.max(0, stageHeight - paddingPx * 2 - captionPx);

  useImperativeHandle(ref, () => ({
    exportDataUrl: (pixelWidth?: number) => {
      const stage = stageRef.current;
      if (!stage || !composed) return null;
      const targetW = pixelWidth || stageWidth;
      const scale = targetW / stageWidth;
      return stage.toDataURL({
        x: 0,
        y: 0,
        width: stageWidth,
        height: stageHeight,
        pixelRatio: scale,
        mimeType: "image/png",
      });
    },
    exportBlob: async (pixelWidth?: number) => {
      const stage = stageRef.current;
      if (!stage || !composed) return null;
      const targetW = pixelWidth || stageWidth;
      const scale = targetW / stageWidth;
      const url = stage.toDataURL({
        x: 0,
        y: 0,
        width: stageWidth,
        height: stageHeight,
        pixelRatio: scale,
        mimeType: "image/png",
      });
      const res = await fetch(url);
      return res.blob();
    },
  }));

  if (!composed || !frame) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-black/10 bg-[#FAF8F5] p-6"
        style={{ aspectRatio: `${aspect}` }}
      >
        <span className="text-[11px] text-[#8C7783]">Menyiapkan hasil…</span>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-lg"
      style={{
        width: displayWidth,
        maxWidth: "100%",
        aspectRatio: `${stageWidth} / ${stageHeight}`,
        maxHeight: `${maxHeight}px`,
      }}
    >
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={displayWidth / stageWidth}
        scaleY={displayWidth / stageWidth}
        listening={false}
      >
        <Layer listening={false}>
          <Rect
            x={0}
            y={0}
            width={stageWidth}
            height={stageHeight}
            fill={frame.surroundColor}
          />
          {frame.borderColor !== "none" && borderWidthPx > 0 && (
            <Rect
              x={borderWidthPx / 2}
              y={borderWidthPx / 2}
              width={stageWidth - borderWidthPx}
              height={stageHeight - borderWidthPx}
              stroke={frame.borderColor}
              strokeWidth={borderWidthPx}
              fill="transparent"
            />
          )}
          {frame.decor === "star" && (
            <StarDecor
              x={paddingPx * 0.5}
              y={paddingPx * 0.5}
              size={Math.max(8, stageWidth * 0.012)}
            />
          )}
          {frame.decor === "constellation" && (
            <>
              <StarDecor
                x={paddingPx * 0.6}
                y={paddingPx * 0.6}
                size={Math.max(8, stageWidth * 0.012)}
              />
              <StarDecor
                x={stageWidth - paddingPx * 0.8}
                y={paddingPx * 0.8}
                size={Math.max(6, stageWidth * 0.009)}
              />
              <Line
                points={[
                  paddingPx * 0.6 + 5,
                  paddingPx * 0.6 + 5,
                  stageWidth - paddingPx * 0.8 + 3,
                  paddingPx * 0.8 + 3,
                ]}
                stroke="#D4A574"
                strokeWidth={0.6}
                opacity={0.5}
              />
            </>
          )}
          {frame.decor === "film" && (
            <FilmPerforationDecor stageWidth={stageWidth} stageHeight={stageHeight} />
          )}
          {frame.decor === "hearts" && (
            <HeartsDecor stageWidth={stageWidth} stageHeight={stageHeight} />
          )}
          {frame.decor === "accent" && (
            <Circle
              x={stageWidth - paddingPx * 0.5 - 6}
              y={paddingPx * 0.5 + 6}
              radius={5}
              fill="#E63946"
            />
          )}
        </Layer>

        {image && !processing && (
          <Layer listening={false}>
            <KonvaImage
              image={image}
              x={innerX}
              y={innerY}
              width={innerW}
              height={innerH}
            />
          </Layer>
        )}

        {frame.captionArea > 0 && caption && caption.trim().length > 0 && (
          <Layer listening={false}>
            <Text
              x={0}
              y={stageHeight - paddingPx - captionPx + captionPx * 0.25}
              width={stageWidth}
              align="center"
              text={caption}
              fontSize={Math.max(10, stageWidth * 0.018)}
              fontStyle="italic"
              fill={
                frame.decor === "film" || frame.decor === "cinema"
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(60, 30, 40, 0.7)"
              }
              fontFamily='"Inter", system-ui, sans-serif'
            />
          </Layer>
        )}

        <Layer>
          {stickers.map((s) => (
            <StickerNodeLegacy
              key={s.id}
              sticker={s}
              stageWidth={stageWidth}
              stageHeight={stageHeight}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});

LegacyFrameRenderer.displayName = "LegacyFrameRenderer";
