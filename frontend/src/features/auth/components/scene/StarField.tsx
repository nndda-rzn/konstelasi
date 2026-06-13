"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SKY_RADIUS } from "./data/constellations";

// Night-sky star colors: soft white, soft blue-white, muted gold.
const SOFT_WHITE = new THREE.Color("#F8F4EF");
const BLUE_WHITE = new THREE.Color("#C9D4E8");
const MUTED_GOLD = new THREE.Color("#D99A2B");

interface StarFieldProps {
  count: number;
  enableTwinkle: boolean;
  seed?: number;
}

/**
 * StarField - Points-based night-sky star field.
 *
 * Most stars are small and dim; only ~6% are bright. Colors stay in the
 * soft white / blue-white / muted gold range to read as a real night sky
 * rather than colorful particle noise. Twinkle is very subtle and can be
 * disabled (mobile / reduced-motion).
 */
export function StarField({ count, enableTwinkle, seed = 42 }: StarFieldProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const baseAlpha = new Float32Array(count);

    const rng = mulberry32(seed);
    const r = SKY_RADIUS * 1.35;

    for (let i = 0; i < count; i++) {
      const u = rng();
      const v = rng();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const colorRoll = rng();
      const c =
        colorRoll < 0.62
          ? SOFT_WHITE
          : colorRoll < 0.9
            ? BLUE_WHITE
            : MUTED_GOLD;
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // ~6% bright stars, the rest small and dim.
      const bright = rng() < 0.06;
      sizes[i] = bright ? 2.0 + rng() * 1.4 : 0.7 + rng() * 0.9;
      baseAlpha[i] = bright ? 0.7 + rng() * 0.3 : 0.25 + rng() * 0.35;
      phases[i] = rng() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(baseAlpha, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uTwinkle: { value: enableTwinkle ? 1.0 : 0.0 },
        uPixelRatio: { value: 1 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        attribute float aAlpha;
        uniform float uTime;
        uniform float uTwinkle;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          float tw = 1.0;
          if (uTwinkle > 0.5) {
            tw = 0.82 + 0.18 * sin(uTime * 1.2 + aPhase);
          }
          vAlpha = aAlpha * tw;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (300.0 / -mv.z);
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
          gl_FragColor = vec4(vColor, core * vAlpha);
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
