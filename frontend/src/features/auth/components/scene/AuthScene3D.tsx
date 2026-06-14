"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Skybox } from "./Skybox";
import { StarField } from "./StarField";
import { Constellations } from "./Constellations";
import { Meteors } from "./Meteors";

interface AuthScene3DProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

// ── Bright anchor stars (2 muted gold + 2 soft white) ──
// All on the left/center hemisphere, far from the login form on the right.
const BRIGHT_STARS = [
  { position: [-3.0, 1.8, -7], size: 0.14, color: new THREE.Color("#D99A2B") },
  { position: [-4.8, 0.3, -12], size: 0.13, color: new THREE.Color("#D99A2B") },
  { position: [1.5, -2.2, -9], size: 0.12, color: new THREE.Color("#F8F4EF") },
  { position: [-1.0, 3.2, -11], size: 0.11, color: new THREE.Color("#F8F4EF") },
];

const BRIGHT_STARS_MOBILE = BRIGHT_STARS.slice(0, 2);

export function AuthScene3D({ isMobile, reducedMotion }: AuthScene3DProps) {
  return (
    <Canvas
      dpr={[1, isMobile ? 1.25 : 1.5]}
      gl={{
        antialias: !isMobile,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{ position: [0, 0, 0.1], fov: 60, near: 0.1, far: 200 }}
      style={{ position: "absolute", inset: 0, background: "#05060D" }}
    >
      <ParallaxRig>
        <Skybox />
        <StarField
          count={isMobile ? 180 : 420}
          enableTwinkle={!isMobile && !reducedMotion}
          brightStars={isMobile ? BRIGHT_STARS_MOBILE : BRIGHT_STARS}
        />
        <Constellations active={!reducedMotion} />
        {!isMobile && !reducedMotion && <Meteors active />}
      </ParallaxRig>
    </Canvas>
  );
}

function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setEnabled(!isTouch);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = nx * 0.04;
      target.current.y = -ny * 0.04;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  useFrame(() => {
    if (!ref.current) return;
    if (!enabled) {
      ref.current.rotation.x = 0;
      ref.current.rotation.y = 0;
      return;
    }
    ref.current.rotation.y +=
      (target.current.x - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x +=
      (target.current.y - ref.current.rotation.x) * 0.05;
  });

  return <group ref={ref}>{children}</group>;
}
