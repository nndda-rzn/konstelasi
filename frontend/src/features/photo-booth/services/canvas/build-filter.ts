/**
 * Canvas service - build CSS/canvas filter string from filter + effect IDs.
 */

import { PHOTO_FILTERS, PHOTO_EFFECTS } from "../../photoBooth.config";
import type { FilterId, EffectId } from "../../photoBooth.config";

export function buildFilterString(
  filterId: FilterId,
  effectId: EffectId
): string {
  const f = PHOTO_FILTERS[filterId];
  const e = PHOTO_EFFECTS[effectId];
  const parts: string[] = [];
  if (f.canvasFilter && f.canvasFilter !== "none") parts.push(f.canvasFilter);
  if (e.canvasFilter) parts.push(e.canvasFilter);
  return parts.join(" ");
}
