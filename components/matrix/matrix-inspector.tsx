"use client";

import { X } from "lucide-react";
import { useMatrixSelection, useMatrixStore } from "@/stores/matrix-store";
import { CATEGORY_COLORS, CLUSTER_LABELS, RELATION_COLORS } from "@/lib/matrix/colors";
import { Badge } from "@/components/ui/badge";

export function MatrixInspector() {
  const { selectedNode, selectedEdge } = useMatrixSelection();
  const built = useMatrixStore((s) => s.built);
  const selectNode = useMatrixStore((s) => s.selectNode);
  const selectEdge = useMatrixStore((s) => s.selectEdge);

  if (!selectedNode && !selectedEdge) return null;

  if (selectedEdge && built) {
    const a = built.layout.find((n) => n.id === selectedEdge.source);
    const b = built.layout.find((n) => n.id === selectedEdge.target);
    return (
      <aside className="absolute right-3 top-3 z-20 w-[min(340px,calc(100%-1.5rem))] rounded-2xl border border-amber-500/25 bg-[#0c0a08]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <Header title="Relationship" onClose={() => selectEdge(null)} />
        <div
          className="mb-2 inline-flex rounded-full px-2 py-0.5 text-xs uppercase tracking-wider"
          style={{
            color: RELATION_COLORS[selectedEdge.type],
            background: `${RELATION_COLORS[selectedEdge.type]}22`,
          }}
        >
          {selectedEdge.type.replace("_", " ")}
        </div>
        <p className="text-sm text-stone-200">{selectedEdge.reason}</p>
        <p className="mt-2 font-mono text-sm text-stone-500">
          Confidence {(selectedEdge.confidence * 100).toFixed(0)}%
        </p>
        <div className="mt-3 space-y-1.5">
          {[a, b].filter(Boolean).map((n) => (
            <button
              key={n!.id}
              type="button"
              onClick={() => selectNode(n!.id)}
              className="block w-full rounded-lg border border-white/10 px-3 py-2 text-left text-xs text-stone-300 hover:border-amber-500/40"
            >
              {n!.label}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  if (!selectedNode || !built) return null;

  const related = built.edges
    .filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id,
    )
    .slice(0, 8)
    .map((e) => {
      const otherId = e.source === selectedNode.id ? e.target : e.source;
      const other = built.layout.find((n) => n.id === otherId);
      return { edge: e, other };
    });

  return (
    <aside className="absolute right-3 top-3 z-20 max-h-[min(70vh,560px)] w-[min(360px,calc(100%-1.5rem))] overflow-auto rounded-2xl border border-amber-500/25 bg-[#0c0a08]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <Header title="Memory" onClose={() => selectNode(null)} />
      <h2 className="text-lg font-medium text-stone-50">{selectedNode.label}</h2>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge
          className="border-0"
          style={{
            background: `${CATEGORY_COLORS[selectedNode.category]}22`,
            color: CATEGORY_COLORS[selectedNode.category],
          }}
        >
          {selectedNode.category}
        </Badge>
        <Badge>{CLUSTER_LABELS[selectedNode.cluster]}</Badge>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-400">
        {selectedNode.summary}
      </p>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <Field label="Source" value={selectedNode.source} />
        <Field
          label="Created"
          value={new Date(selectedNode.createdAt).toLocaleDateString()}
        />
        <Field label="Degree" value={String(selectedNode.degree)} />
        <Field
          label="PageRank"
          value={selectedNode.pagerank.toFixed(4)}
        />
        <Field
          label="Importance"
          value={selectedNode.importance.toFixed(2)}
        />
        <Field
          label="Activity"
          value={selectedNode.activity.toFixed(2)}
        />
      </dl>

      <div className="mt-4 text-xs uppercase tracking-wider text-stone-500">
        Connected memories
      </div>
      <ul className="mt-1.5 space-y-1.5">
        {related.map(({ edge, other }) =>
          other ? (
            <li key={edge.id}>
              <button
                type="button"
                onClick={() => selectNode(other.id)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/8 px-2.5 py-1.5 text-left text-xs text-stone-300 hover:border-amber-500/35"
              >
                <span className="truncate">{other.label}</span>
                <span className="shrink-0 font-mono text-xs text-amber-500/80">
                  {edge.type}
                </span>
              </button>
            </li>
          ) : null,
        )}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <Action onClick={() => useMatrixStore.getState().setFocusMode(true)}>
          Focus neighborhood
        </Action>
        <Action
          onClick={() =>
            useMatrixStore.getState().setClusterFocus(selectedNode.cluster)
          }
        >
          Enter cluster
        </Action>
      </div>
    </aside>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
        {title}
      </span>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 text-stone-500 hover:bg-white/5 hover:text-stone-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/25 px-2 py-1.5">
      <div className="text-xs uppercase tracking-wider text-stone-600">
        {label}
      </div>
      <div className="truncate font-mono text-stone-300">{value}</div>
    </div>
  );
}

function Action({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-sm text-amber-100 hover:bg-amber-500/20"
    >
      {children}
    </button>
  );
}
