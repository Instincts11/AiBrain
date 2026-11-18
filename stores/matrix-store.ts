"use client";

import { create } from "zustand";
import { buildMatrix, neighborsOf, type BuiltMatrix } from "@/lib/matrix/build-matrix";
import type {
  MemoryCategory,
  MemoryClusterId,
  MemoryEdge,
  MemoryRelation,
  MatrixLayoutNode,
  PendingMemory,
} from "@/lib/matrix/types";

type MatrixState = {
  ready: boolean;
  error: string | null;
  built: BuiltMatrix | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  hoveredNodeId: string | null;
  search: string;
  categoryFilter: MemoryCategory | "ALL";
  clusterFocus: MemoryClusterId | null;
  relationFilter: MemoryRelation | "ALL";
  focusMode: boolean;
  viewMode: "3d" | "2d";
  /** hologram = Ultron volume; constellation = layered learning lattice */
  vizForm: "hologram" | "constellation";
  showLabels: boolean;
  pendingOpen: boolean;
  cameraNonce: number;
  highlightIds: Set<string>;
  init: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  setSearch: (q: string) => void;
  setCategoryFilter: (c: MemoryCategory | "ALL") => void;
  setClusterFocus: (c: MemoryClusterId | null) => void;
  setRelationFilter: (r: MemoryRelation | "ALL") => void;
  setFocusMode: (v: boolean) => void;
  setViewMode: (m: "3d" | "2d") => void;
  setVizForm: (m: "hologram" | "constellation") => void;
  setShowLabels: (v: boolean) => void;
  setPendingOpen: (v: boolean) => void;
  resetCamera: () => void;
  ingestNext: () => void;
  ingestAllPending: () => void;
  runCommand: (cmd: string) => void;
};

let cache: BuiltMatrix | null = null;

function getBuilt(): BuiltMatrix {
  if (!cache) cache = buildMatrix(42);
  return cache;
}

function edgeMap(edges: MemoryEdge[]): Map<string, MemoryEdge> {
  const m = new Map<string, MemoryEdge>();
  for (const e of edges) m.set(e.id, e);
  return m;
}

export const useMatrixStore = create<MatrixState>((set, get) => ({
  ready: false,
  error: null,
  built: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  hoveredNodeId: null,
  search: "",
  categoryFilter: "ALL",
  clusterFocus: null,
  relationFilter: "ALL",
  focusMode: true,
  viewMode: "3d",
  vizForm: "hologram",
  showLabels: true,
  pendingOpen: false,
  cameraNonce: 0,
  highlightIds: new Set(),

  init: () => {
    try {
      const built = getBuilt();
      set({ built, ready: true, error: null });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to build matrix",
        ready: false,
      });
    }
  },

  selectNode: (selectedNodeId) =>
    set({ selectedNodeId, selectedEdgeId: null, pendingOpen: false }),
  selectEdge: (selectedEdgeId) =>
    set({ selectedEdgeId, selectedNodeId: null }),
  hoverNode: (hoveredNodeId) => set({ hoveredNodeId }),
  setSearch: (search) => set({ search }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setClusterFocus: (clusterFocus) => set({ clusterFocus }),
  setRelationFilter: (relationFilter) => set({ relationFilter }),
  setFocusMode: (focusMode) => set({ focusMode }),
  setViewMode: (viewMode) => set({ viewMode }),
  setVizForm: (vizForm) => set({ vizForm, cameraNonce: get().cameraNonce + 1 }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setPendingOpen: (pendingOpen) => set({ pendingOpen }),
  resetCamera: () => set({ cameraNonce: get().cameraNonce + 1, clusterFocus: null, selectedNodeId: null }),

  ingestNext: () => {
    const built = get().built;
    if (!built || built.pending.length === 0) return;
    const [next, ...rest] = built.pending;
    applyIngest(built, next!, rest, set);
  },

  ingestAllPending: () => {
    const built = get().built;
    if (!built || built.pending.length === 0) return;
    let current = built;
    const remaining: PendingMemory[] = [];
    for (const item of built.pending) {
      current = materialize(current, item);
    }
    set({
      built: { ...current, pending: remaining },
      highlightIds: new Set(
        current.layout.slice(-built.pending.length).map((n) => n.id),
      ),
      pendingOpen: true,
      cameraNonce: get().cameraNonce + 1,
    });
    cache = current;
  },

  runCommand: (cmd) => {
    const built = get().built;
    if (!built) return;
    const lower = cmd.toLowerCase();
    if (lower.includes("postgresql")) {
      const n = built.layout.find((x) => x.label === "PostgreSQL");
      if (n) set({ selectedNodeId: n.id, focusMode: true });
    } else if (lower.includes("knowledge graph")) {
      const n = built.layout.find((x) => x.label === "Knowledge Graph");
      if (n) set({ selectedNodeId: n.id, focusMode: true });
    } else if (lower.includes("gaps")) {
      set({ clusterFocus: "strategy", focusMode: true });
    } else if (lower.includes("decision intelligence")) {
      const n = built.layout.find((x) => x.label === "Decision Intelligence");
      if (n) set({ selectedNodeId: n.id, focusMode: true });
    } else if (lower.includes("second brain")) {
      const n = built.layout.find((x) => x.label === "Second Brain");
      if (n) set({ selectedNodeId: n.id, focusMode: true });
    } else if (lower.includes("projects")) {
      set({ clusterFocus: "projects" });
    }
  },
}));

