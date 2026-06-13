/**
 * Date helpers for the story node editor.
 * Handles conversion between ISO strings and HTML datetime-local input format.
 */

/**
 * Convert an ISO date string to the format expected by <input type="datetime-local">.
 * Returns empty string for invalid/missing input.
 */
export function toDateTimeInputValue(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

/**
 * Format an ISO date string for human-readable display (Indonesian locale).
 * Returns empty string for invalid input.
 */
export function formatUnlockDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
