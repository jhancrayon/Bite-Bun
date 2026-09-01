import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "bb-theme";

function readInitial(): Theme {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

let current: Theme = readInitial();
const listeners = new Set<() => void>();

/** Reflect the current theme onto <html> so the .dark variant kicks in. */
function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

apply(current);

export function setTheme(theme: Theme) {
  current = theme;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, theme);
  apply(theme);
  listeners.forEach((listener) => listener());
}

export function toggleTheme() {
  setTheme(current === "dark" ? "light" : "dark");
}

/** Subscribe to the active light/dark theme. */
export function useTheme(): Theme {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
}
