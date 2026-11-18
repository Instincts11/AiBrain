"use client";

import { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useNexusDerived } from "@/hooks/use-nexus-derived";
import { useNexusStore } from "@/stores/nexus-store";
import { NODE_TYPE_COLORS, communityColor } from "@/lib/graph/colors";
import type { LayoutNode, KnowledgeEdge } from "@/lib/graph/types";

function FocusCamera({ target }: { target: LayoutNode | null }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!target) return;
    camera.position.lerp(
      new THREE.Vector3(target.x + 8, target.y + 6, target.z + 8),
      0.45,
    );
    camera.lookAt(target.x, target.y, target.z);
  }, [target, camera]);

  return null;
}

function GraphEdges({
  nodes,
  edges,
  neighborSet,
  selectedEdgeId,
}: {
  nodes: LayoutNode[];
  edges: KnowledgeEdge[];
  neighborSet: Set<string>;
  selectedEdgeId: string | null;
}) {
  const positionsById = useMemo(() => {
    const map = new Map<string, THREE.Vector3>();
    for (const n of nodes) map.set(n.id, new THREE.Vector3(n.x, n.y, n.z));
    return map;
  }, [nodes]);

  const segments = useMemo(() => {
    const selected: number[] = [];
    const inferred: number[] = [];
    const normal: number[] = [];
    const dim: number[] = [];
    const hasFocus = neighborSet.size > 0;

    for (const edge of edges) {
      const a = positionsById.get(edge.source);
      const b = positionsById.get(edge.target);
      if (!a || !b) continue;
      const arr =
        edge.id === selectedEdgeId
          ? selected
          : hasFocus &&
              !(neighborSet.has(edge.source) && neighborSet.has(edge.target))
            ? dim
            : edge.provenance === "inferred"
              ? inferred
              : normal;
      arr.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    return { selected, inferred, normal, dim };
  }, [edges, positionsById, neighborSet, selectedEdgeId]);

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(segments.normal), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#334155" transparent opacity={0.45} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(segments.inferred), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(segments.dim), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1e293b" transparent opacity={0.12} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(segments.selected), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

function GraphNodes({
  nodes,
  colorMode,
  selectedNodeId,
  neighborSet,
  onSelect,
}: {
  nodes: LayoutNode[];
  colorMode: "community" | "category";
  selectedNodeId: string | null;
  neighborSet: Set<string>;
  onSelect: (id: string) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const maxPr = useMemo(
    () => Math.max(...nodes.map((n) => n.pagerank), 0.0001),
    [nodes],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const hasFocus = neighborSet.size > 0;

    nodes.forEach((node, i) => {
      const scale = 0.18 + (node.pagerank / maxPr) * 0.55;
      dummy.position.set(node.x, node.y, node.z);
      dummy.scale.setScalar(
        node.id === selectedNodeId ? scale * 1.35 : scale,
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      const base =
        colorMode === "community"
          ? communityColor(node.community)
          : NODE_TYPE_COLORS[node.type];
      color.set(base);
      if (hasFocus && !neighborSet.has(node.id)) {
        color.multiplyScalar(0.25);
      } else if (node.id === selectedNodeId) {
        color.offsetHSL(0, 0.05, 0.15);
      }
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [nodes, colorMode, selectedNodeId, neighborSet, maxPr]);

  const pulse = useRef(0);
  useFrame((_, dt) => {
    pulse.current += dt;
    const mesh = meshRef.current;
    if (!mesh || selectedNodeId == null) return;
    const idx = nodes.findIndex((n) => n.id === selectedNodeId);
    if (idx < 0) return;
    const dummy = new THREE.Object3D();
    const node = nodes[idx];
    const scale =
      (0.18 + (node.pagerank / maxPr) * 0.55) *
      (1.25 + Math.sin(pulse.current * 3) * 0.08);
    dummy.position.set(node.x, node.y, node.z);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(idx, dummy.matrix);
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, nodes.length]}
      onClick={(e) => {
        e.stopPropagation();
        const id = nodes[e.instanceId ?? -1]?.id;
        if (id) onSelect(id);
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        roughness={0.35}
        metalness={0.25}
        emissive="#0ea5e9"
        emissiveIntensity={0.08}
      />
    </instancedMesh>
  );
}

function Scene() {
  const { analyzed, nodes, edges, neighborSet, selectedNodeId } =
    useNexusDerived();
  const colorMode = useNexusStore((s) => s.colorMode);
  const selectedEdgeId = useNexusStore((s) => s.selectedEdgeId);
  const selectNode = useNexusStore((s) => s.selectNode);

  const selectedNode =
    analyzed?.layout.find((n) => n.id === selectedNodeId) ?? null;

  return (
    <>
      <color attach="background" args={["#05070c"]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[12, 18, 8]} intensity={1.1} color="#22d3ee" />
      <pointLight position={[-14, -8, -10]} intensity={0.55} color="#8b5cf6" />
      <Stars
        radius={80}
        depth={40}
        count={1200}
        factor={2}
        saturation={0}
        fade
        speed={0.2}
      />
      <GraphEdges
        nodes={nodes}
        edges={edges}
        neighborSet={neighborSet}
        selectedEdgeId={selectedEdgeId}
      />
      <GraphNodes
        nodes={nodes}
        colorMode={colorMode}
        selectedNodeId={selectedNodeId}
        neighborSet={neighborSet}
        onSelect={selectNode}
      />
      <FocusCamera target={selectedNode} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={80}
      />
    </>
  );
}

export function NexusCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 12, 28], fov: 50, near: 0.1, far: 200 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onPointerMissed={() => useNexusStore.getState().selectNode(null)}
    >
      <Scene />
    </Canvas>
  );
}
