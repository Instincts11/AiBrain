"use client";

import {
  Activity,
  Bot,
  Command,
  Mic,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useMatrixStore } from "@/stores/matrix-store";
import { CLUSTER_LABELS } from "@/lib/matrix/colors";
import { cn } from "@/lib/utils";

export function MatrixPanels() {
  const built = useMatrixStore((s) => s.built);
  const runCommand = useMatrixStore((s) => s.runCommand);
  const selectNode = useMatrixStore((s) => s.selectNode);

  if (!built) return null;
  const { stats, topConcepts, activity, agents, voice, retrievals, commands, isolatedClusters } =
    built;

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      <Panel icon={Workflow} title="Memory Ingestion">
        <Stat label="Total memories" value={stats.totalMemories.toLocaleString()} />
        <Stat label="Documents" value={String(stats.documents)} />
        <Stat label="Conversations" value={String(stats.conversations)} />
        <Stat label="Relationships" value={stats.edgeCount.toLocaleString()} />
        <p className="mt-2 text-xs text-amber-200/70">
          Demo dataset · labelled sample universe
        </p>
      </Panel>

      <Panel icon={Network} title="Knowledge Analytics">
        <div className="mb-2 text-xs uppercase tracking-wider text-stone-500">
          Most connected
        </div>
        <ul className="space-y-1">
          {topConcepts.slice(0, 5).map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => selectNode(c.id)}
                className="flex w-full items-center justify-between gap-2 text-left text-sm text-stone-300 hover:text-amber-200"
              >
                <span className="truncate">{c.label}</span>
                <span className="font-mono text-xs text-stone-500">
                  d{c.degree}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 text-xs text-stone-500">
          {stats.clusterCount} communities · {isolatedClusters.length} sparse
        </div>
      </Panel>

      <Panel icon={Sparkles} title="AI Memory Handoff">
        <ul className="space-y-1.5">
          {retrievals.slice(0, 5).map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
              <button
                type="button"
                onClick={() => selectNode(r.id)}
                className="truncate text-left text-stone-300 hover:text-amber-200"
              >
                {r.label}
              </button>
              <span className="font-mono text-xs text-amber-400/80">
                {(r.relevance * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel icon={Activity} title="Recent Activity">
        <ul className="space-y-1.5">
          {activity.slice(0, 5).map((a) => (
            <li key={a.id} className="text-sm">
              <div className="text-stone-200">{a.title}</div>
              <div className="text-xs text-stone-500">{a.detail}</div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel icon={Mic} title="Voice Memory">
        <ul className="space-y-2">
          {voice.map((v) => (
            <li key={v.id} className="text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-stone-200">{v.title}</span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-xs uppercase",
                    v.status === "transcribed" && "bg-amber-500/15 text-amber-300",
                    v.status === "processing" && "bg-orange-500/15 text-orange-300",
                    v.status === "queued" && "bg-white/5 text-stone-500",
                  )}
                >
                  {v.status}
                </span>
              </div>
              {v.concepts.length > 0 && (
                <div className="mt-0.5 truncate text-xs text-stone-500">
                  {v.concepts.join(" · ")}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel icon={Command} title="Knowledge Commands">
        <ul className="space-y-1">
          {commands.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => runCommand(c)}
                className="w-full rounded-lg border border-white/5 bg-black/20 px-2 py-1.5 text-left text-xs text-stone-300 hover:border-amber-500/30 hover:text-amber-100"
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel icon={Bot} title="Agent Activity">
        <ul className="space-y-2">
          {agents.map((a) => (
            <li key={a.id} className="text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-200">{a.agent}</span>
                <span className="font-mono text-xs text-amber-400/80">
                  {a.progress}%
                </span>
              </div>
              <div className="text-xs text-stone-500">{a.task}</div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-2 text-xs text-stone-500">
          Clusters:{" "}
          {Object.values(CLUSTER_LABELS)
            .slice(0, 3)
            .join(", ")}
          …
        </div>
      </Panel>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#0a0908]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-stone-500">
        <Icon className="h-3 w-3 text-amber-500/80" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5 text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="font-mono text-stone-200">{value}</span>
    </div>
  );
}
