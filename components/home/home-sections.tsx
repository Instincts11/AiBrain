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
  Activity,
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
              <Icon className="mx-auto mb-3 h-6 w-6 text-cyan lg:mx-0" />
              <h3 className="text-base font-medium text-ink">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-dim">
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
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan md:text-sm">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl xl:text-6xl">
            From Information to{" "}
            <span className="bg-gradient-to-r from-violet to-fuchsia-400 bg-clip-text text-transparent">
              Actionable Decisions
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            A complete intelligence pipeline — from unstructured knowledge to a
            clear, evidence-backed direction.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {pipeline.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-white/10 bg-black/35 px-3 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan/40 bg-cyan/10 font-mono text-xs text-cyan">
                  {s.n}
                </div>
                <div className="mt-2 text-sm font-medium text-ink">{s.label}</div>
                <p className="mt-1 text-xs leading-snug text-ink-dim">
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
        <p className="text-center font-mono text-xs uppercase tracking-[0.24em] text-violet md:text-sm">
          Use cases
        </p>
        <h2 className="mt-3 text-center text-4xl font-semibold tracking-tight text-ink md:text-5xl xl:text-6xl">
          Built for{" "}
          <span className="bg-gradient-to-r from-cyan via-violet to-fuchsia-400 bg-clip-text text-transparent">
            Complex Decisions
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-base text-ink-muted md:text-lg">
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
                <h3 className="text-base font-medium text-ink">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
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
  const features = [
    { icon: Network, label: "Knowledge Graph", color: "text-cyan" },
    { icon: Split, label: "Dual Analysis", color: "text-violet" },
    { icon: Activity, label: "Gap Discovery", color: "text-sky-300" },
    { icon: Layers, label: "Execution Roadmap", color: "text-fuchsia-300" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050a14] py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/home/bg-universe-vibrant.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#050a14]/20" />
      </div>

      <div className="relative mx-auto w-full max-w-[1680px] px-4 sm:px-6 md:pl-20 md:pr-8 lg:px-8 xl:px-10">
        <div className="mx-auto max-w-3xl py-6 text-center lg:mx-0 lg:max-w-2xl lg:pl-10 lg:text-left xl:pl-16">
          <p className="font-mono text-[13px] uppercase tracking-[0.28em] text-ink md:text-sm">
            The AI Decision Intelligence Platform
          </p>
          <h2 className="mt-3 text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl xl:text-[4.5rem]">
            A Living Network of{" "}
            <span className="bg-gradient-to-r from-cyan via-violet to-fuchsia-400 bg-clip-text text-transparent">
              Your Knowledge
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted lg:mx-0 md:text-xl">
            Ingest your information, map the connections, challenge it with two
            independent AI minds, and turn it into clear, evidence-backed
            decisions and execution plans.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="text-center lg:text-left">
                  <Icon className={`mx-auto mb-1.5 h-5 w-5 lg:mx-0 ${f.color}`} />
                  <div className="text-[12px] font-medium text-ink">{f.label}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href="/nexus"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia-500 px-7 text-sm font-medium text-white shadow-[0_0_28px_rgba(139,92,246,0.35)]"
            >
              Enter the Nexus
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/30 px-6 text-sm text-ink-muted backdrop-blur transition-colors hover:border-white/30 hover:text-ink"
            >
              <Play className="h-4 w-4" />
              Watch Overview
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Meshy Discover–inspired masonry showcase for Dualmind artifacts. */
export function DiscoverShowcase() {
  type Card = {
    title: string;
    tag: string;
    image: string;
    likes: number;
    href: string;
    tall?: boolean;
    fill?: boolean;
  };

  const columns: Card[][] = [
    [
      {
        title: "Strategy Nexus",
        tag: "Graph",
        image: "/home/visual-earth.png",
        likes: 128,
        href: "/nexus",
        tall: true,
      },
      {
        title: "Pixel Intelligence",
        tag: "Agent",
        image: "/home/visual-pixel-head.png",
        likes: 96,
        href: "/dual",
      },
    ],
    [
      {
        title: "Research Cluster",
        tag: "Vault",
        image: "/home/section-usecase-3.jpg",
        likes: 74,
        href: "/vault",
      },
      {
        title: "Mission Map",
        tag: "Execute",
        image: "/home/section-usecase-1.jpg",
        likes: 112,
        href: "/mission",
        tall: true,
      },
    ],
    [
      {
        title: "Risk Lattice",
        tag: "Lab",
        image: "/home/section-usecase-2.jpg",
        likes: 63,
        href: "/lab",
      },
      {
        title: "Decision Core",
        tag: "Synthesis",
        image: "/home/section-usecase-4.jpg",
        likes: 141,
        href: "/synthesis",
        fill: true,
      },
    ],
  ];

  return (
    <section id="discover" className="relative overflow-hidden bg-[#05070f] py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,211,238,0.08),transparent_55%),radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

      <div className={`relative ${HOME_SHELL}`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan md:text-sm">
            Discover
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl xl:text-6xl">
            What will you decide in{" "}
            <span className="bg-gradient-to-r from-cyan via-violet to-fuchsia-400 bg-clip-text text-transparent">
              3D intelligence?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted md:text-lg">
            Explore living graphs, dual-agent debates, and mission maps — a
            community of decision artifacts, inspired by modern 3D showcases.
          </p>
        </div>

        {/* Equal-height columns: Decision Core flex-grows to shared bottom edge */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-5">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex h-full flex-col gap-4 xl:gap-5">
              {col.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a101c]/80 transition-all hover:-translate-y-0.5 hover:border-cyan/35 hover:shadow-[0_0_28px_rgba(34,211,238,0.15)] ${
                    item.fill ? "min-h-0 flex-1" : "shrink-0"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-black/40 ${
                      item.fill
                        ? "min-h-[220px] flex-1"
                        : item.tall
                          ? "aspect-[3/4]"
                          : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070f] via-transparent to-transparent opacity-80" />
                    <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted backdrop-blur">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <h3 className="text-base font-medium text-ink">{item.title}</h3>
                    <span className="font-mono text-xs text-ink-dim">
                      ♥ {item.likes}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
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
        <p className="text-center font-mono text-xs uppercase tracking-[0.24em] text-cyan md:text-sm">
          Why Dualmind
        </p>
        <h2 className="mt-3 text-center text-4xl font-semibold tracking-tight text-ink md:text-5xl xl:text-6xl">
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
                <Icon className={`h-6 w-6 ${item.color}`} />
                <h3 className="mt-4 text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted md:text-[15px]">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/nexus"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia-500 px-7 text-base font-medium text-white shadow-[0_0_32px_rgba(139,92,246,0.35)]"
          >
            Enter the Nexus
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-6 text-base text-ink-muted backdrop-blur"
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
        <p className="text-sm text-ink-dim">
          DUALMIND — Explore the connections. Challenge the thinking. Discover
          the direction.
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-ink-dim">
          Milestone 1–2 · Sample graph online
        </p>
      </div>
    </footer>
  );
}
