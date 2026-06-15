/**
 * Search filter for story nodes. Strips HTML from content
 * before matching, and returns whether a given node matches
 * the trimmed lowercased query.
 */
export function matchesQuery(
  query: string,
  title?: string,
  content?: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const titleMatch = title?.toLowerCase().includes(q) ?? false;
  const contentMatch = content
    ?.replace(/<[^>]+>/g, "")
    .toLowerCase()
    .includes(q) ?? false;
  return titleMatch || contentMatch;
}

/**
 * Returns dimmed style overrides for non-matching nodes during search.
 */
export function dimStyle(active: boolean): React.CSSProperties {
  if (active) return {};
  return {
    opacity: 0.25,
    filter: "grayscale(0.6)",
    transition: "opacity 0.3s ease, filter 0.3s ease",
  };
}
