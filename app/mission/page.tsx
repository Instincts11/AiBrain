import { SectionFrame } from "@/components/shell/section-frame";
import { Badge } from "@/components/ui/badge";

export default function MissionPage() {
  return (
    <SectionFrame
      title="Mission Control"
      subtitle="Turn decisions into execution: tasks, milestones, dependencies, and outcome metrics."
      badge="Execution"
    >
      <div className="dm-panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Badge>Empty</Badge>
          <span className="text-sm text-ink-muted">No active missions</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Tasks", "Milestones", "Dependencies", "Outcome metrics"].map(
            (label) => (
              <div
                key={label}
                className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-ink-dim"
              >
                {label}
              </div>
            ),
          )}
        </div>
      </div>
    </SectionFrame>
  );
}
