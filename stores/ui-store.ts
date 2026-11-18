"use client";

import { create } from "zustand";

type UiState = {
  railCollapsed: boolean;
  toggleRail: () => void;
  setRailCollapsed: (v: boolean) => void;
  /** Memory Matrix bottom stats panels (toggled from chat dock Stats tab). */
  matrixStatsOpen: boolean;
  setMatrixStatsOpen: (v: boolean) => void;
  toggleMatrixStats: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  railCollapsed: false,
  toggleRail: () => set((s) => ({ railCollapsed: !s.railCollapsed })),
  setRailCollapsed: (railCollapsed) => set({ railCollapsed }),
  matrixStatsOpen: false,
  setMatrixStatsOpen: (matrixStatsOpen) => set({ matrixStatsOpen }),
  toggleMatrixStats: () =>
    set((s) => ({ matrixStatsOpen: !s.matrixStatsOpen })),
}));