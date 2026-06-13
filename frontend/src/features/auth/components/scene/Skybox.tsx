"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { SKY_RADIUS } from "./data/constellations";

const ZENITH = new THREE.Color("#2A0A14");
const MID = new THREE.Color("#4A1118");
const HORIZON = new THREE.Color("#6B1820");
const HAZE = new THREE.Color("#FFB4A2");

/**
 * Skybox - Inward-facing sphere with a custom gradient shader.
 *
 * Gradient (top to bottom):
 *   zenith (#2A0A14 dark wine)
 *   -> mid (#4A1118 dark red)
 *   -> horizon (#6B1820 red-brown)
 *   -> subtle peach haze near the very bottom (#FFB4A2)
 *
 * Positioned behind everything (renderOrder = -1) and does not respond
 * to scene parallax so the sky stays stable.
 */
export function Skybox() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uZenith: { value: ZENITH },
        uMid: { value: MID },
        uHorizon: { value: HORIZON },
        uHaze: { value: HAZE },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uZenith;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        uniform vec3 uHaze;
        varying vec3 vWorldPos;

        void main() {
          float h = normalize(vWorldPos).y;
          float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);

          vec3 col;
          if (t > 0.55) {
            float k = (t - 0.55) / 0.45;
            col = mix(uMid, uZenith, k);
          } else if (t > 0.2) {
            float k = (t - 0.2) / 0.35;
            col = mix(uHorizon, uMid, k);
          } else {
            float k = t / 0.2;
            col = mix(uHaze, uHorizon, k);
          }

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[SKY_RADIUS * 1.5, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
