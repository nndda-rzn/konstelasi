"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const FRAME_COLORS = [
  "#FFE0E8", // dusty pink
  "#F2E4C8", // muted gold
  "#E8DEF2", // soft lavender
  "#FCDCE6", // blush pink
];

interface FloatingPhotoStripProps {
  reducedMotion: boolean;
  parallax: { x: number; y: number; enabled: boolean };
}

/**
 * FloatingPhotoStrip - 3D printed photo booth strip.
 * Very thin depth (like real photo paper) with bright pastel frames.
 * Uses Float for gentle bobbing and mouse-driven parallax tilt.
 */
export function FloatingPhotoStrip({ reducedMotion, parallax }: FloatingPhotoStripProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle parallax tilt
  useFrame(() => {
    if (!groupRef.current || !parallax.enabled) return;
    const targetRotY = parallax.x * 0.08;
    const targetRotX = -parallax.y * 0.05;
    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * 0.04;
  });

  // Strip dimensions
  const stripWidth = 1.0;
  const stripHeight = 2.8;
  const stripDepth = 0.03; // Very thin - like real printed card
  const frameGap = 0.05;
  const frameWidth = stripWidth - frameGap * 2;
  const usableHeight = stripHeight - 0.5 - frameGap * 2; // Reserve space for footer
  const frameHeight = (usableHeight - frameGap * 3) / 4;

  // Frame Y positions (top to bottom)
  const frameYPositions = useMemo(() => {
    const startY = stripHeight / 2 - 0.18 - frameHeight / 2;
    return [0, 1, 2, 3].map(
      (i) => startY - i * (frameHeight + frameGap)
    );
  }, [frameHeight]);

  return (
    <Float
      speed={reducedMotion ? 0 : 1.5}
      rotationIntensity={reducedMotion ? 0 : 0.04}
      floatIntensity={reducedMotion ? 0 : 0.08}
      floatingRange={[-0.04, 0.04]}
    >
      <group ref={groupRef}>
        {/* Strip backing - warm cream paper */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[stripWidth, stripHeight, stripDepth]} />
          <meshStandardMaterial
            color="#FAF6EF"
            roughness={0.9}
            metalness={0.0}
            emissive="#FFF8F0"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Photo frames - bright pastels using MeshBasicMaterial for guaranteed vibrancy */}
        {FRAME_COLORS.map((color, i) => (
          <mesh
            key={i}
            position={[0, frameYPositions[i], stripDepth / 2 + 0.002]}
          >
            <boxGeometry args={[frameWidth, frameHeight, 0.005]} />
            <meshBasicMaterial color={color} />
          </mesh>
        ))}

        {/* Subtle frame highlights for "paper" feel */}
        {FRAME_COLORS.map((color, i) => (
          <mesh
            key={`hl-${i}`}
            position={[frameWidth * 0.15, frameYPositions[i] + frameHeight * 0.15, stripDepth / 2 + 0.005]}
          >
            <planeGeometry args={[frameWidth * 0.4, frameHeight * 0.25]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Brand mark - small red dot */}
        <mesh position={[-0.12, -stripHeight / 2 + 0.12, stripDepth / 2 + 0.003]}>
          <circleGeometry args={[0.018, 16]} />
          <meshBasicMaterial color="#E63946" />
        </mesh>

        {/* Soft contact shadow plane underneath */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -stripHeight / 2 - 0.08, -stripDepth / 2]}
        >
          <planeGeometry args={[stripWidth * 1.3, 0.4]} />
          <meshBasicMaterial
            color="#5A3E4C"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
