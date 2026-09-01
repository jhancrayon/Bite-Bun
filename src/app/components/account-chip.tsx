import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatVnd, useCart, type CartItem } from "./cart-store";
import { MENU } from "./menu-data";
import { useAuth, VOUCHERS, getTierInfo, type Voucher } from "./auth-store";
import { toggleTheme, useTheme } from "./theme-store";
import { useOrderHistory } from "./order-store";
import { cancelReservation, useReservations } from "./reservation-store";
import { RewardsPanel } from "./rewards-panel";

/** Width of the portaled account menu. */
const MENU_WIDTH = 300;

type PanelId = "rewards" | "vouchers" | "orders" | "bookings" | "payment" | "settings";

const PANEL_TITLE: Record<PanelId, string> = {
  rewards: "Bite & Bun Rewards",
  vouchers: "Đổi voucher",
  orders: "Đơn của tôi",
  bookings: "Lịch đặt bàn",
  payment: "Phương thức thanh toán",
  settings: "Cài đặt",
};

const ORDERS = [
  { id: "BB-2481", date: "Hôm nay · 19:12", status: "Đang giao", items: ["m-bg1", "m-pz1"], total: 234000 },
  { id: "BB-2402", date: "28 Th7 · 12:40", status: "Hoàn tất", items: ["m-ps1", "m-bg6"], total: 168000 },
  { id: "BB-2350", date: "22 Th7 · 20:05", status: "Hoàn tất", items: ["m-bg3"], total: 129000 },
];

const PAYMENTS = [
  { id: "pm-visa", emoji: "💳", label: "Visa •••• 4821", note: "Hết hạn 08/29" },
  { id: "pm-momo", emoji: "📱", label: "Ví MoMo", note: "0901 234 567" },
  { id: "pm-cash", emoji: "💵", label: "Tiền mặt khi nhận", note: "Chuẩn bị đúng số tiền" },
];

const SETTINGS = [
  { id: "st-noti", label: "Thông báo đơn hàng", on: true },
  { id: "st-promo", label: "Email ưu đãi mỗi tuần", on: true },
  { id: "st-loc", label: "Tự động lấy vị trí", on: false },
  { id: "st-dark", label: "Giao diện tối", on: false },
];

const dishName = (id: string) => MENU.find((dish) => dish.id === id)?.name ?? id;

/* ------------------------------- panel body ------------------------------- */

