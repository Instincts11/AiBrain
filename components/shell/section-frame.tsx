"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function SectionFrame({
  title,
  subtitle,
  badge,
  children,
  fullBleed = false,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  children: React.ReactNode;
  fullBleed?: boolean;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-end justify-between gap-4 border-b border-border px-4 py-4 md:px-6">
        <div>
          <div className="mb-1 flex items-center gap-2">
            {badge && <Badge variant="cyan">{badge}</Badge>}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
            {title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">{subtitle}</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={
          fullBleed
            ? "min-h-0 flex-1"
            : "dm-scrollbar min-h-0 flex-1 overflow-auto p-4 md:p-6"
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
