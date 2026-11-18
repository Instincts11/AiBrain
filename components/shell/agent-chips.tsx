"use client";

export function AgentChips() {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-cyan/25 bg-cyan-dim px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-cyan">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        Jarvis
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-violet/25 bg-violet-dim px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-violet">
        <span className="h-1.5 w-1.5 rounded-full bg-violet" />
        Ultron
      </span>
    </div>
  );
}
