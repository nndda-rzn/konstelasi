"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface ConstellationLinesProps {
  starPositions: [number, number, number][];
  opacity: number;
}

/**
 * ConstellationLines - Curated, intentional connecting lines.
 * Uses a fixed pattern of connections (not random nearest-neighbor)
 * to create a tasteful constellation feel without clutter.
 */
export function ConstellationLines({
  starPositions,
  opacity,
}: ConstellationLinesProps) {
  const geometry = useMemo(() => {
    const vertices: number[] = [];

    // Use intentional connection pattern - sequential + skip-one
    // This creates a graceful flowing pattern instead of a chaotic web
    for (let i = 0; i < starPositions.length; i++) {
      const next = (i + 1) % starPositions.length;
      const skip = (i + 2) % starPositions.length;

      // Direct neighbor connection
      const [x1, y1, z1] = starPositions[i];
      const [x2, y2, z2] = starPositions[next];
      const dist = Math.sqrt(
        (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
      );

      // Only connect if reasonable distance (not too far, not too close)
      if (dist < 4 && dist > 1.5) {
        vertices.push(x1, y1, z1, x2, y2, z2);
      }

      // Occasional skip connection for visual interest
      if (i % 3 === 0) {
        const [x3, y3, z3] = starPositions[skip];
        const dist2 = Math.sqrt(
          (x3 - x1) ** 2 + (y3 - y1) ** 2 + (z3 - z1) ** 2
        );
        if (dist2 < 3.5 && dist2 > 2) {
          vertices.push(x1, y1, z1, x3, y3, z3);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return geo;
  }, [starPositions]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#C9A876"
        transparent
        opacity={opacity}
        depthWrite={false}
        linewidth={1}
      />
    </lineSegments>
  );
}
