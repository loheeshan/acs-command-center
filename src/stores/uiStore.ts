import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";
export type ExplanationLevel = "beginner" | "developer" | "deep";

interface UiState {
  theme: Theme;
  explanationLevel: ExplanationLevel;
  mobileNavOpen: boolean;
  collapsedGroups: Record<string, boolean>;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setExplanationLevel: (level: ExplanationLevel) => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleGroup: (group: string) => void;
}

/** Shared learner-interface state (client state → Zustand). */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "dark",
      explanationLevel: "developer",
      mobileNavOpen: false,
      collapsedGroups: {},
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setExplanationLevel: (explanationLevel) => set({ explanationLevel }),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      toggleGroup: (group) =>
        set((s) => ({ collapsedGroups: { ...s.collapsedGroups, [group]: !s.collapsedGroups[group] } })),
    }),
    {
      name: "acs-ui",
      version: 1,
      partialize: (s) => ({ theme: s.theme, explanationLevel: s.explanationLevel, collapsedGroups: s.collapsedGroups }),
    },
  ),
);
