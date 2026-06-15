"use client";

import { type LayoutId, LAYOUT_DECORATIONS } from "../photoBooth.config";
import { PreviewBox } from "./preview/PreviewBox";
import {
  renderPreviewChildren,
  getPreviewBorder,
} from "./preview/previewRegistry";

/**
 * MiniPreview - Tiny SVG mock of a layout's photo arrangement.
 * Renders a stack of rounded rectangles according to the layout's
 * composition (strip, grid, wide, etc.). No images needed.
 *
 * All case-specific rendering is delegated to previewRegistry.
 */
export function MiniPreview({
  layoutId,
  className = "",
}: {
  layoutId: LayoutId;
  className?: string;
}) {
  const deco = LAYOUT_DECORATIONS[layoutId];
  const border = getPreviewBorder(layoutId);
  const children = renderPreviewChildren(layoutId, deco);

  return (
    <PreviewBox className={className} border={border}>
      {children}
    </PreviewBox>
  );
}
