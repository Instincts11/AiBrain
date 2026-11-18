"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  GitCompareArrows,
  Layers,
  Network,
  Orbit,
  Rocket,
  Scale,
  Sparkles,
  Users,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { HomeNav } from "@/components/home/home-nav";
import { HomeFooter } from "@/components/home/home-sections";
import { SectionBg } from "@/components/home/section-bg";
import { HOME_SHELL } from "@/lib/home-layout";
import { cn } from "@/lib/utils";

type CategoryId = "all" | "work" | "research" | "personal" | "teams";

type UseCase = {
  id: string;
  title: string;
  body: string;
  outcomes: string[];
  tags: string[];
  href: string;
  category: Exclude<CategoryId, "all">;
  icon: LucideIcon;
  accent: "cyan" | "violet";
};

const CATEGORIES: {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "all", label: "All Use Cases", icon: Layers },
  { id: "work", label: "Work & Build", icon: Briefcase },
  { id: "research", label: "Research & Learn", icon: BookOpen },
  { id: "personal", label: "Personal Growth", icon: UserRound },
  { id: "teams", label: "Teams & Organizations", icon: Users },
];

const USE_CASES: UseCase[] = [
  {
    id: "startup",
    title: "Build & Run a Startup",
    body: "Validate markets, pressure-test strategy, and turn high-stakes decisions into clear execution roadmaps before you burn runway.",
    outcomes: [
      "Compare optimistic vs critical views on product bets",
      "Surface hidden risks in GTM and hiring plans",
      "Leave with a sequenced mission plan",
    ],
    tags: ["Market Analysis", "Strategy", "Execution"],
    href: "/lab",
    category: "work",
    icon: Rocket,
    accent: "cyan",
  },
  {
    id: "research",
    title: "Research & Innovation",
    body: "Connect literature, surface knowledge gaps, and frame sharper research questions with a living evidence graph.",
    outcomes: [
      "Map citations and concept clusters",
      "Find overlooked contradictions and gaps",
      "Draft stronger problem statements",
    ],
    tags: ["Literature Review", "Knowledge Graph", "Gaps"],
    href: "/vault",
    category: "research",
    icon: BookOpen,
    accent: "violet",
  },
  {
    id: "engineering",
    title: "Software Engineering",
    body: "Challenge architectures, map code intelligence, and keep docs aligned with how systems actually behave in production.",
    outcomes: [
      "Stress-test design trade-offs with dual agents",
      "Link decisions to constraints and evidence",
      "Keep architecture notes searchable",
    ],
    tags: ["Architecture", "Code Intelligence", "Docs"],
    href: "/dual",
    category: "work",
    icon: Code2,
    accent: "cyan",
  },
  {
    id: "learning",
    title: "Learning & Skill Mastery",
    body: "Design learning paths, reinforce recall, and track mastery with constructive and critical feedback loops.",
    outcomes: [
      "Build spaced practice from your notes",
      "Identify weak concepts early",
      "Convert study into actionable skill plans",
    ],
    tags: ["Learning Paths", "Spaced Recall", "Mastery"],
    href: "/lab",
    category: "personal",
    icon: Sparkles,
    accent: "violet",
  },
  {
    id: "knowledge-os",
    title: "Personal Knowledge OS",
    body: "Turn notes, media, and memories into a searchable second brain you can query when decisions get complex.",
    outcomes: [
      "Ingest notes, voice, and documents",
      "Retrieve context with graph connections",
      "Reuse past decisions instead of restarting",
    ],
    tags: ["Notes", "Media", "Memory Search"],
    href: "/vault",
    category: "personal",
    icon: Layers,
    accent: "cyan",
  },
  {
    id: "decisions",
    title: "Decision Intelligence",
    body: "Weigh trade-offs, expose risks, and leave with evidence-backed recommendations — not a single opaque answer.",
    outcomes: [
      "Pros, cons, and confidence scores",
      "Independent synthesis across agents",
      "Clear next steps with owners",
    ],
    tags: ["Pros & Cons", "Risk Analysis", "Recommendations"],
    href: "/synthesis",
    category: "work",
    icon: Scale,
    accent: "violet",
  },
  {
    id: "team-hub",
    title: "Team Knowledge Hub",
    body: "Capture org memory, align collaboration, and keep institutional knowledge alive as people and projects change.",
    outcomes: [
      "Shared graph for team decisions",
      "Reduce repeated debates",
      "Onboard faster with living context",
    ],
    tags: ["Team Memory", "Collaboration", "Org Knowledge"],
    href: "/nexus",
    category: "teams",
    icon: Users,
    accent: "cyan",
  },
  {
    id: "creative",
    title: "Creative & Long-Term Projects",
    body: "Plan ambitious goals, map knowledge over time, and track meaningful progress without losing the big picture.",
    outcomes: [
      "Break vision into missions and milestones",
      "Connect inspiration to constraints",
      "Review progress with dual critique",
    ],
    tags: ["Goal Planning", "Knowledge Map", "Progress"],
    href: "/mission",
    category: "personal",
    icon: Orbit,
    accent: "violet",
  },
];

