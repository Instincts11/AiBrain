"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeft, Infinity as InfinityIcon } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { ChatDock } from "./chat-dock";

export function CommandShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { railCollapsed, toggleRail } = useUiStore();
  const isMarketing =
    pathname === "/" ||
    pathname === "/use-cases" ||
    pathname.startsWith("/use-cases/");

  if (isMarketing) {
    return <>{children}</>;
  }

  return (
    <div className="app-chrome flex h-dvh flex-col overflow-hidden dm-grid-bg">
      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "hidden shrink-0 flex-col border-r border-border bg-[#070b14]/95 transition-[width] duration-300 md:flex",
            railCollapsed ? "w-[68px]" : "w-[220px]",
          )}
        >
          <div
            className={cn(
              "flex h-14 shrink-0 items-center gap-2 border-b border-border px-3",
              railCollapsed && "justify-center px-0",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan/30 to-violet/40 text-cyan">
              <InfinityIcon className="h-4 w-4" />
            </div>
            {!railCollapsed && (
              <Link href="/" className="text-sm font-semibold tracking-[0.16em] text-ink">
                DUALMIND
              </Link>
            )}
          </div>

          <div className="flex items-center justify-end border-b border-border px-2 py-1.5 md:hidden" />
          <div
            className={cn(
              "hidden items-center border-b border-border px-2 py-1.5 md:flex",
              railCollapsed ? "justify-center" : "justify-end",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRail}
              aria-label={railCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {railCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

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
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
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
                      className="absolute inset-0 rounded-xl border border-cyan/25 bg-gradient-to-r from-cyan/15 via-violet/20 to-violet/10"
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
            <div className="space-y-3 border-t border-border p-3">
              <div>
                <div className="mb-1.5 text-xs uppercase tracking-wider text-ink-dim">
                  Current Workspace
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-ink">
                  AI SaaS Product
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs uppercase tracking-wider text-ink-dim">
                  <span>Knowledge Usage</span>
                  <span className="text-cyan">68%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan to-violet" />
                </div>
                <p className="mt-1.5 font-mono text-xs text-ink-dim">
                  1,248 nodes · 4,320 connections
                </p>
              </div>
            </div>
          )}
        </aside>

        <main className="relative min-w-0 flex-1 overflow-hidden pb-[140px] md:pb-[88px]">
          {children}
        </main>
      </div>

      <nav className="z-50 flex shrink-0 items-stretch justify-around border-t border-border bg-midnight/95 backdrop-blur-md md:hidden">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs uppercase tracking-wider",
                active ? "text-cyan" : "text-ink-dim",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.short}
            </Link>
          );
        })}
      </nav>

      <ChatDock />
    </div>
  );
}
