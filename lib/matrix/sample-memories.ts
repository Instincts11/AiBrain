import type {
  MemoryCategory,
  MemoryClusterId,
  MemoryEdge,
  MemoryNode,
  MemoryRelation,
  PendingMemory,
  MatrixActivity,
  AgentOp,
  VoiceClip,
  RetrievalHit,
} from "./types";

/** Seeded PRNG for stable demo layouts across reloads. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const CLUSTERS: MemoryClusterId[] = [
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

const CATEGORIES: MemoryCategory[] = [
  "knowledge",
  "concept",
  "document",
  "conversation",
  "project",
  "person",
  "event",
  "decision",
  "task",
  "research",
  "note",
  "insight",
];

const RELATIONS: MemoryRelation[] = [
  "references",
  "semantic",
  "causal",
  "depends_on",
  "contradicts",
  "temporal",
  "mentions",
  "derived_from",
];

const ANCHORS: Record<MemoryClusterId, string[]> = {
  software: [
    "PostgreSQL",
    "TypeScript",
    "System Design",
    "API Gateway",
    "Redis Cache",
    "CI Pipeline",
    "GraphQL Schema",
    "Observability",
    "Auth Service",
    "Event Bus",
  ],
  ai_research: [
    "AI Architecture",
    "Knowledge Graph",
    "Embeddings",
    "RAG Pipeline",
    "Transformer Attention",
    "Evaluation Harness",
    "Hallucination Risk",
    "Agent Memory",
    "Vector Index",
    "Second Brain",
  ],
  entrepreneurship: [
    "Product Strategy",
    "Go-to-Market",
    "Pricing Experiments",
    "Founder Notes",
    "Investor Update",
    "Market Wedge",
    "Retention Loops",
    "MVP Scope",
  ],
  personal: [
    "Deep Work Ritual",
    "Health Tracker",
    "Reading List",
    "Weekly Review",
    "Focus Protocol",
    "Journal Entry",
  ],
  projects: [
    "Dualmind Core",
    "Memory Matrix",
    "Ingestion Worker",
    "Decision Engine",
    "Vault Search",
    "Mission Planner",
  ],
  strategy: [
    "Competitive Map",
    "Decision Intelligence",
    "Risk Register",
    "OKR Draft",
    "Budget Guardrails",
    "Partnership Thesis",
  ],
  learning: [
    "ForceAtlas2 Notes",
    "Three.js Patterns",
    "pgvector Guide",
    "Graphology Primer",
    "Prompt Patterns",
    "Research Method",
  ],
  conversations: [
    "Standup Transcript",
    "Advisor Call",
    "User Interview",
    "Design Critique",
    "Async Thread",
    "Brainstorm Session",
  ],
  science: [
    "Cognitive Load",
    "Memory Encoding",
    "Sparse Coding",
    "Predictive Models",
    "Experiment Log",
    "Citation Graph",
  ],
};

const SOURCES = [
  "vault://notes",
  "vault://pdf",
  "vault://chat",
  "vault://voice",
  "vault://web",
  "vault://meeting",
  "vault://code",
];

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function dateAt(rand: () => number, daysAgoMax: number): string {
  const d = new Date("2026-11-18T12:00:00Z");
  d.setDate(d.getDate() - Math.floor(rand() * daysAgoMax));
  return d.toISOString();
}

export type MatrixUniverse = {
  nodes: MemoryNode[];
  edges: MemoryEdge[];
  pending: PendingMemory[];
  activity: MatrixActivity[];
  agents: AgentOp[];
  voice: VoiceClip[];
  retrievals: RetrievalHit[];
  commands: string[];
};

/**
 * Builds a labelled demonstration universe of interconnected memories.
 * Every node/edge is a first-class graph entity — not decorative noise.
 */
