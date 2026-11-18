"use client";

import { useMemo } from "react";
import {
  getInfluential,
  getNeighborIds,
  getVisibleEdges,
  getVisibleNodes,
} from "@/lib/graph/selectors";
import { useNexusStore } from "@/stores/nexus-store";

export function useNexusDerived() {
  const analyzed = useNexusStore((s) => s.analyzed);
  const search = useNexusStore((s) => s.search);
  const communityFocus = useNexusStore((s) => s.communityFocus);
  const hideNonNeighbors = useNexusStore((s) => s.hideNonNeighbors);
  const selectedNodeId = useNexusStore((s) => s.selectedNodeId);
  const expandedNeighborhood = useNexusStore((s) => s.expandedNeighborhood);
  const relationFilter = useNexusStore((s) => s.relationFilter);

  const neighborSet = useMemo(
    () => getNeighborIds(analyzed, selectedNodeId, expandedNeighborhood),
    [analyzed, selectedNodeId, expandedNeighborhood],
  );

  const nodes = useMemo(
    () =>
      getVisibleNodes(
        analyzed,
        search,
        communityFocus,
        hideNonNeighbors,
        selectedNodeId,
        expandedNeighborhood,
      ),
    [
      analyzed,
      search,
      communityFocus,
      hideNonNeighbors,
      selectedNodeId,
      expandedNeighborhood,
    ],
  );

  const edges = useMemo(
    () => getVisibleEdges(analyzed, nodes, relationFilter),
    [analyzed, nodes, relationFilter],
  );

  const influential = useMemo(() => getInfluential(analyzed), [analyzed]);

  return { analyzed, nodes, edges, neighborSet, influential, selectedNodeId };
}
