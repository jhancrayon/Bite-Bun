import { useSyncExternalStore } from "react";

/** Một lượt đặt bàn của khách. */
export type Reservation = {
  id: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  occasion: string;
  note: string;
  createdAt: number;
  status: "confirmed" | "cancelled";
};

const STORAGE_KEY = "bb-reservations";
const LIMIT = 20;

function readAll(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    return [];
  }
}

let list: Reservation[] = readAll();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** Tạo một lượt đặt bàn mới, trả về bản ghi đầy đủ. */
export function addReservation(input: Omit<Reservation, "id" | "createdAt" | "status">) {
  const full: Reservation = {
    ...input,
    id: `BK-${Math.floor(1000 + Math.random() * 8999)}`,
    createdAt: Date.now(),
    status: "confirmed",
  };
  list = [full, ...list].slice(0, LIMIT);
  persist();
  emit();
  return full;
}

/** Huỷ một lượt đặt bàn theo mã. */
export function cancelReservation(id: string) {
  list = list.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r));
  persist();
  emit();
}

export function useReservations(): Reservation[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => list,
    () => list,
  );
}
