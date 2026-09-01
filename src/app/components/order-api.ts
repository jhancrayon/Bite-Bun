import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import type { Order } from "./order-store";

/** Base URL của Edge Function (proxy giữ key ở máy chủ). */
const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-bfede902`;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

/** Gửi đơn mới lên Supabase. Trả về đơn đã lưu, hoặc null nếu lỗi mạng. */
export async function apiCreateOrder(order: Order): Promise<Order | null> {
  try {
    const res = await fetch(`${BASE}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(order),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.order as Order) ?? null;
  } catch {
    return null;
  }
}

/** Cập nhật trạng thái đơn trên máy chủ (done | cancelled | active). */
export async function apiUpdateStatus(
  id: string,
  status: "active" | "done" | "cancelled",
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/orders/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Tra cứu 1 đơn theo id (theo dõi đơn thời gian thực). */
export async function apiGetOrder(id: string): Promise<Order | null> {
  try {
    const res = await fetch(`${BASE}/orders/${id}`, { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.order as Order) ?? null;
  } catch {
    return null;
  }
}

/** Lấy lịch sử đơn theo số điện thoại từ Supabase. */
export async function apiListOrders(phone: string): Promise<Order[]> {
  try {
    const res = await fetch(`${BASE}/orders?phone=${encodeURIComponent(phone)}`, { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.orders) ? (data.orders as Order[]) : [];
  } catch {
    return [];
  }
}
