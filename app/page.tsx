"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { HomeNav } from "@/components/home/home-nav";
import { HomeRail } from "@/components/home/home-rail";
import { HeroVisual } from "@/components/home/hero-visual";
import { SectionBg } from "@/components/home/section-bg";
import {
  FeatureStrip,
  HowItWorks,
  UseCases,
  KnowledgeUniverse,
  WhyDualmind,
  HomeFooter,
} from "@/components/home/home-sections";

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#05070f] text-ink">
      <HomeNav />
      <HomeRail />

      <main className="relative z-10">
        <section className="relative overflow-x-hidden pb-14 pt-10 md:pt-14">
          <SectionBg
            src="/home/hero-bg.jpg"
            overlay="from-[#05070f]/75 via-[#05070f]/50 to-[#05070f]/90"
          />

          {/* Restored centered hero shell */}
          <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-8 md:pl-20 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-4xl text-center"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan">
                The AI Decision Intelligence Platform
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
                Two Minds. One{" "}
                <span className="bg-gradient-to-r from-violet via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  Superior Decision.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
                Transform your information, ideas and goals into an
                interconnected intelligence network. Compare perspectives,
                challenge assumptions and get evidence-backed decisions with a
                clear execution plan.
              </p>
            </motion.div>

            <HeroVisual />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/nexus"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-cyan via-sky-400 to-violet px-7 text-sm font-medium text-[#041018] shadow-[0_0_28px_rgba(34,211,238,0.35)]"
              >
                Enter the Nexus
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-black/45 px-6 text-sm text-ink-muted backdrop-blur transition-colors hover:border-white/25 hover:text-ink"
              >
                <Play className="h-4 w-4" />
                Watch Product Tour
              </a>
            </motion.div>
          </div>
        </section>

        <FeatureStrip />
        <HowItWorks />
        <UseCases />
        <KnowledgeUniverse />
        <WhyDualmind />
        <HomeFooter />
      </main>
    </div>
  );
}
