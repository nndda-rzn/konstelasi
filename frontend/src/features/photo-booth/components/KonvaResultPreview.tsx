"use client";

import { forwardRef, useMemo } from "react";
import { usePhotoBoothStore } from "../photoBoothStore";
import { getTemplateById, type TemplateConfig } from "../config/templates";
import {
  KonvaTemplateRenderer,
  type KonvaResultPreviewHandle,
} from "./KonvaTemplateRenderer";

// Re-export the handle so consumers can import it from this file
export type { KonvaResultPreviewHandle };

interface KonvaResultPreviewProps {
  /** Display width in CSS pixels (height computed from aspect). */
  displayWidth?: number;
  /** Maximum height for the rendered stage. */
  maxHeight?: number;
}

/**
 * KonvaResultPreview - The single source of truth for the final output.
 *
 * Routes to either:
 *  - KonvaTemplateRenderer (when a template is selected) — full template
 *    design with photo slots, decor, frame, text, stickers
 *  - Legacy frame mode (when no template is selected) — preserved from
 *    earlier commits for backward compatibility
 *
 * Preview = Download = Save — both call this same stage's export.
 */
export const KonvaResultPreview = forwardRef<
  KonvaResultPreviewHandle,
  KonvaResultPreviewProps
>(({ displayWidth = 720, maxHeight = 640 }, ref) => {
  const selectedTemplateId = usePhotoBoothStore((s) => s.selectedTemplateId);
  const composed = usePhotoBoothStore((s) => s.composed);

  const template = useMemo<TemplateConfig | null>(
    () => (selectedTemplateId ? getTemplateById(selectedTemplateId) ?? null : null),
    [selectedTemplateId]
  );

  // Use template renderer when a template is selected AND composed
  // is available. Otherwise fall back to legacy frame mode.
  if (template && composed) {
    return (
      <KonvaTemplateRenderer
        ref={ref}
        template={template}
        displayWidth={displayWidth}
        maxHeight={maxHeight}
      />
    );
  }

  // Legacy frame mode — single composed image + frame + sticker
  return (
    <LegacyFramePreview
      ref={ref}
      displayWidth={displayWidth}
      maxHeight={maxHeight}
    />
  );
});

KonvaResultPreview.displayName = "KonvaResultPreview";

/* ------------------------------------------------------------------ */
/*  Legacy frame mode (preserved for backward compatibility)            */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState, useImperativeHandle } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group, Line, Circle } from "react-konva";
import type Konva from "konva";
import { FRAME_MAP } from "../config/frames";
import type { Sticker } from "../photoBooth.types";

const LegacyFramePreview = forwardRef<
  KonvaResultPreviewHandle,
  KonvaResultPreviewProps
>(({ displayWidth = 720, maxHeight = 640 }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);

  const composed = usePhotoBoothStore((s) => s.composed);
  const processing = usePhotoBoothStore((s) => s.processing);
  const selectedFrame = usePhotoBoothStore((s) => s.selectedFrame);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const caption = usePhotoBoothStore((s) => s.caption);

  const frame = FRAME_MAP[selectedFrame];

  // Native image element for the composed output
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
          {frame.decor === "star" && <StarDecor x={paddingPx * 0.5} y={paddingPx * 0.5} size={Math.max(8, stageWidth * 0.012)} />}
          {frame.decor === "constellation" && (
            <>
              <StarDecor x={paddingPx * 0.6} y={paddingPx * 0.6} size={Math.max(8, stageWidth * 0.012)} />
              <StarDecor x={stageWidth - paddingPx * 0.8} y={paddingPx * 0.8} size={Math.max(6, stageWidth * 0.009)} />
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
          {frame.decor === "film" && <FilmPerforationDecor stageWidth={stageWidth} stageHeight={stageHeight} />}
          {frame.decor === "hearts" && <HeartsDecor stageWidth={stageWidth} stageHeight={stageHeight} />}
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
              fill={frame.decor === "film" || frame.decor === "cinema" ? "rgba(255,255,255,0.75)" : "rgba(60, 30, 40, 0.7)"}
              fontFamily='"Inter", system-ui, sans-serif'
            />
          </Layer>
        )}

        <Layer>
          {stickers.map((s: Sticker) => (
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

LegacyFramePreview.displayName = "LegacyFramePreview";

/* ------------------------------------------------------------------ */
/*  Decor helpers (legacy)                                             */
/* ------------------------------------------------------------------ */

function StickerNodeLegacy({
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

function StarDecor({ x, y, size }: { x: number; y: number; size: number }) {
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

function FilmPerforationDecor({
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

function HeartsDecor({
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
          const r = size / 2;
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
          const r = size / 2;
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
