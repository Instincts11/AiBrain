"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { AgentChips } from "./agent-chips";
import { Button } from "@/components/ui/button";

export function CommandShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { railCollapsed, toggleRail } = useUiStore();
  const isHome = pathname === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden dm-grid-bg">
      <header className="z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-midnight/90 px-3 backdrop-blur-md md:px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={toggleRail}
            aria-label={railCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {railCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-[0.18em] text-ink">
              DUALMIND
            </span>
            <span className="hidden text-[10px] uppercase tracking-widest text-ink-dim sm:inline">
              Command
            </span>
          </Link>
        </div>
        <AgentChips />
        <div className="hidden items-center gap-3 font-mono text-[10px] text-ink-dim lg:flex">
          <span>GRAPH · SAMPLE</span>
          <span className="h-1 w-1 rounded-full bg-emerald" />
          <span>OFFLINE READY</span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "hidden shrink-0 flex-col border-r border-border bg-midnight/60 transition-[width] duration-300 md:flex",
            railCollapsed ? "w-16" : "w-56",
          )}
        >
          <nav className="flex flex-1 flex-col gap-1 p-2">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "text-ink"
                      : "text-ink-muted hover:bg-white/[0.03] hover:text-ink",
                    railCollapsed && "justify-center px-0",
                  )}
                  title={item.label}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md bg-cyan-dim border border-cyan/20"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-4 w-4 shrink-0",
                      active ? "text-cyan" : "text-ink-dim",
                    )}
                  />
                  {!railCollapsed && (
                    <span className="relative z-10 truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          {!railCollapsed && (
            <p className="border-t border-border px-4 py-3 text-[10px] leading-relaxed text-ink-dim">
              Explore the connections. Challenge the thinking. Discover the
              direction.
            </p>
          )}
        </aside>

        <main className="relative min-w-0 flex-1 overflow-hidden">{children}</main>
      </div>

      <nav className="z-30 flex shrink-0 items-stretch justify-around border-t border-border bg-midnight/95 backdrop-blur-md md:hidden">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[9px] uppercase tracking-wider",
                active ? "text-cyan" : "text-ink-dim",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
