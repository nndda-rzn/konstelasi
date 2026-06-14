"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SoftStarFieldProps {
  count: number;
  enableTwinkle: boolean;
}

/**
 * SoftStarField - Subtle ambient particles like dust in warm light.
 * Uses soft cream/muted-gold tones with gentle opacity oscillation.
 */
export function SoftStarField({ count, enableTwinkle }: SoftStarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, sizes, phases, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    const col = new Float32Array(count * 3);

    // Warm palette: cream, muted gold, dusty pink
    const palette = [
      new THREE.Color("#FFF8F0"), // cream
      new THREE.Color("#F0E0C0"), // muted gold
      new THREE.Color("#F5D0D8"), // dusty pink
      new THREE.Color("#E8DCC8"), // warm beige
    ];

    for (let i = 0; i < count; i++) {
      // Spread particles in a gentle ring around the center
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 5;
      pos[i * 3] = Math.cos(angle) * radius;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7; // y
      pos[i * 3 + 2] = -1 - Math.random() * 4;    // z (behind strip)

      sz[i] = 0.012 + Math.random() * 0.022; // small dots
      ph[i] = Math.random() * Math.PI * 2;   // phase offset

      // Pick a color from palette
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, sizes: sz, phases: ph, colors: col };
  }, [count]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uEnableTwinkle: { value: enableTwinkle ? 1.0 : 0.0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        attribute vec3 aColor;
        uniform float uTime;
        uniform float uEnableTwinkle;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          // Size attenuation
          gl_PointSize = aSize * 320.0 / -mvPosition.z;
          gl_PointSize = clamp(gl_PointSize, 1.0, 5.0);

          // Twinkle: very slow, subtle
          float twinkle = sin(uTime * 0.6 + aPhase) * 0.4 + 0.6;
          vOpacity = mix(0.85, twinkle, uEnableTwinkle);

          vColor = aColor;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          // Soft circle with falloff
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.0, d) * 0.35 * vOpacity;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [enableTwinkle]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
      </bufferGeometry>
    </points>
  );
}
