"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function NeuralCore() {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count); 
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.15 + (i % 3) * 0.08;
      pts.push(
        new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ),
      );
    }
    return pts;
  }, []);

  const links = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.95) {
          positions.push(
            nodes[i].x,
            nodes[i].y,
            nodes[i].z,
            nodes[j].x,
            nodes[j].y,
            nodes[j].z,
          );
        }
      }
    }
    return new Float32Array(positions);
  }, [nodes]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.28;
    if (ringA.current) ringA.current.rotation.z += delta * 0.4;
    if (ringB.current) {
      ringB.current.rotation.x += delta * 0.25;
      ringB.current.rotation.y -= delta * 0.18;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={group}>
        {/* Core intelligence sphere */}
        <mesh>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#0891b2"
            emissiveIntensity={0.55}
            metalness={0.35}
            roughness={0.25}
            wireframe
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.55, 2]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={0.7}
            metalness={0.4}
            roughness={0.2}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Orbit rings */}
        <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={[1.35, 0.015, 12, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.75} />
        </mesh>
        <mesh ref={ringB} rotation={[0.4, Math.PI / 3, 0.5]}>
          <torusGeometry args={[1.55, 0.012, 12, 96]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.55} />
        </mesh>

        {/* Neural links */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[links, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#67e8f9" transparent opacity={0.35} />
        </lineSegments>

        {/* Synapse nodes */}
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[i % 5 === 0 ? 0.055 : 0.032, 10, 10]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#e879f9" : "#22d3ee"}
              emissive={i % 3 === 0 ? "#a21caf" : "#0e7490"}
              emissiveIntensity={1.1}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function IntelligenceOrb() {
  return (
    <div className="relative h-full min-h-[180px] w-full">
      <Canvas
        camera={{ position: [0, 0.35, 4.2], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[3, 2, 4]} intensity={1.4} color="#67e8f9" />
        <pointLight position={[-3, -1, -2]} intensity={1.1} color="#c084fc" />
        <Stars radius={40} depth={30} count={220} factor={2} fade speed={0.6} />
        <NeuralCore />
      </Canvas>
    </div>
  );
}
