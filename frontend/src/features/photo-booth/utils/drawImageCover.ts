/**
 * drawImageCover
 *
 * Draws an HTMLImageElement into the given rect on the canvas with
 * object-cover behavior. No stretch, no distortion. The image is
 * center-cropped to fill the slot.
 */

export function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  if (width <= 0 || height <= 0) return;
  const slotAspect = width / height;
  const imageAspect = image.width / image.height;

  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (imageAspect > slotAspect) {
    sw = image.height * slotAspect;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / slotAspect;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}
