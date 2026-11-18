"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function MindCore({
  color,
  emissive,
  side,
}: {
  color: string;
  emissive: string;
  side: "left" | "right";
}) {
  const group = useRef<THREE.Group>(null);
  const baseX = side === "left" ? -1.35 : 1.35;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // Side-by-side sway: both move horizontally in opposing rhythm
    const sway = Math.sin(t * 0.9 + (side === "left" ? 0 : Math.PI)) * 0.28;
    group.current.position.x = baseX + sway;
    group.current.position.y = Math.sin(t * 1.15 + (side === "left" ? 0.4 : 1.2)) * 0.18;
    group.current.rotation.y += 0.012;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.15}>
      <group ref={group} position={[baseX, 0, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.62, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.7}
            metalness={0.35}
            roughness={0.25}
            wireframe
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.42, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.9}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
          <torusGeometry args={[0.95, 0.012, 10, 72]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

export function DualMindsPreview() {
  return (
    <div className="absolute inset-0 bg-[#05070f]">
      <Canvas
        camera={{ position: [0, 0.2, 4.6], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[-3, 2, 3]} intensity={1.3} color="#67e8f9" />
        <pointLight position={[3, 1, 2]} intensity={1.4} color="#fb7185" />
        {/* JARVIS — cyan */}
        <MindCore color="#22d3ee" emissive="#0891b2" side="left" />
        {/* ULTRON — red */}
        <MindCore color="#fb7185" emissive="#e11d48" side="right" />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-between px-10 text-xs font-medium tracking-wide">
        <span className="text-cyan">JARVIS</span>
        <span className="text-rose-300">ULTRON</span>
      </div>
    </div>
  );
}
