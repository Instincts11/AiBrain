import { UndirectedGraph } from "graphology";
import type { Attributes } from "graphology-types";
import pagerank from "graphology-metrics/centrality/pagerank";
import louvain from "graphology-communities-louvain";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { buildMatrixUniverse } from "./sample-memories";
import { CLUSTER_LABELS } from "./colors";
import type {
  MatrixLayoutNode,
  MatrixStats,
  MemoryEdge,
  MemoryNode,
  PendingMemory,
  MatrixActivity,
  AgentOp,
  VoiceClip,
  RetrievalHit,
  MemoryClusterId,
} from "./types";

export type MatrixGraph = UndirectedGraph<Attributes, Attributes, Attributes>;

export type BuiltMatrix = {
  graph: MatrixGraph;
  nodes: MemoryNode[];
  edges: MemoryEdge[];
  layout: MatrixLayoutNode[];
  stats: MatrixStats;
  communityLabels: Record<number, string>;
  clusterCenters: Record<MemoryClusterId, { x: number; y: number; z: number }>;
  pending: PendingMemory[];
  activity: MatrixActivity[];
  agents: AgentOp[];
  voice: VoiceClip[];
  retrievals: RetrievalHit[];
  commands: string[];
  topConcepts: MatrixLayoutNode[];
  isolatedClusters: string[];
};

const CLUSTER_ORDER: MemoryClusterId[] = [
  "software",
  "ai_research",
  "entrepreneurship",
  "personal",
  "projects",
  "strategy",
  "learning",
  "conversations",
  "science",
];

function clusterOffset(cluster: MemoryClusterId, i: number) {
  const angle = (i / CLUSTER_ORDER.length) * Math.PI * 2;
  const radius = 28;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle * 1.3) * 8,
    z: Math.sin(angle) * radius,
  };
}

function runLayout(
  graph: MatrixGraph,
  nodes: MemoryNode[],
  pageranks: Record<string, number>,
  communities: Record<string, number>,
): {
  layout: MatrixLayoutNode[];
  clusterCenters: Record<MemoryClusterId, { x: number; y: number; z: number }>;
} {
  graph.forEachNode((id) => {
    graph.mergeNodeAttributes(id, {
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
    });
  });

  forceAtlas2.assign(graph, {
    iterations: 90,
    settings: {
      gravity: 0.65,
      scalingRatio: 18,
      strongGravityMode: true,
      slowDown: 2.2,
      barnesHutOptimize: true,
      barnesHutTheta: 0.6,
    },
  });

  const clusterCenters = {} as Record<
    MemoryClusterId,
    { x: number; y: number; z: number }
  >;
  CLUSTER_ORDER.forEach((c, i) => {
    clusterCenters[c] = clusterOffset(c, i);
  });

  const layout: MatrixLayoutNode[] = nodes.map((node) => {
    const attrs = graph.getNodeAttributes(node.id) as {
      x?: number;
      y?: number;
    };
    const center = clusterCenters[node.cluster];
    const localX = (attrs.x ?? 0) * 0.35;
    const localZ = (attrs.y ?? 0) * 0.35;
    const pr = pageranks[node.id] ?? 0;
    const degree = graph.degree(node.id);
    return {
      ...node,
      degree,
      pagerank: pr,
      community: communities[node.id] ?? 0,
      x: center.x + localX,
      y: center.y + (pr * 25 - 1.5) + (Math.sin(localX * 0.2) * 1.2),
      z: center.z + localZ,
    };
  });

  return { layout, clusterCenters };
}

export function buildMatrix(seed = 42): BuiltMatrix {
  const universe = buildMatrixUniverse(seed);
  const graph = new UndirectedGraph();

  for (const node of universe.nodes) {
    graph.addNode(node.id, { ...node });
  }
  for (const edge of universe.edges) {
    if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) continue;
    if (graph.hasEdge(edge.source, edge.target)) continue;
    graph.addEdge(edge.source, edge.target, { ...edge });
  }

  const pr = pagerank(graph, { getEdgeWeight: null });
  const detailed = louvain.detailed(graph, { getEdgeWeight: null });
  const communities = detailed.communities as Record<string, number>;

  const { layout, clusterCenters } = runLayout(
    graph,
    universe.nodes,
    pr,
    communities,
  );

  const communityIds = Array.from(new Set(Object.values(communities)));
  const communityLabels: Record<number, string> = {};
  for (const c of communityIds) {
    const members = layout.filter((n) => n.community === c);
    const clusterVotes = members.reduce<Record<string, number>>((acc, m) => {
      acc[m.cluster] = (acc[m.cluster] ?? 0) + 1;
      return acc;
    }, {});
    const topCluster =
      Object.entries(clusterVotes).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "projects";
    const hub = members.slice().sort((a, b) => b.pagerank - a.pagerank)[0];
    communityLabels[c] = `${CLUSTER_LABELS[topCluster] ?? topCluster}${
      hub ? ` · ${hub.label}` : ""
    }`;
  }

  const byClusterCount = CLUSTER_ORDER.map((c) => ({
    c,
    n: layout.filter((x) => x.cluster === c).length,
    bridges: universe.edges.filter((e) => {
      const a = layout.find((n) => n.id === e.source);
      const b = layout.find((n) => n.id === e.target);
      return a && b && (a.cluster === c) !== (b.cluster === c);
    }).length,
  }));

  const isolatedClusters = byClusterCount
    .filter((x) => x.bridges < 8)
    .map((x) => CLUSTER_LABELS[x.c] ?? x.c);

  const stats: MatrixStats = {
    totalMemories: layout.length,
    documents: layout.filter((n) => n.category === "document").length,
    conversations: layout.filter((n) => n.category === "conversation").length,
    projects: layout.filter((n) => n.category === "project").length,
    people: layout.filter((n) => n.category === "person").length,
    edgeCount: graph.size,
    clusterCount: CLUSTER_ORDER.length,
    isolatedClusters: isolatedClusters.length,
  };

  const topConcepts = layout
    .slice()
    .sort((a, b) => b.pagerank - a.pagerank)
    .slice(0, 10);

  return {
    graph,
    nodes: universe.nodes,
    edges: universe.edges,
    layout,
    stats,
    communityLabels,
    clusterCenters,
    pending: universe.pending,
    activity: universe.activity,
    agents: universe.agents,
    voice: universe.voice,
    retrievals: universe.retrievals,
    commands: universe.commands,
    topConcepts,
    isolatedClusters,
  };
}

export function neighborsOf(
  edges: MemoryEdge[],
  id: string,
): Set<string> {
  const set = new Set<string>([id]);
  for (const e of edges) {
    if (e.source === id) set.add(e.target);
    if (e.target === id) set.add(e.source);
  }
  return set;
}
