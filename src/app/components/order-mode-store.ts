import { useSyncExternalStore } from "react";

/** Cách nhận hàng khách chọn — dùng chung toàn web (thanh đặt món, nav, thanh toán). */
export type OrderMode = "delivery" | "pickup";

const STORAGE_KEY = "bb-order-mode";

function readInitial(): OrderMode {
  if (typeof window === "undefined") return "delivery";
  return localStorage.getItem(STORAGE_KEY) === "pickup" ? "pickup" : "delivery";
}

let current: OrderMode = readInitial();
const listeners = new Set<() => void>();

export function setOrderMode(mode: OrderMode) {
  if (mode === current) return;
  current = mode;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, mode);
  listeners.forEach((listener) => listener());
}

/** Subscribe to the current order mode (delivery vs pickup). */
export function useOrderMode(): OrderMode {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
}
