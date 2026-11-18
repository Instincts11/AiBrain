"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Network,
  Split,
  ScanSearch,
  Blend,
  Crosshair,
  Check,
  Zap,
  ShieldCheck,
  BarChart3,
  Layers,
  ArrowRight,
  Play,
} from "lucide-react";
import { HOME_SHELL } from "@/lib/home-layout";

/** Solid dark section shell — no text-baked background plates. */
function DarkSection({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-[#05070f] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_20%,rgba(34,211,238,0.06),transparent_55%),radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(139,92,246,0.07),transparent_50%)]" />
      <div className="relative">{children}</div>
    </section>
  );
}

export function FeatureStrip() {
  const items = [
    {
      icon: Network,
      title: "Knowledge Graph",
      body: "Turn information into connected intelligence.",
    },
    {
      icon: Split,
      title: "Dual Analysis",
      body: "Two independent AI minds with opposite perspectives.",
    },
    {
      icon: ScanSearch,
      title: "Gap Discovery",
      body: "Find what's missing, overlooked or unexplored.",
    },
    {
      icon: Blend,
      title: "Synthesis Engine",
      body: "Evidence-based evaluation and clear recommendations.",
    },
    {
      icon: Crosshair,
      title: "Mission Control",
      body: "Turn decisions into actionable execution plans.",
    },
  ];

  return (
    <section className="border-y border-white/5 bg-[#070b14]">
      <div className={`grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-5 ${HOME_SHELL}`}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="text-center lg:text-left">
              <Icon className="mx-auto mb-3 h-5 w-5 text-cyan lg:mx-0" />
              <h3 className="text-sm font-medium text-ink">{item.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-dim">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const pipeline = [
    { n: "1", label: "Input", body: "Goals, resources & data" },
    { n: "2", label: "Analyze", body: "Two independent AI minds" },
    { n: "3", label: "Compare", body: "Evidence, risks & trade-offs" },
    { n: "4", label: "Decide", body: "Best strategy with confidence" },
    { n: "5", label: "Execute", body: "Trackable roadmap" },
  ];

  return (
    <DarkSection id="how" className="py-20">
      <div
        className={`grid items-center gap-10 lg:grid-cols-[0.95fr_1.25fr] xl:gap-16 ${HOME_SHELL}`}
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30"
        >
          <Image
            src="/home/section-how.jpg"
            alt=""
            width={1024}
            height={1024}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </motion.div>

        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl xl:text-5xl">
            From Information to{" "}
            <span className="bg-gradient-to-r from-violet to-fuchsia-400 bg-clip-text text-transparent">
              Actionable Decisions
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
            A complete intelligence pipeline — from unstructured knowledge to a
            clear, evidence-backed direction.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {pipeline.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-white/10 bg-black/35 px-3 py-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 font-mono text-[11px] text-cyan">
                  {s.n}
                </div>
                <div className="mt-2 text-xs font-medium text-ink">{s.label}</div>
                <p className="mt-1 text-[10px] leading-snug text-ink-dim">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DarkSection>
  );
}

export function UseCases() {
  const cases = [
    {
      title: "Startup & Business",
      body: "Validate ideas, analyze markets, plan and de-risk execution.",
      image: "/home/section-usecase-1.jpg",
      href: "/lab",
    },
    {
      title: "Technology & Engineering",
      body: "Pressure-test architectures, risks, and delivery constraints.",
      image: "/home/section-usecase-2.jpg",
      href: "/lab",
    },
    {
      title: "Research & Academia",
      body: "Connect literatures, surface gaps, and frame better questions.",
      image: "/home/section-usecase-3.jpg",
      href: "/vault",
    },
    {
      title: "Personal Goals",
      body: "Turn life decisions into clear plans with visible trade-offs.",
      image: "/home/section-usecase-4.jpg",
      href: "/mission",
    },
  ];

  return (
    <DarkSection id="use-cases" className="py-20">
      <div className={HOME_SHELL}>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-violet">
          Use cases
        </p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-ink md:text-4xl xl:text-5xl">
          Built for{" "}
          <span className="bg-gradient-to-r from-cyan via-violet to-fuchsia-400 bg-clip-text text-transparent">
            Complex Decisions
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-ink-muted md:text-base">
          From startups to research, turn uncertainty into clear,
          evidence-backed action.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          {cases.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a101c] transition-colors hover:border-cyan/35"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a101c] via-[#0a101c]/20 to-transparent" />
              </div>
              <div className="relative -mt-8 px-4 pb-4 pt-2">
                <h3 className="text-sm font-medium text-ink">{c.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                  {c.body}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DarkSection>
  );
}

export function KnowledgeUniverse() {
  const points = [
    "Multi-source ingestion across notes, papers, and decisions",
    "Structural gap analysis labeled as hypotheses",
    "Community detection and influential concept ranking",
    "Interactive 3D exploration with edge provenance",
    "Concept & relationship extraction with provenance",
    "Topic communities and influential nodes",
  ];

  return (
    <DarkSection className="py-20">
      <div
        className={`grid items-center gap-8 lg:grid-cols-[1.1fr_1.2fr_0.9fr] xl:gap-12 ${HOME_SHELL}`}
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <Image
            src="/home/section-globe.jpg"
            alt=""
            width={1024}
            height={1024}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 35vw"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl xl:text-5xl">
            A Living Network of{" "}
            <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">
              Your Knowledge
            </span>
          </h2>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {points.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-ink-muted"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/nexus"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-5 text-sm text-cyan transition-colors hover:bg-cyan/20"
          >
            Explore the Nexus
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2">
          <div className="mb-2 px-2 pt-1 text-[10px] uppercase tracking-wider text-ink-dim">
            Graph preview
          </div>
          <Image
            src="/home/section-graph.jpg"
            alt=""
            width={800}
            height={800}
            className="h-auto w-full rounded-lg object-cover"
            sizes="(max-width: 1024px) 100vw, 28vw"
          />
        </div>
      </div>
    </DarkSection>
  );
}

export function WhyDualmind() {
  const items = [
    {
      icon: Zap,
      title: "Deeper Insights",
      body: "See structure, influence, and missing links — not just summaries.",
      color: "text-violet",
    },
    {
      icon: ShieldCheck,
      title: "Higher Confidence",
      body: "Claims are challenged, evidenced, and never majority-voted alone.",
      color: "text-cyan",
    },
    {
      icon: BarChart3,
      title: "Clearer Action",
      body: "Leave with trade-offs, risks, and a direction you can execute.",
      color: "text-fuchsia-300",
    },
    {
      icon: Layers,
      title: "Your Intelligence",
      body: "Your knowledge graph becomes an active layer for every decision.",
      color: "text-ink",
    },
  ];

  return (
    <DarkSection id="why" className="py-20">
      <div className={HOME_SHELL}>
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-cyan">
          Why Dualmind
        </p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-ink md:text-4xl xl:text-5xl">
          More Than an{" "}
          <span className="bg-gradient-to-r from-violet to-fuchsia-400 bg-clip-text text-transparent">
            AI Assistant
          </span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
                <h3 className="mt-4 text-sm font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/nexus"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia-500 px-7 text-sm font-medium text-white shadow-[0_0_32px_rgba(139,92,246,0.35)]"
          >
            Enter the Nexus
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-6 text-sm text-ink-muted backdrop-blur"
          >
            <Play className="h-4 w-4" />
            Watch Product Tour
          </a>
        </div>
      </div>
    </DarkSection>
  );
}

export function HomeFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#05070f] py-8">
      <div
        className={`flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left ${HOME_SHELL}`}
      >
        <p className="text-[12px] text-ink-dim">
          DUALMIND — Explore the connections. Challenge the thinking. Discover
          the direction.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-dim">
          Milestone 1–2 · Sample graph online
        </p>
      </div>
    </footer>
  );
}
