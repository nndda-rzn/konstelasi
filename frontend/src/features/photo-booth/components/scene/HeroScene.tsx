"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "@/features/auth/hooks/useReducedMotion";
import { FloatingPhotoStrip } from "./FloatingPhotoStrip";
import { SoftStarField } from "./SoftStarField";
import { ConstellationLines } from "./ConstellationLines";
import { PhotoStripSample } from "../PhotoStripSample";

// Dynamic import - no SSR for Three.js
// This component is NOT dynamically imported itself because it's already
// inside a client-only WelcomeScreen. The Canvas handles its own mounting.

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
 * HeroScene - SSR-safe 3D hero for the Photo Booth welcome screen.
 *
 * - Detects WebGL; falls back to 2D PhotoStripSample if unavailable
 * - Detects mobile for performance adjustments
 * - Detects reduced motion for animation control
 * - Canvas is transparent, HTML content shows through
 * - Contains: FloatingPhotoStrip, SoftStarField, ConstellationLines
 */
export function HeroScene({ className = "" }: HeroSceneProps) {
  const [ready, setReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  // Mouse parallax state (shared with scene children)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [parallaxEnabled, setParallaxEnabled] = useState(false);

  useEffect(() => {
    setHasWebGL(detectWebGL());
    setIsMobile(detectMobile());
    setReady(true);

    // Check touch device
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

  // Generate constellation anchor points (fixed, not random per render)
  const constellationAnchors = useMemo(() => {
    const count = isMobile ? 5 : 8;
    const anchors: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      anchors.push([
        (Math.sin(i * 1.7) * 0.5 + 0.5) * 8 - 4,
        (Math.cos(i * 2.3) * 0.5 + 0.5) * 5 - 2.5,
        -2 - (i % 3) * 1.5,
      ]);
    }
    return anchors;
  }, [isMobile]);

  // Fallback: existing 2D photo strip
  if (!ready || hasWebGL === null || !hasWebGL) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <PhotoStripSample />
      </div>
    );
  }

  const particleCount = isMobile ? 35 : 70;

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 5], fov: 40, near: 0.1, far: 50 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Warm ambient lighting */}
        <ambientLight intensity={0.7} color="#FFF5F0" />
        <directionalLight
          position={[2, 3, 5]}
          intensity={0.35}
          color="#FFF8F0"
        />
        <directionalLight
          position={[-1, -1, 3]}
          intensity={0.15}
          color="#E8D4F0"
        />

        {/* Main 3D element */}
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
          maxDistance={3.5}
          opacity={0.08}
        />
      </Canvas>
    </div>
  );
}
