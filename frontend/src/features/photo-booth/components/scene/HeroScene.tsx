"use client";

import { useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "@/features/auth/hooks/useReducedMotion";
import { FloatingPhotoStrip } from "./FloatingPhotoStrip";
import { SoftStarField } from "./SoftStarField";
import { ConstellationLines } from "./ConstellationLines";
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
 * HeroScene - 3D hero for Photo Booth welcome screen.
 *
 * Architecture:
 * - Three.js renders a 3D printed photo card with thin depth
 * - Ambient particles + constellation lines in the background
 * - HTML content (text, buttons) sits above via z-index
 *
 * Performance:
 * - SSR safe with WebGL detection → 2D fallback
 * - Mobile detection for particle count tuning
 * - Reduced motion disables animations
 * - No 3D models, no heavy geometry, no textures
 */
export function HeroScene({ className = "" }: HeroSceneProps) {
  const [ready, setReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  // Mouse parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    setHasWebGL(detectWebGL());
    setIsMobile(detectMobile());
    setReady(true);

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setParallaxEnabled(!isTouch && !reduced);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    if (!parallaxEnabled) return;
    let raf: number;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      setMousePos({ x: current.x, y: current.y });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [parallaxEnabled]);

  // Curated constellation anchor points
  const constellationAnchors = useMemo<[number, number, number][]>(() => {
    if (isMobile) {
      return [
        [-3.0, 1.5, -3.0],
        [2.8, 1.8, -2.5],
        [-2.5, -1.2, -3.5],
        [2.5, -1.5, -3.0],
        [0.5, 2.0, -2.8],
      ];
    }
    return [
      [-3.5, 1.8, -3.0],
      [3.2, 2.0, -2.5],
      [-2.8, -1.5, -3.5],
      [3.0, -1.8, -3.0],
      [0.8, 2.5, -2.8],
      [-1.2, -2.2, -3.2],
      [4.0, 0.5, -3.0],
      [-4.0, -0.3, -3.0],
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

  const particleCount = isMobile ? 30 : 55;

  return (
    <div
      className={`relative ${className}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 4.5], fov: 40, near: 0.1, far: 50 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Bright warm lighting to keep the strip looking like printed paper */}
        <ambientLight intensity={1.2} color="#FFF8F0" />
        <directionalLight
          position={[2, 2, 4]}
          intensity={0.6}
          color="#FFFAF0"
        />
        <directionalLight
          position={[-1.5, 0, 3]}
          intensity={0.3}
          color="#FFE8D0"
        />
        <directionalLight
          position={[0, -1, 2]}
          intensity={0.2}
          color="#F0E0D0"
        />

        {/* Main 3D element - thin printed photo card */}
        <FloatingPhotoStrip
          reducedMotion={reducedMotion}
          parallax={{ x: mousePos.x, y: mousePos.y, enabled: parallaxEnabled }}
        />

        {/* Ambient particles */}
        <SoftStarField
          count={particleCount}
          enableTwinkle={!reducedMotion}
        />

        {/* Constellation connecting lines */}
        <ConstellationLines
          starPositions={constellationAnchors}
          opacity={0.18}
        />
      </Canvas>
    </div>
  );
}
