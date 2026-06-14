"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SoftStarFieldProps {
  count: number;
  enableTwinkle: boolean;
}

/**
 * SoftStarField - Subtle ambient particles like distant stars.
 * Warm cream/white dots with gentle opacity oscillation.
 */
export function SoftStarField({ count, enableTwinkle }: SoftStarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions and attributes
  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across a wide but shallow area behind the strip
      pos[i * 3] = (Math.random() - 0.5) * 12;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;  // y
      pos[i * 3 + 2] = -1 - Math.random() * 6;      // z (behind strip)

      sz[i] = 0.015 + Math.random() * 0.025; // small dots
      ph[i] = Math.random() * Math.PI * 2;   // phase offset for twinkle
    }

    return { positions: pos, sizes: sz, phases: ph };
  }, [count]);

  // Custom shader for soft circular dots with optional twinkle
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uEnableTwinkle: { value: enableTwinkle ? 1.0 : 0.0 },
        uBaseOpacity: { value: 0.25 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uEnableTwinkle;
        varying float vOpacity;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          // Size attenuation
          gl_PointSize = aSize * 300.0 / -mvPosition.z;
          gl_PointSize = clamp(gl_PointSize, 1.0, 6.0);

          // Twinkle: slow sine oscillation
          float twinkle = sin(uTime * 0.8 + aPhase) * 0.5 + 0.5;
          vOpacity = mix(1.0, twinkle, uEnableTwinkle);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uBaseOpacity;
        varying float vOpacity;

        void main() {
          // Soft circle
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.1, d) * uBaseOpacity * vOpacity;
          gl_FragColor = vec4(0.96, 0.94, 0.91, alpha); // warm cream
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [enableTwinkle]);

  // Update time uniform
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
      </bufferGeometry>
    </points>
  );
}
