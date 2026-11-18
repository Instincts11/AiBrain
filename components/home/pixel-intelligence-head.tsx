"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/** Stylized voxel intelligence head — Meshy-style showcase object. */
function VoxelHead() {
  const group = useRef<THREE.Group>(null);

  const voxels = useMemo(() => {
    const cells: { pos: [number, number, number]; color: string; size: number }[] =
      [];

    // Head silhouette grid (x,y in head space; z layers)
    const map = [
      "001111100",
      "011111110",
      "111111111",
      "111010111", // eyes row
      "111111111",
      "011101110", // nose/mouth
      "001111100",
      "000111000",
      "000010000", // neck
      "000111000",
    ];

    const colors = ["#22d3ee", "#67e8f9", "#a78bfa", "#e879f9", "#38bdf8"];

    map.forEach((row, yi) => {
      [...row].forEach((ch, xi) => {
        if (ch !== "1") return;
        for (let zi = -1; zi <= 1; zi++) {
          // Thin the sides of depth
          if (Math.abs(zi) === 1 && (xi === 0 || xi === row.length - 1)) continue;
          const x = (xi - 4) * 0.22;
          const y = (4.2 - yi) * 0.22;
          const z = zi * 0.22;
          const eye =
            yi === 3 && (xi === 2 || xi === 6);
          cells.push({
            pos: [x, y, z],
            color: eye ? "#f0abfc" : colors[(xi + yi + zi + 3) % colors.length],
            size: eye ? 0.2 : 0.18,
          });
        }
      });
    });

    // Floating pixel debris
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      cells.push({
        pos: [
          Math.cos(a) * (1.5 + (i % 3) * 0.15),
          Math.sin(a * 1.7) * 0.9,
          Math.sin(a) * 1.1,
        ],
        color: colors[i % colors.length],
        size: 0.08 + (i % 3) * 0.02,
      });
    }

    return cells;
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
      group.current.rotation.x = Math.sin(Date.now() * 0.0006) * 0.08;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={group} position={[0, -0.15, 0]} scale={1.15}>
        {voxels.map((v, i) => (
          <mesh key={i} position={v.pos}>
            <boxGeometry args={[v.size, v.size, v.size]} />
            <meshStandardMaterial
              color={v.color}
              emissive={v.color}
              emissiveIntensity={0.55}
              metalness={0.35}
              roughness={0.25}
              transparent
              opacity={0.92}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function PixelIntelligenceHead() {
  return (
    <div className="relative h-full min-h-[220px] w-full">
      <Canvas
        camera={{ position: [0, 0.2, 4.4], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 2, 4]} intensity={1.5} color="#67e8f9" />
        <pointLight position={[-3, 1, -2]} intensity={1.2} color="#e879f9" />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#a78bfa" />
        <VoxelHead />
      </Canvas>
    </div>
  );
}
