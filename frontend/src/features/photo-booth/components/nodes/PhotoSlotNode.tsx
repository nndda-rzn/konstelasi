"use client";

import { Image as KonvaImage, Group, Rect } from "react-konva";
import { calculateFit } from "../../hooks/use-template-fit";
import { drawMaskPath, type ClipMask } from "../utils/masks";
import { getKonvaFilter } from "../utils/konvaFilters";
import type { PhotoSlot } from "../../config/templates";

interface PhotoSlotNodeProps {
  slot: PhotoSlot;
  image: HTMLImageElement;
  stageWidth: number;
  stageHeight: number;
  filterStr: string;
}

export function PhotoSlotNode({ slot, image, stageWidth, stageHeight, filterStr }: PhotoSlotNodeProps) {
  const slotX = slot.x * stageWidth;
  const slotY = slot.y * stageHeight;
  const slotW = slot.w * stageWidth;
  const slotH = slot.h * stageHeight;

  const slotAspect = slotW / slotH;
  const imageAspect = image.width / image.height;
  const fit = calculateFit({ slotAspect, imageAspect, mode: slot.fit });

  const cropX = fit.sx * image.width;
  const cropY = fit.sy * image.height;
  const cropW = fit.sw * image.width;
  const cropH = fit.sh * image.height;

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
  const strokeW = slot.stroke ? (slot.stroke.width / 1000) * stageWidth : 0;

  const clipMask: ClipMask | null =
    slot.mask === "rounded" ||
    slot.mask === "circle" ||
    slot.mask === "heart" ||
    slot.mask === "filmFrame"
      ? slot.mask
      : null;

  const filters =
    filterStr && filterStr !== "none" ? [getKonvaFilter(filterStr)] : [];

  const imageEl = (
    <KonvaImage
      image={image}
      cropX={isContain ? undefined : cropX}
      cropY={isContain ? undefined : cropY}
      cropWidth={isContain ? undefined : cropW}
      cropHeight={isContain ? undefined : cropH}
      width={drawW}
      height={drawH}
      filters={filters}
      listening={false}
    />
  );

  return (
    <Group
      x={slotX + offsetX}
      y={slotY + offsetY}
      rotation={rotation}
      offsetX={drawW / 2}
      offsetY={drawH / 2}
    >
      {clipMask ? (
        <Group
          clipFunc={(ctx) => {
            drawMaskPath(ctx, clipMask, drawW, drawH, radius);
          }}
        >
          {imageEl}
        </Group>
      ) : (
        imageEl
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
