"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text, Group, Line, Circle } from "react-konva";
import type Konva from "konva";
import { usePhotoBoothStore } from "../photoBoothStore";
import { FRAME_MAP } from "../config/frames";
import type { Sticker } from "../photoBooth.types";

export interface KonvaResultPreviewHandle {
  /**
   * Export the current stage as a data URL (PNG) at the given pixel width.
   * Used by Download and Save actions — both call this, so the source
   * of truth is the same (the Konva stage).
   */
  exportDataUrl: (pixelWidth?: number) => string | null;
  /**
   * Export the current stage as a Blob (PNG) at the given pixel width.
   */
  exportBlob: (pixelWidth?: number) => Promise<Blob | null>;
}

interface KonvaResultPreviewProps {
  /** Display width in CSS pixels (height computed from composed aspect). */
  displayWidth?: number;
}

/**
 * KonvaResultPreview - The single source of truth for the final output.
 *
 * Renders the composed photo output + frame + stickers + caption as a
 * Konva stage. The image itself is NEVER re-cropped or transformed —
 * it's placed at its natural size and the frame adds border/padding
 * around it.
 *
 * All exports (Download, Save to Canvas, Save to Gallery) come from
 * this stage, so preview = download = save.
 */
export const KonvaResultPreview = forwardRef<
  KonvaResultPreviewHandle,
  KonvaResultPreviewProps
>(({ displayWidth = 720 }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);

  const composed = usePhotoBoothStore((s) => s.composed);
  const processing = usePhotoBoothStore((s) => s.processing);
  const selectedFrame = usePhotoBoothStore((s) => s.selectedFrame);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const caption = usePhotoBoothStore((s) => s.caption);

  const frame = FRAME_MAP[selectedFrame];

  // Native image element for the composed output
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Load the composed image into a native HTMLImageElement for Konva
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

  // The stage canvas size matches the composed image's natural size
  // (so exports are at full quality). For display, we scale via CSS.
  const aspect =
    composed && composed.width && composed.height
      ? composed.width / composed.height
      : 1;
  const stageWidth = composed?.width || Math.round(displayWidth);
  const stageHeight = composed?.height || Math.round(displayWidth / aspect);

  // Frame padding (in stage pixels)
  const paddingPx = frame ? (frame.padding / 1000) * stageWidth : 0;
  const captionPx = frame ? (frame.captionArea / 1000) * stageWidth : 0;
  const borderWidthPx = frame ? (frame.borderWidth / 1000) * stageWidth : 0;

  // Inner image area inside the frame padding + caption area
  const innerX = paddingPx;
  const innerY = paddingPx;
  const innerW = Math.max(0, stageWidth - paddingPx * 2);
  const innerH = Math.max(0, stageHeight - paddingPx * 2 - captionPx);

  // Expose export functions
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
      const dataUrl = (stageRef.current as KonvaResultPreviewHandle | null)
        ? null
        : null;
      void dataUrl;
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
      }}
    >
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        // Scale display to fit the CSS width while keeping stage pixel-perfect
        scaleX={displayWidth / stageWidth}
        scaleY={displayWidth / stageWidth}
        // Disable stage-level listening: there are no interactive
        // children yet, and the canvas's full-resolution DOM element
        // (stageWidth wide) was overflowing into the right panel,
        // stealing pointer events from the Filter/Frame/Stiker/Caption
        // tabs. Clip via overflow:hidden on the wrapper + listening:false
        // on the Stage makes the canvas truly passive.
        listening={false}
      >
        {/* Layer 1: Frame surround (background + border + decor) */}
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

        {/* Layer 2: Base photo output (NO cropping, just placed) */}
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

        {/* Layer 3: Caption (if any) — drawn INSIDE the frame caption area */}
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

        {/* Layer 4: Stickers (interactive + exportable) */}
        <Layer>
          {stickers.map((s: Sticker) => (
            <StickerNode
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

KonvaResultPreview.displayName = "KonvaResultPreview";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                       */
/* ------------------------------------------------------------------ */

function StickerNode({
  sticker,
  stageWidth,
  stageHeight,
}: {
  sticker: Sticker;
  stageWidth: number;
  stageHeight: number;
}) {
  // Sticker position is stored as 0..100% of the stage.
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
  // 4-pointed star path
  const path = `
    M ${x} ${y - size}
    L ${x + size * 0.3} ${y - size * 0.3}
    L ${x + size} ${y}
    L ${x + size * 0.3} ${y + size * 0.3}
    L ${x} ${y + size}
    L ${x - size * 0.3} ${y + size * 0.3}
    L ${x - size} ${y}
    L ${x - size * 0.3} ${y - size * 0.3}
    Z
  `;
  return <Path d={path} fill="#D4A574" />;
}

function Path({ d, fill }: { d: string; fill: string }) {
  // Use a Konva Path via a stringified SVG path
  // We import through Group to keep it simple
  return (
    <Group>
      <SvgPathString d={d} fill={fill} />
    </Group>
  );
}

function SvgPathString({ d, fill }: { d: string; fill: string }) {
  // Convert simple SVG path to Konva Shape using sceneFunc
  return (
    <Rect
      x={0}
      y={0}
      width={0}
      height={0}
      fill={fill}
      shadowEnabled={false}
      sceneFunc={(context, shape) => {
        const path = new Path2D(d);
        context.fillStyle = fill;
        context.fill(path);
        context.fillStrokeShape(shape);
      }}
    />
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
      <HeartShape x={margin} y={margin} size={size} />
      <HeartShape x={stageWidth - margin - size} y={stageHeight - margin - size} size={size} />
    </Group>
  );
}

function HeartShape({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <Rect
      x={0}
      y={0}
      width={0}
      height={0}
      fill="#E8919C"
      opacity={0.7}
      sceneFunc={(context, shape) => {
        const cx = x + size / 2;
        const cy = y + size / 2;
        const r = size / 2;
        context.beginPath();
        context.moveTo(cx, y + size);
        context.bezierCurveTo(x, y + size * 0.6, x, y + size * 0.2, cx, y + size * 0.4);
        context.bezierCurveTo(x + size, y + size * 0.2, x + size, y + size * 0.6, cx, y + size);
        context.closePath();
        context.fillStyle = "#E8919C";
        context.fill();
        context.fillStrokeShape(shape);
      }}
    />
  );
}
