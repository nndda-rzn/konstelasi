export const AUTH_PALETTE = {
  red: "#9D0208",
  redCandy: "#E63946",
  gold: "#D9A441",
  peach: "#FFB4A2",
  pink: "#FFCAD4",
  cream: "#FFF4D8",
  base: "#FFFAF7",
} as const;

export type AuthPaletteKey = keyof typeof AUTH_PALETTE;
