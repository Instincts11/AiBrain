"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function latLonToVec(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function NetworkArcs({
  hubs,
  radius,
}: {
  hubs: THREE.Vector3[];
  radius: number;
}) {
  const curves = useMemo(() => {
    const pairs: [number, number][] = [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 3],
      [0, 3],
      [3, 4],
      [1, 4],
    ];
    return pairs.map(([a, b], i) => {
      const start = hubs[a];
      const end = hubs[b];
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(radius * (1.22 + (i % 3) * 0.05));
      return new THREE.QuadraticBezierCurve3(start, mid, end);
    });
  }, [hubs, radius]);

  return (
    <group>
      {curves.map((curve, i) => {
        const points = curve.getPoints(56);
        const positions = new Float32Array(points.length * 3);
        points.forEach((p, idx) => {
          positions[idx * 3] = p.x;
          positions[idx * 3 + 1] = p.y;
          positions[idx * 3 + 2] = p.z;
        });
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[positions, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={i % 2 === 0 ? "#22d3ee" : "#fbbf24"}
              transparent
              opacity={0.85}
            />
          </line>
        );
      })}
    </group>
  );
}

function EarthSphere() {
  const group = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const radius = 1.65;

  const [colorMap, cloudsMap] = useTexture([
    "/home/earth-day-map.jpg",
    "/home/earth-clouds.png",
  ]);

  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.anisotropy = 16;
  colorMap.needsUpdate = true;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.anisotropy = 8;
  cloudsMap.needsUpdate = true;

  const hubs = useMemo(
    () => [
      latLonToVec(37.7, -122.4, radius * 1.015),
      latLonToVec(40.7, -74.0, radius * 1.015),
      latLonToVec(19.4, -99.1, radius * 1.015),
      latLonToVec(-23.5, -46.6, radius * 1.015),
      latLonToVec(51.5, -0.1, radius * 1.015),
    ],
    [radius],
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.05;
  });

  return (
    <Float speed={0.9} rotationIntensity={0.05} floatIntensity={0.15}>
      <group ref={group} rotation={[0.18, -0.9, 0.02]}>
        {/* Colorful Earth — Basic+Phong stack so color always visible */}
        <mesh>
          <sphereGeometry args={[radius, 96, 96]} />
          <meshBasicMaterial map={colorMap} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[radius * 1.001, 96, 96]} />
          <meshPhongMaterial
            map={colorMap}
            transparent
            opacity={0.55}
            specular="#88aacc"
            shininess={22}
          />
        </mesh>

        {/* Clouds */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.01, 64, 64]} />
          <meshPhongMaterial
            map={cloudsMap}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>

        {/* Atmosphere rim */}
        <mesh>
          <sphereGeometry args={[radius * 1.05, 64, 64]} />
          <meshBasicMaterial
            color="#4fd1c5"
            transparent
            opacity={0.14}
            side={THREE.BackSide}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[radius * 1.1, 48, 48]} />
          <meshBasicMaterial
            color="#67e8f9"
            transparent
            opacity={0.07}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Network hubs */}
        {hubs.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#06b6d4"
              emissiveIntensity={2}
            />
          </mesh>
        ))}

        <NetworkArcs hubs={hubs} radius={radius} />
      </group>
    </Float>
  );
}

export function KnowledgeGlobe() {
  return (
    <div className="relative h-full min-h-[340px] w-full">
      <Canvas
        camera={{ position: [0, 0.15, 5.0], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.35;
        }}
      >
        {/* Bright lighting so Earth colors are clearly visible */}
        <ambientLight intensity={1.1} />
        <hemisphereLight args={["#ffffff", "#1e3a5f", 0.85]} />
        <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-4, -1, 2]} intensity={0.55} color="#a5b4fc" />
        <pointLight position={[2, 2, 4]} intensity={1.2} color="#e0f2fe" />
        <Stars
          radius={60}
          depth={30}
          count={500}
          factor={2.2}
          fade
          speed={0.3}
        />
        <Suspense fallback={null}>
          <EarthSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
