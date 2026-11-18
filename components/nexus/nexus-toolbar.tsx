"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RelationType } from "@/lib/graph/types";
import { useNexusStore } from "@/stores/nexus-store";

const RELATIONS: Array<RelationType | "ALL"> = [
  "ALL",
  "RELATED_TO",
  "SUPPORTS",
  "CONTRADICTS",
  "DEPENDS_ON",
  "ENABLES",
  "BLOCKS",
  "PART_OF",
  "MENTIONED_IN",
  "DERIVED_FROM",
  "COMPETES_WITH",
  "CAUSED_BY",
];

export function NexusToolbar() {
  const search = useNexusStore((s) => s.search);
  const setSearch = useNexusStore((s) => s.setSearch);
  const relationFilter = useNexusStore((s) => s.relationFilter);
  const setRelationFilter = useNexusStore((s) => s.setRelationFilter);
  const colorMode = useNexusStore((s) => s.colorMode);
  const setColorMode = useNexusStore((s) => s.setColorMode);
  const viewMode = useNexusStore((s) => s.viewMode);
  const setViewMode = useNexusStore((s) => s.setViewMode);
  const hideNonNeighbors = useNexusStore((s) => s.hideNonNeighbors);
  const setHideNonNeighbors = useNexusStore((s) => s.setHideNonNeighbors);
  const communityFocus = useNexusStore((s) => s.communityFocus);
  const setCommunityFocus = useNexusStore((s) => s.setCommunityFocus);
  const analyzed = useNexusStore((s) => s.analyzed);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-midnight/80 px-3 py-2 backdrop-blur">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search concepts…"
        className="h-8 max-w-[200px]"
        aria-label="Search concepts"
      />
      <select
        className="h-8 rounded-md border border-border-strong bg-midnight px-2 text-xs text-ink"
        value={relationFilter}
        onChange={(e) =>
          setRelationFilter(e.target.value as RelationType | "ALL")
        }
        aria-label="Filter by relationship type"
      >
        {RELATIONS.map((r) => (
          <option key={r} value={r}>
            {r === "ALL" ? "All relationships" : r}
          </option>
        ))}
      </select>
      <select
        className="h-8 rounded-md border border-border-strong bg-midnight px-2 text-xs text-ink"
        value={communityFocus ?? ""}
        onChange={(e) =>
          setCommunityFocus(e.target.value === "" ? null : Number(e.target.value))
        }
        aria-label="Focus community"
      >
        <option value="">All communities</option>
        {analyzed &&
          Object.entries(analyzed.communityLabels).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
      </select>
      <Button
        size="sm"
        variant={colorMode === "community" ? "jarvis" : "secondary"}
        onClick={() => setColorMode("community")}
      >
        Community color
      </Button>
      <Button
        size="sm"
        variant={colorMode === "category" ? "jarvis" : "secondary"}
        onClick={() => setColorMode("category")}
      >
        Category color
      </Button>
      <Button
        size="sm"
        variant={hideNonNeighbors ? "ultron" : "secondary"}
        onClick={() => setHideNonNeighbors(!hideNonNeighbors)}
      >
        Neighbors only
      </Button>
      <div className="ml-auto flex items-center gap-1">
        <Button
          size="sm"
          variant={viewMode === "3d" ? "default" : "secondary"}
          onClick={() => setViewMode("3d")}
        >
          3D
        </Button>
        <Button
          size="sm"
          variant={viewMode === "2d" ? "default" : "secondary"}
          onClick={() => setViewMode("2d")}
        >
          2D
        </Button>
      </div>
    </div>
  );
}
