/**
 * Strip HTML tags and decode entities from a TipTap content string.
 * Returns plain text suitable for word counting.
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<\/(p|div|h[1-6]|li|blockquote|br)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Count words in plain text (split by whitespace, filter empty). */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/** Count characters in plain text (excluding HTML markup). */
export function countCharacters(text: string): number {
  return text.length;
}

/**
 * Estimate reading time in minutes. Average adult reads ~200 wpm.
 * Returns minimum 1 minute for non-empty content.
 */
export function estimateReadingTime(wordCount: number): number {
  if (wordCount === 0) return 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Format reading time as Indonesian label. */
export function formatReadingTime(minutes: number): string {
  if (minutes === 0) return '';
  return `${minutes} menit baca`;
}
