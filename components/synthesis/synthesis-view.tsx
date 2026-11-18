"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bell,
  Check,
  FileText,
  Infinity as InfinityIcon,
  TrendingUp,
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
  "Synthesis Overview",
  "Evidence Analysis",
  "Trade-offs",
  "Risk Assessment",
  "Decision Rationale",
] as const;

const TRADEOFFS = [
  {
    factor: "Time to Market",
    a: "Fast (90 days)",
    b: "Slower (6 months)",
  },
  { factor: "Cost", a: "Lower upfront", b: "Higher validation spend" },
  { factor: "Risk", a: "Higher product risk", b: "Lower demand risk" },
  {
    factor: "Learning",
    a: "Ship to learn",
    b: "Learn then ship",
  },
];

export function SynthesisView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Synthesis Overview");

  return (
    <div className="dm-scrollbar flex h-full min-h-0 flex-col overflow-auto">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
            Synthesis
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Integrate both perspectives, evaluate the evidence, and generate a
            final, actionable decision.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-ink-muted sm:inline">
            Session: AI SaaS for Researchers
          </span>
          <button
            type="button"
            className="rounded-xl border border-white/10 p-2.5 text-ink-dim hover:text-ink"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan/40 to-violet/50" />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-4 py-3 md:px-6">
        {FLOW.map((step, i) => {
          const done = i < 5;
          const active = i === 5;
          return (
            <div key={step} className="flex items-center gap-1">
              <div
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs",
                  active &&
                    "border border-cyan/40 bg-gradient-to-r from-cyan/20 to-violet/20 text-ink shadow-[0_0_16px_rgba(34,211,238,0.25)]",
                  done && "text-emerald",
                  !done && !active && "text-ink-dim",
                )}
              >
                {done && <Check className="mr-1 inline h-3 w-3" />}
                {active && <span className="mr-1 text-cyan">6</span>}
                {step}
              </div>
              {i < FLOW.length - 1 && (
                <div className="mx-1 h-px w-4 bg-white/10 sm:w-6" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px] md:p-5">
        <div className="flex min-h-0 flex-col gap-4">
          {/* Hero synthesis */}
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#060a12] p-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="flex items-center gap-3 rounded-xl border border-cyan/20 bg-cyan/[0.05] p-3">
              <AgentAvatar agent="jarvis" size="lg" />
              <div>
                <div className="text-sm font-medium text-ink">JARVIS</div>
                <div className="text-sm text-ink-dim">
                  Constructive Analysis
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center py-2">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-cyan/30 bg-gradient-to-br from-cyan/25 via-violet/30 to-violet/15 shadow-[0_0_44px_rgba(34,211,238,0.22)]">
                <InfinityIcon className="h-10 w-10 text-ink" />
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider text-cyan">
                Independent Evaluation
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-violet/20 bg-violet/[0.05] p-3 md:flex-row-reverse md:text-right">
              <AgentAvatar agent="ultron" size="lg" />
              <div>
                <div className="text-sm font-medium text-ink">ULTRON</div>
                <div className="text-sm text-ink-dim">Critical Analysis</div>
              </div>
            </div>
          </div>

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

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm leading-relaxed text-ink-muted">
              Synthesis combined JARVIS’s opportunity-focused strategy with
              ULTRON’s risk critique. The independent evaluation favors a{" "}
              <span className="text-ink">phased build</span> — ship a narrow MVP
              while gating expansion on validated demand.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Decision Confidence",
                  value: "0.86",
                  hint: "↑ strong",
                },
                { label: "Opportunity Score", value: "High", hint: "market" },
                { label: "Risk Level", value: "Medium", hint: "managed" },
                {
                  label: "Evidence Strength",
                  value: "Strong",
                  hint: "sourced",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-3"
                >
                  <div className="text-xs uppercase tracking-wider text-ink-dim">
                    {m.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-ink">
                      {m.value}
                    </span>
                    <span className="text-xs text-cyan">{m.hint}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald/25 bg-emerald/[0.06] p-4">
              <div className="mb-2 text-sm uppercase tracking-wider text-emerald">
                Key Agreement Areas
              </div>
              <ul className="space-y-2 text-xs text-ink-muted">
                {[
                  "Growing and underserved researcher market",
                  "Product differentiation via dual-mind UX",
                  "Need for an execution-ready MVP scope",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-violet/25 bg-violet/[0.06] p-4">
              <div className="mb-2 text-sm uppercase tracking-wider text-violet">
                Key Disagreement Areas
              </div>
              <ul className="space-y-2 text-xs text-ink-muted">
                {[
                  "Market entry timing vs validation depth",
                  "Whether $20k covers meaningful GTM",
                  "Competitive response speed assumptions",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-0.5 text-violet">·</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 text-sm uppercase tracking-wider text-ink-dim">
              Trade-off Analysis
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-xs">
                <thead className="text-xs uppercase tracking-wider text-ink-dim">
                  <tr className="border-b border-white/10">
                    <th className="pb-2 pr-3 font-medium">Factor</th>
                    <th className="pb-2 pr-3 font-medium text-cyan">
                      Option A · Aggressive
                    </th>
                    <th className="pb-2 font-medium text-violet">
                      Option B · Conservative
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TRADEOFFS.map((r) => (
                    <tr key={r.factor} className="border-b border-white/5">
                      <td className="py-2.5 pr-3 text-ink">{r.factor}</td>
                      <td className="py-2.5 pr-3 text-ink-muted">{r.a}</td>
                      <td className="py-2.5 text-ink-muted">{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-sm uppercase tracking-wider text-ink-dim">
                Evidence Foundation
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "market_research.pdf",
                  "competitor_analysis.pdf",
                  "interview_notes.md",
                  "budget_model.xlsx",
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

        {/* Right output column */}
        <aside className="flex flex-col gap-3">
          <div className="rounded-2xl border border-cyan/25 bg-gradient-to-br from-cyan/10 via-violet/10 to-transparent p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm uppercase tracking-wider text-ink-dim">
                Final Recommendation
              </div>
              <Badge variant="cyan">0.86</Badge>
            </div>
            <h2 className="text-lg font-semibold text-ink">
              Proceed — Build the AI SaaS (Phased)
            </h2>
            <div className="mt-3 space-y-2 text-xs text-ink-muted">
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <span className="text-cyan">Phase 1 · </span>
                Concierge MVP + waitlist (30 days)
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <span className="text-violet">Phase 2 · </span>
                Validate demand with 20 pilots
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <span className="text-emerald">Phase 3 · </span>
                Expand features only on traction
              </div>
            </div>
            <Link
              href="/mission"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.25)]"
            >
              Send to Mission Control
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <Panel title="Decision Impact">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Strategic Fit", value: 87 },
                { label: "Feasibility", value: 82 },
                { label: "Expected ROI", value: 79 },
              ].map((g) => (
                <Gauge key={g.label} label={g.label} value={g.value} />
              ))}
            </div>
          </Panel>

          <Panel title="Key Risks & Mitigations">
            <ul className="space-y-3 text-xs">
              {[
                {
                  risk: "Competitive pressure",
                  mit: "Ship differentiated dual-mind UX early",
                },
                {
                  risk: "Demand uncertainty",
                  mit: "Gate Phase 2 on paid pilot signals",
                },
                {
                  risk: "Budget overrun",
                  mit: "Cap scope; reuse open tooling",
                },
              ].map((r) => (
                <li key={r.risk} className="border-l-2 border-amber/40 pl-2.5">
                  <div className="text-ink">{r.risk}</div>
                  <div className="text-ink-muted">{r.mit}</div>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-ink-dim">
            <TrendingUp className="mr-1.5 inline h-3.5 w-3.5 text-cyan" />
            Synthesis confidence trending upward
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

function Gauge({ label, value }: { label: string; value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center text-center">
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="url(#g)"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="-mt-11 text-sm font-semibold text-ink">{value}%</div>
      <div className="mt-6 text-xs text-ink-dim">{label}</div>
    </div>
  );
}
