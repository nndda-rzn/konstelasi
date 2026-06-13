"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CONSTELLATION_DEFS,
  type ConstellationDef,
} from "./data/constellations";
import { makeStarTexture } from "./three-utils";

const LINE_GOLD = new THREE.Color("#F2B84B");

interface ConstellationsProps {
  active: boolean;
}

/**
 * Constellations - Renders all constellation definitions simultaneously
 * as fixed celestial patterns (data-driven). Stars use a glow sprite;
 * lines use additive LineSegments. Subtle group-level twinkle/drift.
 */
export function Constellations({ active }: ConstellationsProps) {
  const texture = useMemo(() => makeStarTexture(64), []);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <>
      {CONSTELLATION_DEFS.map((def) => (
        <ConstellationGroup
          key={def.name}
          def={def}
          texture={texture}
          active={active}
        />
      ))}
    </>
  );
}

function ConstellationGroup({
  def,
  texture,
  active,
}: {
  def: ConstellationDef;
  texture: THREE.Texture;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const elapsed = useRef(0);

  const { starGeo, starMat, lineGeo, lineMat } = useMemo(() => {
    const index = new Map(def.stars.map((s, i) => [s.id, i]));

    const positions = new Float32Array(def.stars.length * 3);
    const sizes = new Float32Array(def.stars.length);
    const opacities = new Float32Array(def.stars.length);
    def.stars.forEach((s, i) => {
      positions[i * 3 + 0] = s.x * def.scale;
      positions[i * 3 + 1] = s.y * def.scale;
      positions[i * 3 + 2] = s.z * def.scale;
      sizes[i] = s.size * def.scale;
      opacities[i] = s.opacity;
    });

    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    sGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    sGeo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));

    // Custom shader points so each star keeps its own size + opacity,
    // with a soft glow sprite and very subtle twinkle.
    const sMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTex: { value: texture },
        uPixelRatio: { value: 1 },
        uFade: { value: 0 },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vOpacity;
        void main() {
          float tw = 0.85 + 0.15 * sin(uTime * 1.4 + position.x * 3.0 + position.y * 2.0);
          vOpacity = aOpacity * tw;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (900.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        uniform float uFade;
        varying float vOpacity;
        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vec3(1.0, 0.95, 0.82), t.a * vOpacity * uFade);
        }
      `,
    });

    // Lines
    const linePos: number[] = [];
    def.connections.forEach(([from, to]) => {
      const fi = index.get(from);
      const ti = index.get(to);
      if (fi === undefined || ti === undefined) return;
      const a = def.stars[fi];
      const b = def.stars[ti];
      linePos.push(
        a.x * def.scale,
        a.y * def.scale,
        a.z * def.scale,
        b.x * def.scale,
        b.y * def.scale,
        b.z * def.scale,
      );
    });
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linePos), 3),
    );
    const lMat = new THREE.LineBasicMaterial({
      color: LINE_GOLD,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { starGeo: sGeo, starMat: sMat, lineGeo: lGeo, lineMat: lMat };
  }, [def, texture]);

  useEffect(() => {
    return () => {
      starGeo.dispose();
      starMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [starGeo, starMat, lineGeo, lineMat]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // fade in once on mount
    elapsed.current = Math.min(1, elapsed.current + delta * 0.6);
    const fade = elapsed.current;

    if (starMatRef.current) {
      starMatRef.current.uniforms.uTime.value = t;
      starMatRef.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
      starMatRef.current.uniforms.uFade.value = fade;
    }
    lineMat.opacity = def.lineOpacity * fade;

    // very slow drift
    if (groupRef.current && active) {
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.015;
    }
  });

  return (
    <group ref={groupRef} position={def.position}>
      <points>
        <primitive object={starGeo} attach="geometry" />
        <primitive object={starMat} attach="material" ref={starMatRef} />
      </points>
      <lineSegments>
        <primitive object={lineGeo} attach="geometry" />
        <primitive object={lineMat} attach="material" />
      </lineSegments>
    </group>
  );
}
