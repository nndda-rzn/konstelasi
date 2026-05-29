/**
 * Scrapbook theme utilities for the story canvas.
 * Centralizes the theme background, canvas, and grid color mappings.
 */

export interface ScrapbookTheme {
  background: string;
  font: string;
}

export const DEFAULT_SCRAPBOOK_THEME: ScrapbookTheme = {
  background: 'red_candy',
  font: 'default',
};

export const SCRAPBOOK_PAGE_CLASSES: Record<string, string> = {
  red_candy: 'bg-[var(--background)]',
  warm_paper: 'bg-[#FFF8EA] dark:bg-[#1c1710]',
  rose_album: 'bg-[#FFF0F3] dark:bg-[#24161b]',
  night_letter: 'bg-[#F7F2FF] dark:bg-[#15111f]',
};

export const SCRAPBOOK_CANVAS_CLASSES: Record<string, string> = {
  red_candy: 'bg-[#FFFAF7] dark:bg-[#1a1625]',
  warm_paper: 'bg-[#FFF8EA] dark:bg-[#1c1710]',
  rose_album: 'bg-[#FFF0F3] dark:bg-[#24161b]',
  night_letter: 'bg-[#F7F2FF] dark:bg-[#15111f]',
};

export const SCRAPBOOK_GRID_COLORS: Record<string, string> = {
  red_candy: '#FFB8C0',
  warm_paper: '#D9B979',
  rose_album: '#FF9FB0',
  night_letter: '#6D5F8F',
};

export function parseScrapbookTheme(value?: string): ScrapbookTheme {
  try {
    return { ...DEFAULT_SCRAPBOOK_THEME, ...(value ? JSON.parse(value) : {}) };
  } catch {
    return DEFAULT_SCRAPBOOK_THEME;
  }
}

export function getScrapbookFontClass(font?: string): string {
  if (font === 'handwriting') return 'font-scrapbook-handwriting';
  if (font === 'serif') return 'font-scrapbook-serif';
  return '';
}

/** Background option metadata for use in settings/wizard pickers. */
export const SCRAPBOOK_BACKGROUNDS = [
  { value: 'red_candy', label: 'Red Candy', desc: 'Lembut dan romantis', className: 'from-[#FFE5E8] to-[#FFFAF7]' },
  { value: 'warm_paper', label: 'Warm Paper', desc: 'Album kertas hangat', className: 'from-[#F8E7C9] to-[#FFF8EA]' },
  { value: 'rose_album', label: 'Rose Album', desc: 'Scrapbook bunga mawar', className: 'from-[#FFD6DC] to-[#FFF0F3]' },
  { value: 'night_letter', label: 'Night Letter', desc: 'Lavender lembut, gelap saat dark mode', className: 'from-[#E7DCFF] to-[#F7F2FF]' },
];

/** Font option metadata for use in settings/wizard pickers. */
export const SCRAPBOOK_FONTS = [
  { value: 'default', label: 'Modern Clean', desc: 'Tetap rapi dan mudah dibaca' },
  { value: 'serif', label: 'Literary Serif', desc: 'Rasa buku klasik' },
  { value: 'handwriting', label: 'Elegant Handwriting', desc: 'Tulisan tangan halus untuk scrapbook' },
];

export interface ResolvedScrapbookTheme {
  pageClass: string;
  canvasClass: string;
  gridColor: string;
  fontClass: string;
}

/** Convenience: resolve all CSS classes/colors from a theme JSON string. */
export function resolveScrapbookTheme(value?: string): ResolvedScrapbookTheme {
  const theme = parseScrapbookTheme(value);
  return {
    pageClass: SCRAPBOOK_PAGE_CLASSES[theme.background] || SCRAPBOOK_PAGE_CLASSES.red_candy,
    canvasClass: SCRAPBOOK_CANVAS_CLASSES[theme.background] || SCRAPBOOK_CANVAS_CLASSES.red_candy,
    gridColor: SCRAPBOOK_GRID_COLORS[theme.background] || SCRAPBOOK_GRID_COLORS.red_candy,
    fontClass: getScrapbookFontClass(theme.font),
  };
}
