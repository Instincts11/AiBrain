"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useNavMemoryStore } from "@/stores/nav-memory-store";
import { cn } from "@/lib/utils";

export function PageBackButton({
  fallbackHref = "/",
  className,
}: {
  fallbackHref?: string;
  className?: string;
}) {
  const router = useRouter();
  const stack = useNavMemoryStore((s) => s.stack);
  const popPrevious = useNavMemoryStore((s) => s.popPrevious);

  function onBack() {
    const current =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const prev = popPrevious(current);
    router.push(prev ?? fallbackHref);
  }

  return (
    <button
      type="button"
      onClick={onBack}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/30 px-2.5 py-2 text-xs text-ink-muted transition-colors hover:border-cyan/35 hover:text-cyan",
        className,
      )}
      title={stack.length ? "Go back" : `Back to ${fallbackHref}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
