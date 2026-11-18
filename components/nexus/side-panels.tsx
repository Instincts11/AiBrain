"use client";

import { Badge } from "@/components/ui/badge";
import { useNexusDerived } from "@/hooks/use-nexus-derived";
import { useNexusStore } from "@/stores/nexus-store";

export function StatsPanel() {
  const analyzed = useNexusStore((s) => s.analyzed);
  if (!analyzed) return null;
  const { stats } = analyzed;
  return (
    <div className="dm-panel p-3">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-dim">
        Graph statistics
      </h2>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <Stat label="Nodes" value={stats.nodeCount} />
        <Stat label="Edges" value={stats.edgeCount} />
        <Stat label="Communities" value={stats.communityCount} />
        <Stat label="Components" value={stats.componentCount} />
        <Stat label="Modularity" value={stats.modularity.toFixed(3)} />
      </div>
    </div>
  );
}

export function InfluentialPanel() {
  const { influential } = useNexusDerived();
  const selectNode = useNexusStore((s) => s.selectNode);
  return (
    <div className="dm-panel p-3">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-dim">
        Influential concepts
      </h2>
      <p className="mb-2 text-[11px] text-ink-dim">Ranked by PageRank</p>
      <ul className="space-y-1.5">
        {influential.map((n, i) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => selectNode(n.id)}
              className="flex w-full items-center justify-between gap-2 rounded-sm px-1 py-1 text-left text-sm hover:bg-white/5"
            >
              <span className="truncate text-ink-muted">
                <span className="mr-2 font-mono text-[10px] text-ink-dim">
                  {i + 1}
                </span>
                {n.label}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-cyan">
                {n.pagerank.toFixed(3)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StructuralGapsPanel() {
  const analyzed = useNexusStore((s) => s.analyzed);
  const setCommunityFocus = useNexusStore((s) => s.setCommunityFocus);
  if (!analyzed) return null;

  return (
    <div className="dm-panel dm-scrollbar max-h-[320px] overflow-auto p-3">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-ink-dim">
          Structural gaps
        </h2>
        <Badge variant="violet">Hypothesis</Badge>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-ink-dim">
        Weak inter-community bridges suggest investigation opportunities — not
        proof of conceptual similarity.
      </p>
      <ul className="space-y-3">
        {analyzed.gaps.map((gap) => (
          <li
            key={gap.id}
            className="rounded-md border border-violet/20 bg-violet-dim/40 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="text-xs text-cyan hover:underline"
                onClick={() => setCommunityFocus(gap.communityA)}
              >
                {gap.labelA}
              </button>
              <span className="text-ink-dim">×</span>
              <button
                type="button"
                className="text-xs text-violet hover:underline"
                onClick={() => setCommunityFocus(gap.communityB)}
              >
                {gap.labelB}
              </button>
              <Badge className="ml-auto">{gap.bridgeCount} bridges</Badge>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              {gap.rationale}
            </p>
            <p className="mt-2 text-xs text-ink">
              <span className="text-ink-dim">Investigate: </span>
              {gap.suggestedQuestion}
            </p>
            <div className="mt-2 grid gap-2 text-[11px] text-ink-dim sm:grid-cols-2">
              <div>
                <div className="mb-1 uppercase tracking-wider">Supporting</div>
                <ul>
                  {gap.supportingEvidence.map((e) => (
                    <li key={e}>· {e}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1 uppercase tracking-wider">Missing</div>
                <ul>
                  {gap.missingEvidence.map((e) => (
                    <li key={e}>· {e}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-2 font-mono text-[10px] text-violet">
              Concepts: {gap.conceptsA.join(", ")} ↔ {gap.conceptsB.join(", ")}
            </p>
          </li>
        ))}
        {analyzed.gaps.length === 0 && (
          <li className="text-sm text-ink-muted">
            No weak community pairs detected in this sample.
          </li>
        )}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border bg-midnight px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-ink-dim">
        {label}
      </div>
      <div className="text-ink">{value}</div>
    </div>
  );
}
