"use client";

import { useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "@/features/auth/hooks/useReducedMotion";
import { SoftStarField } from "./SoftStarField";
import { ConstellationLines } from "./ConstellationLines";
import { PremiumPhotoStrip } from "./PremiumPhotoStrip";
import { PhotoStripSample } from "../PhotoStripSample";

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(ctx);
  } catch {
    return false;
  }
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

interface HeroSceneProps {
  className?: string;
}

/**
 * HeroScene - Hybrid 2.5D hero for Photo Booth welcome screen.
 *
 * Architecture:
 * - HTML/SVG for the main photo strip (looks like real printed paper)
 * - Three.js for ambient particles + constellation lines + subtle depth
 * - Canvas is transparent, HTML strip sits on top
 *
 * Performance:
 * - SSR safe with WebGL detection → 2D fallback
 * - Mobile detection for particle count tuning
 * - Reduced motion disables animations
 * - No 3D models, no heavy geometry
 */
export function HeroScene({ className = "" }: HeroSceneProps) {
  const [ready, setReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setHasWebGL(detectWebGL());
    setIsMobile(detectMobile());
    setReady(true);
  }, []);

  // Curated constellation anchor points - intentional, not random
  const constellationAnchors = useMemo<[number, number, number][]>(() => {
    if (isMobile) {
      return [
        [-3.2, 1.5, -2.5],
        [3.0, 1.8, -2.0],
        [-2.5, -1.2, -3.0],
        [2.8, -1.5, -2.5],
        [0.5, 2.2, -2.2],
      ];
    }
    return [
      [-3.5, 1.8, -2.5],
      [3.2, 2.0, -2.0],
      [-2.8, -1.5, -3.0],
      [3.0, -1.8, -2.5],
      [0.8, 2.5, -2.2],
      [-1.2, -2.2, -2.8],
      [4.0, 0.5, -2.5],
      [-4.0, -0.3, -2.5],
    ];
  }, [isMobile]);

  // Fallback: existing 2D photo strip
  if (!ready || hasWebGL === null || !hasWebGL) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <PhotoStripSample />
      </div>
    );
  }

  const particleCount = isMobile ? 25 : 50;

  return (
    <div className={`relative ${className}`}>
      {/* Three.js ambient layer (behind the HTML strip) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <Canvas
          dpr={[1, isMobile ? 1.25 : 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 8], fov: 40, near: 0.1, far: 50 }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <SoftStarField
            count={particleCount}
            enableTwinkle={!reducedMotion}
          />
          <ConstellationLines
            starPositions={constellationAnchors}
            opacity={0.15}
          />
        </Canvas>
      </div>

      {/* HTML photo strip (main visual) */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <PremiumPhotoStrip />
      </div>
    </div>
  );
}
