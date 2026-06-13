"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/features/auth/hooks/useReducedMotion";

const AuthScene3D = dynamic(
  () => import("./AuthScene3D").then((m) => m.AuthScene3D),
  { ssr: false },
);

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(ctx);
  } catch {
    return false;
  }
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

/**
 * AuthBackground - SSR-safe wrapper that mounts the stellarium 3D scene.
 *
 * - Dynamic import of the Canvas component (no SSR for Three.js)
 * - Detects WebGL availability; renders a gradient fallback if missing
 * - Detects prefers-reduced-motion and passes to scene
 * - Detects mobile viewport for performance adjustments
 * - Positioned fixed inset-0 with -z-10 so auth forms sit on top
 */
export function AuthBackground() {
  const [ready, setReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setHasWebGL(detectWebGL());
    setIsMobile(detectMobile());
    setReady(true);
  }, []);

  if (!ready || hasWebGL === null) {
    return <Fallback />;
  }

  if (!hasWebGL) {
    return <Fallback />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      <AuthScene3D isMobile={isMobile} reducedMotion={reducedMotion} />
    </div>
  );
}

function Fallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(ellipse at top, #4A1118 0%, #2A0A14 60%, #1a050a 100%)",
      }}
    />
  );
}
