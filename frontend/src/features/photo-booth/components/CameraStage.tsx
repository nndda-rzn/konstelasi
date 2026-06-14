"use client";

import Webcam from "react-webcam";
import { CameraPreview } from "./CameraPreview";
import { CapturedThumbs } from "./CapturedThumbs";
import { CameraControls } from "./CameraControls";

interface CameraStageProps {
  webcamRef: React.RefObject<Webcam | null>;
  onStart: () => void;
  onRetry: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

/**
 * CameraStage - Hero column composition: preview + thumbs + controls.
 * Bar is in-flow; nothing covers the camera viewport.
 */
export function CameraStage({
  webcamRef,
  onStart,
  onRetry,
  onRetake,
  onDownload,
  onSave,
}: CameraStageProps) {
  return (
    <div className="flex flex-col gap-3">
      <CameraPreview webcamRef={webcamRef} />
      <CapturedThumbs />
      <CameraControls
        onStart={onStart}
        onRetry={onRetry}
        onRetake={onRetake}
        onDownload={onDownload}
        onSave={onSave}
      />
    </div>
  );
}
