import type { NodeType } from "./types";

export const NODE_TYPE_COLORS: Record<NodeType, string> = {
  concept: "#38bdf8",
  person: "#a78bfa",
  organization: "#f472b6",
  project: "#34d399",
  document: "#94a3b8",
  event: "#fbbf24",
  decision: "#22d3ee",
  goal: "#4ade80",
  resource: "#60a5fa",
  risk: "#fb7185",
  assumption: "#c084fc",
  strategy: "#2dd4bf",
  evidence: "#e2e8f0",
};

export const COMMUNITY_COLORS = [
  "#22d3ee",
  "#8b5cf6",
  "#34d399",
  "#f59e0b",
  "#f472b6",
  "#60a5fa",
  "#fb7185",
  "#a3e635",
];

export function communityColor(community: number): string {
  return COMMUNITY_COLORS[Math.abs(community) % COMMUNITY_COLORS.length];
}

export const PROVENANCE_LABEL: Record<string, string> = {
  extracted: "Extracted",
  inferred: "Inferred hypothesis",
  manual: "Manually created",
};
