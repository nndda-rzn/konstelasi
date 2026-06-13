"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CONSTELLATIONS, type ConstellationData, SKY_RADIUS } from "./data/constellations";

const GOLD = new THREE.Color("#D9A441");
const ROTATION_INTERVAL = 13;
const FADE_DURATION = 1.5;

interface ConstellationsProps {
  active: boolean;
}

export function Constellations({ active }: ConstellationsProps) {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(active ? 0 : 1);
  const elapsed = useRef(0);

  useEffect(() => {
    if (!active) {
      setOpacity(1);
      return;
    }
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % CONSTELLATIONS.length),
      ROTATION_INTERVAL * 1000,
    );
    return () => clearTimeout(id);
  }, [index, active]);

  useEffect(() => {
    if (active) elapsed.current = 0;
  }, [index, active]);

  useFrame((_, delta) => {
    if (!active) {
      setOpacity(1);
      return;
    }
    elapsed.current += delta;
    setOpacity(Math.min(1, elapsed.current / FADE_DURATION));
  });

  return <ConstellationGroup data={CONSTELLATIONS[index]!} opacity={opacity} />;
}

function ConstellationGroup({
  data,
  opacity,
}: {
  data: ConstellationData;
  opacity: number;
}) {
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const starMatRef = useRef<THREE.ShaderMaterial>(null);

  const { lineGeo, starGeo, starMat } = useMemo(() => {
    const starPositions = new Float32Array(data.stars.length * 3);
    const starSizes = new Float32Array(data.stars.length);
    data.stars.forEach((s, i) => {
      starPositions[i * 3 + 0] = s.x * data.scale;
      starPositions[i * 3 + 1] = s.y * data.scale;
      starPositions[i * 3 + 2] = (s.z ?? 0) * data.scale;
      starSizes[i] = (s.size ?? 1) * 6;
    });

    const linePositions = new Float32Array(data.lines.length * 6);
    data.lines.forEach(([a, b], i) => {
      const sa = data.stars[a];
      const sb = data.stars[b];
      if (!sa || !sb) return;
      linePositions[i * 6 + 0] = sa.x * data.scale;
      linePositions[i * 6 + 1] = sa.y * data.scale;
      linePositions[i * 6 + 2] = (sa.z ?? 0) * data.scale;
      linePositions[i * 6 + 3] = sb.x * data.scale;
      linePositions[i * 6 + 4] = sb.y * data.scale;
      linePositions[i * 6 + 5] = (sb.z ?? 0) * data.scale;
    });

    const lineG = new THREE.BufferGeometry();
    lineG.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const starG = new THREE.BufferGeometry();
    starG.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starG.setAttribute("aSize", new THREE.BufferAttribute(starSizes, 1));

    const starM = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: 1 } },
      vertexShader: `
        attribute float aSize;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (420.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float halo = smoothstep(0.5, 0.15, d) * 0.6;
          float a = (core + halo) * uOpacity;
          gl_FragColor = vec4(1.0, 0.85, 0.45, a);
        }
      `,
    });

    return { lineGeo: lineG, starGeo: starG, starMat: starM };
  }, [data]);

  useEffect(() => {
    if (lineMatRef.current) lineMatRef.current.opacity = opacity * 0.7;
    if (starMatRef.current) starMatRef.current.uniforms.uOpacity.value = opacity;
  }, [opacity]);

  useEffect(() => {
    return () => {
      lineGeo.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, [lineGeo, starGeo, starMat]);

  const groupPos = useMemo<[number, number, number]>(() => {
    const r = SKY_RADIUS * 0.92;
    const x = r * Math.cos(data.pivot.phi) * Math.cos(data.pivot.theta);
    const y = r * Math.sin(data.pivot.phi);
    const z = r * Math.cos(data.pivot.phi) * Math.sin(data.pivot.theta);
    return [x, y, z];
  }, [data]);

  return (
    <group position={groupPos}>
      <points>
        <primitive object={starGeo} attach="geometry" />
        <primitive object={starMat} attach="material" ref={starMatRef} />
      </points>
      <lineSegments>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial
          ref={lineMatRef}
          color={GOLD}
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
