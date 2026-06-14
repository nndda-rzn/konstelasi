/**
 * Constellation data for the auth background stellarium scene.
 *
 * Flat data-driven constellations: each star has world-ish coordinates
 * (x, y on the view plane, z for slight depth), a size and base opacity.
 * Connections reference star ids. The scene places each constellation
 * group at a fixed position in front of the camera so it reads as a
 * deliberate celestial pattern, not random noise.
 */

export interface ConstellationStar {
  id: string;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
}

export interface ConstellationDef {
  name: string;
  /** group position in world space (camera looks -Z from origin) */
  position: [number, number, number];
  scale: number;
  /** line opacity multiplier */
  lineOpacity: number;
  /** custom line color override (hex). Defaults to gold. */
  lineColor?: string;
  stars: ConstellationStar[];
  connections: [string, string][];
}

// ──────────────────────────────────────────────────────────
// Primary — organic celestial pattern behind the hero heading.
// 10 stars, 10 connections, warm gold lines.
// ──────────────────────────────────────────────────────────
const MAIN_STARS: ConstellationStar[] = [
  { id: "a", x: -3.2, y: 1.1, z: -1, size: 0.095, opacity: 0.95 },
  { id: "b", x: -2.4, y: 1.7, z: -1, size: 0.065, opacity: 0.75 },
  { id: "c", x: -1.6, y: 0.9, z: -1, size: 0.085, opacity: 0.9 },
  { id: "d", x: -0.7, y: 1.25, z: -1, size: 0.06, opacity: 0.7 },
  { id: "e", x: 0.15, y: 0.45, z: -1, size: 0.1, opacity: 1 },
  { id: "f", x: 0.9, y: 1.0, z: -1, size: 0.07, opacity: 0.78 },
  { id: "g", x: 1.8, y: 0.35, z: -1, size: 0.085, opacity: 0.88 },
  { id: "h", x: 2.4, y: -0.45, z: -1, size: 0.06, opacity: 0.68 },
  { id: "i", x: 1.1, y: -1.0, z: -1, size: 0.075, opacity: 0.8 },
  { id: "j", x: -0.3, y: -0.8, z: -1, size: 0.065, opacity: 0.75 },
];

const MAIN_CONNECTIONS: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["d", "e"],
  ["e", "f"],
  ["f", "g"],
  ["g", "h"],
  ["e", "j"],
  ["j", "i"],
  ["i", "g"],
];

// ──────────────────────────────────────────────────────────
// Secondary — smaller, upper-right, purely for depth.
// ──────────────────────────────────────────────────────────
const SECONDARY_STARS: ConstellationStar[] = [
  { id: "a", x: -1.2, y: 0.8, z: 0, size: 0.06, opacity: 0.7 },
  { id: "b", x: -0.4, y: 1.1, z: 0, size: 0.05, opacity: 0.6 },
  { id: "c", x: 0.3, y: 0.5, z: 0, size: 0.07, opacity: 0.8 },
  { id: "d", x: 1.1, y: 0.8, z: 0, size: 0.05, opacity: 0.55 },
  { id: "e", x: 0.6, y: -0.4, z: 0, size: 0.055, opacity: 0.6 },
];

const SECONDARY_CONNECTIONS: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["c", "e"],
];

// ──────────────────────────────────────────────────────────
// Tertiary — Cygnus-inspired swan shape, lower-left.
// 7 stars, 8 connections, warm gold lines.
// ──────────────────────────────────────────────────────────
const TERTIARY_STARS: ConstellationStar[] = [
  { id: "a", x: -2.0, y: 2.0, z: 0, size: 0.09, opacity: 0.88 },
  { id: "b", x: 0.5, y: 1.0, z: 0, size: 0.06, opacity: 0.7 },
  { id: "c", x: 2.0, y: 0.3, z: 0, size: 0.065, opacity: 0.72 },
  { id: "d", x: 0.0, y: 0.0, z: 0, size: 0.1, opacity: 0.92 },
  { id: "e", x: -0.5, y: -0.8, z: 0, size: 0.06, opacity: 0.7 },
  { id: "f", x: 1.0, y: -1.5, z: 0, size: 0.055, opacity: 0.65 },
  { id: "g", x: 0.3, y: -2.0, z: 0, size: 0.05, opacity: 0.6 },
];

const TERTIARY_CONNECTIONS: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["d", "a"],
  ["d", "e"],
  ["e", "f"],
  ["f", "g"],
  ["b", "e"],
];

// ──────────────────────────────────────────────────────────
// Quaternary — mini diamond, center-right, very subtle.
// 4 stars, 3 connections, blue-white lines.
// ──────────────────────────────────────────────────────────
const QUATERNARY_STARS: ConstellationStar[] = [
  { id: "a", x: -0.6, y: 0.4, z: 0, size: 0.06, opacity: 0.65 },
  { id: "b", x: 0.0, y: 0.9, z: 0, size: 0.05, opacity: 0.55 },
  { id: "c", x: 0.6, y: 0.4, z: 0, size: 0.065, opacity: 0.68 },
  { id: "d", x: 0.0, y: -0.4, z: 0, size: 0.05, opacity: 0.5 },
];

const QUATERNARY_CONNECTIONS: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
];

export const CONSTELLATION_DEFS: ConstellationDef[] = [
  {
    name: "Primary",
    position: [-2.4, 0.6, -8],
    scale: 1.7,
    lineOpacity: 0.34,
    stars: MAIN_STARS,
    connections: MAIN_CONNECTIONS,
  },
  {
    name: "Secondary",
    position: [5.2, 3.0, -13],
    scale: 1.15,
    lineOpacity: 0.2,
    stars: SECONDARY_STARS,
    connections: SECONDARY_CONNECTIONS,
  },
  {
    name: "Tertiary",
    position: [-4.5, -2.5, -10],
    scale: 1.3,
    lineOpacity: 0.26,
    stars: TERTIARY_STARS,
    connections: TERTIARY_CONNECTIONS,
  },
  {
    name: "Quaternary",
    position: [2.0, 1.5, -14],
    scale: 1.0,
    lineOpacity: 0.18,
    lineColor: "#C9D4E8",
    stars: QUATERNARY_STARS,
    connections: QUATERNARY_CONNECTIONS,
  },
];

export const SKY_RADIUS = 50;
