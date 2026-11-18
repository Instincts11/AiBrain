"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PageSnapshot = Record<string, unknown>;

type NavMemoryState = {
  stack: string[];
  snapshots: Record<string, PageSnapshot>;
  lastPath: string | null;
  /** Record a navigation hop so Back can return here later. */
  trackPath: (path: string) => void;
  /** Save UI state for a page (tab, filters, etc.). */
  saveSnapshot: (path: string, snapshot: PageSnapshot) => void;
  getSnapshot: <T extends PageSnapshot>(path: string) => T | null;
  /** Pop previous path (skips current). */
  popPrevious: (currentPath: string) => string | null;
};

function normalize(path: string) {
  const bare = path.split("?")[0] || "/";
  return bare.endsWith("/") && bare.length > 1 ? bare.slice(0, -1) : bare;
}

export const useNavMemoryStore = create<NavMemoryState>()(
  persist(
    (set, get) => ({
      stack: [],
      snapshots: {},
      lastPath: null,
      trackPath: (path) => {
        const next = normalize(path);
        const { lastPath, stack } = get();
        if (!lastPath) {
          set({ lastPath: next });
          return;
        }
        if (lastPath === next) return;
        const trimmed = [...stack, lastPath].slice(-20);
        set({ stack: trimmed, lastPath: next });
      },
      saveSnapshot: (path, snapshot) => {
        const key = normalize(path);
        set((s) => ({
          snapshots: { ...s.snapshots, [key]: snapshot },
        }));
      },
      getSnapshot: <T extends PageSnapshot>(path: string) => {
        const key = normalize(path);
        return (get().snapshots[key] as T) ?? null;
      },
      popPrevious: (currentPath) => {
        const current = normalize(currentPath);
        const stack = [...get().stack];
        while (stack.length > 0) {
          const prev = stack.pop()!;
          if (prev !== current) {
            set({ stack });
            return prev;
          }
        }
        set({ stack: [] });
        return null;
      },
    }),
    {
      name: "dualmind-nav-memory",
      partialize: (s) => ({
        stack: s.stack,
        snapshots: s.snapshots,
        lastPath: s.lastPath,
      }),
    },
  ),
);
