import { SectionFrame } from "@/components/shell/section-frame";
import { Badge } from "@/components/ui/badge";

export default function DualPage() {
  return (
    <SectionFrame
      title="Dual Analysis"
      subtitle="Two independent reasoning systems will argue from the same evidence pool. No simulated inference is shown here."
      badge="Agents"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <AgentPanel
          name="JARVIS"
          role="Constructive Intelligence"
          accent="cyan"
          duties={[
            "Understand the problem",
            "Retrieve relevant knowledge",
            "Generate strategies",
            "Propose execution plans",
          ]}
        />
        <AgentPanel
          name="ULTRON"
          role="Critical Intelligence"
          accent="violet"
          duties={[
            "Challenge assumptions",
            "Surface contradictions",
            "Identify hidden risks",
            "Test feasibility",
          ]}
        />
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        Both agents can be wrong. Synthesis will evaluate claims with evidence —
        never majority voting alone.
      </p>
    </SectionFrame>
  );
}

function AgentPanel({
  name,
  role,
  accent,
  duties,
}: {
  name: string;
  role: string;
  accent: "cyan" | "violet";
  duties: string[];
}) {
  const border =
    accent === "cyan" ? "border-cyan/25 bg-cyan-dim/40" : "border-violet/25 bg-violet-dim/40";
  return (
    <div className={`rounded-md border p-5 ${border}`}>
      <div className="mb-3 flex items-center gap-2">
        <Badge variant={accent}>{name}</Badge>
        <span className="text-xs text-ink-muted">{role}</span>
      </div>
      <ul className="space-y-2 text-sm text-ink-muted">
        {duties.map((d) => (
          <li key={d} className="flex gap-2">
            <span className={accent === "cyan" ? "text-cyan" : "text-violet"}>
              —
            </span>
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[11px] text-ink-dim">
        Awaiting live session · Milestone 6+
      </p>
    </div>
  );
}
