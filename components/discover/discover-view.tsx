"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  Compass,
  Dna,
  FolderKanban,
  Infinity as InfinityIcon,
  Rocket,
  Search,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PageBackButton } from "@/components/shell/page-back-button";
import { cn } from "@/lib/utils";
import { useNavMemoryStore } from "@/stores/nav-memory-store";

type Goal =
  | "Build a Product"
  | "Do Research"
  | "Learn a Skill"
  | "Solve a Problem"
  | "Grow in Career"
  | "Stay Informed"
  | "Explore Ideas";

const CHIPS = [
  "AI Agents",
  "Second Brain",
  "Knowledge Graphs",
  "Research Tools",
  "Startup",
  "Product Strategy",
];

const KINDS: { label: string; hint: string; icon: LucideIcon }[] = [
  { label: "Topics", hint: "Explore by subject", icon: Compass },
  { label: "Papers", hint: "Research & studies", icon: BookOpen },
  { label: "Tools", hint: "Apps & frameworks", icon: Wrench },
  { label: "People", hint: "Experts & creators", icon: Users },
  { label: "Collections", hint: "Curated knowledge", icon: FolderKanban },
  { label: "Trails", hint: "Guided learning", icon: Sparkles },
];

const TRENDING = [
  { n: "01", title: "AI Agents", delta: "+142%" },
  { n: "02", title: "RAG Systems", delta: "+98%" },
  { n: "03", title: "Second Brain", delta: "+87%" },
  { n: "04", title: "Knowledge Graphs", delta: "+76%" },
  { n: "05", title: "Multimodal AI", delta: "+65%" },
  { n: "06", title: "Autonomous Tools", delta: "+58%" },
];

const GOALS: Goal[] = [
  "Build a Product",
  "Do Research",
  "Learn a Skill",
  "Solve a Problem",
  "Grow in Career",
  "Stay Informed",
  "Explore Ideas",
];

type Space = {
  title: string;
  stat: string;
  image: string;
  goals: Goal[];
  icon: LucideIcon;
};

const SPACES: Space[] = [
  {
    title: "Artificial Intelligence",
    stat: "12.4k resources",
    image: "/home/visual-pixel-head.png",
    goals: ["Do Research", "Learn a Skill", "Explore Ideas", "Solve a Problem"],
    icon: Brain,
  },
  {
    title: "Startups & Product",
    stat: "8.6k resources",
    image: "/home/section-usecase-1.jpg",
    goals: ["Build a Product", "Grow in Career", "Explore Ideas"],
    icon: Rocket,
  },
  {
    title: "Software Engineering",
    stat: "15.3k resources",
    image: "/home/section-usecase-2.jpg",
    goals: ["Build a Product", "Learn a Skill", "Solve a Problem"],
    icon: Boxes,
  },
  {
    title: "Data & Analytics",
    stat: "7.8k resources",
    image: "/home/section-how.jpg",
    goals: ["Do Research", "Learn a Skill", "Grow in Career"],
    icon: Sparkles,
  },
  {
    title: "Space & Earth Science",
    stat: "4.5k resources",
    image: "/home/visual-earth.png",
    goals: ["Stay Informed", "Explore Ideas", "Do Research"],
    icon: Compass,
  },
  {
    title: "Health & Biotechnology",
    stat: "6.1k resources",
    image: "/home/section-usecase-3.jpg",
    goals: ["Do Research", "Stay Informed", "Solve a Problem"],
    icon: Dna,
  },
];

const COLLECTIONS = [
  {
    title: "The AI Agent Playbook",
    body: "From concepts to real-world builds.",
    meta: "24 resources · 6 trails",
    image: "/home/visual-pixel-head.png",
  },
  {
    title: "The Second Brain Stack",
    body: "Methods, tools, and systems.",
    meta: "18 resources · 4 trails",
    image: "/home/section-usecase-2.jpg",
  },
  {
    title: "Space Tech Essentials",
    body: "Key research, missions, and tools.",
    meta: "30 resources · 6 trails",
    image: "/home/visual-earth.png",
  },
];

const TRAIL_STEPS = [
  "Fundamentals",
  "Capture",
  "Organize",
  "Connect",
  "Automate",
  "Apply",
];