function applyIngest(
  built: BuiltMatrix,
  next: PendingMemory,
  rest: PendingMemory[],
  set: (partial: Partial<MatrixState>) => void,
) {
  const updated = materialize(built, next);
  updated.pending = rest;
  cache = updated;
  set({
    built: updated,
    highlightIds: new Set([next.id, ...next.relatedIds]),
    selectedNodeId: next.id,
    pendingOpen: true,
  });
}

function materialize(built: BuiltMatrix, item: PendingMemory): BuiltMatrix {
  const { relatedIds, relationType, reason, ...node } = item;
  const newNode: MatrixLayoutNode = {
    ...node,
    degree: relatedIds.length,
    pagerank: 0.002 + node.importance * 0.01,
    community: built.layout.find((n) => n.id === relatedIds[0])?.community ?? 0,
    x: 0,
    y: 0,
    z: 0,
  };

  const related = built.layout.find((n) => n.id === relatedIds[0]);
  if (related) {
    const jitter = () => (Math.random() - 0.5) * 3;
    newNode.x = related.x + jitter();
    newNode.y = related.y + jitter();
    newNode.z = related.z + jitter();
  }

  const newEdges: MemoryEdge[] = relatedIds.map((rid, i) => ({
    id: `e-ingest-${node.id}-${i}`,
    source: node.id,
    target: rid,
    type: relationType,
    reason,
    confidence: 0.82,
  }));

  built.graph.addNode(node.id, { ...node });
  for (const e of newEdges) {
    if (built.graph.hasNode(e.target) && !built.graph.hasEdge(e.source, e.target)) {
      built.graph.addEdge(e.source, e.target, { ...e });
    }
  }

  const activity = [
    {
      id: `act-ingest-${node.id}`,
      kind: "ingest" as const,
      title: `${node.label} ingested`,
      detail: reason,
      at: new Date().toISOString(),
    },
    ...built.activity,
  ];

  return {
    ...built,
    nodes: [...built.nodes, node],
    edges: [...built.edges, ...newEdges],
    layout: [...built.layout, newNode],
    activity,
    stats: {
      ...built.stats,
      totalMemories: built.stats.totalMemories + 1,
      edgeCount: built.stats.edgeCount + newEdges.length,
      documents:
        built.stats.documents + (node.category === "document" ? 1 : 0),
      conversations:
        built.stats.conversations +
        (node.category === "conversation" ? 1 : 0),
    },
    retrievals: [
      {
        id: node.id,
        label: node.label,
        relevance: 0.9,
        source: node.source,
      },
      ...built.retrievals,
    ].slice(0, 10),
  };
}

export function useMatrixSelection() {
  const built = useMatrixStore((s) => s.built);
  const selectedNodeId = useMatrixStore((s) => s.selectedNodeId);
  const selectedEdgeId = useMatrixStore((s) => s.selectedEdgeId);
  const focusMode = useMatrixStore((s) => s.focusMode);
  const clusterFocus = useMatrixStore((s) => s.clusterFocus);
  const categoryFilter = useMatrixStore((s) => s.categoryFilter);
  const relationFilter = useMatrixStore((s) => s.relationFilter);
  const search = useMatrixStore((s) => s.search);
  const highlightIds = useMatrixStore((s) => s.highlightIds);

  if (!built) {
    return {
      nodes: [] as MatrixLayoutNode[],
      edges: [] as MemoryEdge[],
      neighborSet: new Set<string>(),
      selectedNode: null as MatrixLayoutNode | null,
      selectedEdge: null as MemoryEdge | null,
    };
  }

  let nodes = built.layout;
  if (clusterFocus) nodes = nodes.filter((n) => n.cluster === clusterFocus);
  if (categoryFilter !== "ALL")
    nodes = nodes.filter((n) => n.category === categoryFilter);
  if (search.trim()) {
    const q = search.toLowerCase();
    nodes = nodes.filter(
      (n) =>
        n.label.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q),
    );
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  let edges = built.edges.filter(
    (e) => nodeIds.has(e.source) && nodeIds.has(e.target),
  );
  if (relationFilter !== "ALL")
    edges = edges.filter((e) => e.type === relationFilter);

  const neighborSet =
    focusMode && selectedNodeId
      ? neighborsOf(built.edges, selectedNodeId)
      : highlightIds.size
        ? new Set(highlightIds)
        : new Set<string>();

  const selectedNode =
    built.layout.find((n) => n.id === selectedNodeId) ?? null;
  const selectedEdge =
    built.edges.find((e) => e.id === selectedEdgeId) ?? null;

  return { nodes, edges, neighborSet, selectedNode, selectedEdge, edgeMap: edgeMap(built.edges) };
}
