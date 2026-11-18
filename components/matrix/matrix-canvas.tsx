"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  useMatrixSelection,
  useMatrixStore,
} from "@/stores/matrix-store";
import {
  projectToConstellation,
  projectToSphere,
} from "@/lib/matrix/sphere-layout";
import type { MatrixLayoutNode, MemoryEdge } from "@/lib/matrix/types";

const ULTRON_BG = "#02040a";
const DOT_HOT_PINK = "#ff1493";
const DOT_HOT_PINK_LIT = "#ff69b4";
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

/** Brief camera ease on select/reset — then OrbitControls own the view so the user can drag freely. */
function CameraRig({
  target,
  nonce,
}: {
  target: MatrixLayoutNode | null;
  nonce: number;
}) {
  const { camera } = useThree();
  const controls = useThree((s) => s.controls);
  const animating = useRef(0);
  const goal = useRef(new THREE.Vector3(0, 2.2, 18));
  const look = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (target) {
      const len = Math.hypot(target.x, target.y, target.z) || 1;
      // Stay back so selection never fills the frame as a sun-like blob
      const dist = Math.max(len * 1.85, 16);
      goal.current.set(
        (target.x / len) * dist,
        (target.y / len) * dist * 0.35 + 1.6,
        (target.z / len) * dist,
      );
      look.current.set(target.x, target.y, target.z);
    } else {
      goal.current.set(0, 2.2, 18);
      look.current.set(0, 0, 0);
    }
    animating.current = 1;
  }, [target?.id, nonce]);

  useFrame((_, dt) => {
    if (animating.current <= 0) return;
    animating.current = Math.max(0, animating.current - dt * 0.55);
    const k = 0.08;
    camera.position.lerp(goal.current, k);
    const ctrl = controls as unknown as {
      target?: THREE.Vector3;
      update?: () => void;
    } | null;
    if (ctrl?.target) {
      ctrl.target.lerp(look.current, k);
      ctrl.update?.();
    }
  });

  return null;
}

