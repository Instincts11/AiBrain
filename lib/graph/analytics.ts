import { UndirectedGraph } from "graphology";
import type { Attributes } from "graphology-types";
import pagerank from "graphology-metrics/centrality/pagerank";
import betweennessCentrality from "graphology-metrics/centrality/betweenness";
import louvain from "graphology-communities-louvain";
import { connectedComponents } from "graphology-components";
import forceAtlas2 from "graphology-layout-forceatlas2";
import sample from "./sample-knowledge.json";
import type {
  GraphStats,
  KnowledgeEdge,
  KnowledgeNode,
  LayoutNode,
  NodeMetrics,
  SampleKnowledgeGraph,
  StructuralGap,
} from "./types";

export type DualmindGraph = UndirectedGraph<Attributes, Attributes, Attributes>;

export type AnalyzedGraph = {
  graph: DualmindGraph;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  metrics: Record<string, NodeMetrics>;
  layout: LayoutNode[];
  stats: GraphStats;
  gaps: StructuralGap[];
  communityLabels: Record<number, string>;
  documents: SampleKnowledgeGraph["documents"];
};

function loadSample(): SampleKnowledgeGraph {
  return sample as SampleKnowledgeGraph;
}

export function buildGraphology(
  data: SampleKnowledgeGraph = loadSample(),
): DualmindGraph {
  const graph = new UndirectedGraph();

  for (const node of data.nodes) {
    graph.addNode(node.id, { ...node });
  }

  for (const edge of data.edges) {
    if (!graph.hasNode(edge.source) || !graph.hasNode(edge.target)) continue;
    if (graph.hasEdge(edge.source, edge.target)) continue;
    graph.addEdge(edge.source, edge.target, { ...edge });
  }

  return graph;
}

function inferCommunityLabel(
  community: number,
  nodes: KnowledgeNode[],
  metrics: Record<string, NodeMetrics>,
): string {
  const members = nodes.filter((n) => metrics[n.id]?.community === community);
  const hints = members
    .map((m) => m.communityHint)
    .filter(Boolean) as string[];
  const topNode = members
    .slice()
    .sort(
      (a, b) => (metrics[b.id]?.pagerank ?? 0) - (metrics[a.id]?.pagerank ?? 0),
    )[0];

  let domain = "Cluster";
  if (hints.length) {
    const counts = hints.reduce<Record<string, number>>((acc, h) => {
      acc[h] = (acc[h] ?? 0) + 1;
      return acc;
    }, {});
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (top === "ai") domain = "AI Systems";
    else if (top === "neuro") domain = "Neuroscience";
    else if (top === "bridge") domain = "NeuroAI Bridge";
    else domain = top ?? domain;
  }

  const anchor = topNode?.label ? ` · ${topNode.label}` : "";
  return `${domain}${anchor}`;
}

function computeStructuralGaps(
  _graph: DualmindGraph,
  nodes: KnowledgeNode[],
  metrics: Record<string, NodeMetrics>,
  edges: KnowledgeEdge[],
  communityLabels: Record<number, string>,
): StructuralGap[] {
  const communities = Array.from(
    new Set(Object.values(metrics).map((m) => m.community)),
  ).sort((a, b) => a - b);

  const gaps: StructuralGap[] = [];

  for (let i = 0; i < communities.length; i++) {
    for (let j = i + 1; j < communities.length; j++) {
      const a = communities[i];
      const b = communities[j];
      const nodesA = nodes.filter((n) => metrics[n.id]?.community === a);
      const nodesB = nodes.filter((n) => metrics[n.id]?.community === b);
      if (nodesA.length < 4 || nodesB.length < 4) continue;

      const setA = new Set(nodesA.map((n) => n.id));
      const setB = new Set(nodesB.map((n) => n.id));

      let bridgeCount = 0;
      const bridgeEdges: KnowledgeEdge[] = [];
      for (const edge of edges) {
        const cross =
          (setA.has(edge.source) && setB.has(edge.target)) ||
          (setB.has(edge.source) && setA.has(edge.target));
        if (cross) {
          bridgeCount += 1;
          bridgeEdges.push(edge);
        }
      }

      const possible = nodesA.length * nodesB.length;
      const density = bridgeCount / possible;
      // Keep only sparse inter-community links as structural-gap hypotheses.
      if (density > 0.02 || bridgeCount > 6) continue;

      const topA = nodesA
        .slice()
        .sort(
          (x, y) =>
            (metrics[y.id]?.pagerank ?? 0) - (metrics[x.id]?.pagerank ?? 0),
        )
        .slice(0, 3);
      const topB = nodesB
        .slice()
        .sort(
          (x, y) =>
            (metrics[y.id]?.pagerank ?? 0) - (metrics[x.id]?.pagerank ?? 0),
        )
        .slice(0, 3);

      const supporting = bridgeEdges
        .filter((e) => e.provenance === "extracted" || e.provenance === "manual")
        .map((e) => e.evidenceExcerpt || `${e.source} → ${e.target}`)
        .slice(0, 3);

      const missing = [
        "No high-confidence causal evidence linking the communities",
        "Shared vocabulary may reflect analogy rather than mechanism",
        "Graph distance is not proof of conceptual similarity",
      ];

      gaps.push({
        id: `gap-${a}-${b}`,
        communityA: a,
        communityB: b,
        labelA: communityLabels[a] ?? `Community ${a}`,
        labelB: communityLabels[b] ?? `Community ${b}`,
        bridgeCount,
        conceptsA: topA.map((n) => n.label),
        conceptsB: topB.map((n) => n.label),
        rationale: `Communities “${communityLabels[a]}” and “${communityLabels[b]}” share only ${bridgeCount} bridge relationship${bridgeCount === 1 ? "" : "s"} across ${possible} possible pairs (density ${(density * 100).toFixed(2)}%). This is a structural gap — a hypothesis for investigation, not a verified connection.`,
        supportingEvidence: supporting.length
          ? supporting
          : ["No extracted cross-community evidence yet"],
        missingEvidence: missing,
        suggestedQuestion: `How might ${topA[0]?.label ?? "concepts in A"} inform or constrain ${topB[0]?.label ?? "concepts in B"}, and what evidence would confirm or refute the link?`,
        status: "hypothesis",
      });
    }
  }

  return gaps.sort((a, b) => a.bridgeCount - b.bridgeCount).slice(0, 5);
}

