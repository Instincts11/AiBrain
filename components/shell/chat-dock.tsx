"use client";

import { useRef, useState } from "react";
import {
  MessageSquare,
  Paperclip,
  Send,
  Upload,
  X,
  GitCompareArrows,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatDock() {
  const [expanded, setExpanded] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Ask Dualmind about your knowledge graph, dual analysis, or upload two datasets to compare.",
    },
  ]);
  const [files, setFiles] = useState<{ a?: File; b?: File }>({});
  const fileARef = useRef<HTMLInputElement>(null);
  const fileBRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLInputElement>(null);

  function send() {
    const trimmed = message.trim();
    if (!trimmed && !files.a && !files.b) return;
    const parts: string[] = [];
    if (trimmed) parts.push(trimmed);
    if (files.a || files.b) {
      parts.push(
        `Compare: ${files.a?.name ?? "—"} vs ${files.b?.name ?? "—"}`,
      );
    }
    setMessages((m) => [...m, { role: "user", text: parts.join("\n") }]);
    setMessage("");
    setExpanded(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            files.a && files.b
              ? `Queued comparison of “${files.a.name}” and “${files.b.name}”. Dual analysis will surface agreements, conflicts, and gaps.`
              : "Noted. Open Dual Analysis or Synthesis when you want JARVIS and ULTRON to pressure-test this.",
        },
      ]);
    }, 450);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-14 z-40 flex justify-center px-3 pb-2 md:bottom-0 md:px-6 md:pb-4">
      <div className="pointer-events-auto w-full max-w-3xl">
        {expanded && (
          <div className="mb-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0a101c]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-cyan" />
                <span className="text-sm font-medium text-ink">Dualmind Chat</span>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-md p-1 text-ink-dim hover:bg-white/5 hover:text-ink"
                aria-label="Collapse chat"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="dm-scrollbar flex max-h-56 flex-col gap-2.5 overflow-y-auto px-4 py-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-gradient-to-r from-cyan/20 to-violet/20 text-ink"
                      : "mr-auto border border-white/10 bg-white/[0.03] text-ink-muted",
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {compareOpen && (
          <div className="mb-2 rounded-2xl border border-white/10 bg-[#0a101c]/95 p-3 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-ink-dim">
                <GitCompareArrows className="h-3.5 w-3.5 text-cyan" />
                Compare two datasets
              </div>
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                className="rounded-md p-1 text-ink-dim hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fileARef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-cyan/35 bg-cyan/5 px-3 py-2.5 text-left text-xs text-ink-muted hover:border-cyan/55"
              >
                <Upload className="h-3.5 w-3.5 shrink-0 text-cyan" />
                <span className="truncate">{files.a?.name ?? "Dataset A"}</span>
              </button>
              <button
                type="button"
                onClick={() => fileBRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-violet/35 bg-violet/5 px-3 py-2.5 text-left text-xs text-ink-muted hover:border-violet/55"
              >
                <Upload className="h-3.5 w-3.5 shrink-0 text-violet" />
                <span className="truncate">{files.b?.name ?? "Dataset B"}</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-[#0b1220]/92 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-ink-dim hover:border-cyan/30 hover:text-cyan"
            title="Chat history"
            aria-label="Toggle chat"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => attachRef.current?.click()}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-ink-dim hover:border-cyan/30 hover:text-cyan"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCompareOpen((v) => !v)}
            className={cn(
              "mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-ink-dim",
              compareOpen
                ? "border-violet/40 bg-violet/10 text-violet"
                : "border-white/10 hover:border-violet/30 hover:text-violet",
            )}
            title="Upload & compare two datasets"
          >
            <GitCompareArrows className="h-4 w-4" />
          </button>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            onFocus={() => setExpanded(true)}
            rows={1}
            placeholder="Message Dualmind…"
            className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-ink outline-none placeholder:text-ink-dim"
          />
          <button
            type="button"
            onClick={send}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-violet text-white shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <input
          ref={fileARef}
          type="file"
          className="hidden"
          onChange={(e) => setFiles((f) => ({ ...f, a: e.target.files?.[0] }))}
        />
        <input
          ref={fileBRef}
          type="file"
          className="hidden"
          onChange={(e) => setFiles((f) => ({ ...f, b: e.target.files?.[0] }))}
        />
        <input
          ref={attachRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFiles((f) => ({ ...f, a: file }));
              setCompareOpen(true);
            }
          }}
        />
      </div>
    </div>
  );
}