const IMPACT = [
  {
    from: 1.2,
    target: 2.4,
    decimals: 1,
    suffix: "x",
    label: "Faster Research",
    detail: "vs scattered document review",
    icon: Rocket,
  },
  {
    from: 18,
    target: 40,
    decimals: 0,
    suffix: "%",
    label: "Better Decisions",
    detail: "higher confidence on trade-offs",
    icon: Layers,
  },
  {
    from: 1,
    target: 3,
    decimals: 0,
    suffix: "x",
    label: "Higher Execution",
    detail: "more plans that ship",
    icon: Zap,
  },
  {
    from: 8,
    target: 20,
    decimals: 0,
    suffix: "+",
    label: "Active Use Cases",
    detail: "across work and life",
    icon: Users,
  },
];

const PIPELINE = [
  {
    icon: Network,
    title: "Ingest & Connect",
    body: "Bring goals, notes, docs, and signals into one knowledge graph.",
  },
  {
    icon: GitCompareArrows,
    title: "Dual Analysis",
    body: "JARVIS builds options while ULTRON challenges assumptions and risk.",
  },
  {
    icon: Scale,
    title: "Synthesize",
    body: "Independent evaluation weighs evidence, confidence, and trade-offs.",
  },
  {
    icon: Rocket,
    title: "Execute",
    body: "Convert the decision into missions, milestones, and measurable outcomes.",
  },
];

