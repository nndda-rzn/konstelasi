/**
 * exportCanvas
 *
 * Converts a canvas to a Blob using the same encoding decision as
 * composePhotoBoothOutput. Useful for download/save flows that already
 * have the canvas in memory.
 */

export function exportCanvasAsBlob(
  canvas: HTMLCanvasElement,
  preferPng = false
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const mime = preferPng ? "image/png" : "image/jpeg";
      const quality = mime === "image/jpeg" ? 0.92 : undefined;
      canvas.toBlob(
        (blob) => resolve(blob),
        mime,
        quality
      );
    } catch {
      resolve(null);
    }
  });
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  link.click();
}
