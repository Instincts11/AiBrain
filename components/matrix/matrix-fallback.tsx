"use client";

import { useMemo } from "react";
import { useMatrixSelection, useMatrixStore } from "@/stores/matrix-store";
import { projectToSphere } from "@/lib/matrix/sphere-layout";

/** Accessible non-WebGL / 2D orthographic of the Ultron sphere. */
export function MatrixFallback() {
  const { nodes: raw, edges, selectedNode } = useMatrixSelection();
  const selectNode = useMatrixStore((s) => s.selectNode);
  const nodes = useMemo(() => projectToSphere(raw, 14), [raw]);

  const projected = useMemo(() => {
    if (!nodes.length) return [];
    return nodes.map((n) => ({
      ...n,
      px: 50 + (n.x / 16) * 45,
      py: 50 + (n.z / 16) * 45,
    }));
  }, [nodes]);

  const pos = useMemo(() => {
    const m = new Map<string, { px: number; py: number }>();
    for (const n of projected) m.set(n.id, { px: n.px, py: n.py });
    return m;
  }, [projected]);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-[#030303]">
      <svg className="absolute inset-0 h-full w-full" aria-label="2D memory map">
        {edges.slice(0, 2500).map((e) => {
          const a = pos.get(e.source);
          const b = pos.get(e.target);
          if (!a || !b) return null;
          return (
            <line
              key={e.id}
              x1={`${a.px}%`}
              y1={`${a.py}%`}
              x2={`${b.px}%`}
              y2={`${b.py}%`}
              stroke="#7c4a1a"
              strokeOpacity={0.25}
              strokeWidth={0.5}
            />
          );
        })}
      </svg>
      {projected.map((n) => {
        const size = 4 + n.importance * 8;
        const hot = selectedNode?.id === n.id;
        return (
          <button
            key={n.id}
            type="button"
            title={n.label}
            onClick={() => selectNode(n.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/40 focus:outline-none focus:ring-2 focus:ring-amber-400"
            style={{
              left: `${n.px}%`,
              top: `${n.py}%`,
              width: hot ? size * 1.4 : size,
              height: hot ? size * 1.4 : size,
              background: "#ff1493",
              boxShadow: hot ? "0 0 12px rgba(251,191,36,0.8)" : undefined,
            }}
          />
        );
      })}
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/70 px-2 py-1 font-mono text-xs text-stone-500">
        2D fallback · same graph entities · click nodes to inspect
      </div>
    </div>
  );
}