function VoucherPanel() {
  const { points, wallet, redeem } = useAuth();
  const [failed, setFailed] = useState<string | null>(null);

  const tryRedeem = (voucher: Voucher) => {
    if (!redeem(voucher)) {
      setFailed(voucher.id);
      window.setTimeout(() => setFailed(null), 1600);
    }
  };

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[14px] rounded-[18px] px-[20px] py-[16px]" style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 75%)" }}>
        <span className="text-[30px]">🥟</span>
        <span className="flex flex-col leading-tight">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-white tabular-nums">{points.toLocaleString("vi-VN")} Bun</span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#ffdcb0]">Điểm khả dụng · 1.000 vnd = 1 Bun</span>
        </span>
      </div>

      {VOUCHERS.map((voucher) => {
        const owned = wallet.includes(voucher.id);
        const short = failed === voucher.id;
        return (
          <div className="flex items-center gap-[14px] rounded-[16px] bg-[#f3f3f3] px-[16px] py-[13px] ring-1 ring-[#f0e2d2]" key={voucher.id}>
            <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-white text-[21px] shadow-[0px_4px_10px_rgba(205,5,8,0.1)]">{voucher.emoji}</span>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">{voucher.label}</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">{voucher.note}</span>
            </span>
            <button
              className={`shrink-0 cursor-pointer rounded-[11px] px-[16px] py-[9px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] whitespace-nowrap transition-all duration-300 ${
                owned
                  ? "bg-[#e6f4ec] text-[#22a06b]"
                  : short
                    ? "bg-[#ffeceb] text-[#d9161c]"
                    : "bg-[#d9161c] text-white hover:-translate-y-[2px] active:scale-95"
              }`}
              disabled={owned}
              onClick={() => tryRedeem(voucher)}
              type="button"
            >
              {owned ? "Đã có ✓" : short ? "Thiếu điểm" : `${voucher.cost} Bun`}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function OrdersPanel() {
  return (
    <div className="flex flex-col gap-[12px]">
      {ORDERS.map((order) => (
        <div className="flex flex-col gap-[8px] rounded-[16px] bg-[#f3f3f3] px-[18px] py-[15px] ring-1 ring-[#f0e2d2]" key={order.id}>
          <div className="flex items-center gap-[10px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">#{order.id}</span>
            <span
              className={`rounded-full px-[11px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] ${
                order.status === "Đang giao" ? "bg-[#fff1cf] text-[#a86800]" : "bg-[#e6f4ec] text-[#22a06b]"
              }`}
            >
              {order.status}
            </span>
            <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#d9161c]">{formatVnd(order.total)}</span>
          </div>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">{order.date}</span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#6b584c]">{order.items.map(dishName).join(" · ")}</span>
        </div>
      ))}
    </div>
  );
}

function BookingsPanel() {
  const bookings = useReservations();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-[10px] py-[36px] text-center">
        <span className="text-[46px]">🍽️</span>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#3b2a20]">Chưa có lịch đặt bàn</span>
        <span className="max-w-[280px] font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">
          Đặt bàn ở mục “Đặt bàn” trên trang chủ để giữ chỗ trước nhé.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {bookings.map((b) => {
        const cancelled = b.status === "cancelled";
        const confirming = confirmId === b.id;
        return (
          <div className="flex flex-col gap-[9px] rounded-[16px] bg-[#f3f3f3] px-[18px] py-[15px] ring-1 ring-[#f0e2d2]" key={b.id}>
            <div className="flex items-center gap-[10px]">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">#{b.id}</span>
              <span
                className={`rounded-full px-[11px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] ${
                  cancelled ? "bg-[#ffeceb] text-[#d9161c]" : "bg-[#e6f4ec] text-[#22a06b]"
                }`}
              >
                {cancelled ? "✕ Đã huỷ" : "✓ Đã xác nhận"}
              </span>
              <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">👥 {b.guests}</span>
            </div>
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#6b584c]">{b.branchName}</span>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">
              📅 {b.date} · 🕒 {b.time} · {b.occasion}
              {b.note ? ` · “${b.note}”` : ""}
            </span>

            {!cancelled &&
              (confirming ? (
                <div className="mt-[2px] flex items-center gap-[8px]">
                  <span className="flex-1 font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#d9161c]">Huỷ lịch này?</span>
                  <button
                    className="cursor-pointer rounded-[10px] bg-[#f3f3f3] px-[14px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#6b584c] ring-1 ring-[#e0d3c6] transition-colors hover:bg-white"
                    onClick={() => setConfirmId(null)}
                    type="button"
                  >
                    Giữ lại
                  </button>
                  <button
                    className="cursor-pointer rounded-[10px] bg-[#d9161c] px-[14px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-white transition-transform hover:-translate-y-px active:translate-y-0"
                    onClick={() => {
                      cancelReservation(b.id);
                      setConfirmId(null);
                    }}
                    type="button"
                  >
                    Xác nhận huỷ
                  </button>
                </div>
              ) : (
                <button
                  className="mt-[2px] cursor-pointer self-start rounded-[10px] border border-[#e6b9ba] px-[14px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#d9161c] transition-colors hover:bg-[#ffeceb]"
                  onClick={() => setConfirmId(b.id)}
                  type="button"
                >
                  Huỷ đặt bàn
                </button>
              ))}
          </div>
        );
      })}
    </div>
  );
}

function PaymentPanel() {
  const [active, setActive] = useState("pm-visa");

  return (
    <div className="flex flex-col gap-[12px]">
      {PAYMENTS.map((method) => (
        <button
          className={`flex cursor-pointer items-center gap-[14px] rounded-[16px] px-[16px] py-[13px] text-left ring-1 transition-all duration-300 ${
            active === method.id ? "bg-[#f6ece9] ring-[#d9161c]" : "bg-[#f3f3f3] ring-[#f0e2d2] hover:bg-[#f3f3f3]"
          }`}
          key={method.id}
          onClick={() => setActive(method.id)}
          type="button"
        >
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[13px] bg-white text-[20px] shadow-[0px_4px_10px_rgba(205,5,8,0.1)]">{method.emoji}</span>
          <span className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">{method.label}</span>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">{method.note}</span>
          </span>
          <span
            className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
              active === method.id ? "border-[#d9161c] bg-[#d9161c] text-white" : "border-[#dcc9b8]"
            }`}
          >
            {active === method.id && (
              <svg className="size-[12px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                <path d="m5 13 4.5 4.5L19 7" />
              </svg>
            )}
          </span>
        </button>
      ))}

      <button className="cursor-pointer rounded-[14px] border-2 border-dashed border-[#dcc9b8] py-[13px] font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#a8927f] transition-colors duration-300 hover:border-[#d9161c] hover:text-[#d9161c]" type="button">
        + Thêm thẻ mới
      </button>
    </div>
  );
}

function SettingsPanel() {
  const theme = useTheme();
  const [state, setState] = useState(() => Object.fromEntries(SETTINGS.map((row) => [row.id, row.on])));

  return (
    <div className="flex flex-col gap-[10px]">
      {SETTINGS.map((row) => {
        /* The "dark theme" row drives the real app-wide theme store; every
           other row is a local mock toggle. */
        const isTheme = row.id === "st-dark";
        const on = isTheme ? theme === "dark" : state[row.id];
        return (
          <button
            className="flex cursor-pointer items-center gap-[14px] rounded-[16px] bg-[#f3f3f3] px-[18px] py-[14px] text-left ring-1 ring-[#f0e2d2] transition-colors duration-300 hover:bg-[#f3f3f3]"
            key={row.id}
            onClick={() => (isTheme ? toggleTheme() : setState((prev) => ({ ...prev, [row.id]: !prev[row.id] })))}
            type="button"
          >
            <span className="flex items-center gap-[9px]">
              {isTheme && <span className="text-[18px]">{on ? "🌙" : "☀️"}</span>}
              <span className="flex-1 font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#3b2a20]">{row.label}</span>
            </span>
            <span className={`ml-auto flex h-[26px] w-[48px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-300 ${on ? "bg-[#22a06b]" : "bg-[#dcc9b8]"}`}>
              <span className={`size-[20px] rounded-full bg-white transition-transform duration-300 ${on ? "translate-x-[22px]" : ""}`} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- chip ---------------------------------- */

/**
 * Signed-in account pill: dog avatar + display name, with a menu for loyalty
 * points, vouchers, orders, payment methods and settings.
 */
export function AccountChip({ big }: { big?: boolean }) {
  const { user, signOut, points, tierPoints, wallet } = useAuth();
  const tier = getTierInfo(tierPoints).current;
  const { addMany, setOpen: openCart } = useCart();
  const history = useOrderHistory();
  const bookings = useReservations();
  const activeBookings = bookings.filter((b) => b.status === "confirmed").length;
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });

  /* The chip lives inside a CSS-transformed stage, so the menu is portaled to
     the body and positioned from the button's viewport rect. */
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      setAnchor({ top: rect.bottom + 10, left: Math.max(12, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 12)) });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  if (!user) return null;

  /* Build the line items of the most recent order: prefer the real order
     history, otherwise fall back to the latest sample order. */
  const lastReorder: CartItem[] = (() => {
    if (history.length > 0) return history[0].items.map((line) => ({ ...line }));
    const sample = ORDERS[0];
    if (!sample) return [];
    return sample.items
      .map((id) => MENU.find((dish) => dish.id === id))
      .filter((dish): dish is (typeof MENU)[number] => Boolean(dish))
      .map((dish) => ({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, qty: 1 }));
  })();

  const reorderCount = lastReorder.reduce((sum, line) => sum + line.qty, 0);

  const runReorder = () => {
    if (lastReorder.length === 0) return;
    addMany(lastReorder);
    setOpen(false);
    openCart(true);
  };

  const ROWS: { id: PanelId; icon: string; label: string; hint?: string }[] = [
    { id: "rewards", icon: "🏆", label: "Bite & Bun Rewards", hint: `Hạng ${tier.label}` },
    { id: "vouchers", icon: "🎟️", label: "Đổi voucher", hint: wallet.length > 0 ? `${wallet.length} đã đổi` : undefined },
    { id: "orders", icon: "🧾", label: "Đơn của tôi", hint: `${ORDERS.length} đơn` },
    { id: "bookings", icon: "🍽️", label: "Lịch đặt bàn", hint: activeBookings > 0 ? `${activeBookings} lịch` : undefined },
    { id: "payment", icon: "💳", label: "Phương thức thanh toán" },
    { id: "settings", icon: "⚙️", label: "Cài đặt" },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        className={`flex cursor-pointer items-center rounded-[999px] border border-white/25 bg-white/12 transition-all duration-300 hover:bg-white/25 ${
          big ? "gap-[11px] py-[6px] pl-[6px] pr-[18px]" : "gap-[9px] py-[4px] pl-[4px] pr-[14px]"
        }`}
        onClick={() => setOpen((v) => !v)}
        ref={btnRef}
        type="button"
      >
        <img alt={user.name} className={`${big ? "size-[46px]" : "size-[34px]"} shrink-0 rounded-full object-cover ring-2 ring-[#f4de79]`} src={user.avatar} />
        <span className="flex flex-col items-start leading-tight">
          <span className={`font-['Source_Sans_Pro:Bold',sans-serif] whitespace-nowrap text-[#f3f3f3] ${big ? "text-[19px]" : "text-[16px]"}`}>{user.name}</span>
          <span className={`font-['Source_Sans_Pro:Bold',sans-serif] whitespace-nowrap text-[#f4de79] ${big ? "text-[14px]" : "text-[12px]"}`}>
            {tier.emoji} Hạng {tier.label} · {points.toLocaleString("vi-VN")} Bun
          </span>
        </span>
        <svg
          className={`shrink-0 text-[#f4de79] transition-transform duration-300 ${open ? "rotate-180" : ""} ${big ? "size-[17px]" : "size-[15px]"}`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.6"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[95] flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_30px_60px_rgba(74,0,1,0.4)] [animation:dish-in_0.26s_cubic-bezier(0.16,1,0.3,1)_both]"
            ref={menuRef}
            style={{ top: anchor.top, left: anchor.left, width: MENU_WIDTH }}
          >
          {/* Identity */}
          <div
            className="relative z-[2] flex items-center gap-[11px] px-[16px] py-[14px] shadow-[0px_6px_16px_rgba(74,0,1,0.25)]"
            style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #d9161c 55%, #fa6932 120%)" }}
          >
            <img alt="" className="size-[46px] rounded-full object-cover ring-2 ring-[#f4de79]" src={user.avatar} />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white">{user.name}</span>
              <span className="truncate font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#ffdcb0]">{user.email}</span>
            </span>
          </div>

          {/* Points */}
          <button
            className="flex cursor-pointer items-center gap-[12px] border-b border-[#f3e7db] bg-[#f3f3f3] px-[16px] py-[14px] text-left transition-colors duration-300 hover:bg-[#ffeccd]"
            onClick={() => {
              setPanel("rewards");
              setOpen(false);
            }}
            type="button"
          >
            <span className="text-[26px]">{tier.emoji}</span>
            <span className="flex flex-col leading-tight">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#d9161c] tabular-nums">{points.toLocaleString("vi-VN")} Bun</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">Hạng {tier.label} · bấm xem Rewards</span>
            </span>
            <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#d9161c]">›</span>
          </button>

          {/* 1-click re-order of the most recent combo */}
          <button
            className={`flex items-center gap-[12px] border-b border-[#f3e7db] px-[16px] py-[13px] text-left transition-colors duration-200 ${
              reorderCount > 0 ? "cursor-pointer hover:bg-[#ffeccd]" : "cursor-not-allowed opacity-55"
            }`}
            disabled={reorderCount === 0}
            onClick={runReorder}
            type="button"
          >
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[12px] text-[19px] text-white shadow-[0px_5px_12px_rgba(205,5,8,0.28)]" style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 75%)" }}>
              ⚡
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#3b2a20]">Đặt lại đơn 1 chạm</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">
                {reorderCount > 0 ? `Nạp lại combo gần nhất · ${reorderCount} món` : "Chưa có đơn để đặt lại"}
              </span>
            </span>
            {reorderCount > 0 && <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#d9161c]">›</span>}
          </button>

          {ROWS.map((row) => (
            <button
              className="flex cursor-pointer items-center gap-[11px] px-[16px] py-[12px] text-left font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#4a3b33] transition-colors duration-200 hover:bg-[#f3f3f3]"
              key={row.id}
              onClick={() => {
                setPanel(row.id);
                setOpen(false);
              }}
              type="button"
            >
              <span className="text-[17px]">{row.icon}</span>
              {row.label}
              {row.hint && <span className="ml-auto font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#a8927f]">{row.hint}</span>}
            </button>
          ))}

          <button
            className="flex cursor-pointer items-center gap-[11px] border-t border-[#f3e7db] px-[16px] py-[12px] text-left font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c] transition-colors duration-200 hover:bg-[#ffeceb]"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            type="button"
          >
            <span className="text-[17px]">↩</span>
            Đăng xuất
          </button>
          </div>,
          document.body,
        )}

      {panel &&
        createPortal(
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-[12px] sm:p-[24px]">
            <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-[#1a0507]/70 backdrop-blur-[5px]" onClick={() => setPanel(null)} type="button" />

            <div className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_40px_90px_rgba(122,0,2,0.45)] [animation:dish-in_0.3s_cubic-bezier(0.16,1,0.3,1)_both] sm:max-h-[86vh] ${panel === "rewards" ? "sm:w-[560px]" : "sm:w-[520px]"}`}>
              <div className="flex shrink-0 items-center justify-between px-[24px] py-[18px]" style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #d9161c 55%, #fa6932 120%)" }}>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-white">{PANEL_TITLE[panel]}</span>
                <button
                  className="flex size-[34px] cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/30"
                  onClick={() => setPanel(null)}
                  type="button"
                >
                  <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path d="M5 5l14 14M19 5 5 19" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto px-[24px] py-[22px]">
                {panel === "rewards" && <RewardsPanel />}
                {panel === "vouchers" && <VoucherPanel />}
                {panel === "orders" && <OrdersPanel />}
                {panel === "bookings" && <BookingsPanel />}
                {panel === "payment" && <PaymentPanel />}
                {panel === "settings" && <SettingsPanel />}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
