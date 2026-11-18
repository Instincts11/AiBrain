export type MemoryCategory =
  | "knowledge"
  | "concept"
  | "document"
  | "conversation"
  | "project"
  | "person"
  | "event"
  | "decision"
  | "task"
  | "research"
  | "note"
  | "insight";

export type MemoryRelation =
  | "references"
  | "semantic"
  | "causal"
  | "depends_on"
  | "contradicts"
  | "temporal"
  | "mentions"
  | "derived_from";

export type MemoryClusterId =
  | "software"
  | "ai_research"
  | "entrepreneurship"
  | "personal"
  | "projects"
  | "strategy"
  | "learning"
  | "conversations"
  | "science";

export type MemoryNode = {
  id: string;
  label: string;
  category: MemoryCategory;
  cluster: MemoryClusterId;
  summary: string;
  source: string;
  createdAt: string;
  activity: number;
  importance: number;
};

export type MemoryEdge = {
  id: string;
  source: string;
  target: string;
  type: MemoryRelation;
  reason: string;
  confidence: number;
};

export type PendingMemory = MemoryNode & {
  relatedIds: string[];
  relationType: MemoryRelation;
  reason: string;
};

export type MatrixActivity = {
  id: string;
  kind: "ingest" | "link" | "retrieve" | "voice" | "agent";
  title: string;
  detail: string;
  at: string;
};

export type MatrixLayoutNode = MemoryNode & {
  x: number;
  y: number;
  z: number;
  degree: number;
  pagerank: number;
  community: number;
};

export type MatrixStats = {
  totalMemories: number;
  documents: number;
  conversations: number;
  projects: number;
  people: number;
  edgeCount: number;
  clusterCount: number;
  isolatedClusters: number;
};

export type AgentOp = {
  id: string;
  agent: string;
  task: string;
  status: "running" | "complete" | "queued";
  progress: number;
};

export type VoiceClip = {
  id: string;
  title: string;
  status: "transcribed" | "processing" | "queued";
  concepts: string[];
  related: string[];
};

export type RetrievalHit = {
  id: string;
  label: string;
  relevance: number;
  source: string;
};
