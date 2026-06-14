"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const FRAME_COLORS = [
  "#FFE5E8", // soft pink
  "#F5ECD7", // warm beige
  "#EDE7F6", // lavender
  "#FCE4EC", // rose
];

interface FloatingPhotoStripProps {
  reducedMotion: boolean;
  parallax: { x: number; y: number; enabled: boolean };
}

/**
 * FloatingPhotoStrip - A 3D printed photo booth strip floating gently.
 * Uses Drei Float for ambient bobbing and mouse-driven parallax tilt.
 */
export function FloatingPhotoStrip({ reducedMotion, parallax }: FloatingPhotoStripProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle parallax tilt
  useFrame(() => {
    if (!groupRef.current || !parallax.enabled) return;
    const targetRotY = parallax.x * 0.06;
    const targetRotX = -parallax.y * 0.04;
    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * 0.04;
  });

  const stripWidth = 1.1;
  const stripHeight = 3.2;
  const stripDepth = 0.04;
  const frameGap = 0.06;
  const frameRadius = 0.03;
  const footerHeight = 0.35;

  // Compute frame positions (top to bottom)
  const usableHeight = stripHeight - footerHeight - frameGap * 2;
  const frameHeight = (usableHeight - frameGap * 3) / 4;
  const frameWidth = stripWidth - frameGap * 2;

  const frameYPositions = useMemo(() => {
    const startY = stripHeight / 2 - frameGap - frameHeight / 2 - 0.04;
    return [0, 1, 2, 3].map(
      (i) => startY - i * (frameHeight + frameGap)
    );
  }, [frameHeight]);

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      rotationIntensity={reducedMotion ? 0 : 0.08}
      floatIntensity={reducedMotion ? 0 : 0.12}
      floatingRange={[-0.06, 0.06]}
    >
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Strip backing */}
        <RoundedBox
          args={[stripWidth, stripHeight, stripDepth]}
          radius={0.06}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#FAF8F5"
            roughness={0.85}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Photo frames */}
        {FRAME_COLORS.map((color, i) => (
          <RoundedBox
            key={i}
            args={[frameWidth, frameHeight, stripDepth + 0.005]}
            radius={frameRadius}
            smoothness={4}
            position={[0, frameYPositions[i], stripDepth / 2 + 0.003]}
          >
            <meshStandardMaterial
              color={color}
              roughness={0.7}
              metalness={0.01}
            />
          </RoundedBox>
        ))}

        {/* Brand mark - small circle dot */}
        <mesh position={[-0.18, -stripHeight / 2 + 0.14, stripDepth / 2 + 0.003]}>
          <circleGeometry args={[0.025, 16]} />
          <meshStandardMaterial color="#E63946" roughness={0.5} />
        </mesh>

        {/* Shadow plane underneath */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -stripHeight / 2 - 0.15, -0.1]}
        >
          <planeGeometry args={[stripWidth * 1.2, 0.5]} />
          <meshBasicMaterial
            color="#6D5561"
            transparent
            opacity={0.06}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
