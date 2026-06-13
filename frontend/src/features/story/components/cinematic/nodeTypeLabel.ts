"use client";

import { NODE_TYPE_LABELS } from "./cinematicNodeLabels";

export { NODE_TYPE_LABELS };

/**
 * getNodeTypeLabel - Returns display label for a node type, with fallback.
 */
export function getNodeTypeLabel(nodeType: string | null | undefined): string {
  if (!nodeType) return "Scene";
  return NODE_TYPE_LABELS[nodeType] || nodeType.replace("_", " ");
}
