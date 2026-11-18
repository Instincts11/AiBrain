import type { MemoryCategory, MemoryRelation } from "./types";

/** Amber / white / orange palette — matches Memory Matrix reference. */
export const MATRIX_BG = "#030303";
export const MATRIX_FOG = "#0a0806";

export const CATEGORY_COLORS: Record<MemoryCategory, string> = {
  knowledge: "#f5f0e6",
  concept: "#ffe8a3",
  document: "#fbbf24",
  conversation: "#fb923c",
  project: "#f97316",
  person: "#fdba74",
  event: "#ea580c",
  decision: "#ef4444",
  task: "#f59e0b",
  research: "#fcd34d",
  note: "#e7e5e4",
  insight: "#fecaca",
};

export const RELATION_COLORS: Record<MemoryRelation, string> = {
  references: "#f59e0b",
  semantic: "#d6d3d1",
  causal: "#ef4444",
  depends_on: "#fb923c",
  contradicts: "#dc2626",
  temporal: "#a8a29e",
  mentions: "#fbbf24",
  derived_from: "#f97316",
};

export const CLUSTER_LABELS: Record<string, string> = {
  software: "Software Engineering",
  ai_research: "AI Research",
  entrepreneurship: "Entrepreneurship",
  personal: "Personal Development",
  projects: "Projects",
  strategy: "Business Strategy",
  learning: "Learning Resources",
  conversations: "Conversations",
  science: "Scientific Research",
};

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
