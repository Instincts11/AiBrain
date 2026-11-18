"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Check,
  ArrowUpRight,
  Bell,
  Share2,
  History,
  Settings2,
  Pencil,
  FileText,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgentAvatar } from "@/components/shell/agent-avatar";
import { cn } from "@/lib/utils";

const STEPS = [
  "Define",
  "Context",
  "Configure",
  "Analyze",
  "Synthesize",
  "Plan",
] as const;

const FILES = [
  "Research tools market analysis.pdf",
  "Competitor landscape.md",
  "User interview notes.docx",
  "Pricing benchmarks.xlsx",
  "Technical feasibility.pdf",
  "Go-to-market draft.md",
];

export function LabView() {
  const [jarvisFocus, setJarvisFocus] = useState(["Strategy", "Opportunities"]);
  const [ultronFocus, setUltronFocus] = useState(["Risks", "Assumptions"]);
  const [depth, setDepth] = useState("Standard");

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(
      list.includes(value)
        ? list.filter((x) => x !== value)
        : [...list, value],
    );
  }

  return (
    <div className="dm-scrollbar flex h-full min-h-0 flex-col overflow-auto">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border px-4 py-4 md:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan" />
            <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
              Intelligence Lab
            </h1>
          </div>
          <p className="max-w-2xl text-sm text-ink-muted">
            Run a new decision analysis, configure the AI minds, and explore
            their reasoning in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-emerald sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Auto Save
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs text-ink-muted hover:text-ink"
          >
            <History className="h-3.5 w-3.5" />
            Session History
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 p-2 text-ink-dim hover:text-ink"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 p-2 text-ink-dim hover:text-ink"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan/40 to-violet/50" />
        </div>
      </div>

      {/* Stepper */}
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-4 py-3 md:px-6">
        {STEPS.map((step, i) => {
          const done = i < 2;
          const active = i === 2;
          return (
            <div key={step} className="flex items-center gap-1">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs",
                  active &&
                    "border border-cyan/35 bg-cyan/15 text-cyan shadow-[0_0_14px_rgba(34,211,238,0.2)]",
                  done && "text-emerald",
                  !done && !active && "text-ink-dim",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                    active && "bg-cyan text-void",
                    done && "bg-emerald/20 text-emerald",
                    !done && !active && "bg-white/5",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                {step}
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-1 h-px w-4 bg-white/10 sm:w-8" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px] md:p-5">
        <div className="flex min-h-0 flex-col gap-4">
          {/* Session header */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] uppercase tracking-wider text-ink-dim">
                Decision Session
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-1.5 text-ink-dim hover:text-ink"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-1.5 text-ink-dim hover:text-ink"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h2 className="text-lg font-medium text-ink md:text-xl">
              Should we build an AI-powered SaaS for researchers?
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Business Decision",
                "90 days",
                "$20,000 budget",
                "20+ paying users",
              ].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>

          {/* Dual intelligence center */}
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#060a12] p-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <AgentProgress
              agent="jarvis"
              name="JARVIS"
              role="Constructive Intelligence"
              pct={72}
              checks={[
                { label: "Understanding context", done: true },
                { label: "Mapping opportunities", done: true },
                { label: "Generating plan", done: false },
              ]}
            />

            <div className="flex flex-col items-center py-2">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan/30 bg-gradient-to-br from-cyan/20 via-violet/25 to-violet/10 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                <InfinityIcon className="h-10 w-10 text-ink" />
              </div>
              <div className="mt-2 text-center text-[10px] uppercase tracking-wider text-ink-dim">
                Dual Intelligence
              </div>
              <p className="mt-1 max-w-[160px] text-center text-[11px] text-ink-muted">
                Both minds are analyzing the problem…
              </p>
            </div>

            <AgentProgress
              agent="ultron"
              name="ULTRON"
              role="Critical Intelligence"
              pct={68}
              checks={[
                { label: "Challenging assumptions", done: true },
                { label: "Surfacing risks", done: true },
                { label: "Evaluating trade-offs", done: false },
              ]}
            />
          </div>

          {/* Input summary */}
          <div>
            <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-dim">
              Your Input
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Current Situation",
                  body: "Researchers drown in papers; no unified AI workspace.",
                },
                {
                  title: "Desired Outcome",
                  body: "Ship MVP in 90 days with 20+ paying users.",
                },
                {
                  title: "Constraints",
                  body: "$20k budget · small team · no enterprise sales yet.",
                },
                {
                  title: "Key Resources",
                  body: "Domain experts · prior research · open tooling.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="mb-1.5 text-[11px] font-medium text-ink">
                    {c.title}
                  </div>
                  <p className="text-xs leading-relaxed text-ink-muted">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Config bar */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
              <FocusGroup
                label="JARVIS Focus"
                options={["Strategy", "Opportunities", "Execution"]}
                selected={jarvisFocus}
                accent="cyan"
                onToggle={(v) => toggle(jarvisFocus, v, setJarvisFocus)}
              />
              <FocusGroup
                label="ULTRON Focus"
                options={["Risks", "Assumptions", "Alternatives"]}
                selected={ultronFocus}
                accent="violet"
                onToggle={(v) => toggle(ultronFocus, v, setUltronFocus)}
              />
              <div className="space-y-3">
                <div>
                  <div className="mb-1.5 text-[11px] uppercase tracking-wider text-ink-dim">
                    Analysis Depth
                  </div>
                  <div className="flex rounded-xl border border-white/10 p-0.5">
                    {["Quick", "Standard", "Deep"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDepth(d)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs",
                          depth === d
                            ? "bg-cyan/15 text-cyan"
                            : "text-ink-dim hover:text-ink",
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 text-[11px] uppercase tracking-wider text-ink-dim">
                    Knowledge Scope
                  </div>
                  <div className="rounded-xl border border-white/10 px-3 py-2 text-xs text-ink">
                    Workspace
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                href="/dual"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-violet px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.28)]"
              >
                Start Dual Analysis
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="flex flex-col gap-3">
          <Panel title="Knowledge Context">
            <div className="relative mx-auto h-36 w-full max-w-[220px]">
              <svg viewBox="0 0 200 140" className="h-full w-full">
                <line x1="100" y1="70" x2="40" y2="30" stroke="#22d3ee55" />
                <line x1="100" y1="70" x2="160" y2="30" stroke="#a78bfa55" />
                <line x1="100" y1="70" x2="40" y2="110" stroke="#34d39955" />
                <line x1="100" y1="70" x2="160" y2="110" stroke="#f472b655" />
                <circle cx="100" cy="70" r="18" fill="#22d3ee22" stroke="#22d3ee" />
                <text x="100" y="74" textAnchor="middle" fill="#e8eef7" fontSize="7">
                  AI SaaS
                </text>
                {[
                  [40, 30, "Market"],
                  [160, 30, "Researchers"],
                  [40, 110, "Tools"],
                  [160, 110, "Competitors"],
                ].map(([x, y, label]) => (
                  <g key={String(label)}>
                    <circle
                      cx={Number(x)}
                      cy={Number(y)}
                      r="12"
                      fill="#ffffff08"
                      stroke="#94a3b866"
                    />
                    <text
                      x={Number(x)}
                      y={Number(y) + 3}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="6"
                    >
                      {label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </Panel>

          <Panel title="Relevant Knowledge">
            <ul className="space-y-2">
              {FILES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-xs text-ink-muted"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-cyan" />
                  <span className="truncate">{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-2 text-[11px] text-cyan hover:underline"
            >
              View All
            </button>
          </Panel>

          <Panel title="AI Mind Configuration">
            <label className="mb-2 block space-y-1">
              <span className="text-[11px] text-ink-dim">JARVIS model</span>
              <div className="rounded-lg border border-cyan/25 bg-cyan/5 px-3 py-2 text-xs text-ink">
                GPT-4o
              </div>
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] text-ink-dim">ULTRON model</span>
              <div className="rounded-lg border border-violet/25 bg-violet/5 px-3 py-2 text-xs text-ink">
                Claude 3.7
              </div>
            </label>
          </Panel>

          <Panel title="Expected Output">
            <ul className="space-y-2 text-xs text-ink-muted">
              {[
                "Dual perspective analysis",
                "Risk and opportunity assessment",
                "Claims comparison table",
                "Execution roadmap",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                  {t}
                </li>
              ))}
            </ul>
          </Panel>
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
      <div className="mb-2.5 text-[11px] uppercase tracking-wider text-ink-dim">
        {title}
      </div>
      {children}
    </div>
  );
}

function AgentProgress({
  agent,
  name,
  role,
  pct,
  checks,
}: {
  agent: "jarvis" | "ultron";
  name: string;
  role: string;
  pct: number;
  checks: { label: string; done: boolean }[];
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
      <div className="mb-3 flex items-center gap-2.5">
        <AgentAvatar agent={agent} />
        <div>
          <div className="text-sm font-medium text-ink">{name}</div>
          <div className="text-[11px] text-ink-dim">{role}</div>
        </div>
      </div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-ink-muted">Running Analysis…</span>
        <span className={accent === "cyan" ? "text-cyan" : "text-violet"}>
          {pct}%
        </span>
      </div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full rounded-full",
            accent === "cyan"
              ? "bg-gradient-to-r from-cyan to-cyan/60"
              : "bg-gradient-to-r from-violet to-violet/60",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-1.5 text-xs text-ink-muted">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full",
                c.done
                  ? accent === "cyan"
                    ? "bg-cyan/20 text-cyan"
                    : "bg-violet/20 text-violet"
                  : "bg-white/5 text-ink-dim",
              )}
            >
              {c.done && <Check className="h-2.5 w-2.5" />}
            </span>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FocusGroup({
  label,
  options,
  selected,
  accent,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  accent: "cyan" | "violet";
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] uppercase tracking-wider text-ink-dim">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => onToggle(o)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                on
                  ? accent === "cyan"
                    ? "border-cyan/40 bg-cyan/15 text-cyan"
                    : "border-violet/40 bg-violet/15 text-violet"
                  : "border-white/10 text-ink-dim hover:text-ink",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
