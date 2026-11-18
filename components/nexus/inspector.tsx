"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PROVENANCE_LABEL } from "@/lib/graph/colors";
import { useNexusStore } from "@/stores/nexus-store";

export function NexusInspector() {
  const analyzed = useNexusStore((s) => s.analyzed);
  const selectedNodeId = useNexusStore((s) => s.selectedNodeId);
  const selectedEdgeId = useNexusStore((s) => s.selectedEdgeId);
  const selectNode = useNexusStore((s) => s.selectNode);
  const selectEdge = useNexusStore((s) => s.selectEdge);

  if (!analyzed) return null;

  const node = analyzed.layout.find((n) => n.id === selectedNodeId);
  const edge = analyzed.edges.find((e) => e.id === selectedEdgeId);

  if (!node && !edge) {
    return (
      <div className="dm-panel flex h-full flex-col p-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-ink-dim">
          Inspector
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          Select a node or relationship to inspect metrics, evidence, and
          provenance.
        </p>
        <p className="mt-4 font-mono text-[11px] text-ink-dim">
          Node size encodes PageRank. Colors follow community or category.
        </p>
      </div>
    );
  }

  if (edge) {
    const source = analyzed.nodes.find((n) => n.id === edge.source);
    const target = analyzed.nodes.find((n) => n.id === edge.target);
    const doc = analyzed.documents.find((d) => d.id === edge.sourceDocId);
    const isInferred = edge.provenance === "inferred";

    return (
      <div className="dm-panel dm-scrollbar h-full overflow-auto p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-ink-dim">
            Relationship
          </h2>
          <button
            type="button"
            className="text-[11px] text-ink-dim hover:text-ink"
            onClick={() => selectEdge(null)}
          >
            Clear
          </button>
        </div>
        <p className="mt-2 font-mono text-sm text-cyan">{edge.type}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant={isInferred ? "violet" : "cyan"}>
            {PROVENANCE_LABEL[edge.provenance]}
          </Badge>
          <Badge>{Math.round(edge.confidence * 100)}% confidence</Badge>
        </div>
        {isInferred && (
          <p className="mt-3 rounded-md border border-violet/30 bg-violet-dim px-3 py-2 text-xs text-ink-muted">
            This link is an inferred hypothesis — not a verified fact.
          </p>
        )}
        <Separator className="my-4" />
        <dl className="space-y-3 text-sm">
          <Row label="From" value={source?.label ?? edge.source} />
          <Row label="To" value={target?.label ?? edge.target} />
          <Row label="Source document" value={doc?.title ?? "—"} />
          <Row label="Extraction" value={edge.extractionMethod ?? "—"} />
          <Row label="Created" value={edge.createdAt.slice(0, 10)} />
        </dl>
        {edge.evidenceExcerpt && (
          <>
            <Separator className="my-4" />
            <h3 className="mb-2 text-[11px] uppercase tracking-wider text-ink-dim">
              Evidence excerpt
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              “{edge.evidenceExcerpt}”
            </p>
          </>
        )}
      </div>
    );
  }

  if (!node) return null;

  const neighbors: string[] = analyzed.graph.neighbors(node.id);
  const incident = analyzed.edges.filter(
    (e) => e.source === node.id || e.target === node.id,
  );
  const docs = (node.sourceDocIds ?? [])
    .map((id) => analyzed.documents.find((d) => d.id === id)?.title)
    .filter(Boolean);

  return (
    <div className="dm-panel dm-scrollbar h-full overflow-auto p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wider text-ink-dim">
          Concept
        </h2>
        <button
          type="button"
          className="text-[11px] text-ink-dim hover:text-ink"
          onClick={() => selectNode(null)}
        >
          Clear
        </button>
      </div>
      <h3 className="mt-2 text-lg font-medium text-ink">{node.label}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="cyan">{node.type}</Badge>
        <Badge>
          Community {node.community}
        </Badge>
      </div>
      {node.description && (
        <p className="mt-3 text-sm text-ink-muted">{node.description}</p>
      )}
      <Separator className="my-4" />
      <h3 className="mb-2 text-[11px] uppercase tracking-wider text-ink-dim">
        Graph metrics
      </h3>
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <Metric label="Degree" value={String(node.degree)} />
        <Metric label="PageRank" value={node.pagerank.toFixed(4)} />
        <Metric label="Betweenness" value={node.betweenness.toFixed(4)} />
        <Metric label="Neighbors" value={String(neighbors.length)} />
      </div>
      <p className="mt-2 text-[11px] text-ink-dim">
        Metrics computed with Graphology — not invented by an AI model.
      </p>
      {docs.length > 0 && (
        <>
          <Separator className="my-4" />
          <h3 className="mb-2 text-[11px] uppercase tracking-wider text-ink-dim">
            Source documents
          </h3>
          <ul className="space-y-1 text-sm text-ink-muted">
            {docs.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
        </>
      )}
      <Separator className="my-4" />
      <h3 className="mb-2 text-[11px] uppercase tracking-wider text-ink-dim">
        Connected concepts
      </h3>
      <ul className="space-y-1">
        {neighbors.slice(0, 12).map((id) => {
          const n = analyzed.nodes.find((x) => x.id === id);
          return (
            <li key={id}>
              <button
                type="button"
                className="text-sm text-cyan hover:underline"
                onClick={() => selectNode(id)}
              >
                {n?.label ?? id}
              </button>
            </li>
          );
        })}
      </ul>
      <Separator className="my-4" />
      <h3 className="mb-2 text-[11px] uppercase tracking-wider text-ink-dim">
        Relationships
      </h3>
      <ul className="space-y-2">
        {incident.slice(0, 10).map((e) => (
          <li key={e.id}>
            <button
              type="button"
              className="w-full rounded-md border border-border px-2 py-1.5 text-left text-xs hover:border-cyan/30"
              onClick={() => selectEdge(e.id)}
            >
              <span className="font-mono text-cyan">{e.type}</span>
              <span className="ml-2 text-ink-dim">
                {PROVENANCE_LABEL[e.provenance]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-dim">
        {label}
      </dt>
      <dd className="text-ink-muted">{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-midnight px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-ink-dim">
        {label}
      </div>
      <div className="mt-1 text-ink">{value}</div>
    </div>
  );
}
