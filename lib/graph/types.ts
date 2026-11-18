export type NodeType =
  | "concept"
  | "person"
  | "organization"
  | "project"
  | "document"
  | "event"
  | "decision"
  | "goal"
  | "resource"
  | "risk"
  | "assumption"
  | "strategy"
  | "evidence";

export type RelationType =
  | "RELATED_TO"
  | "SUPPORTS"
  | "CONTRADICTS"
  | "DEPENDS_ON"
  | "CAUSED_BY"
  | "PART_OF"
  | "MENTIONED_IN"
  | "DERIVED_FROM"
  | "COMPETES_WITH"
  | "ENABLES"
  | "BLOCKS";

export type Provenance = "extracted" | "inferred" | "manual";

export type KnowledgeNode = {
  id: string;
  label: string;
  type: NodeType;
  description?: string;
  communityHint?: string;
  sourceDocIds?: string[];
};

export type KnowledgeEdge = {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  provenance: Provenance;
  confidence: number;
  evidenceExcerpt?: string;
  sourceDocId?: string;
  createdAt: string;
  extractionMethod?: string;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  kind: string;
};

export type SampleKnowledgeGraph = {
  documents: KnowledgeDocument[];
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
};

export type NodeMetrics = {
  degree: number;
  pagerank: number;
  betweenness: number;
  community: number;
};

export type GraphStats = {
  nodeCount: number;
  edgeCount: number;
  componentCount: number;
  modularity: number;
  communityCount: number;
};

export type StructuralGap = {
  id: string;
  communityA: number;
  communityB: number;
  labelA: string;
  labelB: string;
  bridgeCount: number;
  conceptsA: string[];
  conceptsB: string[];
  rationale: string;
  supportingEvidence: string[];
  missingEvidence: string[];
  suggestedQuestion: string;
  status: "hypothesis";
};

export type LayoutNode = KnowledgeNode &
  NodeMetrics & {
    x: number;
    y: number;
    z: number;
  };

export type ColorMode = "community" | "category";
export type ViewMode = "3d" | "2d";
