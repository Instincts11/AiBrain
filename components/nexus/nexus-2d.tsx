"use client";

import { useMemo } from "react";
import { useNexusDerived } from "@/hooks/use-nexus-derived";
import { useNexusStore } from "@/stores/nexus-store";
import { NODE_TYPE_COLORS, communityColor } from "@/lib/graph/colors";

export function Nexus2D() {
  const { nodes, edges, neighborSet, selectedNodeId } = useNexusDerived();
  const colorMode = useNexusStore((s) => s.colorMode);
  const selectNode = useNexusStore((s) => s.selectNode);

  const { projected, width, height } = useMemo(() => {
    const width = 1000;
    const height = 640;
    if (!nodes.length) return { projected: [], width, height };
    const xs = nodes.map((n) => n.x);
    const zs = nodes.map((n) => n.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const pad = 40;
    const spanX = maxX - minX || 1;
    const spanZ = maxZ - minZ || 1;
    const projected = nodes.map((n) => ({
      ...n,
      px: pad + ((n.x - minX) / spanX) * (width - pad * 2),
      py: pad + ((n.z - minZ) / spanZ) * (height - pad * 2),
    }));
    return { projected, width, height };
  }, [nodes]);

  const pos = useMemo(() => {
    const map = new Map<string, { px: number; py: number }>();
    for (const n of projected) map.set(n.id, { px: n.px, py: n.py });
    return map;
  }, [projected]);

  const maxPr = Math.max(...projected.map((n) => n.pagerank), 0.0001);
  const hasFocus = neighborSet.size > 0;

  return (
    <div className="h-full w-full overflow-auto bg-void p-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full min-h-[420px] w-full"
        role="img"
        aria-label="2D knowledge graph"
      >
        {edges.map((edge) => {
          const a = pos.get(edge.source);
          const b = pos.get(edge.target);
          if (!a || !b) return null;
          const active =
            !hasFocus ||
            (neighborSet.has(edge.source) && neighborSet.has(edge.target));
          return (
            <line
              key={edge.id}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={
                edge.provenance === "inferred"
                  ? "#8b5cf6"
                  : active
                    ? "#475569"
                    : "#1e293b"
              }
              strokeOpacity={active ? 0.7 : 0.2}
              strokeWidth={edge.provenance === "inferred" ? 1 : 1.25}
              strokeDasharray={edge.provenance === "inferred" ? "4 3" : undefined}
            />
          );
        })}
        {projected.map((node) => {
          const r = 4 + (node.pagerank / maxPr) * 10;
          const fill =
            colorMode === "community"
              ? communityColor(node.community)
              : NODE_TYPE_COLORS[node.type];
          const active = !hasFocus || neighborSet.has(node.id);
          const selected = node.id === selectedNodeId;
          return (
            <g
              key={node.id}
              transform={`translate(${node.px}, ${node.py})`}
              className="cursor-pointer"
              onClick={() => selectNode(node.id)}
            >
              <circle
                r={selected ? r * 1.25 : r}
                fill={fill}
                opacity={active ? 1 : 0.25}
                stroke={selected ? "#e8eef7" : "transparent"}
                strokeWidth={1.5}
              />
              {(selected || (!hasFocus && node.pagerank > maxPr * 0.55)) && (
                <text
                  y={-r - 4}
                  textAnchor="middle"
                  className="fill-ink text-[10px]"
                  fill="#e8eef7"
                  fontSize={10}
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
