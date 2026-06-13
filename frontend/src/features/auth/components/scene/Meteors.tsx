"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SKY_RADIUS } from "./data/constellations";

const POOL_SIZE = 3;
const MIN_INTERVAL = 30;
const MAX_INTERVAL = 60;
const METEOR_DURATION = 0.9;
const METEOR_LENGTH = 8;

interface MeteorShot {
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  startTime: number;
}

interface MeteorsProps {
  active: boolean;
}

export function Meteors({ active }: MeteorsProps) {
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const [shots, setShots] = useState<MeteorShot[]>([]);
  const nextShotTime = useRef(0);

  const geometry = useMemo(() => {
    const positions = new Float32Array(POOL_SIZE * 6);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;

    if (t >= nextShotTime.current) {
      const interval =
        MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      nextShotTime.current = t + interval;
      spawnMeteor(setShots);
    }

    const pos = geometry.attributes.position as THREE.BufferAttribute;
    pos.array.fill(0);
    let liveCount = 0;
    const now = performance.now() / 1000;
    shots.forEach((shot) => {
      const age = now - shot.startTime;
      if (age < 0 || age > METEOR_DURATION) return;
      const head = shot.origin
        .clone()
        .add(shot.velocity.clone().multiplyScalar(age));
      const tail = head
        .clone()
        .sub(shot.velocity.clone().multiplyScalar(0.15));
      pos.array[liveCount * 6 + 0] = head.x;
      pos.array[liveCount * 6 + 1] = head.y;
      pos.array[liveCount * 6 + 2] = head.z;
      pos.array[liveCount * 6 + 3] = tail.x;
      pos.array[liveCount * 6 + 4] = tail.y;
      pos.array[liveCount * 6 + 5] = tail.z;
      liveCount++;
    });
    pos.needsUpdate = true;
    if (matRef.current) {
      matRef.current.opacity = liveCount > 0 ? 0.85 : 0;
    }
  });

  return (
    <lineSegments geometry={geometry} renderOrder={2}>
      <lineBasicMaterial
        ref={matRef}
        color={"#FFF4D8"}
        transparent
        depthWrite={false}
        opacity={0}
      />
    </lineSegments>
  );
}

function spawnMeteor(setShots: React.Dispatch<React.SetStateAction<MeteorShot[]>>) {
  const r = SKY_RADIUS * 1.0;
  const origin = new THREE.Vector3(
    (Math.random() - 0.5) * r * 1.6,
    Math.random() * r * 0.6 + r * 0.2,
    (Math.random() - 0.5) * r * 1.6,
  );
  const target = new THREE.Vector3(
    origin.x - (Math.random() - 0.5) * r * 0.4,
    origin.y - r * 0.3,
    origin.z - (Math.random() - 0.5) * r * 0.4,
  );
  const direction = target.sub(origin).normalize().multiplyScalar(METEOR_LENGTH);
  setShots((prev) => {
    const now = performance.now() / 1000;
    const next = prev.filter((s) => now - s.startTime < METEOR_DURATION);
    next.push({ origin, velocity: direction, startTime: now });
    return next.slice(-POOL_SIZE);
  });
}
