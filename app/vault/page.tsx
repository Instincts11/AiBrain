import { SectionFrame } from "@/components/shell/section-frame";
import { Badge } from "@/components/ui/badge";

const SAMPLE_SOURCES = [
  {
    id: "doc-ai-survey",
    title: "Foundations of Modern AI Systems",
    kind: "Research",
    nodes: 18,
  },
  {
    id: "doc-neuro",
    title: "Notes on Cortical Computation",
    kind: "Notes",
    nodes: 16,
  },
  {
    id: "doc-bridge",
    title: "Weak Links: AI × Neuroscience Memo",
    kind: "Memo",
    nodes: 8,
  },
];

export default function VaultPage() {
  return (
    <SectionFrame
      title="Memory Vault"
      subtitle="Searchable library of documents, notes, clusters, and prior decisions. Sample sources power the Nexus graph."
      badge="Library"
    >
      <div className="space-y-3">
        {SAMPLE_SOURCES.map((doc) => (
          <div
            key={doc.id}
            className="dm-panel flex items-center justify-between gap-4 px-4 py-3"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-ink">{doc.title}</h2>
                <Badge>{doc.kind}</Badge>
              </div>
              <p className="mt-1 font-mono text-[11px] text-ink-dim">{doc.id}</p>
            </div>
            <span className="font-mono text-xs text-ink-muted">
              {doc.nodes} nodes
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink-muted">
        Upload ingestion (PDF, DOCX, web) lands in Milestone 3. These entries are
        the curated sample dataset for Milestones 1–2.
      </p>
    </SectionFrame>
  );
}
