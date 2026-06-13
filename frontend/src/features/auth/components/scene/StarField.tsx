"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SKY_RADIUS } from "./data/constellations";

const CREAM = new THREE.Color("#FFF4D8");
const GOLD = new THREE.Color("#D9A441");
const PEACH = new THREE.Color("#FFB4A2");

interface StarFieldProps {
  count: number;
  enableTwinkle: boolean;
  seed?: number;
}

/**
 * StarField - Points-based random background stars.
 *
 * Distributed on a sphere just inside the skybox. Each star has a
 * random color (mostly cream/gold, occasional peach), size, and twinkle
 * phase. `enableTwinkle=false` disables per-frame shader updates
 * (used for mobile / reduced-motion).
 */
export function StarField({ count, enableTwinkle, seed = 42 }: StarFieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const rng = mulberry32(seed);
    const palette = [CREAM, GOLD, PEACH];
    const r = SKY_RADIUS * 1.35;

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const colorRoll = rng();
      const c =
        colorRoll < 0.7
          ? palette[0]
          : colorRoll < 0.92
            ? palette[1]
            : palette[2];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 1.2 + rng() * 2.0;
      phases[i] = rng() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTwinkle: { value: enableTwinkle ? 1.0 : 0.0 },
        uPixelRatio: { value: 1 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uTwinkle;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          float twinkle = 1.0;
          if (uTwinkle > 0.5) {
            twinkle = 0.55 + 0.45 * sin(uTime * 1.6 + aPhase);
          }
          vAlpha = twinkle;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (420.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float halo = smoothstep(0.5, 0.15, d) * 0.5;
          float a = (core + halo) * vAlpha;
          gl_FragColor = vec4(vColor, a);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [count, enableTwinkle, seed]);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points renderOrder={0}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" ref={matRef} />
    </points>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
