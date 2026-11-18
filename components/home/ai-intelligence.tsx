"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function NeuralHalo({ radius = 1.55 }: { radius?: number }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (ring.current) ring.current.rotation.z += d * 0.35;
  });
  return (
    <mesh ref={ring} rotation={[Math.PI / 2.2, 0.2, 0]}>
      <torusGeometry args={[radius, 0.018, 16, 120]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.75} />
    </mesh>
  );
}

function AiCore() {
  const group = useRef<THREE.Group>(null);
  const bust = useTexture("/home/ai-intelligence.jpg");
  bust.colorSpace = THREE.SRGBColorSpace;
  bust.anisotropy = 8;

  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 36; i++) {
      const phi = Math.acos(-1 + (2 * i) / 36);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.35 + (i % 4) * 0.06;
      pts.push(
        new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi) * 0.85,
          r * Math.cos(phi),
        ),
      );
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
      <group ref={group}>
        {/* AI bust plane with soft billboard feel inside sphere cage */}
        <mesh position={[0, 0.1, 0]}>
          <planeGeometry args={[2.1, 2.1]} />
          <meshBasicMaterial
            map={bust}
            transparent
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Holographic cage */}
        <mesh>
          <icosahedronGeometry args={[1.45, 1]} />
          <meshBasicMaterial
            color="#67e8f9"
            wireframe
            transparent
            opacity={0.28}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={0.55}
            transparent
            opacity={0.18}
            wireframe
          />
        </mesh>

        <NeuralHalo radius={1.7} />
        <mesh rotation={[0.8, 0.4, 0.2]}>
          <torusGeometry args={[1.85, 0.012, 12, 100]} />
          <meshBasicMaterial color="#e879f9" transparent opacity={0.55} />
        </mesh>

        {/* Orbiting data nodes */}
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i % 5 === 0 ? 0.05 : 0.028, 10, 10]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#22d3ee" : "#e879f9"}
              emissive={i % 2 === 0 ? "#0891b2" : "#a21caf"}
              emissiveIntensity={1.4}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function AiIntelligence() {
  return (
    <div className="relative h-full min-h-[340px] w-full">
      <Canvas
        camera={{ position: [0, 0.2, 4.6], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#050814"]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 2, 4]} intensity={1.6} color="#67e8f9" />
        <pointLight position={[-3, 0, -2]} intensity={1.2} color="#e879f9" />
        <pointLight position={[0, -2, 3]} intensity={0.6} color="#a78bfa" />
        <Stars radius={40} depth={24} count={350} factor={2} fade speed={0.5} />

        <Suspense fallback={null}>
          <AiCore />
        </Suspense>

        {/* Drag / scroll to move the AI */}
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={2.8}
          maxDistance={7}
          autoRotate={false}
          rotateSpeed={0.85}
        />
      </Canvas>

      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-dim backdrop-blur">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  );
}
