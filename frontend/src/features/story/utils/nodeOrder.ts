/**
 * Comparator that sorts story nodes by their narrative date.
 * Prefers `eventDate` (when the event in the story actually happened)
 * over `createdAt` (when the user typed it). This produces the order
 * most users expect for chronological storytelling.
 */
export function compareByNarrativeDate(
  a: { eventDate?: string | null; createdAt?: string | null },
  b: { eventDate?: string | null; createdAt?: string | null },
): number {
  const aTime = new Date(a.eventDate || a.createdAt || 0).getTime();
  const bTime = new Date(b.eventDate || b.createdAt || 0).getTime();
  return aTime - bTime;
}

/** Pick narrative date (eventDate ?? createdAt) for display purposes. */
export function getNarrativeDate(node: {
  eventDate?: string | null;
  createdAt?: string | null;
}): string | undefined {
  return node.eventDate || node.createdAt || undefined;
}
