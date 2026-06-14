"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Text,
  Group,
  Line,
  Circle,
  Path,
} from "react-konva";
import Konva from "konva";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_FILTERS } from "../photoBooth.config";
import { calculateFit } from "../hooks/use-template-fit";
import type {
  TemplateConfig,
  OverlayShape,
  PhotoSlot,
  TextElement,
} from "../config/templates";

export interface KonvaResultPreviewHandle {
  /**
   * Export the current stage as a data URL (PNG) at the given pixel width.
   * Used by Download and Save — same source guarantees preview = download = save.
   */
  exportDataUrl: (pixelWidth?: number) => string | null;
  /**
   * Export the current stage as a Blob (PNG).
   */
  exportBlob: (pixelWidth?: number) => Promise<Blob | null>;
}

interface KonvaTemplateRendererProps {
  template: TemplateConfig;
  /** Display width in CSS pixels (height computed from template aspect). */
  displayWidth?: number;
  /** Maximum height for the rendered stage (e.g. 64vh on a tall screen). */
  maxHeight?: number;
}

/**
 * KonvaTemplateRenderer - The single source of truth for the final output.
 *
 * Renders the template's full design (background, photo slots, overlays,
 * text, frame) on a Konva stage. The photo slots are filled with the
 * raw captured frames (NOT a pre-composed image) so the template
 * controls slot positions, masks, and fit modes precisely.
 *
 * Stickers (user-added emoji) are added on top in their own layer.
 *
 * Export methods (exportDataUrl, exportBlob) are used by Download + Save.
 */
export const KonvaTemplateRenderer = forwardRef<
  KonvaResultPreviewHandle,
  KonvaTemplateRendererProps
