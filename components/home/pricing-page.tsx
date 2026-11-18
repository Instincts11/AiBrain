"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Brain,
  Check,
  Infinity as InfinityIcon,
  Network,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react"; 
import { HomeNav } from "@/components/home/home-nav";
import { HomeFooter } from "@/components/home/home-sections";
import { HOME_SHELL } from "@/lib/home-layout";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

type Plan = {
  id: string;
  name: string;
  blurb: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  href: string;
  icon: LucideIcon;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    blurb: "Start exploring the power of a Second Brain.",
    monthly: 0,
    yearly: 0,
    features: [
      "Personal knowledge space",
      "Basic memory capture (notes, links, files)",
      "AI search & retrieval",
      "Limited knowledge graph",
      "Community collections",
    ],
    cta: "Get Started Free",
    href: "/lab",
    icon: Box,
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "For individuals who want a smarter, more capable brain.",
    monthly: 999,
    yearly: 9990,
    features: [
      "Unlimited memory capture",
      "Full knowledge graph & connections",
      "Dual Intelligence (JARVIS & ULTRON)",
      "Advanced analysis & synthesis",
      "Personalized recommendations",
      "Priority processing",
    ],
    cta: "Upgrade to Pro",
    href: "/nexus",
    icon: Zap,
  },
  {
    id: "team",
    name: "Pro+ (Team)",
    blurb: "A shared intelligence layer for high-performing teams.",
    monthly: 2999,
    yearly: 29990,
    features: [
      "Everything in Pro",
      "Shared knowledge spaces",
      "Team memory & collaboration",
      "Role-based access & permissions",
      "Team-specific AI agents",
      "Usage analytics & insights",
    ],
    cta: "Start Team Plan",
    href: "/nexus",
    icon: Users,
    popular: true,
  },
];

const PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: InfinityIcon,
    title: "Second Brain",
    body: "Capture · Connect · Recall",
  },
  {
    icon: Brain,
    title: "Dual Intelligence",
    body: "JARVIS + ULTRON",
  },
  {
    icon: Network,
    title: "Knowledge Graph",
    body: "Discover · Explore · Expand",
  },
  {
    icon: Zap,
    title: "AI Agents",
    body: "Research · Analyse · Execute",
  },
];

function rupee(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function PricingPage() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#05070f] text-ink">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/home/Neon Galaxy Over Earth’s Horizon.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#05070f]/62" />
      </div>

      <div className="relative">
        <HomeNav />
        <main className={`pb-16 pt-12 md:pt-16 ${HOME_SHELL}`}>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan md:text-sm">
              Pricing
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-cyan via-violet to-fuchsia-400 bg-clip-text text-transparent">
                Intelligence Plan
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
              From a powerful personal second brain to a collaborative
              intelligence system for teams. Pick the plan that fits your goals
              and grow with DUALMIND.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur">
              {(["monthly", "yearly"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBilling(mode)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm capitalize transition-colors",
                    billing === mode
                      ? "bg-cyan/20 text-cyan shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
            <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/15 px-3 py-1 text-xs font-medium text-fuchsia-200">
              Save up to 30%
            </span>
          </div>

          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <Icon className="mx-auto h-7 w-7 text-cyan" />
                  <h2 className="mt-3 text-base font-medium text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-dim">{item.body}</p>
                </div>
              );
            })}
          </div>
        </main>
        <HomeFooter />
      </div>
    </div>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const Icon = plan.icon;
  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const period = billing === "monthly" ? "/month" : "/year";
  const yearlySaving =
    plan.monthly > 0
      ? Math.round((1 - plan.yearly / (plan.monthly * 12)) * 100)
      : 0;

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-3xl border bg-[#071018]/80 p-6 backdrop-blur-md",
        plan.popular
          ? "border-fuchsia-400/70 shadow-[0_0_36px_rgba(217,70,239,0.28)]"
          : "border-cyan/35 shadow-[0_0_24px_rgba(34,211,238,0.12)]",
      )}
    >
      {plan.popular && (
        <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet to-fuchsia-500 px-3 py-1 text-xs font-medium text-white">
          Most Popular
        </span>
      )}
      <Icon className={cn("h-6 w-6", plan.popular ? "text-fuchsia-300" : "text-cyan")} />
      <h2 className="mt-4 text-2xl font-semibold text-ink">{plan.name}</h2>
      <p className="mt-2 min-h-12 text-sm leading-relaxed text-ink-muted">
        {plan.blurb}
      </p>
      <div className="mt-5">
        <span className="text-4xl font-semibold tracking-tight text-ink">
          {rupee(price)}
        </span>
        <span className="ml-1 text-sm text-ink-dim">{period}</span>
      </div>
      {plan.monthly > 0 && (
        <p className="mt-1 text-sm text-ink-dim">
          {billing === "monthly" ? (
            <>
              {rupee(plan.yearly)} billed yearly{" "}
              <span className="text-cyan">(Save {yearlySaving}%)</span>
            </>
          ) : (
            <>
              {rupee(plan.monthly)} if billed monthly{" "}
              <span className="text-cyan">(Save {yearlySaving}%)</span>
            </>
          )}
        </p>
      )}
      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={plan.href}
        className={cn(
          "mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium",
          plan.id === "free"
            ? "border border-white/20 text-ink hover:border-cyan/40"
            : "bg-gradient-to-r from-cyan via-violet to-fuchsia-500 text-white shadow-[0_0_22px_rgba(139,92,246,0.3)]",
        )}
      >
        {plan.cta}
        {plan.id !== "free" && <ArrowRight className="h-4 w-4" />}
      </Link>
    </article>
  );
}
