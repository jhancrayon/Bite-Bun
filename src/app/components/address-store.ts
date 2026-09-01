import { useSyncExternalStore } from "react";

/** Delivery address the customer wants the order sent to. */
const STORAGE_KEY = "bb-delivery-address";
const DEFAULT_ADDRESS = "98 Nguyễn Công Hoan, P. Cầu Kiệu, Q. Phú Nhuận";

function readInitial(): string {
  if (typeof window === "undefined") return DEFAULT_ADDRESS;
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_ADDRESS;
}

let current: string = readInitial();
const listeners = new Set<() => void>();

export function setAddress(address: string) {
  current = address;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, address);
  listeners.forEach((listener) => listener());
}

/** Subscribe to the current delivery address. */
export function useAddress(): string {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
}
