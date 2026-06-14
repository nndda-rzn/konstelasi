"use client";

import Webcam from "react-webcam";
import { type LayoutDef } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { CameraPreview } from "./CameraPreview";
import { CapturedThumbs } from "./CapturedThumbs";

interface CameraStageProps {
  webcamRef: React.RefObject<Webcam | null>;
  layoutDef: LayoutDef;
}

/**
 * CameraStage - Viewfinder and thumbnails composition.
 */
export function CameraStage({ webcamRef, layoutDef }: CameraStageProps) {
  const isCapturing = usePhotoboothStore((s) => s.isCapturing);

  return (
    <div className="flex flex-col gap-8">
      <CameraPreview webcamRef={webcamRef} isCapturing={isCapturing} />
      <CapturedThumbs layoutDef={layoutDef} />
    </div>
  );
}
