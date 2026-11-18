import { SectionFrame } from "@/components/shell/section-frame";
import { Badge } from "@/components/ui/badge";

export default function LabPage() {
  return (
    <SectionFrame
      title="Intelligence Lab"
      subtitle="Frame a decision session with problem state, constraints, and relevant knowledge sources. Agent reasoning arrives in a later milestone."
      badge="Workspace"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="dm-panel space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink">Session brief</h2>
            <Badge>Not connected</Badge>
          </div>
          <Field label="Problem" placeholder="What decision are you facing?" />
          <Field label="Current state" placeholder="Where things stand today" />
          <Field label="Desired state" placeholder="What success looks like" />
          <Field label="Resources" placeholder="People, capital, tools available" />
          <Field label="Constraints" placeholder="Budget, time, regulation, risk" />
          <Field label="Deadline" placeholder="YYYY-MM-DD" />
        </div>
        <div className="dm-panel space-y-4 p-5">
          <h2 className="text-sm font-medium text-ink">Knowledge binding</h2>
          <p className="text-sm text-ink-muted">
            Sessions will retrieve evidence from your knowledge graph before
            JARVIS and ULTRON reason. Live retrieval and debate are not active
            in this build.
          </p>
          <ul className="space-y-2 font-mono text-xs text-ink-dim">
            <li>· Graph-backed RAG</li>
            <li>· Shared evidence pool for both agents</li>
            <li>· Provenance-preserving citations</li>
          </ul>
        </div>
      </div>
    </SectionFrame>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-ink-dim">
        {label}
      </span>
      <div className="rounded-md border border-border bg-midnight px-3 py-2.5 text-sm text-ink-dim">
        {placeholder}
      </div>
    </label>
  );
}
