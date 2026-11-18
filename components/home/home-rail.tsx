"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Network,
  FlaskConical,
  Activity,
  Crosshair,
  Archive,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RAIL = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/nexus", icon: Network, label: "Nexus" },
  { href: "/lab", icon: FlaskConical, label: "Lab" },
  { href: "/dual", icon: Activity, label: "Dual" },
  { href: "/mission", icon: Crosshair, label: "Mission" },
  { href: "/vault", icon: Archive, label: "Vault" },
  { href: "/synthesis", icon: Settings, label: "Synthesis" },
];

export function HomeRail() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
      {RAIL.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-ink-dim backdrop-blur transition-all hover:border-cyan/30 hover:text-cyan",
              active && "border-cyan/40 text-cyan shadow-[0_0_16px_rgba(34,211,238,0.2)]",
            )}
          >
            <Icon className="h-6 w-6" />
          </Link>
        );
      })}
    </aside>
  );
}
