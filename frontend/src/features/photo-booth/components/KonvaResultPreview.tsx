"use client";

import { forwardRef, useMemo } from "react";
import { usePhotoBoothStore } from "../photoBoothStore";
import { getTemplateById, type TemplateConfig } from "../config/templates";
import {
  KonvaTemplateRenderer,
  type KonvaResultPreviewHandle,
} from "./KonvaTemplateRenderer";
import { LegacyFrameRenderer } from "./nodes/LegacyFrameRenderer";

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
 *  - LegacyFrameRenderer (when no template is selected) — preserved
 *    for backward compatibility
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

  return (
    <LegacyFrameRenderer
      ref={ref}
      displayWidth={displayWidth}
      maxHeight={maxHeight}
    />
  );
});

KonvaResultPreview.displayName = "KonvaResultPreview";
