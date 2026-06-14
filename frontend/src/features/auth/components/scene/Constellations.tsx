"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CONSTELLATION_DEFS,
  type ConstellationDef,
} from "./data/constellations";
import { makeStarTexture } from "./three-utils";

const LINE_GOLD = new THREE.Color("#F2B84B");

// Stagger timing (seconds) for each constellation index
const STAGGER_DELAYS = [0.0, 0.4, 0.8, 1.2];
const FADE_DURATION = 0.8;

interface ConstellationsProps {
  active: boolean;
}

/**
 * Constellations - Renders all constellation definitions with staggered
 * fade-in on mount. Stars use a glow sprite; lines use additive blending.
 * Active: cycles through stagger. Reduced-motion: instant full opacity.
 */
export function Constellations({ active }: ConstellationsProps) {
  const texture = useMemo(() => makeStarTexture(64), []);
  const mountTime = useRef(-1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    mountTime.current = performance.now() / 1000;
    setMounted(true);
    return () => { mountTime.current = -1; };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  if (!mounted) return null;

  return (
    <>
      {CONSTELLATION_DEFS.map((def, i) => (
        <ConstellationGroup
          key={def.name}
          def={def}
          texture={texture}
          active={active}
          staggerDelay={STAGGER_DELAYS[i] ?? 0}
          mountTime={mountTime}
        />
      ))}
    </>
  );
}

function ConstellationGroup({
  def,
  texture,
  active,
  staggerDelay,
  mountTime,
}: {
  def: ConstellationDef;
  texture: THREE.Texture;
  active: boolean;
  staggerDelay: number;
  mountTime: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const elapsed = useRef(0);

  // Resolve line color from def or default to warm gold
  const lineColor = useMemo(
    () => (def.lineColor ? new THREE.Color(def.lineColor) : LINE_GOLD),
    [def.lineColor],
  );

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
      color: lineColor,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { starGeo: sGeo, starMat: sMat, lineGeo: lGeo, lineMat: lMat };
  }, [def, texture, lineColor]);

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

    // Staggered fade-in: progress based on time since mount + delay
    if (active && mountTime.current > 0) {
      const now = performance.now() / 1000;
      const since = now - mountTime.current - staggerDelay;
      elapsed.current = Math.max(
        0,
        Math.min(1, since / FADE_DURATION),
      );
    } else {
      // reducedMotion: instant full opacity
      elapsed.current = 1;
    }

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
