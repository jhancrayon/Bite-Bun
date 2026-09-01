import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthTab = "login" | "register";

export type AuthUser = { name: string; email: string; avatar: string };

/** Default profile picture shown after signing in. */
export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?auto=format&fit=crop&w=200&q=80";

/** Display name used for the signed-in demo account. */
export const DEFAULT_NAME = "Nam Thuận";

/** Email hiển thị cho tài khoản demo khi đăng nhập nhanh. */
export const DEFAULT_EMAIL = "Thuanpro0809@gmail.com";

/** Loyalty points ("Bun") the demo account starts with (số dư đổi quà). */
export const START_POINTS = 1250;

/** Tổng Bun đã tích lũy trọn đời — quyết định hạng, không giảm khi đổi quà. */
export const START_TIER_POINTS = 1850;

export type Tier = {
  id: "bronze" | "silver" | "gold";
  label: string;
  min: number;
  emoji: string;
  /** Màu chủ đạo cho thẻ hạng. */
  gradient: string;
  perks: string[];
};

/** Các hạng thành viên Bite & Bun Rewards. */
export const TIERS: Tier[] = [
  { id: "bronze", label: "Đồng", min: 0, emoji: "🥉", gradient: "linear-gradient(120deg, #b87333 0%, #e0a06a 55%, #8a5a2b 100%)", perks: ["Tích 1 Bun mỗi 1.000đ", "Ưu đãi sinh nhật"] },
  { id: "silver", label: "Bạc", min: 1000, emoji: "🥈", gradient: "linear-gradient(120deg, #8e9aa6 0%, #d7dee6 50%, #7b8794 100%)", perks: ["Tích x1.25 Bun", "Freeship 2 đơn/tháng", "Quà mốc chi tiêu"] },
  { id: "gold", label: "Vàng", min: 2500, emoji: "🥇", gradient: "linear-gradient(120deg, #d99e1c 0%, #ffe58a 48%, #c9871a 100%)", perks: ["Tích x1.5 Bun", "Freeship không giới hạn", "Ưu tiên bếp giờ cao điểm", "Quà VIP hàng quý"] },
];

/** Trả về hạng hiện tại + hạng kế tiếp theo tổng Bun tích lũy. */
export function getTierInfo(tierPoints: number) {
  let index = 0;
  for (let i = 0; i < TIERS.length; i++) {
    if (tierPoints >= TIERS[i].min) index = i;
  }
  const current = TIERS[index];
  const next = TIERS[index + 1] ?? null;
  const spanFrom = current.min;
  const spanTo = next ? next.min : current.min;
  const progress = next ? Math.min(1, (tierPoints - spanFrom) / (spanTo - spanFrom)) : 1;
  const toNext = next ? Math.max(0, next.min - tierPoints) : 0;
  return { index, current, next, progress, toNext };
}

/**
 * Cách một voucher giảm tiền khi thanh toán:
 * - "ship": miễn phí giao hàng
 * - "percent": giảm theo % (kèm `cap` là mức giảm tối đa)
 * - "amount": giảm số tiền cố định
 * `min` là giá trị đơn tối thiểu (tiền món) để được dùng.
 */
export type VoucherDiscount = { kind: "ship" | "percent" | "amount"; value: number; cap?: number; min?: number };

export type Voucher = { id: string; label: string; note: string; cost: number; emoji: string; discount: VoucherDiscount };

export const VOUCHERS: Voucher[] = [
  { id: "v-ship", label: "Miễn phí giao hàng", note: "Đơn từ 100.000 vnd", cost: 200, emoji: "🛵", discount: { kind: "ship", value: 0, min: 100000 } },
  { id: "v-15", label: "Giảm 15%", note: "Tối đa 40.000 vnd", cost: 450, emoji: "🎟️", discount: { kind: "percent", value: 15, cap: 40000 } },
  { id: "v-drink", label: "Tặng 1 nước ngọt", note: "Áp dụng mọi đơn", cost: 300, emoji: "🥤", discount: { kind: "amount", value: 18000 } },
  { id: "v-burger", label: "Burger 0 đồng", note: "Cheese Burger, đơn từ 250k", cost: 900, emoji: "🍔", discount: { kind: "amount", value: 89000, min: 250000 } },
];

type AuthValue = {
  open: boolean;
  tab: AuthTab;
  user: AuthUser | null;
  points: number;
  /** Tổng Bun tích lũy trọn đời — dùng để xếp hạng thành viên. */
  tierPoints: number;
  /** Voucher ids the user has redeemed. */
  wallet: string[];
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setTab: (tab: AuthTab) => void;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  /** Spends points and adds the voucher to the wallet. Returns false if short on points. */
  redeem: (voucher: Voucher) => boolean;
  /** Tiêu một voucher trong ví sau khi đã áp dụng cho đơn (xoá khỏi ví). */
  useVoucher: (voucherId: string) => void;
  /** Cộng Bun khi mua hàng (số dư đổi quà + tổng tích lũy trọn đời). Trả về số Bun vừa cộng. */
  earn: (orderTotal: number) => number;
};

/** Tỉ lệ tích điểm: 1.000đ = 1 Bun. */
export const BUN_PER_VND = 1000;

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [points, setPoints] = useState(START_POINTS);
  const [tierPoints, setTierPoints] = useState(START_TIER_POINTS);
  const [wallet, setWallet] = useState<string[]>([]);

  const value = useMemo<AuthValue>(
    () => ({
      open,
      tab,
      user,
      points,
      tierPoints,
      wallet,
      openAuth: (next) => {
        if (next) setTab(next);
        setOpen(true);
      },
      closeAuth: () => setOpen(false),
      setTab,
      signIn: (next) => {
        setUser(next);
        setOpen(false);
      },
      signOut: () => setUser(null),
      redeem: (voucher) => {
        if (points < voucher.cost) return false;
        setPoints((p) => p - voucher.cost);
        setWallet((w) => (w.includes(voucher.id) ? w : [...w, voucher.id]));
        return true;
      },
      useVoucher: (voucherId) => setWallet((w) => w.filter((id) => id !== voucherId)),
      earn: (orderTotal) => {
        const gained = Math.max(0, Math.floor(orderTotal / BUN_PER_VND));
        if (gained > 0) {
          setPoints((p) => p + gained);
          setTierPoints((t) => t + gained);
        }
        return gained;
      },
    }),
    [open, tab, user, points, tierPoints, wallet],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
