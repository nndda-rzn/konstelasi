"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface ConstellationLinesProps {
  starPositions: [number, number, number][];
  maxDistance: number;
  opacity: number;
}

/**
 * ConstellationLines - Subtle connecting lines between nearby particles.
 * Rendered as thin lines with very low opacity.
 */
export function ConstellationLines({
  starPositions,
  maxDistance,
  opacity,
}: ConstellationLinesProps) {
  const geometry = useMemo(() => {
    const vertices: number[] = [];

    for (let i = 0; i < starPositions.length; i++) {
      for (let j = i + 1; j < starPositions.length; j++) {
        const [x1, y1, z1] = starPositions[i];
        const [x2, y2, z2] = starPositions[j];
        const dist = Math.sqrt(
          (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
        );

        if (dist < maxDistance) {
          vertices.push(x1, y1, z1, x2, y2, z2);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return geo;
  }, [starPositions, maxDistance]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#8C7783"
        transparent
        opacity={opacity}
        depthWrite={false}
        linewidth={1}
      />
    </lineSegments>
  );
}
