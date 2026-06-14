"use client";

import Webcam from "react-webcam";
import { type LayoutDef } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { CameraPreview } from "./CameraPreview";
import { CapturedThumbs } from "./CapturedThumbs";
import { CaptureControlBar } from "./CaptureControlBar";

interface StudioStageProps {
  webcamRef: React.RefObject<Webcam | null>;
  layoutDef: LayoutDef;
  onStart: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

/**
 * StudioStage - Hero column composition: preview + thumbs + control bar.
 * The bar is in-flow (not viewport-fixed), so nothing covers the camera.
 */
export function StudioStage({
  webcamRef,
  layoutDef,
  onStart,
  onRetake,
  onDownload,
  onSave,
}: StudioStageProps) {
  const isCapturing = usePhotoboothStore((s) => s.isCapturing);
  const stage = usePhotoboothStore((s) => s.stage);

  return (
    <div className="flex flex-col gap-4">
      <CameraPreview webcamRef={webcamRef} isCapturing={isCapturing} />
      <CapturedThumbs layoutDef={layoutDef} />
      {(stage === "setup" ||
        stage === "countdown" ||
        stage === "flash" ||
        stage === "edit" ||
        stage === "saving") && (
        <CaptureControlBar
          onStart={onStart}
          onRetake={onRetake}
          onDownload={onDownload}
          onSave={onSave}
        />
      )}
    </div>
  );
}
