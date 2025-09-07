import { create } from "zustand";

type ThemeState = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem("theme") || "coffee",
  setTheme: (theme: string) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));