function computeLayout(
  graph: DualmindGraph,
  nodes: KnowledgeNode[],
  metrics: Record<string, NodeMetrics>,
): LayoutNode[] {
  const positions: Record<string, { x: number; y: number }> = {};
  graph.forEachNode((id: string) => {
    positions[id] = {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
    };
  });
  graph.updateEachNodeAttributes((id: string, attr: Attributes) => ({
    ...attr,
    x: positions[id].x,
    y: positions[id].y,
  }));

  forceAtlas2.assign(graph, {
    iterations: 120,
    settings: {
      gravity: 0.8,
      scalingRatio: 12,
      strongGravityMode: true,
      slowDown: 2,
      barnesHutOptimize: true,
    },
  });

  const communities = Array.from(
    new Set(Object.values(metrics).map((m) => m.community)),
  );
  const communityIndex = new Map(communities.map((c, i) => [c, i]));

  return nodes.map((node) => {
    const attrs = graph.getNodeAttributes(node.id) as {
      x?: number;
      y?: number;
    };
    const m = metrics[node.id];
    const ci = communityIndex.get(m.community) ?? 0;
    const angle = (ci / Math.max(communities.length, 1)) * Math.PI * 2;
    const lift = Math.sin(angle) * 3 + (m.pagerank * 40 - 2);
    return {
      ...node,
      ...m,
      x: attrs.x ?? 0,
      y: lift,
      z: attrs.y ?? 0,
    };
  });
}

export function analyzeSampleGraph(): AnalyzedGraph {
  const data = loadSample();
  const graph = buildGraphology(data);

  const pr = pagerank(graph, { getEdgeWeight: null });
  const betweenness = betweennessCentrality(graph, {
    normalized: true,
    getEdgeWeight: null,
  });
  const detailed = louvain.detailed(graph, { getEdgeWeight: null });
  const communities = detailed.communities as Record<string, number>;
  const components = connectedComponents(graph);

  const metrics: Record<string, NodeMetrics> = {};
  graph.forEachNode((id) => {
    metrics[id] = {
      degree: graph.degree(id),
      pagerank: pr[id] ?? 0,
      betweenness: betweenness[id] ?? 0,
      community: communities[id] ?? 0,
    };
  });

  const communityIds = Array.from(
    new Set(Object.values(metrics).map((m) => m.community)),
  );
  const communityLabels: Record<number, string> = {};
  for (const c of communityIds) {
    communityLabels[c] = inferCommunityLabel(c, data.nodes, metrics);
  }

  const layout = computeLayout(graph, data.nodes, metrics);
  const gaps = computeStructuralGaps(
    graph,
    data.nodes,
    metrics,
    data.edges,
    communityLabels,
  );

  const stats: GraphStats = {
    nodeCount: graph.order,
    edgeCount: graph.size,
    componentCount: components.length,
    modularity: detailed.modularity ?? 0,
    communityCount: communityIds.length,
  };

  return {
    graph,
    nodes: data.nodes,
    edges: data.edges,
    metrics,
    layout,
    stats,
    gaps,
    communityLabels,
    documents: data.documents,
  };
}

export function getInfluentialConcepts(
  analyzed: AnalyzedGraph,
  limit = 8,
): LayoutNode[] {
  return analyzed.layout
    .slice()
    .sort((a, b) => b.pagerank - a.pagerank)
    .slice(0, limit);
}
