"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  ChevronDown,
  Focus,
  Maximize2,
  Minimize2,
  PanelTopClose,
  RotateCcw,
  Search,
  Tag,
  Inbox,
} from "lucide-react";
import { useMatrixStore } from "@/stores/matrix-store";
import { useUiStore } from "@/stores/ui-store";
import { CLUSTER_LABELS } from "@/lib/matrix/colors";
import type { MemoryCategory, MemoryClusterId } from "@/lib/matrix/types";
import { MatrixPanels } from "./matrix-panels";
import { MatrixInspector } from "./matrix-inspector";
import { MatrixFallback } from "./matrix-fallback";
import { cn } from "@/lib/utils";

const MatrixCanvas = dynamic(
  () => import("./matrix-canvas").then((m) => m.MatrixCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-stone-500">
        Initializing Memory Matrix…
      </div>
    ),
  },
);

const CATEGORIES: Array<MemoryCategory | "ALL"> = [
  "ALL",
  "concept",
  "document",
  "conversation",
  "project",
  "person",
  "research",
  "insight",
];

export function MatrixView() {
  const init = useMatrixStore((s) => s.init);
  const ready = useMatrixStore((s) => s.ready);
  const error = useMatrixStore((s) => s.error);
  const built = useMatrixStore((s) => s.built);
  const search = useMatrixStore((s) => s.search);
  const setSearch = useMatrixStore((s) => s.setSearch);
  const categoryFilter = useMatrixStore((s) => s.categoryFilter);
  const setCategoryFilter = useMatrixStore((s) => s.setCategoryFilter);
  const clusterFocus = useMatrixStore((s) => s.clusterFocus);
  const setClusterFocus = useMatrixStore((s) => s.setClusterFocus);
  const viewMode = useMatrixStore((s) => s.viewMode);
  const setViewMode = useMatrixStore((s) => s.setViewMode);
  const vizForm = useMatrixStore((s) => s.vizForm);
  const setVizForm = useMatrixStore((s) => s.setVizForm);
  const showLabels = useMatrixStore((s) => s.showLabels);
  const setShowLabels = useMatrixStore((s) => s.setShowLabels);
  const focusMode = useMatrixStore((s) => s.focusMode);
  const setFocusMode = useMatrixStore((s) => s.setFocusMode);
  const resetCamera = useMatrixStore((s) => s.resetCamera);
  const pendingOpen = useMatrixStore((s) => s.pendingOpen);
  const setPendingOpen = useMatrixStore((s) => s.setPendingOpen);
  const ingestNext = useMatrixStore((s) => s.ingestNext);
  const ingestAllPending = useMatrixStore((s) => s.ingestAllPending);
  const selectNode = useMatrixStore((s) => s.selectNode);

  const matrixStatsOpen = useUiStore((s) => s.matrixStatsOpen);
  const setMatrixStatsOpen = useUiStore((s) => s.setMatrixStatsOpen);

  const [webgl, setWebgl] = useState(true);
  const [topOpen, setTopOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(
        c.getContext("webgl2") ||
        c.getContext("webgl") ||
        c.getContext("experimental-webgl")
      );
      setWebgl(ok);
    } catch {
      setWebgl(false);
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (expanded) {
          setExpanded(false);
          return;
        }
        selectNode(null);
        setPendingOpen(false);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        document.getElementById("matrix-search")?.focus();
      }
      if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        resetCamera();
      }
      if (e.key === "e" && !(e.target instanceof HTMLInputElement)) {
        setExpanded((v) => !v);
      }
      if (e.key === "[" && !(e.target instanceof HTMLInputElement)) {
        setTopOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectNode, setPendingOpen, resetCamera, expanded]);

  useEffect(() => {
    if (expanded) {
      setTopOpen(false);
      setMatrixStatsOpen(false);
    }
  }, [expanded, setMatrixStatsOpen]);

  const pendingCount = built?.pending.length ?? 0;
  const clusterOptions = useMemo(
    () => Object.entries(CLUSTER_LABELS) as [MemoryClusterId, string][],
    [],
  );

  const showTop = topOpen && !expanded;
  const showBottom = matrixStatsOpen && !expanded;

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden bg-[#02040a]",
        expanded && "fixed inset-0 z-[60]",
      )}
    >
      <div
        className={cn(
          "shrink-0 overflow-hidden border-b border-white/8 transition-[max-height,opacity] duration-300 ease-out",
          showTop ? "max-h-[220px] opacity-100" : "max-h-0 border-b-0 opacity-0",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 md:px-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-stone-50 md:text-2xl">
                Memory Matrix
              </h1>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs uppercase tracking-wider text-amber-300">
                Second Brain
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-stone-500">
              Learning intelligence — connected memory nodes and pathways. Scroll
              to zoom; open Stats beside chat for panels.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
              <Search className="h-3.5 w-3.5 text-stone-500" />
              <input
                id="matrix-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search memories…  /"
                className="w-40 bg-transparent text-sm text-stone-200 outline-none placeholder:text-stone-600 lg:w-52"
              />
            </div>
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => setPendingOpen(!pendingOpen)}
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-100 shadow-[0_0_24px_rgba(245,158,11,0.25)]"
              >
                <Inbox className="h-3.5 w-3.5" />
                NEW MEMORIES +{pendingCount}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 pb-3 md:px-5">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as MemoryCategory | "ALL")
            }
            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-stone-300"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All categories" : c}
              </option>
            ))}
          </select>
          <select
            value={clusterFocus ?? ""}
            onChange={(e) =>
              setClusterFocus(
                (e.target.value || null) as MemoryClusterId | null,
              )
            }
            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-stone-300"
          >
            <option value="">All clusters</option>
            {clusterOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <ToolToggle
            active={focusMode}
            onClick={() => setFocusMode(!focusMode)}
            icon={Focus}
            label="Focus"
          />
          <ToolToggle
            active={vizForm === "hologram"}
            onClick={() =>
              setVizForm(
                vizForm === "hologram" ? "constellation" : "hologram",
              )
            }
            icon={Box}
            label={vizForm === "hologram" ? "Hologram" : "Constellation"}
          />
          <ToolToggle
            active={showLabels}
            onClick={() => setShowLabels(!showLabels)}
            icon={Tag}
            label="Labels"
          />
          <ToolToggle
            active={viewMode === "3d"}
            onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
            icon={Box}
            label={viewMode === "3d" ? "3D" : "2D"}
          />
          <button
            type="button"
            onClick={resetCamera}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-sm text-stone-400 hover:text-stone-200"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          {ready && built && (
            <span className="ml-auto font-mono text-xs text-stone-600">
              {built.stats.totalMemories.toLocaleString()} nodes ·{" "}
              {built.stats.edgeCount.toLocaleString()} edges
            </span>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3">
        <div className="pointer-events-auto">
          <ChromeBtn
            onClick={() => {
              if (expanded) setExpanded(false);
              setTopOpen((v) => !v);
            }}
            title={showTop ? "Collapse header ([)" : "Expand header ([)"}
          >
            {showTop ? (
              <PanelTopClose className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">
              {showTop ? "Hide top" : "Show top"}
            </span>
          </ChromeBtn>
        </div>
        <ChromeBtn
          onClick={() => setExpanded((v) => !v)}
          title={expanded ? "Exit immersive (Esc / E)" : "Expand intelligence (E)"}
          accent
        >
          {expanded ? (
            <Minimize2 className="h-3.5 w-3.5" />
          ) : (
            <Maximize2 className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">
            {expanded ? "Exit" : "Expand"}
          </span>
        </ChromeBtn>
      </div>

      <div className="relative min-h-0 flex-1 transition-[flex] duration-300">
        {!ready && !error && (
          <div className="flex h-full items-center justify-center font-mono text-xs text-stone-500">
            Computing learning intelligence volume…
          </div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center text-sm text-red-400">
            {error}
          </div>
        )}
        {ready &&
          (viewMode === "3d" && webgl ? (
            <MatrixCanvas />
          ) : (
            <MatrixFallback />
          ))}
        <MatrixInspector />

        {pendingOpen && built && pendingCount > 0 && (
          <div className="absolute left-3 top-14 z-20 w-[min(320px,calc(100%-1.5rem))] rounded-2xl border border-amber-500/30 bg-[#0c0a08]/95 p-3 shadow-2xl backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-300/90">
                Ingestion queue
              </span>
              <button
                type="button"
                onClick={() => setPendingOpen(false)}
                className="text-xs text-stone-500 hover:text-stone-300"
              >
                Close
              </button>
            </div>
            <ul className="mb-3 max-h-40 space-y-1.5 overflow-auto">
              {built.pending.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-white/8 px-2 py-1.5 text-sm text-stone-300"
                >
                  {p.label}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={ingestNext}
                className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-xs font-medium text-black"
              >
                Ingest next
              </button>
              <button
                type="button"
                onClick={ingestAllPending}
                className="rounded-lg border border-amber-500/40 px-3 py-2 text-xs text-amber-100"
              >
                All
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "shrink-0 overflow-hidden border-t border-white/8 bg-[#050403] transition-[max-height,opacity] duration-300 ease-out",
          showBottom
            ? "max-h-[42vh] opacity-100"
            : "max-h-0 border-t-0 opacity-0",
        )}
      >
        <div className="dm-scrollbar max-h-[42vh] overflow-auto px-3 py-3 md:px-4">
          <MatrixPanels />
        </div>
      </div>
    </div>
  );
}

function ChromeBtn({
  children,
  onClick,
  title,
  accent,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm backdrop-blur-md",
        accent
          ? "border-amber-400/45 bg-amber-500/20 text-amber-50 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          : "border-white/12 bg-black/55 text-stone-300 hover:border-amber-500/30 hover:text-amber-100",
      )}
    >
      {children}
    </button>
  );
}

function ToolToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm",
        active
          ? "border-amber-500/40 bg-amber-500/15 text-amber-100"
          : "border-white/10 text-stone-400 hover:text-stone-200",
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}
