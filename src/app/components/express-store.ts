import { useSyncExternalStore } from "react";

/** Express-delivery selection shared between the service panel and checkout. */
export type Express = {
  enabled: boolean;
  area: string;
  eta: number; // minutes
  fee: number; // extra surcharge in vnd (0 when express off)
};

const STORAGE_KEY = "bb-express";
const DEFAULT: Express = { enabled: false, area: "Quận Phú Nhuận", eta: 22, fee: 0 };

function readInitial(): Express {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...(JSON.parse(raw) as Express) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

let current: Express = readInitial();
const listeners = new Set<() => void>();

export function setExpress(next: Express) {
  current = next;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

/** Subscribe to the current express-delivery selection. */
export function useExpress(): Express {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
}