export function UseCasesPage() {
  const [category, setCategory] = useState<CategoryId>("all");

  const visible = useMemo(
    () =>
      category === "all"
        ? USE_CASES
        : USE_CASES.filter((c) => c.category === category),
    [category],
  );

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#05070f] text-ink">
      <HomeNav />

      <main className="relative z-10">
        <section className="relative overflow-hidden pb-10 pt-12 md:pt-16">
          <SectionBg
            src="/home/hero-bg.jpg"
            overlay="from-[#05070f]/55 via-[#05070f]/45 to-[#05070f]/92"
            parallax={false}
          />

          <div className={`relative ${HOME_SHELL}`}>
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1 font-mono text-xs uppercase tracking-[0.22em] text-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                Use Cases
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
                One Intelligence System. Multiple{" "}
                <span className="bg-gradient-to-r from-cyan via-sky-400 to-violet bg-clip-text text-transparent">
                  Real-World Uses.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                DUALMIND works as a second brain — dual analysis, knowledge
                graphs, and evidence-backed decisions across work, research,
                personal growth, and teams. Pick a category, explore a workflow,
                and open the product surface that fits.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-dim">
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  8 primary workflows
                </span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  Dual-agent critique
                </span>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1">
                  Graph-backed memory
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all",
                      active
                        ? "border-cyan/50 bg-cyan/15 text-cyan shadow-[0_0_22px_rgba(34,211,238,0.28)]"
                        : "border-white/10 bg-black/35 text-ink-muted hover:border-white/20 hover:text-ink",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative border-y border-white/5 bg-[#070b14]/80 py-14">
          <div className={HOME_SHELL}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-violet md:text-sm">
                How Dualmind Applies
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                The same intelligence loop, adapted to each domain
              </h2>
              <p className="mt-3 text-base text-ink-muted md:text-lg">
                Every use case follows a shared pipeline — ingest context, run
                dual analysis, synthesize evidence, then execute — tuned to the
                language and constraints of that domain.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PIPELINE.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                      <Icon className="h-5 w-5 text-cyan" />
                    </div>
                    <h3 className="mt-3 text-base font-medium text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative pb-16 pt-12">
          <div className={HOME_SHELL}>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan md:text-sm">
                  Explore workflows
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                  {category === "all"
                    ? "All real-world use cases"
                    : CATEGORIES.find((c) => c.id === category)?.label}
                </h2>
                <p className="mt-2 max-w-2xl text-base text-ink-muted">
                  Each card opens a Dualmind surface where you can run the
                  workflow with your own knowledge and goals.
                </p>
              </div>
              <p className="font-mono text-sm text-ink-dim">
                Showing {visible.length} of {USE_CASES.length}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:gap-5">
              {visible.map((item) => (
                <UseCaseCard key={item.id} item={item} />
              ))}
            </div>
            {visible.length === 0 && (
              <p className="py-16 text-center text-ink-muted">
                No use cases in this category yet.
              </p>
            )}
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/5 py-16 md:py-20">
          <SectionBg
            src="/home/Cosmic Cities Beneath a Spiral Galaxy.png"
            overlay="from-[#05070f]/75 via-[#05070f]/55 to-[#05070f]/80"
            parallax={false}
          />
          <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-20 xl:gap-28">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan md:text-base">
                  Real-World Impact
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                  From Ideas to{" "}
                  <span className="bg-gradient-to-r from-violet to-fuchsia-400 bg-clip-text text-transparent">
                    Tangible Outcomes
                  </span>
                </h2>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-muted md:text-xl">
                  Teams and individuals use Dualmind to move faster from
                  scattered knowledge to clear, executable decisions — with
                  measurable lift across research speed, decision quality, and
                  follow-through.
                </p>
                <Link
                  href="/nexus"
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia-500 px-7 text-base font-medium text-white shadow-[0_0_28px_rgba(139,92,246,0.35)]"
                >
                  Start in the Nexus
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
                {IMPACT.map((stat) => (
                  <ImpactStat key={stat.label} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className={`${HOME_SHELL} text-center`}>
            <h2 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl xl:text-6xl">
              Ready to apply Dualmind to your next{" "}
              <span className="bg-gradient-to-r from-cyan via-violet to-fuchsia-400 bg-clip-text text-transparent">
                decision?
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
              Open a lab session, load your knowledge vault, or run dual analysis
              on a live question — the same system powers every use case above.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/lab"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-sky-400 to-violet px-7 text-base font-medium text-[#041018] shadow-[0_0_28px_rgba(34,211,238,0.35)]"
              >
                Open Intelligence Lab
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/vault"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-black/45 px-6 text-base text-ink-muted backdrop-blur hover:text-ink"
              >
                Explore Memory Matrix
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}

function ImpactStat({
  from,
  target,
  decimals,
  suffix,
  label,
  detail,
  icon: Icon,
}: {
  from: number;
  target: number;
  decimals: number;
  suffix: string;
  label: string;
  detail: string;
  icon: LucideIcon;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const delay = 700;
    const duration = 2800;
    let raf = 0;
    let start = 0;
    const begin = window.setTimeout(() => {
      start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(from + (target - from) * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setValue(target);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(begin);
      cancelAnimationFrame(raf);
    };
  }, [started, from, target]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-cyan/20 bg-[#0b1628]/90 px-3 py-4 text-center shadow-[inset_0_0_24px_rgba(34,211,238,0.08)]"
    >
      <Icon className="mx-auto h-4 w-4 text-cyan" />
      <div className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
        <span>{value.toFixed(decimals)}</span>
        <span className="text-cyan">{suffix}</span>
      </div>
      <div className="mt-1 text-xs text-ink-muted md:text-sm">{label}</div>
      <p className="mt-0.5 text-[11px] leading-snug text-ink-dim">{detail}</p>
    </div>
  );
}

function UseCaseCard({ item }: { item: UseCase }) {
  const Icon = item.icon;
  const glow =
    item.accent === "cyan"
      ? "border-cyan/25 shadow-[0_0_28px_rgba(34,211,238,0.12)] hover:border-cyan/45 hover:shadow-[0_0_36px_rgba(34,211,238,0.22)]"
      : "border-violet/25 shadow-[0_0_28px_rgba(139,92,246,0.12)] hover:border-violet/45 hover:shadow-[0_0_36px_rgba(139,92,246,0.22)]";
  const iconTone =
    item.accent === "cyan"
      ? "from-cyan/25 to-sky-500/10 text-cyan"
      : "from-violet/25 to-fuchsia-500/10 text-violet";

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex min-h-[320px] gap-5 overflow-hidden rounded-2xl border bg-[#0a101c]/75 p-6 backdrop-blur-md transition-all md:min-h-[360px] md:p-8",
        glow,
      )}
    >
      <div className="min-w-0 flex-1">
        <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {item.title}
        </h3>
        <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-muted md:text-lg">
          {item.body}
        </p>
        <ul className="mt-4 space-y-2">
          {item.outcomes.map((o) => (
            <li
              key={o}
              className="flex items-start gap-2 text-sm text-ink-dim md:text-base"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
              <span>{o}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-ink-dim"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br md:h-24 md:w-24",
            iconTone,
          )}
        >
          <Icon className="h-10 w-10 drop-shadow-[0_0_12px_currentColor] md:h-12 md:w-12" />
        </div>
        <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-ink-muted transition-colors group-hover:border-cyan/40 group-hover:text-cyan">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
