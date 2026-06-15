"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_FILTERS } from "../photoBooth.config";
import type { TemplateConfig } from "../config/templates";
import { PhotoSlotNode } from "./nodes/PhotoSlotNode";
import { OverlayNode } from "./nodes/OverlayNode";
import { TextNode } from "./nodes/TextNode";
import { StickerNode } from "./nodes/StickerNode";
import { BackgroundLayer } from "./nodes/BackgroundLayer";
import { FrameBorderLayer } from "./nodes/FrameBorderLayer";

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
 * text, frame) on a Konva stage. Each layer is delegated to a small
 * node component for clarity and reuse.
 */
export const KonvaTemplateRenderer = forwardRef<
  KonvaResultPreviewHandle,
  KonvaTemplateRendererProps
>(({ template, displayWidth = 720, maxHeight = 640 }, ref) => {
  const stageRef = useRef<Konva.Stage>(null);

  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const selectedFilter = usePhotoBoothStore((s) => s.selectedFilter);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const caption = usePhotoBoothStore((s) => s.caption);

  const filterStr = PHOTO_FILTERS[selectedFilter]?.cssFilter ?? "none";

  const BASE = 1000;
  const stageWidth = BASE;
  const stageHeight = Math.round(stageWidth * (1 - template.footerHeight));

  const [images, setImages] = useState<HTMLImageElement[]>([]);

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
        listening={false}
      >
        <Layer listening={false}>
          <BackgroundLayer template={template} stageWidth={stageWidth} stageHeight={stageHeight} />
        </Layer>
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
        {template.frame.hasOwnFrame && (
          <Layer listening={false}>
            <FrameBorderLayer template={template} stageWidth={stageWidth} stageHeight={stageHeight} />
          </Layer>
        )}
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
