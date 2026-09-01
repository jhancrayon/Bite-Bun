import { useSyncExternalStore } from "react";
import type { CartItem } from "./cart-store";
import { apiCreateOrder, apiListOrders, apiUpdateStatus } from "./order-api";

/** A placed order the customer can track. */
export type Order = {
  id: string;
  items: CartItem[];
  goods: number;
  discount: number;
  shipping: number;
  total: number;
  address: string;
  name: string;
  phone: string;
  placedAt: number;
  /** Minutes the kitchen + driver need end-to-end. */
  etaMinutes: number;
  /** Kết quả cuối của đơn khi được lưu vào lịch sử. */
  status?: "done" | "cancelled";
};

const STORAGE_KEY = "bb-active-order";
const HISTORY_KEY = "bb-order-history";
const HISTORY_LIMIT = 20;

function readInitial(): Order | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}

function readHistory(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

let current: Order | null = readInitial();
let history: Order[] = readHistory();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persistHistory() {
  if (typeof window !== "undefined") localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/** Place (or replace) the active order. */
export function placeOrder(order: Omit<Order, "id" | "placedAt" | "etaMinutes"> & { etaMinutes?: number }) {
  const full: Order = {
    ...order,
    id: `BB-${Math.floor(10000 + Math.random() * 89999)}`,
    placedAt: Date.now(),
    etaMinutes: order.etaMinutes ?? 22,
  };
  current = full;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  emit();
  // Lưu đơn thật lên Supabase (không chặn UI — offline vẫn đặt được nhờ cache).
  void apiCreateOrder(full);
  return full;
}

export function clearOrder() {
  current = null;
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  emit();
}

/** Archive the active order into history (used when the customer marks it done). */
export function completeOrder() {
  if (current) {
    const done: Order = { ...current, status: "done" };
    history = [done, ...history.filter((o) => o.id !== done.id)].slice(0, HISTORY_LIMIT);
    persistHistory();
    void apiUpdateStatus(done.id, "done");
  }
  clearOrder();
}

/** Huỷ đơn đang hoạt động & lưu vào lịch sử với trạng thái đã huỷ. */
export function cancelOrder() {
  if (current) {
    const cancelled: Order = { ...current, status: "cancelled" };
    history = [cancelled, ...history.filter((o) => o.id !== cancelled.id)].slice(0, HISTORY_LIMIT);
    persistHistory();
    void apiUpdateStatus(cancelled.id, "cancelled");
  }
  clearOrder();
}

/**
 * Tải lịch sử đơn thật từ Supabase theo số điện thoại rồi hợp nhất vào
 * lịch sử cục bộ (ưu tiên bản trên server). Gọi khi khách xem "Đơn của tôi".
 */
export async function syncHistoryFromServer(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return;
  const remote = await apiListOrders(digits);
  if (remote.length === 0) return;
  // Chỉ lấy đơn đã kết thúc (done | cancelled) vào lịch sử; đơn đang chạy để riêng.
  const finished = remote.filter((o) => o.status === "done" || o.status === "cancelled");
  const byId = new Map<string, Order>();
  for (const o of history) byId.set(o.id, o);
  for (const o of finished) byId.set(o.id, o);
  history = [...byId.values()].sort((a, b) => b.placedAt - a.placedAt).slice(0, HISTORY_LIMIT);
  persistHistory();
  emit();
}

/** Subscribe to the active order (or null when the customer has none). */
export function useOrder(): Order | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => current,
  );
}

/** Subscribe to past completed orders (most recent first). */
export function useOrderHistory(): Order[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => history,
    () => history,
  );
}