/** Core orange aura only — no outer decorative arcs. */
function UltronScaffold({ reduced }: { reduced: boolean }) {
  const dust = useMemo(() => {
    const n = reduced ? 600 : 2200;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const lobe =
        0.8 +
        0.35 * Math.max(0, Math.sin(theta * 2.2) * Math.cos(phi * 1.6));
      // Keep dust inside the memory volume — no outer scatter ring
      const r = (2.2 + Math.random() * 9.5) * lobe;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.88;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [reduced]);

  return (
    <group>
      <mesh scale={[1.05, 0.92, 1.0]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial
          color="#ffd28a"
          transparent
          opacity={0.55}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={[1.1, 0.9, 1.05]}>
        <sphereGeometry args={[1.6, 20, 20]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={[1.15, 0.88, 1.08]}>
        <sphereGeometry args={[3.2, 16, 16]} />
        <meshBasicMaterial
          color="#ea580c"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={reduced ? 0.015 : 0.022}
          color="#fbbf24"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}

/** Node-to-node LineSegments cobweb with orange glow. */
function EdgeLayer({
  nodes,
  edges,
  neighborSet,
  selectedNodeId,
  reduced,
}: {
  nodes: MatrixLayoutNode[];
  edges: MemoryEdge[];
  neighborSet: Set<string>;
  selectedNodeId: string | null;
  reduced: boolean;
}) {
  const posById = useMemo(() => {
    const m = new Map<string, THREE.Vector3>();
    for (const n of nodes) m.set(n.id, new THREE.Vector3(n.x, n.y, n.z));
    return m;
  }, [nodes]);

  const packs = useMemo(() => {
    const hot: number[] = [];
    const mid: number[] = [];
    const dim: number[] = [];
    const hasFocus = neighborSet.size > 0;

    // Drop long outer spokes that look like unconnected scatter
    const radii = nodes.map((n) => Math.hypot(n.x, n.y, n.z)).sort((a, b) => a - b);
    const maxR = radii[Math.floor(radii.length * 0.88)] ?? 16;
    const maxLen = maxR * 0.72;

    const maxEdges = reduced ? 1800 : 5500;
    let count = 0;

    for (const edge of edges) {
      if (count >= maxEdges) break;
      const a = posById.get(edge.source);
      const b = posById.get(edge.target);
      if (!a || !b) continue;
      const ra = a.length();
      const rb = b.length();
      // Skip peripheral / over-long links
      if (ra > maxR || rb > maxR) continue;
      if (a.distanceTo(b) > maxLen) continue;
      count += 1;
      const focused =
        hasFocus &&
        neighborSet.has(edge.source) &&
        neighborSet.has(edge.target);
      const selected =
        !!selectedNodeId &&
        (edge.source === selectedNodeId || edge.target === selectedNodeId);
      const bucket = selected || focused ? hot : hasFocus ? dim : mid;
      bucket.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    return { hot, mid, dim };
  }, [edges, nodes, posById, neighborSet, selectedNodeId, reduced]);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(packs.mid), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ea580c"
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(packs.dim), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7c2d12"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(packs.hot), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#fde68a"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

function nodeScale(node: MatrixLayoutNode, maxPr: number) {
  return 0.045 + (node.pagerank / maxPr) * 0.08 + node.importance * 0.03;
}

function NodeInstances({
  nodes,
  neighborSet,
  selectedNodeId,
  highlightIds,
  reduced,
  onSelect,
  onHover,
}: {
  nodes: MatrixLayoutNode[];
  neighborSet: Set<string>;
  selectedNodeId: string | null;
  highlightIds: Set<string>;
  reduced: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const maxPr = useMemo(
    () => Math.max(...nodes.map((n) => n.pagerank), 0.0001),
    [nodes],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const hasFocus = neighborSet.size > 0;

    nodes.forEach((node, i) => {
      const isSelected = node.id === selectedNodeId;
      const isHighlight = highlightIds.has(node.id);
      // Keep selected dots nearly the same size — glow carries the focus
      const boost = isSelected ? 1.12 : isHighlight ? 1.06 : 1;
      _dummy.position.set(node.x, node.y, node.z);
      _dummy.scale.setScalar(nodeScale(node, maxPr) * boost);
      _dummy.updateMatrix();
      mesh.setMatrixAt(i, _dummy.matrix);

      _color.set(isSelected ? DOT_HOT_PINK_LIT : DOT_HOT_PINK);
      if (isSelected) {
        _color.multiplyScalar(1.15);
      } else if (
        hasFocus &&
        !neighborSet.has(node.id) &&
        !highlightIds.has(node.id)
      ) {
        _color.multiplyScalar(0.22);
      }
      mesh.setColorAt(i, _color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes, neighborSet, selectedNodeId, highlightIds, maxPr]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, nodes.length]}
      frustumCulled={false}
      onClick={(e) => {
        e.stopPropagation();
        const id = nodes[e.instanceId ?? -1]?.id;
        if (id) onSelect(id);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        const id = nodes[e.instanceId ?? -1]?.id ?? null;
        if (id !== useMatrixStore.getState().hoveredNodeId) onHover(id);
      }}
      onPointerOut={() => {
        if (useMatrixStore.getState().hoveredNodeId != null) onHover(null);
      }}
    >
      <sphereGeometry args={[1, reduced ? 6 : 10, reduced ? 6 : 10]} />
      <meshBasicMaterial
        toneMapped={false}
        transparent
        opacity={0.78}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

/** Small label only for the clicked memory. */
function ClickLabel({
  nodes,
  selectedNodeId,
}: {
  nodes: MatrixLayoutNode[];
  selectedNodeId: string | null;
}) {
  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );
  if (!node) return null;

  return (
    <Billboard position={[node.x, node.y + 0.35, node.z]}>
      <Text
        fontSize={0.18}
        color="#fff7ed"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.008}
        outlineColor="#1c1008"
        maxWidth={3.2}
        textAlign="center"
      >
        {node.label}
      </Text>
    </Billboard>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  const { nodes: rawNodes, edges, neighborSet, selectedNode } =
    useMatrixSelection();
  const vizForm = useMatrixStore((s) => s.vizForm);
  const nodes = useMemo(
    () =>
      vizForm === "constellation"
        ? projectToConstellation(rawNodes, 14)
        : projectToSphere(rawNodes, 14),
    [rawNodes, vizForm],
  );
  const selectedSpherical = useMemo(() => {
    if (!selectedNode) return null;
    return nodes.find((n) => n.id === selectedNode.id) ?? null;
  }, [nodes, selectedNode]);

  const selectedNodeId = useMatrixStore((s) => s.selectedNodeId);
  const highlightIds = useMatrixStore((s) => s.highlightIds);
  const cameraNonce = useMatrixStore((s) => s.cameraNonce);
  const selectNode = useMatrixStore((s) => s.selectNode);
  const hoverNode = useMatrixStore((s) => s.hoverNode);

  return (
    <>
      <color attach="background" args={[ULTRON_BG]} />
      <fog attach="fog" args={[ULTRON_BG, 18, 85]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={3.2} color="#fbbf24" distance={48} />
      <pointLight position={[18, 12, 10]} intensity={0.9} color="#fb923c" />
      <pointLight position={[-14, -8, -12]} intensity={0.55} color="#ea580c" />

      <group>
        {vizForm === "hologram" && <UltronScaffold reduced={reduced} />}
        {vizForm === "constellation" && (
          <ConstellationScaffold reduced={reduced} />
        )}
        <EdgeLayer
          nodes={nodes}
          edges={edges}
          neighborSet={neighborSet}
          selectedNodeId={selectedNodeId}
          reduced={reduced}
        />
        <NodeInstances
          nodes={nodes}
          neighborSet={neighborSet}
          selectedNodeId={selectedNodeId}
          highlightIds={highlightIds}
          reduced={reduced}
          onSelect={selectNode}
          onHover={hoverNode}
        />
        <ClickLabel nodes={nodes} selectedNodeId={selectedNodeId} />
      </group>

      <CameraRig target={selectedSpherical} nonce={cameraNonce} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan
        enableRotate
        enableZoom
        zoomSpeed={1.35}
        rotateSpeed={0.65}
        panSpeed={0.7}
        minDistance={3}
        maxDistance={90}
        autoRotate={false}
      />
      {!reduced && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.75}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.55}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

function ConstellationScaffold(_props: { reduced: boolean }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#fff3c4" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function MatrixCanvas() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2.2, 18], fov: 40, near: 0.1, far: 200 }}
      dpr={reduced ? [1, 1.25] : [1, 1.75]}
      gl={{
        antialias: !reduced,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onPointerMissed={() => useMatrixStore.getState().selectNode(null)}
    >
      <Scene reduced={reduced} />
    </Canvas>
  );
}
