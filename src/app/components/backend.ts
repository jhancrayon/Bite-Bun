import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import type { MenuItem } from "./menu-data";
import type { Reservation } from "./reservation-store";

/** Base URL của Edge Function (proxy giữ key ở máy chủ). */
export const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-bfede902`;

/** Header có anon key; truyền accessToken khi cần xác thực người dùng. */
export function authHeaders(accessToken?: string | null) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken || publicAnonKey}`,
  };
}

// ───────── Auth ─────────
export type ServerProfile = {
  name: string;
  email: string;
  avatar: string;
  points: number;
  tierPoints: number;
  wallet: string[];
};
export type AuthResult = { accessToken: string | null; profile: ServerProfile } | { error: string };

export async function apiRegister(name: string, email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return (await res.json()) as AuthResult;
  } catch {
    return { error: "Không kết nối được máy chủ." };
  }
}

export async function apiLogin(email: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return (await res.json()) as AuthResult;
  } catch {
    return { error: "Không kết nối được máy chủ." };
  }
}

export async function apiMe(accessToken: string): Promise<ServerProfile | null> {
  try {
    const res = await fetch(`${BASE}/auth/me`, { headers: authHeaders(accessToken) });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.profile as ServerProfile) ?? null;
  } catch {
    return null;
  }
}

export async function apiSaveProfile(
  accessToken: string,
  patch: Partial<Pick<ServerProfile, "points" | "tierPoints" | "wallet">>,
): Promise<void> {
  try {
    await fetch(`${BASE}/auth/profile`, {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify(patch),
    });
  } catch {
    /* offline — bỏ qua, sẽ đồng bộ lần sau */
  }
}

// ───────── Menu ─────────
export async function apiGetMenu(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${BASE}/menu`, { headers: authHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.menu) ? (data.menu as MenuItem[]) : [];
  } catch {
    return [];
  }
}

export async function apiSeedMenu(menu: MenuItem[]): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/menu/seed`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ menu }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ───────── Reservations ─────────
export async function apiCreateReservation(r: Reservation): Promise<Reservation | null> {
  try {
    const res = await fetch(`${BASE}/reservations`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(r),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.reservation as Reservation) ?? null;
  } catch {
    return null;
  }
}

export async function apiListReservations(phone: string): Promise<Reservation[]> {
  try {
    const res = await fetch(`${BASE}/reservations?phone=${encodeURIComponent(phone)}`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.reservations) ? (data.reservations as Reservation[]) : [];
  } catch {
    return [];
  }
}

export async function apiCancelReservation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/reservations/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status: "cancelled" }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