export function buildMatrixUniverse(seed = 42): MatrixUniverse {
  const rand = mulberry32(seed);
  const nodes: MemoryNode[] = [];
  const byCluster = new Map<MemoryClusterId, MemoryNode[]>();

  let seq = 0;
  for (const cluster of CLUSTERS) {
    const anchors = ANCHORS[cluster];
    const clusterNodes: MemoryNode[] = [];
    const count = 85 + Math.floor(rand() * 45); // ~85–130 per cluster

    for (let i = 0; i < count; i++) {
      const isAnchor = i < anchors.length;
      const category = isAnchor
        ? (["concept", "knowledge", "project", "research"][
            Math.floor(rand() * 4)
          ] as MemoryCategory)
        : pick(rand, CATEGORIES);
      const base = isAnchor
        ? anchors[i]!
        : `${anchors[i % anchors.length]} · ${category} ${i}`;
      const label = isAnchor
        ? base
        : `${base.replace(/ ·.*/, "")} ${["note", "thread", "doc", "idea", "clip"][Math.floor(rand() * 5)]} #${100 + i}`;

      const node: MemoryNode = {
        id: `m-${cluster}-${seq++}`,
        label: isAnchor ? anchors[i]! : label,
        category,
        cluster,
        summary: `${CLUSTER_TITLE(cluster)} memory capturing “${isAnchor ? anchors[i] : label}”. Linked into the second-brain graph from ${pick(rand, SOURCES)}.`,
        source: pick(rand, SOURCES),
        createdAt: dateAt(rand, 420),
        activity: isAnchor ? 0.75 + rand() * 0.25 : 0.15 + rand() * 0.55,
        importance: isAnchor ? 0.8 + rand() * 0.2 : 0.12 + rand() * 0.55,
      };
      nodes.push(node);
      clusterNodes.push(node);
    }
    byCluster.set(cluster, clusterNodes);
  }

  const edges: MemoryEdge[] = [];
  let eSeq = 0;

  function link(
    a: MemoryNode,
    b: MemoryNode,
    type: MemoryRelation,
    reason: string,
    confidence: number,
  ) {
    if (a.id === b.id) return;
    edges.push({
      id: `e-${eSeq++}`,
      source: a.id,
      target: b.id,
      type,
      reason,
      confidence,
    });
  }

  // Dense intra-cluster webs
  for (const cluster of CLUSTERS) {
    const list = byCluster.get(cluster)!;
    for (let i = 0; i < list.length; i++) {
      const degree = 3 + Math.floor(rand() * 5);
      for (let k = 0; k < degree; k++) {
        const j = (i + 1 + Math.floor(rand() * Math.min(18, list.length - 1))) %
          list.length;
        const type = pick(rand, RELATIONS);
        link(
          list[i]!,
          list[j]!,
          type,
          relationReason(list[i]!, list[j]!, type),
          0.55 + rand() * 0.4,
        );
      }
      // Hub spokes from anchors
      if (i < 8) {
        for (let k = 0; k < 6; k++) {
          const j = 8 + Math.floor(rand() * (list.length - 8));
          link(
            list[i]!,
            list[j]!,
            "references",
            `${list[j]!.label} references hub concept ${list[i]!.label}.`,
            0.7 + rand() * 0.25,
          );
        }
      }
    }
  }

  // Semantic bridges between related domains
  const bridges: [MemoryClusterId, MemoryClusterId][] = [
    ["ai_research", "software"],
    ["ai_research", "science"],
    ["projects", "software"],
    ["projects", "ai_research"],
    ["strategy", "entrepreneurship"],
    ["conversations", "projects"],
    ["learning", "ai_research"],
    ["personal", "learning"],
    ["strategy", "projects"],
  ];

  for (const [ca, cb] of bridges) {
    const A = byCluster.get(ca)!;
    const B = byCluster.get(cb)!;
    const n = 14 + Math.floor(rand() * 10);
    for (let i = 0; i < n; i++) {
      const a = A[Math.floor(rand() * Math.min(20, A.length))]!;
      const b = B[Math.floor(rand() * Math.min(20, B.length))]!;
      const type = pick(rand, ["semantic", "depends_on", "references", "derived_from"] as MemoryRelation[]);
      link(a, b, type, `Cross-cluster ${type} between ${ca} and ${cb}.`, 0.5 + rand() * 0.35);
    }
  }

  // Pending ingestion queue — real queued demo events, not fake timers
  const pending: PendingMemory[] = [];
  const pendingSeeds = [
    {
      label: "Voice note · competitor pricing",
      category: "note" as const,
      cluster: "strategy" as const,
      related: "Competitive Map",
    },
    {
      label: "PDF · pgvector indexing patterns",
      category: "document" as const,
      cluster: "software" as const,
      related: "PostgreSQL",
    },
    {
      label: "Chat · dual analysis critique",
      category: "conversation" as const,
      cluster: "conversations" as const,
      related: "Decision Intelligence",
    },
    {
      label: "Insight · retention cohort lift",
      category: "insight" as const,
      cluster: "entrepreneurship" as const,
      related: "Retention Loops",
    },
    {
      label: "Meeting · Memory Matrix review",
      category: "event" as const,
      cluster: "projects" as const,
      related: "Memory Matrix",
    },
    {
      label: "Paper · sparse episodic memory",
      category: "research" as const,
      cluster: "science" as const,
      related: "Memory Encoding",
    },
    {
      label: "Task · wire ingestion worker",
      category: "task" as const,
      cluster: "projects" as const,
      related: "Ingestion Worker",
    },
    {
      label: "Note · deep work block design",
      category: "note" as const,
      cluster: "personal" as const,
      related: "Deep Work Ritual",
    },
    {
      label: "Doc · RAG evaluation checklist",
      category: "document" as const,
      cluster: "ai_research" as const,
      related: "Evaluation Harness",
    },
    {
      label: "Person · advisor follow-up",
      category: "person" as const,
      cluster: "conversations" as const,
      related: "Advisor Call",
    },
    {
      label: "Decision · ship phased MVP",
      category: "decision" as const,
      cluster: "strategy" as const,
      related: "MVP Scope",
    },
    {
      label: "Learning · drei Html labels",
      category: "knowledge" as const,
      cluster: "learning" as const,
      related: "Three.js Patterns",
    },
  ];

  for (let i = 0; i < pendingSeeds.length; i++) {
    const s = pendingSeeds[i]!;
    const related = nodes.find((n) => n.label === s.related) ?? pick(rand, nodes);
    pending.push({
      id: `pending-${i}`,
      label: s.label,
      category: s.category,
      cluster: s.cluster,
      summary: `Queued ingestion (demo dataset): ${s.label}. Will link into existing memory “${related.label}”.`,
      source: pick(rand, SOURCES),
      createdAt: dateAt(rand, 3),
      activity: 1,
      importance: 0.55 + rand() * 0.3,
      relatedIds: [related.id],
      relationType: "references",
      reason: `Ingested item references existing memory “${related.label}”.`,
    });
  }

  const activity: MatrixActivity[] = [
    {
      id: "act-1",
      kind: "ingest",
      title: "market_research.pdf indexed",
      detail: "42 entities · 67 relationships extracted",
      at: "2026-11-18T08:12:00Z",
    },
    {
      id: "act-2",
      kind: "link",
      title: "New semantic bridge",
      detail: "AI Architecture ↔ System Design",
      at: "2026-11-18T08:40:00Z",
    },
    {
      id: "act-3",
      kind: "retrieve",
      title: "JARVIS retrieval pack",
      detail: "12 memories · avg relevance 0.81",
      at: "2026-11-18T09:05:00Z",
    },
    {
      id: "act-4",
      kind: "voice",
      title: "Voice clip transcribed",
      detail: "Advisor Call · 4 concepts extracted",
      at: "2026-11-18T09:22:00Z",
    },
    {
      id: "act-5",
      kind: "agent",
      title: "ULTRON contradiction scan",
      detail: "3 tension edges flagged",
      at: "2026-11-18T09:48:00Z",
    },
    {
      id: "act-6",
      kind: "ingest",
      title: "standup transcript stored",
      detail: "Conversation cluster updated",
      at: "2026-11-18T10:10:00Z",
    },
  ];

  const agents: AgentOp[] = [
    {
      id: "ag-1",
      agent: "Ingestor",
      task: "Chunk + embed vault uploads",
      status: "running",
      progress: 72,
    },
    {
      id: "ag-2",
      agent: "Linker",
      task: "Extract entity relationships",
      status: "running",
      progress: 58,
    },
    {
      id: "ag-3",
      agent: "JARVIS",
      task: "Retrieve context for Dual Analysis",
      status: "complete",
      progress: 100,
    },
    {
      id: "ag-4",
      agent: "ULTRON",
      task: "Surface contradictory memories",
      status: "queued",
      progress: 0,
    },
  ];

  const voice: VoiceClip[] = [
    {
      id: "v1",
      title: "Advisor call · GTM risks",
      status: "transcribed",
      concepts: ["Go-to-Market", "Risk Register", "Pricing"],
      related: ["Advisor Call", "Product Strategy"],
    },
    {
      id: "v2",
      title: "Walk note · Memory Matrix UX",
      status: "processing",
      concepts: ["Memory Matrix", "Labels", "Bloom"],
      related: ["Memory Matrix"],
    },
    {
      id: "v3",
      title: "Interview · researcher pain",
      status: "queued",
      concepts: [],
      related: [],
    },
  ];

  const retrievals: RetrievalHit[] = nodes
    .filter((n) => n.importance > 0.75)
    .slice(0, 8)
    .map((n, i) => ({
      id: n.id,
      label: n.label,
      relevance: 0.92 - i * 0.04,
      source: n.source,
    }));

  const commands = [
    "Find connections between PostgreSQL and RAG Pipeline",
    "Explore concept: Knowledge Graph",
    "Discover knowledge gaps in Strategy",
    "Trace memory: Decision Intelligence",
    "Compare Second Brain vs Memory Encoding",
    "Generate insight report for Projects cluster",
  ];

  return {
    nodes,
    edges,
    pending,
    activity,
    agents,
    voice,
    retrievals,
    commands,
  };
}

function CLUSTER_TITLE(c: MemoryClusterId): string {
  return (
    {
      software: "Software Engineering",
      ai_research: "AI Research",
      entrepreneurship: "Entrepreneurship",
      personal: "Personal Development",
      projects: "Projects",
      strategy: "Business Strategy",
      learning: "Learning Resources",
      conversations: "Conversations",
      science: "Scientific Research",
    } as const
  )[c];
}

function relationReason(
  a: MemoryNode,
  b: MemoryNode,
  type: MemoryRelation,
): string {
  switch (type) {
    case "references":
      return `${a.label} directly references ${b.label}.`;
    case "semantic":
      return `Semantic similarity between ${a.label} and ${b.label}.`;
    case "causal":
      return `${a.label} contributes causally to ${b.label}.`;
    case "depends_on":
      return `${a.label} depends on ${b.label}.`;
    case "contradicts":
      return `${a.label} tensions with claims in ${b.label}.`;
    case "temporal":
      return `${a.label} precedes or follows ${b.label} in time.`;
    case "mentions":
      return `${a.label} mentions ${b.label}.`;
    case "derived_from":
      return `${a.label} was derived from ${b.label}.`;
  }
}
