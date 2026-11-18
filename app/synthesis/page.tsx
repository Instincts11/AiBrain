import { SectionFrame } from "@/components/shell/section-frame";
import { Badge } from "@/components/ui/badge";

export default function SynthesisPage() {
  return (
    <SectionFrame
      title="Synthesis"
      subtitle="Independent evaluation of competing strategies using evidence quality, constraints, and explicit uncertainty."
      badge="Evaluator"
    >
      <div className="dm-panel grid gap-6 p-5 md:grid-cols-3">
        {[
          "Strategy comparison",
          "Feasibility & cost",
          "Risk & evidence quality",
          "Unresolved uncertainty",
          "Constraint assessment",
          "Recommendation with citations",
        ].map((item) => (
          <div key={item} className="border-l border-border pl-3">
            <Badge className="mb-2">Pending</Badge>
            <p className="text-sm text-ink">{item}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        Synthesis never presents unsupported recommendations as evidence-backed
        conclusions.
      </p>
    </SectionFrame>
  );
}
