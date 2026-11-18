"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Search,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgentAvatar } from "@/components/shell/agent-avatar";
import { cn } from "@/lib/utils";
import { NexusToolbar } from "./nexus-toolbar";
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

const TABS = [
  "Knowledge Graph",
  "Communities",
  "Gaps & Opportunities",
  "Trends",
  "Map View",
] as const;

const COMMUNITIES = [
  { name: "Technology", pct: 24, color: "#22d3ee" },
  { name: "Market", pct: 18, color: "#a78bfa" },
  { name: "Users", pct: 16, color: "#34d399" },
  { name: "Strategy", pct: 14, color: "#2dd4bf" },
  { name: "Risks", pct: 12, color: "#f472b6" },
  { name: "Resources", pct: 16, color: "#f59e0b" },
];

export function NexusView() {
  const init = useNexusStore((s) => s.init);
  const ready = useNexusStore((s) => s.ready);
  const initError = useNexusStore((s) => s.initError);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Knowledge Graph");

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="dm-scrollbar flex h-full min-h-0 flex-col overflow-auto">
      {/* Header */}
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
              The Nexus
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-emerald">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              Live
            </span>
          </div>
          <p className="mt-1 max-w-xl text-sm text-ink-muted">
            Your interactive knowledge universe — explore connections, discover
            insights and make better decisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 sm:flex">
            <Search className="h-3.5 w-3.5 text-ink-dim" />
            <input
              placeholder="Search your knowledge…"
              className="w-44 bg-transparent text-sm text-ink outline-none placeholder:text-ink-dim lg:w-56"
            />
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-xs text-ink-dim">
              ⌘K
            </kbd>
          </div>
          <button
            type="button"
            className="rounded-xl border border-white/10 p-2.5 text-ink-dim hover:text-ink"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan/40 to-violet/50" />
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-border px-4 py-3 md:px-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-colors",
              tab === t
                ? "border border-cyan/35 bg-cyan/15 text-cyan shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                : "border border-transparent text-ink-muted hover:bg-white/5 hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px] md:p-5">
        {/* Graph + bottom widgets */}
        <div className="flex min-h-0 flex-col gap-4">
          <div className="relative min-h-[380px] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#060a12]">
            <div className="absolute left-3 top-3 z-10">
              <NexusToolbar />
            </div>
            {!ready && !initError && (
              <div className="flex h-full items-center justify-center font-mono text-xs text-ink-dim">
                Computing graph analytics…
              </div>
            )}
            {initError && (
              <div className="flex h-full items-center justify-center text-sm text-crimson">
                {initError}
              </div>
            )}
            {ready && <NexusCanvas />}
            {/* Center tooltip mock */}
            <div className="pointer-events-none absolute left-1/2 top-[42%] z-10 -translate-x-1/2 rounded-xl border border-white/15 bg-black/75 px-4 py-3 text-center shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur">
              <div className="text-sm font-medium text-ink">AI SaaS Product</div>
              <div className="mt-1 space-y-0.5 font-mono text-xs text-ink-dim">
                <div>214 related nodes</div>
                <div>8 communities</div>
                <div>12 key insights</div>
              </div>
            </div>
          </div>

          {/* Bottom dashboard row */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Panel title="Key Insights">
              <ul className="space-y-2.5 text-xs text-ink-muted">
                {[
                  "Strong link between AI capabilities and user needs",
                  "Market opportunity growing ↑ 32%",
                  "Execution path viable within 90 days",
                  "Evidence density highest in Technology cluster",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan" />
                    {t}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Communities">
              <div className="flex items-center gap-3">
                <Donut segments={COMMUNITIES} />
                <ul className="space-y-1 text-sm text-ink-muted">
                  {COMMUNITIES.map((c) => (
                    <li key={c.name} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: c.color }}
                      />
                      {c.name} {c.pct}%
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>

            <Panel title="Knowledge Gaps">
              <ul className="space-y-2.5 text-xs text-ink-muted">
                {[
                  "User validation and real demand data",
                  "Competitive pricing benchmarks",
                  "Regulatory constraints by region",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                    {t}
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Recent Activity">
              <ul className="space-y-2.5 text-xs text-ink-muted">
                {[
                  "Market research.pdf ingested",
                  "Competitor analysis linked",
                  "Dual analysis session started",
                  "Synthesis draft ready",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                    {t}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        {/* Right intelligence column */}
        <aside className="flex flex-col gap-3">
          <div className="text-sm uppercase tracking-wider text-ink-dim">
            Dual Intelligence
          </div>

          <AgentCard
            agent="jarvis"
            name="JARVIS"
            role="Constructive Intelligence"
            bullets={[
              "Opportunity paths mapped across 6 clusters",
              "Optimization plan for MVP scope",
              "Strong evidence for researcher persona fit",
            ]}
          />
          <AgentCard
            agent="ultron"
            name="ULTRON"
            role="Critical Intelligence"
            bullets={[
              "Key risks in competitive saturation",
              "Assumptions on demand need validation",
              "Budget runway pressure under 90 days",
            ]}
          />

          <div className="mt-auto rounded-2xl border border-cyan/25 bg-gradient-to-br from-cyan/15 via-violet/15 to-violet/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-ink">Synthesis</span>
              <Badge variant="cyan">Ready</Badge>
            </div>
            <p className="mb-3 text-xs text-ink-muted">
              Both minds finished. Independent evaluation is ready to produce a
              decision recommendation.
            </p>
            <Link
              href="/synthesis"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.25)]"
            >
              View Decision Synthesis
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-ink-dim">
            <TrendingUp className="mr-1.5 inline h-3.5 w-3.5 text-cyan" />
            Graph health · Sample workspace
          </div>
        </aside>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
      <div className="mb-2.5 text-sm uppercase tracking-wider text-ink-dim">
        {title}
      </div>
      {children}
    </div>
  );
}

function AgentCard({
  agent,
  name,
  role,
  bullets,
}: {
  agent: "jarvis" | "ultron";
  name: string;
  role: string;
  bullets: string[];
}) {
  const accent = agent === "jarvis" ? "cyan" : "violet";
  return (
    <div
      className={cn(
        "rounded-2xl border p-3.5",
        accent === "cyan"
          ? "border-cyan/25 bg-cyan/[0.06]"
          : "border-violet/25 bg-violet/[0.06]",
      )}
    >
      <div className="mb-2.5 flex items-center gap-2.5">
        <AgentAvatar agent={agent} size="sm" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">{name}</span>
            <Badge variant={accent === "cyan" ? "cyan" : "violet"}>
              Analysis Complete
            </Badge>
          </div>
          <div className="truncate text-sm text-ink-dim">{role}</div>
        </div>
      </div>
      <ul className="space-y-1.5 text-xs text-ink-muted">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className={accent === "cyan" ? "text-cyan" : "text-violet"}>
              ·
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Donut({
  segments,
}: {
  segments: { name: string; pct: number; color: string }[];
}) {
  let offset = 0;
  const stops = segments
    .map((s) => {
      const start = offset;
      offset += s.pct;
      return `${s.color} ${start}% ${offset}%`;
    })
    .join(", ");

  return (
    <div
      className="relative h-20 w-20 shrink-0 rounded-full"
      style={{ background: `conic-gradient(${stops})` }}
    >
      <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full bg-[#0a101c] text-center">
        <span className="text-sm font-semibold text-ink">6</span>
        <span className="text-xs uppercase tracking-wider text-ink-dim">
          Clusters
        </span>
      </div>
    </div>
  );
}