>(({ template, displayWidth = 720, maxHeight = 640 }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);

  // Store: photos + filter + stickers + caption
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const selectedFilter = usePhotoBoothStore((s) => s.selectedFilter);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const caption = usePhotoBoothStore((s) => s.caption);

  // Filter string for canvas operations
  const filterStr = PHOTO_FILTERS[selectedFilter]?.cssFilter ?? "none";

  // Compute stage dimensions. The base canvas is always 1000 wide
  // for normalized coordinate math. Actual pixel size scales per
  // PhotoRatio.outputWidth (so 21:9 → 2520 wide).
  const BASE = 1000;
  const stageWidth = BASE;
  const stageHeight = Math.round(stageWidth * (1 - template.footerHeight));

  // Native image elements for each captured frame
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Load each captured frame into a native HTMLImageElement for Konva
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      capturedFrames.map(
        (src) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((loaded) => {
      if (!cancelled) setImages(loaded.filter((x): x is HTMLImageElement => x !== null));
    });
    return () => {
      cancelled = true;
    };
  }, [capturedFrames]);

  // Expose export functions
  useImperativeHandle(ref, () => ({
    exportDataUrl: (pixelWidth?: number) => {
      const stage = stageRef.current;
      if (!stage) return null;
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
      if (!stage) return null;
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

  // Background gradient stops
  const bgStops = template.background.gradientStops;

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
        // Disable stage-level listening: no interactive children here,
        // and the canvas's full-resolution DOM element was overflowing
        // into the right panel. Clip via overflow:hidden + listening:false
        // makes the canvas truly passive.
        listening={false}
      >
        {/* Layer 0: Background (solid or gradient) */}
        <Layer listening={false}>
          {template.background.type === "solid" ? (
            <Rect
              x={0}
              y={0}
              width={stageWidth}
              height={stageHeight}
              fill={template.background.color || "#FFFFFF"}
            />
          ) : bgStops ? (
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
              fillLinearGradientColorStops={bgStops.flatMap((s) => [
                s.offset,
                s.color,
              ])}
            />
          ) : null}
        </Layer>

        {/* Layer 1: Photo slots — each captured image placed in its slot */}
        <Layer listening={false}>
          {template.photoSlots.map((slot) => {
            const img = images[slot.id];
            if (!img) return null;
            return (
              <PhotoSlotNode
                key={slot.id}
                slot={slot}
                image={img}
                stageWidth={stageWidth}
                stageHeight={stageHeight}
                filterStr={filterStr}
              />
            );
          })}
        </Layer>

        {/* Layer 2: Frame border (if template defines its own) */}
        {template.frame.hasOwnFrame && (
          <Layer listening={false}>
            {template.frame.borderColor !== "none" &&
              template.frame.borderWidth > 0 && (
                <Rect
                  x={
                    template.frame.borderWidth / 2
                  }
                  y={
                    template.frame.borderWidth / 2
                  }
                  width={stageWidth - template.frame.borderWidth}
                  height={stageHeight - template.frame.borderWidth}
                  stroke={template.frame.borderColor}
                  strokeWidth={template.frame.borderWidth}
                  fill="transparent"
                />
              )}
          </Layer>
        )}

        {/* Layer 3: Decorative overlays (hearts, stars, etc.) */}
        <Layer listening={false}>
          {template.overlays.map((overlay) => (
            <OverlayNode
              key={overlay.id}
              overlay={overlay}
              stageWidth={stageWidth}
              stageHeight={stageHeight}
            />
          ))}
        </Layer>

        {/* Layer 4: Text elements (caption, date, brand, footer) */}
        <Layer listening={false}>
          {template.textElements.map((text) => (
            <TextNode
              key={text.id}
              text={text}
              stageWidth={stageWidth}
              stageHeight={stageHeight}
              caption={caption}
            />
          ))}
        </Layer>

        {/* Layer 5: User stickers (emoji from store) */}
        <Layer>
          {stickers.map((s) => (
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

KonvaTemplateRenderer.displayName = "KonvaTemplateRenderer";

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

/**
 * PhotoSlotNode - Renders a single captured photo into its template slot
 * with the slot's fit mode and optional mask.
 */
function PhotoSlotNode({
  slot,
  image,
  stageWidth,
  stageHeight,
  filterStr,
}: {
  slot: PhotoSlot;
  image: HTMLImageElement;
  stageWidth: number;
  stageHeight: number;
  filterStr: string;
}) {
  const slotX = slot.x * stageWidth;
  const slotY = slot.y * stageHeight;
  const slotW = slot.w * stageWidth;
  const slotH = slot.h * stageHeight;

  // Calculate fit
  const slotAspect = slotW / slotH;
  const imageAspect = image.width / image.height;
  const fit = calculateFit({
    slotAspect,
    imageAspect,
    mode: slot.fit,
  });

  // Konva crop params
  const cropX = fit.sx * image.width;
  const cropY = fit.sy * image.height;
  const cropW = fit.sw * image.width;
  const cropH = fit.sh * image.height;

  // For "contain" mode, we need padding around the photo
  const isContain = slot.fit === "contain";
  let drawW = slotW;
  let drawH = slotH;
  let offsetX = 0;
  let offsetY = 0;
  if (isContain) {
    if (imageAspect > slotAspect) {
      drawH = slotW / imageAspect;
      offsetY = (slotH - drawH) / 2;
    } else {
      drawW = slotH * imageAspect;
      offsetX = (slotW - drawW) / 2;
    }
  }

  const radius = slot.radius ?? 0;
  const rotation = slot.rotation ?? 0;

  // Stroke width normalized
  const strokeW = slot.stroke ? (slot.stroke.width / 1000) * stageWidth : 0;

  // Determine if we need clipping. We use a Group wrapper with
  // clipFunc to clip the image to the mask shape.
  type ClipMask = "rounded" | "circle" | "heart" | "filmFrame";
  const clipMask: ClipMask | null =
    slot.mask === "rounded" ||
    slot.mask === "circle" ||
    slot.mask === "heart" ||
    slot.mask === "filmFrame"
      ? slot.mask
      : null;
  const needsClip = clipMask !== null;

  return (
    <Group
      x={slotX + offsetX}
      y={slotY + offsetY}
      rotation={rotation}
      offsetX={drawW / 2}
      offsetY={drawH / 2}
    >
      {needsClip ? (
        <Group
          clipFunc={(ctx) => {
            drawMaskPath(ctx, clipMask!, drawW, drawH, radius);
          }}
        >
          <KonvaImage
            image={image}
            cropX={isContain ? undefined : cropX}
            cropY={isContain ? undefined : cropY}
            cropWidth={isContain ? undefined : cropW}
            cropHeight={isContain ? undefined : cropH}
            width={drawW}
            height={drawH}
            filters={
              filterStr && filterStr !== "none"
                ? [getKonvaFilter(filterStr)]
                : []
            }
            listening={false}
          />
        </Group>
      ) : (
        <KonvaImage
          image={image}
          cropX={isContain ? undefined : cropX}
          cropY={isContain ? undefined : cropY}
          cropWidth={isContain ? undefined : cropW}
          cropHeight={isContain ? undefined : cropH}
          width={drawW}
          height={drawH}
          filters={
            filterStr && filterStr !== "none"
              ? [getKonvaFilter(filterStr)]
              : []
          }
          listening={false}
        />
      )}
      {slot.stroke && (
        <Rect
          x={0}
          y={0}
          width={drawW}
          height={drawH}
          stroke={slot.stroke.color}
          strokeWidth={strokeW}
          fill="transparent"
          cornerRadius={slot.mask === "rounded" ? radius : 0}
          listening={false}
        />
      )}
    </Group>
  );
}

/**
 * Draw the appropriate mask path on the 2D context.
 */
function drawMaskPath(
  ctx: any,
  mask: "rounded" | "circle" | "heart" | "filmFrame",
  w: number,
  h: number,
  radius: number
): void {
  if (mask === "rounded") {
    const r = radius;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
  } else if (mask === "circle") {
    const r = Math.min(w, h) / 2;
    const cx = w / 2;
    const cy = h / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.closePath();
  } else if (mask === "heart") {
    const cx = w / 2;
    const cy = h * 0.35;
    const r = Math.min(w * 0.3, h * 0.3);
    ctx.beginPath();
    ctx.moveTo(cx, h * 0.85);
    ctx.bezierCurveTo(
      w * 0.05,
      h * 0.7,
      w * 0.05,
      cy - r * 0.3,
      cx,
      cy - r * 0.1
    );
    ctx.bezierCurveTo(
      w * 0.95,
      cy - r * 0.3,
      w * 0.95,
      h * 0.7,
      cx,
      h * 0.85
    );
    ctx.closePath();
  } else if (mask === "filmFrame") {
    const notches = 4;
    const notchH = h * 0.04;
    const notchW = w * 0.08;
    ctx.beginPath();
    for (let i = 0; i <= notches; i++) {
      const x = (i / notches) * w;
      ctx.lineTo(x, 0);
      ctx.lineTo(x + notchW / 2, 0);
      ctx.lineTo(x + notchW / 2, notchH);
    }
    ctx.lineTo(w, notchH);
    ctx.lineTo(w, h - notchH);
    for (let i = notches; i >= 0; i--) {
      const x = (i / notches) * w;
      ctx.lineTo(x + notchW / 2, h - notchH);
      ctx.lineTo(x + notchW / 2, h);
      ctx.lineTo(x, h);
    }
    ctx.lineTo(0, h);
    ctx.lineTo(0, 0);
    ctx.closePath();
  }
}

/**
 * Convert CSS filter string to Konva filter function.
 * Konva supports: Brighten, Contrast, Grayscale, Invert, Sepia, etc.
 */
function getKonvaFilter(cssFilter: string): any {
  if (cssFilter.includes("grayscale")) return Konva.Filters.Grayscale;
  if (cssFilter.includes("sepia")) return Konva.Filters.Sepia;
  if (cssFilter.includes("invert")) return Konva.Filters.Invert;
  if (cssFilter.includes("brightness")) return Konva.Filters.Brighten;
  if (cssFilter.includes("contrast")) return Konva.Filters.Contrast;
  if (cssFilter.includes("noise")) return Konva.Filters.Noise;
  if (cssFilter.includes("pixelate")) return Konva.Filters.Pixelate;
  return Konva.Filters.Grayscale;
}

/**
 * OverlayNode - Render a decorative overlay element (rect, circle, line, heart, star).
 */
function OverlayNode({
  overlay,
  stageWidth,
  stageHeight,
}: {
  overlay: import("../config/templates").OverlayElement;
  stageWidth: number;
  stageHeight: number;
}) {
  const x = overlay.x * stageWidth;
  const y = overlay.y * stageHeight;
  const w = (overlay.width ?? 5) * (stageWidth / 1000);
  const h = (overlay.height ?? 5) * (stageWidth / 1000);
  const rotation = overlay.rotation ?? 0;
  const strokeW = (overlay.strokeWidth ?? 0.5) * (stageWidth / 1000);

  const commonProps = {
    x: x - w / 2,
    y: y - h / 2,
    width: w,
    height: h,
    rotation,
    opacity: overlay.opacity,
    listening: false as const,
  };

  if (overlay.shape === "rect" && overlay.fill) {
    return (
      <Rect {...commonProps} fill={overlay.fill} />
    );
  }
  if (overlay.shape === "circle" && overlay.fill) {
    return (
      <Circle
        {...commonProps}
        radius={Math.max(w, h) / 2}
        x={x}
        y={y}
        fill={overlay.fill}
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

/**
 * TextNode - Render a text element. If id="caption", the actual caption
 * from the store is used; otherwise the template's default text.
 */
function TextNode({
  text,
  stageWidth,
  stageHeight,
  caption,
}: {
  text: TextElement;
  stageWidth: number;
  stageHeight: number;
  caption: string;
}) {
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

/**
 * StickerNode - User-added emoji sticker.
 */
function StickerNode({
  sticker,
  stageWidth,
  stageHeight,
}: {
  sticker: { id: string; emoji: string; x: number; y: number };
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                              */
/* ------------------------------------------------------------------ */

/**
 * Calculate linear gradient start/end points based on angle.
 * 0° = left→right, 90° = top→bottom, 180° = right→left, 270° = bottom→top
 */
function getGradientStart(
  w: number,
  h: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const cx = w / 2;
  const cy = h / 2;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const length = Math.max(w, h) / 2;
  return { x: cx - dx * length, y: cy - dy * length };
}

function getGradientEnd(
  w: number,
  h: number,
  angleDeg: number
): { x: number; y: number } {
  const start = getGradientStart(w, h, angleDeg);
  return {
    x: start.x + (w - start.x) * 2,
    y: start.y + (h - start.y) * 2,
  };
}

/**
 * Draw a heart path on a 2D context (used for clip masks).
 */
function drawHeartPath(
  ctx: Konva.Context,
  w: number,
  h: number
): void {
  const cx = w / 2;
  const cy = h * 0.35;
  const r = Math.min(w * 0.3, h * 0.3);
  ctx.beginPath();
  ctx.moveTo(cx, h * 0.85);
  ctx.bezierCurveTo(w * 0.05, h * 0.7, w * 0.05, cy - r * 0.3, cx, cy - r * 0.1);
  ctx.bezierCurveTo(w * 0.95, cy - r * 0.3, w * 0.95, h * 0.7, cx, h * 0.85);
  ctx.closePath();
}

/**
 * Generate SVG-like path data string for heart shape, scaled to w x h.
 */
function heartPathData(w: number, h: number): string {
  const cx = w / 2;
  const top = h * 0.25;
  const r = Math.min(w * 0.28, h * 0.28);
  return (
    `M ${cx} ${h * 0.95} ` +
    `C ${w * 0.05} ${h * 0.75}, ${w * 0.05} ${top - r * 0.3}, ${cx} ${top - r * 0.1} ` +
    `C ${w * 0.95} ${top - r * 0.3}, ${w * 0.95} ${h * 0.75}, ${cx} ${h * 0.95} Z`
  );
}

/**
 * Generate 4-point star path scaled to w x h.
 */
function starPathData(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const outer = Math.min(w, h) / 2;
  const inner = outer * 0.35;
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }
  points.push("Z");
  return points.join(" ");
}
