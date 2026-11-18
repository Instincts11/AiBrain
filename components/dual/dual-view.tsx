"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  FileText,
  Infinity as InfinityIcon,
  Minus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgentAvatar } from "@/components/shell/agent-avatar";
import { cn } from "@/lib/utils";

const FLOW = [
  "Context",
  "JARVIS Analysis",
  "ULTRON Analysis",
  "Argument Exchange",
  "Evaluation",
  "Synthesis",
] as const;

const TABS = [
  "Argument Exchange",
  "Claims Comparison",
  "Evidence",
  "Risks",
  "Alternatives",
  "Insights",
] as const;

const CLAIMS = [
  {
    claim: "Market opportunity",
    jarvis: "Strong — underserved researchers",
    ultron: "Real but crowded",
    verdict: "agree" as const,
  },
  {
    claim: "Build MVP in 90 days",
    jarvis: "Feasible with scoped features",
    ultron: "Optimistic without validation",
    verdict: "partial" as const,
  },
  {
    claim: "Competitive risk",
    jarvis: "Differentiable via dual-mind UX",
    ultron: "Incumbents can copy fast",
    verdict: "agree" as const,
  },
  {
    claim: "$20k runway sufficiency",
    jarvis: "Tight but workable",
    ultron: "Insufficient for GTM",
    verdict: "disagree" as const,
  },
];

const ARGUMENTS = [
  {
    agent: "jarvis" as const,
    time: "06:02",
    text: "Researchers already pay for fragmented tools. A unified AI workspace with dual critique is a clear wedge.",
  },
  {
    agent: "ultron" as const,
    time: "06:08",
    text: "Willingness to pay is asserted, not proven. Without interviews, the 20-user target is speculative.",
  },
  {
    agent: "jarvis" as const,
    time: "06:14",
    text: "We can de-risk with a concierge MVP: ingest papers, dual summaries, and a waitlist CTA.",
  },
  {
    agent: "ultron" as const,
    time: "06:19",
    text: "Concierge works only if domain experts stay available. That dependency is a hidden cost.",
  },
];

