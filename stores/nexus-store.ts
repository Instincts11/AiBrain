"use client";

import { create } from "zustand";
import { analyzeSampleGraph, type AnalyzedGraph } from "@/lib/graph/analytics";
import type { ColorMode, RelationType, ViewMode } from "@/lib/graph/types";

type NexusState = {
  analyzed: AnalyzedGraph | null;
  ready: boolean;
  initError: string | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  search: string;
  relationFilter: RelationType | "ALL";
  communityFocus: number | null;
  hideNonNeighbors: boolean;
  colorMode: ColorMode;
  viewMode: ViewMode;
  expandedNeighborhood: boolean;
  init: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setSearch: (q: string) => void;
  setRelationFilter: (r: RelationType | "ALL") => void;
  setCommunityFocus: (c: number | null) => void;
  setHideNonNeighbors: (v: boolean) => void;
  setColorMode: (m: ColorMode) => void;
  setViewMode: (m: ViewMode) => void;
  setExpandedNeighborhood: (v: boolean) => void;
};

let cached: AnalyzedGraph | null = null;

function getAnalyzed(): AnalyzedGraph {
  if (!cached) cached = analyzeSampleGraph();
  return cached;
}

export const useNexusStore = create<NexusState>((set) => ({
  analyzed: null,
  ready: false,
  initError: null,
  selectedNodeId: null,
  selectedEdgeId: null,
  search: "",
  relationFilter: "ALL",
  communityFocus: null,
  hideNonNeighbors: false,
  colorMode: "community",
  viewMode: "3d",
  expandedNeighborhood: true,

  init: () => {
    try {
      const analyzed = getAnalyzed();
      set({ analyzed, ready: true, initError: null });
    } catch (err) {
      set({
        initError:
          err instanceof Error ? err.message : "Failed to analyze graph",
        ready: false,
      });
    }
  },

  selectNode: (selectedNodeId) =>
    set({ selectedNodeId, selectedEdgeId: null }),
  selectEdge: (selectedEdgeId) =>
    set({ selectedEdgeId, selectedNodeId: null }),
  setSearch: (search) => set({ search }),
  setRelationFilter: (relationFilter) => set({ relationFilter }),
  setCommunityFocus: (communityFocus) => set({ communityFocus }),
  setHideNonNeighbors: (hideNonNeighbors) => set({ hideNonNeighbors }),
  setColorMode: (colorMode) => set({ colorMode }),
  setViewMode: (viewMode) => set({ viewMode }),
  setExpandedNeighborhood: (expandedNeighborhood) =>
    set({ expandedNeighborhood }),
}));
