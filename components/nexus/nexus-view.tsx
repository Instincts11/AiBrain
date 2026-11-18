"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { SectionFrame } from "@/components/shell/section-frame";
import { NexusToolbar } from "./nexus-toolbar";
import { NexusInspector } from "./inspector";
import {
  InfluentialPanel,
  StatsPanel,
  StructuralGapsPanel,
} from "./side-panels";
import { Nexus2D } from "./nexus-2d";
import { useNexusStore } from "@/stores/nexus-store";

const NexusCanvas = dynamic(
  () => import("./nexus-canvas").then((m) => m.NexusCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-xs text-ink-dim">
        Initializing Nexus renderer…
      </div>
    ),
  },
);

export function NexusView() {
  const init = useNexusStore((s) => s.init);
  const ready = useNexusStore((s) => s.ready);
  const initError = useNexusStore((s) => s.initError);
  const viewMode = useNexusStore((s) => s.viewMode);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <SectionFrame
      title="Nexus"
      subtitle="Interactive knowledge universe. Node size encodes PageRank. Structural gaps are labeled as hypotheses."
      badge="Knowledge Graph"
      fullBleed
    >
      <div className="flex h-full min-h-0 flex-col">
        <NexusToolbar />
        {!ready && !initError && (
          <div className="flex flex-1 items-center justify-center font-mono text-xs text-ink-dim">
            Computing graph analytics…
          </div>
        )}
        {initError && (
          <div className="flex flex-1 items-center justify-center text-sm text-crimson">
            {initError}
          </div>
        )}
        {ready && (
          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
            <aside className="dm-scrollbar hidden min-h-0 space-y-3 overflow-auto border-r border-border p-3 lg:block">
              <StatsPanel />
              <InfluentialPanel />
            </aside>
            <div className="relative min-h-[420px] min-w-0">
              {viewMode === "3d" ? <NexusCanvas /> : <Nexus2D />}
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border bg-midnight/80 px-2 py-1 font-mono text-[10px] text-ink-dim backdrop-blur">
                Orbit · Pan · Zoom · Click to inspect
              </div>
            </div>
            <aside className="dm-scrollbar min-h-0 space-y-3 overflow-auto border-t border-border p-3 lg:border-l lg:border-t-0">
              <div className="h-[280px] shrink-0 lg:h-[45%]">
                <NexusInspector />
              </div>
              <StructuralGapsPanel />
              <div className="space-y-3 lg:hidden">
                <StatsPanel />
                <InfluentialPanel />
              </div>
            </aside>
          </div>
        )}
      </div>
    </SectionFrame>
  );
}
