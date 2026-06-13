"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { SKY_RADIUS } from "./data/constellations";

// Deep night-sky palette: navy / violet-black with a faint warm ember
// near the very bottom. Intentionally NOT red-dominant.
const ZENITH = new THREE.Color("#070812");
const UPPER = new THREE.Color("#090A16");
const MID = new THREE.Color("#100714");
const HORIZON = new THREE.Color("#160A13");
const EMBER = new THREE.Color("#2A0E16");

/**
 * Skybox - Inward-facing sphere with a custom gradient shader.
 *
 * Gradient (top to bottom): deep navy-black zenith -> violet-black ->
 * burgundy-black -> a faint warm ember glow near the horizon.
 * Calm, cinematic, supports the form rather than competing with it.
 */
export function Skybox() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uZenith: { value: ZENITH },
        uUpper: { value: UPPER },
        uMid: { value: MID },
        uHorizon: { value: HORIZON },
        uEmber: { value: EMBER },
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
        uniform vec3 uUpper;
        uniform vec3 uMid;
        uniform vec3 uHorizon;
        uniform vec3 uEmber;
        varying vec3 vWorldPos;

        void main() {
          float h = normalize(vWorldPos).y;
          float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);

          vec3 col;
          if (t > 0.7) {
            col = mix(uUpper, uZenith, (t - 0.7) / 0.3);
          } else if (t > 0.42) {
            col = mix(uMid, uUpper, (t - 0.42) / 0.28);
          } else if (t > 0.18) {
            col = mix(uHorizon, uMid, (t - 0.18) / 0.24);
          } else {
            col = mix(uEmber, uHorizon, t / 0.18);
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
