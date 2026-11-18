"use client";

import Link from "next/link";
import { DualmindLogo } from "./logo";
import { HOME_SHELL } from "@/lib/home-layout";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/nexus" },
  { label: "Solutions", href: "/lab" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Research", href: "/vault" },
  { label: "Resources", href: "/vault" },
  { label: "Pricing", href: "#why" },
];

export function HomeNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#05070f]/65 backdrop-blur-xl">
      <div className={`flex h-14 items-center justify-between gap-4 ${HOME_SHELL}`}>
        <Link href="/" className="shrink-0">
          <DualmindLogo />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/lab"
            className="hidden h-9 items-center rounded-full px-4 text-[13px] text-ink-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/nexus"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan via-violet to-fuchsia-500 px-4 text-[13px] font-medium text-white shadow-[0_0_24px_rgba(34,211,238,0.25)]"
          >
            Get Started
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
