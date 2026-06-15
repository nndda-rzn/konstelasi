"use client";

import { usePhotoBoothStore } from "../../photoBoothStore";
import { FRAME_STYLES } from "../../config/frames";
import { FrameThumb } from "./frame-thumbs/FrameThumb";

/**
 * FrameSelector - Grid of frame thumbnails for the Result/Edit panel.
 * Each thumbnail is a small SVG mockup that shows the frame's character
 * (border, padding, decor, caption area) without rendering the actual
 * composed photo.
 */
export function FrameSelector() {
  const selected = usePhotoBoothStore((s) => s.selectedFrame);
  const setFrame = usePhotoBoothStore((s) => s.setSelectedFrame);

  return (
    <div className="grid grid-cols-2 gap-2">
      {FRAME_STYLES.map((frame) => (
        <FrameThumb
          key={frame.id}
          frame={frame}
          active={selected === frame.id}
          onSelect={() => setFrame(frame.id)}
        />
      ))}
    </div>
  );
}
