"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * Previous hero composition:
 * JARVIS panel | nexus artwork | ULTRON panel
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto mt-8 w-full">
      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(240px,0.9fr)_minmax(0,1.5fr)_minmax(240px,0.9fr)] lg:gap-5">
        <AgentPanel
          name="JARVIS"
          role="Constructive Intelligence"
          accent="cyan"
          points={[
            "Analyzes your situation",
            "Finds opportunities",
            "Generates strategies",
            "Builds execution plans",
          ]}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/10 bg-black/20 lg:min-h-[300px]"
        >
          <Image
            src="/home/hero-nexus.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070f]/30 via-transparent to-transparent" />
        </motion.div>

        <AgentPanel
          name="ULTRON"
          role="Critical Intelligence"
          accent="violet"
          points={[
            "Challenges assumptions",
            "Finds risks & blind spots",
            "Tests feasibility",
            "Proposes alternatives",
          ]}
        />
      </div>
    </div>
  );
}

function AgentPanel({
  name,
  role,
  accent,
  points,
}: {
  name: string;
  role: string;
  accent: "cyan" | "violet";
  points: string[];
}) {
  const styles =
    accent === "cyan"
      ? "border-cyan/30 bg-black/50 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
      : "border-fuchsia-400/30 bg-black/50 shadow-[0_0_30px_rgba(232,121,249,0.08)]";
  const title = accent === "cyan" ? "text-cyan" : "text-fuchsia-300";
  const icon = accent === "cyan" ? "text-cyan" : "text-fuchsia-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: accent === "cyan" ? 0.15 : 0.25 }}
      className={`flex flex-col justify-center rounded-2xl border p-4 backdrop-blur-md md:p-5 ${styles}`}
    >
      <div className={`text-base font-semibold tracking-wide ${title}`}>{name}</div>
      <div className="mt-0.5 text-xs text-ink-muted md:text-sm">{role}</div>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-ink-muted">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${icon}`} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
