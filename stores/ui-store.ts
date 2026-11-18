"use client";

import { create } from "zustand";

type UiState = {
  railCollapsed: boolean;
  toggleRail: () => void;
  setRailCollapsed: (v: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  railCollapsed: false,
  toggleRail: () => set((s) => ({ railCollapsed: !s.railCollapsed })),
  setRailCollapsed: (railCollapsed) => set({ railCollapsed }),
}));
