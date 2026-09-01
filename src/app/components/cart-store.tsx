import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  /** Loại món (burger, pizza…) — dùng cho khuyến mãi Mua 1 Tặng 1. */
  category?: string;
};

export const SHIPPING_FEE = 15000;
export const FREE_SHIP_FROM = 200000;

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  /** Số burger được tặng miễn phí theo ưu đãi Mua 1 Tặng 1. */
  bogoFreeCount: number;
  /** Số tiền được giảm nhờ ưu đãi Mua 1 Tặng 1 burger. */
  bogoDiscount: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  /** Add several lines at once (e.g. 1-click re-order of a past combo). */
  addMany: (lines: CartItem[]) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function formatVnd(value: number) {
  return `${value.toLocaleString("vi-VN")} vnd`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = count === 0 || subtotal >= FREE_SHIP_FROM ? 0 : SHIPPING_FEE;

    // Mua 1 Tặng 1 burger: cứ mỗi 2 chiếc thì chiếc rẻ hơn được miễn phí.
    const burgerUnits = items
      .filter((item) => item.category === "burger")
      .flatMap((item) => Array<number>(item.qty).fill(item.price))
      .sort((a, b) => a - b);
    const bogoFreeCount = Math.floor(burgerUnits.length / 2);
    const bogoDiscount = burgerUnits.slice(0, bogoFreeCount).reduce((sum, price) => sum + price, 0);

    return {
      items,
      count,
      subtotal,
      shipping,
      bogoFreeCount,
      bogoDiscount,
      total: subtotal + shipping - bogoDiscount,
      open,
      setOpen,
      add: (item) =>
        setItems((prev) => {
          const found = prev.find((entry) => entry.id === item.id);
          if (found) {
            return prev.map((entry) => (entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry));
          }
          return [...prev, { ...item, qty: 1 }];
        }),
      addMany: (lines) =>
        setItems((prev) => {
          const next = [...prev];
          for (const line of lines) {
            const idx = next.findIndex((entry) => entry.id === line.id);
            if (idx >= 0) {
              next[idx] = { ...next[idx], qty: next[idx].qty + line.qty };
            } else {
              next.push({ ...line });
            }
          }
          return next;
        }),
      increase: (id) => setItems((prev) => prev.map((entry) => (entry.id === id ? { ...entry, qty: entry.qty + 1 } : entry))),
      decrease: (id) =>
        setItems((prev) =>
          prev.flatMap((entry) => {
            if (entry.id !== id) return [entry];
            return entry.qty > 1 ? [{ ...entry, qty: entry.qty - 1 }] : [];
          }),
        ),
      remove: (id) => setItems((prev) => prev.filter((entry) => entry.id !== id)),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