export function DualView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Argument Exchange");

  return (
    <div className="dm-scrollbar flex h-full min-h-0 flex-col overflow-auto">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
            Dual Analysis
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Two independent minds. Different perspectives. A deeper, more
            reliable answer.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-2 py-0.5 text-xs uppercase tracking-wider text-emerald">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
              Live Analysis
            </span>
            <span className="font-mono text-ink-dim">06:24</span>
            <span className="rounded-lg border border-white/10 px-2 py-1 text-ink-muted">
              Session: AI SaaS Product
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-white/10 p-2.5 text-ink-dim hover:text-ink"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan/40 to-violet/50" />
        </div>
      </div>

      {/* Process flow */}
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-4 py-3 md:px-6">
        {FLOW.map((step, i) => {
          const done = i < 2;
          const active = i === 2;
          return (
            <div key={step} className="flex items-center gap-1">
              <div
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs",
                  active &&
                    "border border-violet/40 bg-violet/15 text-violet shadow-[0_0_14px_rgba(139,92,246,0.25)]",
                  done && "text-emerald",
                  !done && !active && "text-ink-dim",
                )}
              >
                {done && <Check className="mr-1 inline h-3 w-3" />}
                {step}
              </div>
              {i < FLOW.length - 1 && (
                <div className="mx-1 h-px w-4 bg-white/10 sm:w-6" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_260px] md:p-5">
        <div className="flex min-h-0 flex-col gap-4">
          {/* Side-by-side minds */}
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
            <MindPanel
              agent="jarvis"
              name="JARVIS"
              role="Constructive Intelligence"
              confidence={0.84}
              title="Proposed Strategy"
              points={[
                "Ship a scoped MVP for researchers in 90 days",
                "Lead with dual-perspective summaries as the wedge",
                "Convert early users via waitlist + concierge onboarding",
              ]}
            />
            <div className="flex flex-col items-center justify-center py-2">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan/30 bg-gradient-to-br from-cyan/20 via-violet/25 to-violet/10 shadow-[0_0_36px_rgba(139,92,246,0.25)]">
                <InfinityIcon className="h-9 w-9 text-ink" />
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-ink-dim">
                Dual Analysis
              </div>
            </div>
            <MindPanel
              agent="ultron"
              name="ULTRON"
              role="Critical Intelligence"
              confidence={0.76}
              title="Critical Assessment"
              points={[
                "Market demand claims lack primary validation",
                "Competitive response risk is underweighted",
                "Budget may not cover meaningful GTM experiments",
              ]}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs",
                  tab === t
                    ? "border border-cyan/35 bg-cyan/15 text-cyan"
                    : "border border-transparent text-ink-muted hover:bg-white/5",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid gap-3 xl:grid-cols-[1.1fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 text-sm uppercase tracking-wider text-ink-dim">
                Argument Exchange
              </div>
              <div className="space-y-3">
                {ARGUMENTS.map((a, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-2.5",
                      a.agent === "ultron" && "flex-row-reverse text-right",
                    )}
                  >
                    <AgentAvatar agent={a.agent} size="sm" />
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl border px-3 py-2 text-xs leading-relaxed text-ink-muted",
                        a.agent === "jarvis"
                          ? "border-cyan/20 bg-cyan/[0.06]"
                          : "border-violet/20 bg-violet/[0.06]",
                      )}
                    >
                      <div className="mb-1 font-mono text-xs text-ink-dim">
                        {a.agent === "jarvis" ? "JARVIS" : "ULTRON"} · {a.time}
                      </div>
                      {a.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 text-sm uppercase tracking-wider text-ink-dim">
                Key Claims Comparison
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-xs">
                  <thead className="text-xs uppercase tracking-wider text-ink-dim">
                    <tr className="border-b border-white/10">
                      <th className="pb-2 pr-2 font-medium">Claim</th>
                      <th className="pb-2 pr-2 font-medium text-cyan">JARVIS</th>
                      <th className="pb-2 pr-2 font-medium text-violet">
                        ULTRON
                      </th>
                      <th className="pb-2 font-medium">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CLAIMS.map((c) => (
                      <tr key={c.claim} className="border-b border-white/5">
                        <td className="py-2.5 pr-2 text-ink">{c.claim}</td>
                        <td className="py-2.5 pr-2 text-ink-muted">
                          {c.jarvis}
                        </td>
                        <td className="py-2.5 pr-2 text-ink-muted">
                          {c.ultron}
                        </td>
                        <td className="py-2.5">
                          <Verdict v={c.verdict} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <div className="mb-2 text-sm uppercase tracking-wider text-ink-dim">
                  Evidence & Sources
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "market_research.pdf",
                    "competitor_analysis.pdf",
                    "user_notes.md",
                  ].map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1 text-sm text-ink-muted"
                    >
                      <FileText className="h-3 w-3 text-cyan" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right summary */}
        <aside className="flex flex-col gap-3">
          <Panel title="Analysis Overview">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["18", "Key Claims"],
                ["7", "Agreements"],
                ["4", "Disagreements"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-xl border border-white/10 bg-black/20 px-2 py-2"
                >
                  <div className="text-lg font-semibold text-ink">{n}</div>
                  <div className="text-xs text-ink-dim">{l}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Key Agreements">
            <ul className="space-y-2 text-xs text-ink-muted">
              {[
                "Researcher pain is real and recurring",
                "Differentiation must be product-led",
                "Competitive pressure exists",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                  {t}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Key Disagreements">
            <ul className="space-y-2 text-xs text-ink-muted">
              {[
                "Speed vs validation sequencing",
                "Whether $20k covers GTM experiments",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" />
                  {t}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Emerging Insights">
            <ul className="space-y-2 text-xs text-ink-muted">
              <li>Phased build with paid pilot reduces downside.</li>
              <li>Primary research should gate Phase 2 spend.</li>
            </ul>
          </Panel>

          <div className="mt-auto rounded-2xl border border-violet/30 bg-gradient-to-br from-cyan/10 via-violet/15 to-violet/10 p-4">
            <div className="mb-1 text-sm uppercase tracking-wider text-ink-dim">
              Next: Synthesis
            </div>
            <p className="mb-3 text-xs text-ink-muted">
              Independent evaluation will weigh evidence quality and produce a
              recommendation.
            </p>
            <Link
              href="/synthesis"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet px-4 py-2.5 text-sm font-medium text-white"
            >
              Run Synthesis
              <ArrowUpRight className="h-4 w-4" />
            </Link>
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

function MindPanel({
  agent,
  name,
  role,
  confidence,
  title,
  points,
}: {
  agent: "jarvis" | "ultron";
  name: string;
  role: string;
  confidence: number;
  title: string;
  points: string[];
}) {
  const accent = agent === "jarvis" ? "cyan" : "violet";
  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        accent === "cyan"
          ? "border-cyan/25 bg-cyan/[0.06]"
          : "border-violet/25 bg-violet/[0.06]",
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <AgentAvatar agent={agent} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-ink">{name}</span>
            <Badge variant={accent === "cyan" ? "cyan" : "violet"}>
              Confidence {confidence.toFixed(2)}
            </Badge>
          </div>
          <div className="text-sm text-ink-dim">{role}</div>
        </div>
      </div>
      <div className="mb-2 text-xs font-medium text-ink">{title}</div>
      <ul className="space-y-2 text-xs text-ink-muted">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className={accent === "cyan" ? "text-cyan" : "text-violet"}>
              ·
            </span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Verdict({ v }: { v: "agree" | "partial" | "disagree" }) {
  if (v === "agree")
    return (
      <span className="inline-flex items-center gap-1 text-emerald">
        <Check className="h-3.5 w-3.5" /> Agreed
      </span>
    );
  if (v === "partial")
    return (
      <span className="inline-flex items-center gap-1 text-amber">
        <Minus className="h-3.5 w-3.5" /> Partial
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-crimson">
      <X className="h-3.5 w-3.5" /> Conflict
    </span>
  );
}
