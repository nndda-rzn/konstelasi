/**
 * Shared font family options used by the TiptapEditor (content)
 * and the title font picker. Values reference CSS variables defined
 * in app/layout.tsx so they participate in the Next.js font pipeline.
 */
export interface FontOption {
  label: string;
  value: string;
}

export const FONT_OPTIONS: readonly FontOption[] = [
  { label: 'Default', value: '' },
  { label: 'Serif', value: 'var(--font-lora), Georgia, serif' },
  { label: 'Display', value: 'var(--font-playfair), Georgia, serif' },
  { label: 'Handwriting', value: 'var(--font-caveat), cursive' },
  { label: 'Script', value: 'var(--font-dancing), cursive' },
  { label: 'Monospace', value: 'var(--font-geist-mono), monospace' },
] as const;

/** Find a font option by its CSS value. Returns the Default option if not found. */
export function findFontOption(value: string | undefined): FontOption {
  return FONT_OPTIONS.find((o) => o.value === (value || '')) || FONT_OPTIONS[0];
}
