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
  stars: ConstellationStar[];
  connections: [string, string][];
}

// Primary constellation — organic celestial pattern, placed left-of-center
// behind the hero heading. This is the visual hero of the night sky.
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

// Secondary constellation — smaller, dimmer, top-right, purely for depth.
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
];

export const SKY_RADIUS = 50;
