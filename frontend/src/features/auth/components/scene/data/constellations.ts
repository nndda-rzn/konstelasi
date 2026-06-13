/**
 * Constellation data for the auth background stellarium scene.
 *
 * Each constellation is a flat patch of stars in local 2D coordinates
 * (z = 0) with line connections. The patch is placed on the celestial
 * sphere via `pivot` spherical coordinates.
 *
 * Coordinates are simplified for visual recognition, not astronomical
 * accuracy. Users should recognize the familiar shapes of these
 * famous constellations.
 */

export interface ConstellationStar {
  x: number;
  y: number;
  z?: number;
  size?: number;
}

export interface ConstellationData {
  name: string;
  pivot: { theta: number; phi: number };
  scale: number;
  stars: ConstellationStar[];
  lines: [number, number][];
}

const SKY_RADIUS = 50;

export const CONSTELLATIONS: ConstellationData[] = [
  {
    name: "Orion",
    pivot: { theta: 0, phi: 0 },
    scale: 1.5,
    stars: [
      { x: -2.0, y: 1.4, size: 1.0 },
      { x: 2.0, y: 1.4, size: 1.0 },
      { x: -1.0, y: 0, size: 1.4 },
      { x: 0, y: 0, size: 1.4 },
      { x: 1.0, y: 0, size: 1.4 },
      { x: -1.6, y: -1.4, size: 1.0 },
      { x: 1.6, y: -1.4, size: 1.0 },
    ],
    lines: [
      [0, 1],
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
    ],
  },
  {
    name: "Crux",
    pivot: { theta: -0.35 * Math.PI, phi: -0.2 * Math.PI },
    scale: 1.4,
    stars: [
      { x: 0, y: 2.0, size: 1.2 },
      { x: 0, y: -2.0, size: 1.2 },
      { x: 1.0, y: 0, size: 1.4 },
      { x: -1.0, y: 0, size: 1.4 },
    ],
    lines: [
      [0, 2],
      [2, 1],
      [1, 3],
      [3, 0],
    ],
  },
  {
    name: "Scorpius",
    pivot: { theta: 0.35 * Math.PI, phi: -0.15 * Math.PI },
    scale: 1.6,
    stars: [
      { x: 0, y: 2.0, size: 1.0 },
      { x: -0.6, y: 1.4, size: 1.0 },
      { x: -1.2, y: 0.8, size: 1.0 },
      { x: -1.5, y: 0, size: 1.2 },
      { x: -1.4, y: -0.8, size: 1.0 },
      { x: -1.0, y: -1.5, size: 1.4 },
      { x: 0.2, y: -1.9, size: 1.0 },
      { x: 1.4, y: -1.8, size: 1.0 },
      { x: 2.4, y: -1.4, size: 1.2 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
    ],
  },
  {
    name: "Ursa Major",
    pivot: { theta: -0.3 * Math.PI, phi: 0.3 * Math.PI },
    scale: 1.5,
    stars: [
      { x: 0, y: 0, size: 1.2 },
      { x: 1.0, y: 0.4, size: 1.0 },
      { x: 2.0, y: 0.2, size: 1.0 },
      { x: 3.0, y: -0.2, size: 1.2 },
      { x: -1.0, y: 0.5, size: 1.0 },
      { x: -2.0, y: 0.2, size: 1.0 },
      { x: -3.0, y: -0.2, size: 1.2 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    name: "Cassiopeia",
    pivot: { theta: 0.3 * Math.PI, phi: 0.25 * Math.PI },
    scale: 1.3,
    stars: [
      { x: -2.0, y: 0, size: 1.0 },
      { x: -1.0, y: 0.8, size: 1.0 },
      { x: 0, y: 0, size: 1.2 },
      { x: 1.0, y: 0.8, size: 1.0 },
      { x: 2.0, y: 0, size: 1.0 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
];

export { SKY_RADIUS };