const INTERESTS = [
  {
    kind: "Paper",
    title: "A Survey on AI Agents (2025)",
    body: "Architectures, tools, and evaluation for agent systems.",
    image: "/home/section-usecase-4.jpg",
  },
  {
    kind: "Tool",
    title: "LangGraph",
    body: "Build stateful, multi-agent applications with ease.",
    image: "/home/section-how.jpg",
  },
  {
    kind: "Topic",
    title: "Retrieval-Augmented Generation",
    body: "Methods, best practices, and real-world applications.",
    image: "/home/section-usecase-3.jpg",
  },
  {
    kind: "Guide",
    title: "Designing a Knowledge Graph",
    body: "A practical guide from modeling to deployment.",
    image: "/home/visual-earth.png",
  },
];

type DiscoverSnap = {
  query: string;
  goal: Goal | null;
  chip: string | null;
};

export function DiscoverView() {
  const saveSnapshot = useNavMemoryStore((s) => s.saveSnapshot);
  const getSnapshot = useNavMemoryStore((s) => s.getSnapshot);
  const restored = getSnapshot<DiscoverSnap>("/discover");
  const [query, setQuery] = useState(restored?.query ?? "");
  const [goal, setGoal] = useState<Goal | null>(restored?.goal ?? null);
  const [chip, setChip] = useState<string | null>(restored?.chip ?? null);

  useEffect(() => {
    saveSnapshot("/discover", { query, goal, chip });
  }, [query, goal, chip, saveSnapshot]);

  const needle = (chip ?? query).trim().toLowerCase();

  const spaces = useMemo(() => {
    return SPACES.filter((s) => {
      const matchesGoal = !goal || s.goals.includes(goal);
      const matchesQuery =
        !needle ||
        s.title.toLowerCase().includes(needle) ||
        s.goals.some((g) => g.toLowerCase().includes(needle));
      return matchesGoal && matchesQuery;
    });
  }, [goal, needle]);

  const interests = useMemo(() => {
    if (!needle) return INTERESTS;
    return INTERESTS.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.kind.toLowerCase().includes(needle) ||
        item.body.toLowerCase().includes(needle),
    );
  }, [needle]);

  function submitSearch(value: string) {
    setChip(null);
    setQuery(value);
  }

  return (
    <div className="dm-scrollbar h-full min-h-0 overflow-auto bg-[#05070f]">
      <section className="relative overflow-hidden border-b border-white/5 px-4 py-10 md:px-8 md:py-14">
        <Image
          src="/home/Cosmic Cities Beneath a Spiral Galaxy.png"
          alt=""
          fill
          className="object-cover object-center opacity-45"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070f]/40 via-[#05070f]/55 to-[#05070f]" />
        <div className="relative mb-4">
          <PageBackButton />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan">
            Discover
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Explore Knowledge{" "}
            <span className="bg-gradient-to-r from-violet to-fuchsia-400 bg-clip-text text-transparent">
              Without Limits
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-muted md:text-lg">
            Uncover ideas, connect domains, find high-signal resources, and
            discover new perspectives — all in one intelligent space.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-full border border-cyan/30 bg-black/50 px-4 py-2 shadow-[0_0_28px_rgba(34,211,238,0.15)] backdrop-blur"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              submitSearch(String(data.get("q") ?? ""));
            }}
          >
            <Search className="h-4 w-4 shrink-0 text-cyan" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search topics, ideas, papers, tools, people, or questions…"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-dim"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-cyan to-violet text-[#041018]"
              aria-label="Search"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CHIPS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setChip(item);
                  setQuery(item);
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  chip === item
                    ? "border-cyan/50 bg-cyan/15 text-cyan"
                    : "border-white/10 bg-black/35 text-ink-muted hover:text-ink",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col gap-12 px-4 py-8 md:px-8 md:py-10 lg:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {KINDS.map((kind) => {
            const Icon = kind.icon;
            return (
              <button
                key={kind.label}
                type="button"
                onClick={() => submitSearch(kind.label)}
                className="rounded-2xl border border-white/10 bg-[#0b1628] px-3 py-4 text-left transition-colors hover:border-cyan/35"
              >
                <Icon className="h-5 w-5 text-cyan" />
                <div className="mt-3 text-sm font-medium text-ink">{kind.label}</div>
                <div className="mt-0.5 text-xs text-ink-dim">{kind.hint}</div>
              </button>
            );
          })}
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink md:text-xl">
              Trending Now
            </h2>
            <span className="text-xs uppercase tracking-wider text-ink-dim">
              What people are exploring
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TRENDING.map((item) => (
              <button
                key={item.n}
                type="button"
                onClick={() => submitSearch(item.title)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:border-cyan/30"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan">{item.n}</span>
                  <span className="text-sm font-medium text-ink">{item.title}</span>
                </span>
                <span className="font-mono text-xs text-emerald">{item.delta}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink md:text-xl">
                Explore Knowledge Spaces
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Dive into rich, interconnected hubs of knowledge, research, tools,
                and real-world applications.
              </p>
            </div>
            <span className="shrink-0 text-xs text-cyan">
              {spaces.length} spaces
            </span>
          </div>
          {spaces.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-ink-dim">
              Nothing matches that search yet. Try another topic or goal.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => {
                const Icon = space.icon;
                return (
                  <Link
                    key={space.title}
                    href="/vault"
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0a101c]"
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={space.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a101c] via-transparent to-transparent" />
                      <Icon className="absolute left-3 top-3 h-5 w-5 text-cyan drop-shadow" />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-ink">{space.title}</div>
                        <div className="text-xs text-ink-dim">{space.stat}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-ink-dim group-hover:text-cyan" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink md:text-xl">
            Discover by Goal
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Find the right knowledge for what you want to do next.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {GOALS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGoal((current) => (current === item ? null : item))}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  goal === item
                    ? "border-violet/50 bg-violet/20 text-violet"
                    : "border-white/10 bg-black/30 text-ink-muted hover:text-ink",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink md:text-xl">
                Featured Collections
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Handpicked, high-quality resources to go deeper, faster.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {COLLECTIONS.map((item) => (
              <Link
                key={item.title}
                href="/vault"
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1628]"
              >
                <div className="relative h-36">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="33vw" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    Collection
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
                  <p className="mt-2 font-mono text-xs text-cyan">{item.meta}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink md:text-xl">
            Knowledge Trails
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Structured learning paths that take you from concepts to real-world mastery.
          </p>
          <Link
            href="/lab"
            className="mt-4 grid overflow-hidden rounded-2xl border border-cyan/25 bg-[#0b1628] md:grid-cols-[220px_1fr]"
          >
            <div className="relative min-h-[140px]">
              <Image
                src="/home/section-usecase-4.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-violet/30 bg-violet/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violet">
                  Trail
                </span>
                <span className="text-xs text-ink-dim">Intermediate · 6 modules · 3 hours</span>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-ink">
                Build Your Second Brain
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                A step-by-step path to capture, organize, and leverage your knowledge with Dualmind.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {TRAIL_STEPS.map((step, i) => (
                  <span
                    key={step}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-muted"
                  >
                    {String(i + 1).padStart(2, "0")} {step}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink md:text-xl">
            Based on Your Interests
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Recommendations tailored to your knowledge graph, recent activity, and learning goals.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {interests.map((item) => (
              <Link
                key={item.title}
                href="/vault"
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a101c]"
              >
                <div className="relative h-28">
                  <Image src={item.image} alt="" fill className="object-cover" sizes="25vw" />
                </div>
                <div className="p-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan">
                    {item.kind}
                  </span>
                  <h3 className="mt-1 text-sm font-medium text-ink">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-dim">{item.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="relative overflow-hidden border-t border-white/5 px-4 py-16 md:px-8 md:py-24">
        <Image
          src="/home/Neon Galaxy Over Earth’s Horizon.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#05070f]/55" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <InfinityIcon className="h-8 w-8 text-cyan" />
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Keep Exploring. Keep{" "}
            <span className="bg-gradient-to-r from-violet to-fuchsia-400 bg-clip-text text-transparent">
              Connecting.
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            Every search, trail, and collection adds another link to your
            knowledge universe. Follow what is trending, open a space that
            matches your goal, and turn scattered discoveries into a living
            graph you can return to.
          </p>
          <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
            {[
              {
                title: "Follow a trail",
                body: "Move from a concept to a working practice in a few guided modules.",
              },
              {
                title: "Open a space",
                body: "Step into a domain hub of papers, tools, and real-world applications.",
              },
              {
                title: "Grow the graph",
                body: "Save what matters so the next discovery starts from what you already know.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-[#05070f]/55 px-4 py-4 text-left backdrop-blur-sm"
              >
                <h3 className="text-base font-medium text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/nexus"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia-500 px-7 text-base font-medium text-white shadow-[0_0_28px_rgba(139,92,246,0.35)]"
            >
              Explore More
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/vault"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-6 text-base text-ink backdrop-blur hover:text-white"
            >
              Open Memory Matrix
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
