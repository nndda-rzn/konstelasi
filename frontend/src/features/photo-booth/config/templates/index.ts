/**
 * Photo Booth - Custom Template Layout Registry.
 *
 * Central registry of all available templates. Adding a new template:
 * 1. Create a file in this directory (e.g., my-template.ts) exporting
 *    a TemplateConfig.
 * 2. Add it to the TEMPLATE_REGISTRY array below.
 *
 * Templates are filtered by `selectedLayoutId` and `capturedCount`
 * at render time via the selector functions.
 */

import type { TemplateConfig, TemplateId } from "./types";
import { classicLayout } from "./classic-layout";
import { vintageLayout } from "./vintage-layout";
import { heartsLayout } from "./hearts-layout";
import { withLoveLayout } from "./with-love-layout";
import { solaceLayout } from "./solace-layout";
import { dogFilterLayout } from "./dog-filter-layout";
import { holidaysLayout } from "./holidays-layout";
import { constellationDiary } from "./constellation-diary";
import { magazineLayout } from "./magazine-layout";
import { cinemaStrip } from "./cinema-strip";

export const TEMPLATE_REGISTRY: TemplateConfig[] = [
  constellationDiary,  // brand utama, default
  classicLayout,
  vintageLayout,
  heartsLayout,
  withLoveLayout,
  solaceLayout,
  dogFilterLayout,
  holidaysLayout,
  magazineLayout,
  cinemaStrip,
];

export const TEMPLATE_MAP: Record<TemplateId, TemplateConfig> =
  TEMPLATE_REGISTRY.reduce(
    (acc, t) => {
      acc[t.id] = t;
      return acc;
    },
    {} as Record<TemplateId, TemplateConfig>
  );

export const DEFAULT_TEMPLATE_ID: TemplateId = "constellation-diary";

/**
 * Get all templates that support a given layout.
 */
export function getTemplatesForLayout(
  layoutId: string
): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter((t) =>
    t.supportedLayouts.includes(layoutId)
  );
}

/**
 * Get all templates that can be used with the given number of
 * captured photos. Templates with requiredShots > count are
 * excluded.
 */
export function getTemplatesForCaptureCount(
  count: number
): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter((t) => t.requiredShots <= count);
}

/**
 * Get all templates that support BOTH the given layout AND the
 * given number of captured photos. This is the typical query for
 * the TemplateSelector panel.
 */
export function getCompatibleTemplates(
  layoutId: string,
  count: number
): TemplateConfig[] {
  return TEMPLATE_REGISTRY.filter(
    (t) =>
      t.supportedLayouts.includes(layoutId) && t.requiredShots <= count
  );
}

/**
 * Get a single template by id.
 */
export function getTemplateById(id: TemplateId): TemplateConfig | undefined {
  return TEMPLATE_MAP[id];
}

/**
 * Get the default template for a given layout. Falls back to
 * Constellation Diary if no match.
 */
export function getDefaultTemplateForLayout(
  layoutId: string
): TemplateConfig {
  const matches = getTemplatesForLayout(layoutId);
  if (matches.length === 0) return constellationDiary;
  // Prefer Constellation Diary if compatible, else first match
  const preferred = matches.find(
    (t) => t.id === DEFAULT_TEMPLATE_ID
  );
  return preferred ?? matches[0];
}

export type {
  TemplateConfig,
  TemplateId,
  TemplateCategory,
  BadgeType,
  FitMode,
  MaskType,
  BorderStyle,
  PhotoSlot,
  TextElement,
  OverlayElement,
  OverlayShape,
  TemplateBackground,
  TemplateFrameStyle,
} from "./types";
