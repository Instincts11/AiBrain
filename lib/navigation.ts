import {
  Network,
  FlaskConical,
  Split,
  Blend,
  Crosshair,
  Archive,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/nexus",
    label: "Nexus",
    short: "Nexus",
    icon: Network,
    description: "Knowledge universe",
  },
  {
    href: "/lab",
    label: "Intelligence Lab",
    short: "Lab",
    icon: FlaskConical,
    description: "Decision sessions",
  },
  {
    href: "/dual",
    label: "Dual Analysis",
    short: "Dual",
    icon: Split,
    description: "JARVIS vs ULTRON",
  },
  {
    href: "/synthesis",
    label: "Synthesis",
    short: "Synth",
    icon: Blend,
    description: "Independent evaluation",
  },
  {
    href: "/mission",
    label: "Mission Control",
    short: "Mission",
    icon: Crosshair,
    description: "Execution plans",
  },
  {
    href: "/vault",
    label: "Memory Vault",
    short: "Vault",
    icon: Archive,
    description: "Documents & memory",
  },
];
