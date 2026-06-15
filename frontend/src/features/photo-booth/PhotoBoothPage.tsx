"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import {
  usePhotoBoothStore,
  selectRequiredShots,
} from "./photoBoothStore";
import { usePhotoBooth } from "./usePhotoBooth";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LayoutGallery } from "./components/LayoutGallery";
import { FormatPicker } from "./components/FormatPicker";
import {
  KonvaResultPreview,
  type KonvaResultPreviewHandle,
} from "./components/KonvaResultPreview";
import { SessionShell } from "./components/SessionShell";
import { CameraScreen } from "./components/CameraScreen";
import { ResultScreen } from "./components/ResultScreen";

export function PhotoBoothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  // Ref to the Konva result preview so we can call its export
  // methods (Download + Save use the same exported data URL).
  const konvaPreviewRef = useRef<KonvaResultPreviewHandle>(null);

  const flowMode = usePhotoBoothStore((s) => s.flowMode);
  const sessionStep = usePhotoBoothStore((s) => s.sessionStep);
  const stage = usePhotoBoothStore((s) => s.stage);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const requiredShots = usePhotoBoothStore(selectRequiredShots);
  const isAuthPromptOpen = usePhotoBoothStore((s) => s.isAuthPromptOpen);
  const setAuthPromptOpen = usePhotoBoothStore((s) => s.setAuthPromptOpen);
  const isSettingsSheetOpen = usePhotoBoothStore((s) => s.isSettingsSheetOpen);
  const setSettingsSheetOpen = usePhotoBoothStore((s) => s.setSettingsSheetOpen);
  const setFlowMode = usePhotoBoothStore((s) => s.setFlowMode);
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const setStage = usePhotoBoothStore((s) => s.setStage);

  const {
    handleStart,
    handleRetry,
    handleRetake,
    handleDownload,
    handleSave,
  } = usePhotoBooth(webcamRef, () => konvaPreviewRef.current);

  const showFlashOverlay = stage === "flash";
  // Result mode is EXCLUSIVELY when flowMode is "result".
  // This ensures the camera screen is unmounted when result is shown,
  // so the result doesn't appear "stuck" under the camera preview.
  const isResultMode = flowMode === "result";

  const handleBackToFormat = () => {
    setStage("setup");
    setFlowMode("session");
    setSessionStep("choose-format");
  };

  return (
    <ApolloWrapper>
      <Providers>
        {flowMode === "welcome" && <WelcomeScreen />}

        {flowMode === "session" && sessionStep === "choose-layout" && (
          <SessionShell>
            <LayoutGallery />
          </SessionShell>
        )}

        {flowMode === "session" && sessionStep === "choose-format" && (
          <SessionShell>
            <FormatPicker />
          </SessionShell>
        )}

        {flowMode === "session" && sessionStep === "camera" && (
          <CameraScreen
            webcamRef={webcamRef}
            showFlashOverlay={showFlashOverlay}
            onStart={handleStart}
            onRetry={handleRetry}
            onRetake={handleRetake}
            onDownload={handleDownload}
            onSave={handleSave}
            onBack={handleBackToFormat}
            isAuthPromptOpen={isAuthPromptOpen}
            setAuthPromptOpen={setAuthPromptOpen}
            isSettingsSheetOpen={isSettingsSheetOpen}
            setSettingsSheetOpen={setSettingsSheetOpen}
            phase={stage as unknown as "idle"}
            capturedFramesCount={capturedFrames.length}
            requiredShots={requiredShots}
            onLogin={() => router.push("/login?reason=photobooth_save")}
          />
        )}

        {isResultMode && (
          <ResultScreen
            previewRef={konvaPreviewRef}
            onRetake={handleRetake}
            onDownload={handleDownload}
            onSave={handleSave}
            isAuthPromptOpen={isAuthPromptOpen}
            setAuthPromptOpen={setAuthPromptOpen}
            onLogin={() => router.push("/login?reason=photobooth_save")}
          />
        )}
      </Providers>
    </ApolloWrapper>
  );
}
