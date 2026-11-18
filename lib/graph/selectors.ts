import { getInfluentialConcepts, type AnalyzedGraph } from "./analytics";
import type {
  KnowledgeEdge,
  LayoutNode,
  RelationType,
} from "./types";

export function getNeighborIds(
  analyzed: AnalyzedGraph | null,
  selectedNodeId: string | null,
  expandedNeighborhood: boolean,
): Set<string> {
  const ids = new Set<string>();
  if (!analyzed || !selectedNodeId) return ids;
  ids.add(selectedNodeId);
  if (!expandedNeighborhood) return ids;
  analyzed.graph.forEachNeighbor(selectedNodeId, (n: string) => ids.add(n));
  return ids;
}

export function getVisibleNodes(
  analyzed: AnalyzedGraph | null,
  search: string,
  communityFocus: number | null,
  hideNonNeighbors: boolean,
  selectedNodeId: string | null,
  expandedNeighborhood: boolean,
): LayoutNode[] {
  if (!analyzed) return [];
  const q = search.trim().toLowerCase();
  const neighbors = getNeighborIds(
    analyzed,
    selectedNodeId,
    expandedNeighborhood,
  );
  const hasSelection = Boolean(selectedNodeId);

  return analyzed.layout.filter((node) => {
    if (q && !node.label.toLowerCase().includes(q)) return false;
    if (communityFocus !== null && node.community !== communityFocus) {
      return false;
    }
    if (hideNonNeighbors && hasSelection && !neighbors.has(node.id)) {
      return false;
    }
    return true;
  });
}

export function getVisibleEdges(
  analyzed: AnalyzedGraph | null,
  visibleNodes: LayoutNode[],
  relationFilter: RelationType | "ALL",
): KnowledgeEdge[] {
  if (!analyzed) return [];
  const visible = new Set(visibleNodes.map((n) => n.id));
  return analyzed.edges.filter((edge) => {
    if (!visible.has(edge.source) || !visible.has(edge.target)) return false;
    if (relationFilter !== "ALL" && edge.type !== relationFilter) return false;
    return true;
  });
}

export function getInfluential(analyzed: AnalyzedGraph | null): LayoutNode[] {
  if (!analyzed) return [];
  return getInfluentialConcepts(analyzed, 8);
}
