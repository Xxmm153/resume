import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage", // unique name for storage
      storage: createJSONStorage(() => localStorage), // use localStorage
    },
  ),
);
