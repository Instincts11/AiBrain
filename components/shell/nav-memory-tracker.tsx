"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useNavMemoryStore } from "@/stores/nav-memory-store";

/** Keeps a short navigation stack so page Back buttons can restore the previous route. */
export function NavMemoryTracker() {
  const pathname = usePathname();
  const trackPath = useNavMemoryStore((s) => s.trackPath);

  useEffect(() => {
    trackPath(pathname);
  }, [pathname, trackPath]);

  return null;
}
