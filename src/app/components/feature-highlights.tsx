import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { formatVnd, useCart, FREE_SHIP_FROM } from "./cart-store";
import { useMenuFilter } from "./menu-filter";
import { cancelOrder, completeOrder, syncHistoryFromServer, useOrder, useOrderHistory } from "./order-store";
import { useAddress } from "./address-store";
import { setExpress as saveExpress } from "./express-store";

type PanelId = "promo" | "track" | "express";

const PROMOS = [
  { code: "BITE20", title: "Giảm 20% toàn menu", note: "Đơn từ 150.000 vnd · tối đa 60.000 vnd", expires: "Hết hạn 23:59 hôm nay", min: 150000 },
  { code: "FREESHIP", title: "Miễn phí giao hàng", note: "Đơn từ 200.000 vnd · bán kính 8 km", expires: "Áp dụng cả tuần", min: 200000 },
  { code: "COMBO2", title: "Mua 1 tặng 1 burger", note: "Áp dụng cho Cheese Burger & Burger Gà Cay", expires: "Từ 14:00 – 17:00", min: 0 },
  { code: "NEWBIE", title: "Giảm 50.000 vnd đơn đầu", note: "Dành cho khách hàng mới", expires: "Dùng 1 lần", min: 0 },
];

const TRACK_STEPS = [
  { label: "Đã xác nhận đơn", detail: "Bếp đã nhận đơn của bạn" },
  { label: "Bếp đang chế biến", detail: "Món được nấu theo đơn, nóng hổi" },
  { label: "Tài xế đã lấy hàng", detail: "Anh Tuấn · 59H2-284.16" },
  { label: "Đang giao đến bạn", detail: "Còn 1,2 km · sắp tới nơi" },
  { label: "Giao thành công", detail: "Chúc bạn ngon miệng!" },
];

const EXPRESS_AREAS = [
  { area: "Quận Phú Nhuận", eta: "18 phút", fee: 15000 },
  { area: "Quận 1 · Quận 3", eta: "22 phút", fee: 19000 },
  { area: "Quận Bình Thạnh", eta: "25 phút", fee: 22000 },
  { area: "Quận Gò Vấp", eta: "30 phút", fee: 26000 },
];

const CARDS: { id: PanelId; emoji: string; title: string; sub: string; cta: string }[] = [
  { id: "promo", emoji: "🎁", title: "Khuyến mãi", sub: "4 mã đang chạy hôm nay", cta: "Xem mã giảm giá" },
  { id: "track", emoji: "📍", title: "Theo dõi đơn", sub: "Cập nhật trực tiếp từng bước", cta: "Theo dõi đơn của tôi" },
  { id: "express", emoji: "🛵", title: "Giao hàng siêu tốc", sub: "Trung bình 22 phút tới cửa", cta: "Kiểm tra khu vực" },
];

/* ------------------------------ Promo panel ------------------------------ */

function PromoPanel() {
  const [copied, setCopied] = useState<string | null>(null);
  const [voucher, setVoucher] = useState("");
  const [applied, setApplied] = useState<{ ok: boolean; msg: string } | null>(null);
  const { openMenu } = useMenuFilter();
  const { subtotal, count, setOpen } = useCart();

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(code);
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1800);
  };

  const applyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (!code) {
      setApplied({ ok: false, msg: "Bạn hãy nhập mã voucher nhé!" });
      return;
    }
    const promo = PROMOS.find((p) => p.code === code);
    if (!promo) {
      setApplied({ ok: false, msg: `Mã "${code}" không tồn tại hoặc đã hết hạn.` });
      return;
    }
    if (subtotal < promo.min) {
      setApplied({ ok: false, msg: `Cần mua thêm ${formatVnd(promo.min - subtotal)} để dùng mã ${code}.` });
      return;
    }
    setApplied({ ok: true, msg: `✓ Áp dụng ${code} thành công — ${promo.title}!` });
    setVoucher(code);
  };

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Live cart context */}
      <div className="flex items-center gap-[12px] rounded-[16px] bg-[#f6ece9] px-[18px] py-[13px] ring-1 ring-[#f0e2d2]">
        <span className="text-[22px]">🛒</span>
        <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#7a6a66]">
          Giỏ hiện tại: <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#7f292a]">{count} món · {formatVnd(subtotal)}</span>
        </span>
      </div>

      {/* Nhập voucher */}
      <div className="flex flex-col gap-[10px] rounded-[18px] bg-white p-[16px] ring-1 ring-[#f0e2d2]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[18px]">🏷️</span>
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">Nhập mã voucher</span>
        </div>
        <div className="flex items-center gap-[10px]">
          <input
            className="min-w-0 flex-1 rounded-[12px] border-2 border-dashed border-[#e6dccf] bg-[#faf7f2] px-[16px] py-[12px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tracking-[1px] text-[#7f292a] uppercase outline-none transition-colors placeholder:font-['Source_Sans_Pro:Regular',sans-serif] placeholder:tracking-normal placeholder:normal-case placeholder:text-[#b3a89e] focus:border-[#fa6932]"
            onChange={(e) => {
              setVoucher(e.target.value);
              if (applied) setApplied(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
            placeholder="Nhập mã, ví dụ BITE20"
            type="text"
            value={voucher}
          />
          <button
            className="shrink-0 cursor-pointer rounded-[12px] px-[22px] py-[12px] text-white shadow-[0px_8px_18px_rgba(205,5,8,0.26)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
            onClick={applyVoucher}
            style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
            type="button"
          >
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px]">Áp dụng</span>
          </button>
        </div>
        {applied && (
          <span
            className={`font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] ${applied.ok ? "text-[#22a06b]" : "text-[#d9161c]"}`}
          >
            {applied.msg}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        {PROMOS.map((promo) => {
          const eligible = subtotal >= promo.min;
          const missing = Math.max(0, promo.min - subtotal);
          const ratio = promo.min > 0 ? Math.min(1, subtotal / promo.min) : 1;
          return (
            <div
              className={`group relative flex flex-col gap-[10px] overflow-hidden rounded-[18px] p-[16px] ring-1 transition-all duration-300 hover:-translate-y-[3px] ${
                eligible ? "bg-[#fff8ec] ring-[#f6e0c2] hover:ring-[#f4de79]" : "bg-[#f7f4f0] ring-[#ece4db]"
              }`}
              key={promo.code}
            >
              <div className="flex items-center gap-[14px]">
                <span
                  className="flex size-[54px] shrink-0 items-center justify-center rounded-[14px] text-[26px] text-white"
                  style={{ backgroundImage: "linear-gradient(135deg, #fa6932 0%, #d9161c 100%)" }}
                >
                  %
                </span>
                <div className="flex min-w-0 flex-col leading-tight">
                  <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#212121]">{promo.title}</p>
                  <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#8a8a8a]">{promo.note}</p>
                  <p className="mt-[4px] font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#d9161c]">{promo.expires}</p>
                </div>
                <button
                  className={`ml-auto shrink-0 cursor-pointer rounded-[10px] border-2 border-dashed px-[14px] py-[9px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] transition-all duration-300 ${
                    copied === promo.code
                      ? "border-[#22a06b] bg-[#22a06b] text-white"
                      : "border-[#f4de79] bg-white text-[#d9161c] hover:bg-[#f4de79] hover:text-[#7f292a]"
                  }`}
                  onClick={() => copy(promo.code)}
                  type="button"
                >
                  {copied === promo.code ? "Đã chép ✓" : promo.code}
                </button>
              </div>

              {/* Eligibility */}
              {promo.min > 0 ? (
                <div className="flex flex-col gap-[5px]">
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#efe6da]">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${ratio * 100}%`, backgroundImage: eligible ? "linear-gradient(90deg, #22a06b, #1c8f5d)" : "linear-gradient(90deg, #f4de79, #fa6932)" }}
                    />
                  </div>
                  <span className={`font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] ${eligible ? "text-[#22a06b]" : "text-[#a86800]"}`}>
                    {eligible ? "✓ Đủ điều kiện áp dụng" : `Mua thêm ${formatVnd(missing)} để dùng mã`}
                  </span>
                </div>
              ) : (
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#22a06b]">✓ Áp dụng cho mọi đơn</span>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="mx-auto flex cursor-pointer items-center gap-[10px] rounded-[14px] px-[26px] py-[13px] text-white shadow-[0px_10px_22px_rgba(205,5,8,0.28)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
        onClick={() => (count > 0 ? setOpen(true) : openMenu("all"))}
        style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
        type="button"
      >
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">{count > 0 ? "Mở giỏ để nhập mã & thanh toán" : "Đặt món để dùng mã ngay"}</span>
      </button>
    </div>
  );
}

/* ------------------------------ Track panel ------------------------------ */

/** Faux delivery map: restaurant → home route with the driver moving along it. */
function DeliveryMap({ progress }: { progress: number }) {
  // Route points (in the 0–100 viewBox space). Driver sits at `progress` along it.
  const path = "M 40 150 C 90 150 90 90 150 90 C 210 90 210 40 280 40";
  const at = Math.min(1, Math.max(0, progress));
  // Sample a few control points to approximate the position along the curve.
  const pts = [
    { x: 40, y: 150 },
    { x: 95, y: 118 },
    { x: 150, y: 90 },
    { x: 215, y: 62 },
    { x: 280, y: 40 },
  ];
  const seg = at * (pts.length - 1);
  const i = Math.min(pts.length - 2, Math.floor(seg));
  const f = seg - i;
  const dx = pts[i].x + (pts[i + 1].x - pts[i].x) * f;
  const dy = pts[i].y + (pts[i + 1].y - pts[i].y) * f;

  return (
    <div className="relative overflow-hidden rounded-[18px] ring-1 ring-[#e7ddd2]" style={{ backgroundColor: "#eef3ec" }}>
      <svg className="h-[190px] w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 190">
        <defs>
          {/* Soft shadow for pins/markers, Grab-style */}
          <filter id="mapShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#1f3d2e" floodOpacity="0.28" />
          </filter>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fa6932" />
            <stop offset="100%" stopColor="#d9161c" />
          </linearGradient>
        </defs>

        {/* Land base */}
        <rect fill="#eaf1e7" height="190" width="320" />

        {/* River running through the map */}
        <path d="M -10 20 C 60 40 40 90 120 110 C 190 128 180 178 260 200" fill="none" stroke="#bfe0ea" strokeWidth="26" strokeLinecap="round" />
        <path d="M -10 20 C 60 40 40 90 120 110 C 190 128 180 178 260 200" fill="none" stroke="#d3ecf2" strokeWidth="14" strokeLinecap="round" />

        {/* Park / green block */}
        <rect x="196" y="8" width="70" height="46" rx="8" fill="#cfe6bf" />
        <circle cx="214" cy="24" r="5" fill="#a9d38c" />
        <circle cx="232" cy="34" r="6" fill="#a9d38c" />
        <circle cx="250" cy="20" r="5" fill="#a9d38c" />

        {/* City blocks (buildings) */}
        {[
          { x: 8, y: 12, w: 40, h: 30 },
          { x: 8, y: 96, w: 34, h: 40 },
          { x: 8, y: 150, w: 44, h: 30 },
          { x: 108, y: 8, w: 46, h: 34 },
          { x: 118, y: 118, w: 40, h: 40 },
          { x: 200, y: 118, w: 48, h: 44 },
          { x: 276, y: 96, w: 40, h: 34 },
          { x: 276, y: 150, w: 40, h: 34 },
        ].map((b) => (
          <rect key={`b${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="5" fill="#dbe6d5" stroke="#cfddc8" strokeWidth="1" />
        ))}

        {/* Road network — casing + fill for a real map feel */}
        {[
          "M 0 68 H 320",
          "M 0 130 H 320",
          "M 70 0 V 190",
          "M 170 0 V 190",
          "M 258 0 V 190",
        ].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="#ccd8c8" strokeWidth="16" strokeLinecap="round" />
            <path d={d} fill="none" stroke="#fbfdfa" strokeWidth="11" strokeLinecap="round" />
          </g>
        ))}

        {/* Delivery route: white casing, gray remaining, orange traveled */}
        <path d={path} fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="9" />
        <path d={path} fill="none" stroke="#e4b48f" strokeLinecap="round" strokeWidth="5" opacity="0.55" />
        <path
          d={path}
          fill="none"
          stroke="url(#routeGrad)"
          strokeLinecap="round"
          strokeWidth="5"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - at}
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
        {/* Animated dash overlay to suggest movement */}
        <path d={path} fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" strokeDasharray="1 10" opacity="0.85">
          <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1.2s" repeatCount="indefinite" />
        </path>

        {/* Restaurant pin (teardrop) */}
        <g transform="translate(40 150)" filter="url(#mapShadow)">
          <path d="M 0 4 C -9 4 -13 -4 -13 -9 C -13 -17 -6 -22 0 -22 C 6 -22 13 -17 13 -9 C 13 -4 9 4 0 4 Z" fill="#7f292a" />
          <circle cx="0" cy="-11" r="8" fill="#ffffff" />
          <text fontSize="9" textAnchor="middle" y="-8">🍔</text>
        </g>

        {/* Home pin (teardrop) */}
        <g transform="translate(280 40)" filter="url(#mapShadow)">
          <path d="M 0 4 C -9 4 -13 -4 -13 -9 C -13 -17 -6 -22 0 -22 C 6 -22 13 -17 13 -9 C 13 -4 9 4 0 4 Z" fill="#22a06b" />
          <circle cx="0" cy="-11" r="8" fill="#ffffff" />
          <text fontSize="8" textAnchor="middle" y="-8">🏠</text>
        </g>

        {/* Driver marker with pulsing halo */}
        <g style={{ transition: "transform 0.9s ease" }} transform={`translate(${dx} ${dy})`}>
          <circle fill="#d9161c" opacity="0.25" r="13">
            <animate attributeName="r" values="12;20;12" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle fill="#ffffff" r="13" stroke="#d9161c" strokeWidth="3" filter="url(#mapShadow)" />
          <text fontSize="13" textAnchor="middle" y="4.5">🛵</text>
        </g>
      </svg>
      <span className="absolute left-[12px] top-[12px] rounded-full bg-white/85 px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#7f292a] backdrop-blur-[4px]">
        Bản đồ hành trình
      </span>
    </div>
  );
}

/** Past completed orders with a 1-click re-order button. */
function OrderHistory() {
  const history = useOrderHistory();
  const active = useOrder();
  const { addMany, setOpen } = useCart();

  // Đồng bộ lịch sử đơn thật từ Supabase theo SĐT của đơn gần nhất.
  useEffect(() => {
    const phone = active?.phone || history[0]?.phone;
    if (phone) void syncHistoryFromServer(phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.phone]);

  if (history.length === 0) return null;

  const reorder = (items: typeof history[number]["items"]) => {
    addMany(items.map((line) => ({ ...line })));
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[10px]">
        <span className="text-[22px]">🕘</span>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[22px] text-[#212121]">Lịch sử đơn hàng</span>
      </div>

      {history.map((past) => {
        const count = past.items.reduce((sum, line) => sum + line.qty, 0);
        const when = new Date(past.placedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
        const cancelled = past.status === "cancelled";
        return (
          <div className="flex flex-col gap-[12px] rounded-[18px] bg-white p-[18px] ring-1 ring-[#f0e2d2]" key={past.id}>
            <div className="flex items-center justify-between gap-[12px]">
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">Đơn #{past.id}</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#8a8a8a]">
                  {when} · {count} món
                </span>
              </div>
              {cancelled ? (
                <span className="flex items-center gap-[6px] rounded-full bg-[#fdecea] px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#d9161c]">
                  ✕ Đã huỷ
                </span>
              ) : (
                <span className="flex items-center gap-[6px] rounded-full bg-[#e8f6ef] px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#22a06b]">
                  ✓ Hoàn tất
                </span>
              )}
            </div>

            {/* Item thumbnails */}
            <div className="flex flex-wrap items-center gap-[8px]">
              {past.items.map((line) => (
                <div className="flex items-center gap-[8px] rounded-full bg-[#faf3ea] py-[4px] pl-[4px] pr-[12px] ring-1 ring-[#f0e2d2]" key={line.id}>
                  <img alt={line.name} className="size-[30px] rounded-full object-cover" src={line.image} />
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#7f292a]">
                    {line.qty}× {line.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-[12px]">
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#d9161c]">{formatVnd(past.total)}</span>
              <button
                className="flex cursor-pointer items-center gap-[8px] rounded-[12px] px-[20px] py-[11px] text-white shadow-[0px_8px_18px_rgba(205,5,8,0.28)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
                onClick={() => reorder(past.items)}
                style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
                type="button"
              >
                <svg className="size-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] whitespace-nowrap">Đặt lại đơn này</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackPanel() {
  const order = useOrder();
  const { openMenu } = useMenuFilter();
  const [now, setNow] = useState(Date.now());
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Empty state — no active order, but past orders can still be re-ordered.
  if (!order) {
    return (
      <div className="flex flex-col gap-[24px]">
      <div className="flex flex-col items-center gap-[16px] py-[40px] text-center">
        <span className="flex size-[92px] items-center justify-center rounded-full bg-[#f6ece9] text-[46px]">🧾</span>
        <div className="flex flex-col gap-[6px]">
          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-[#212121]">Bạn chưa có đơn hàng</p>
          <p className="max-w-[420px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] leading-[1.5] text-[#8a8a8a]">
            Khi bạn đặt món và thanh toán, hành trình đơn hàng sẽ hiện ở đây kèm bản đồ theo dõi trực tiếp.
          </p>
        </div>
        <button
          className="flex cursor-pointer items-center gap-[10px] rounded-[14px] px-[26px] py-[13px] text-white shadow-[0px_10px_22px_rgba(205,5,8,0.28)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
          onClick={() => openMenu("all")}
          style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
          type="button"
        >
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">Đặt món ngay</span>
        </button>
      </div>
      <OrderHistory />
      </div>
    );
  }

  // Derive live progress from when the order was placed.
  const totalMs = order.etaMinutes * 60 * 1000;
  const elapsed = Math.max(0, now - order.placedAt);
  const ratio = Math.min(1, elapsed / totalMs);
  const step = Math.min(TRACK_STEPS.length - 1, Math.floor(ratio * TRACK_STEPS.length));
  const remainMs = Math.max(0, totalMs - elapsed);
  const mm = String(Math.floor(remainMs / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remainMs % 60000) / 1000)).padStart(2, "0");
  const delivered = ratio >= 1;
  const progress = ((step + 1) / TRACK_STEPS.length) * 100;

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Status header */}
      <div
        className="flex items-center justify-between gap-[16px] rounded-[18px] px-[22px] py-[18px] text-white"
        style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #b31419 55%, #fa6932 130%)" }}
      >
        <div className="flex flex-col leading-tight">
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#f4de79]">Đơn hàng #{order.id}</span>
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px]">{delivered ? "Giao thành công 🎉" : TRACK_STEPS[step].label}</span>
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#f4de79]">{delivered ? "Đã đến nơi" : "Dự kiến còn"}</span>
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#f4de79] tabular-nums">{delivered ? "00:00" : `${mm}:${ss}`}</span>
        </div>
      </div>

      {/* Live map */}
      <DeliveryMap progress={ratio} />

      {/* Progress bar */}
      <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f1e4d4]">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%`, backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 60%, #d9161c 100%)" }}
        />
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-[2px]">
        {TRACK_STEPS.map((item, i) => {
          const done = i < step || delivered;
          const active = i === step && !delivered;
          return (
            <li className="flex items-start gap-[14px]" key={item.label}>
              <div className="flex flex-col items-center self-stretch">
                <span
                  className={`flex size-[30px] shrink-0 items-center justify-center rounded-full font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] transition-colors duration-500 ${
                    done ? "bg-[#22a06b] text-white" : active ? "bg-[#d9161c] text-white" : "bg-[#eee7dd] text-[#a5a5a5]"
                  } ${active ? "ring-4 ring-[#f7c9a8]" : ""}`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {i < TRACK_STEPS.length - 1 && (
                  <span className={`w-[3px] flex-1 rounded-full transition-colors duration-500 ${done ? "bg-[#22a06b]" : "bg-[#eee7dd]"}`} />
                )}
              </div>
              <div className={`flex flex-col pb-[16px] leading-tight ${active || done ? "" : "opacity-70"}`}>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#212121]">{item.label}</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8a8a8a]">{item.detail}</span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Driver + address */}
      <div className="flex items-center gap-[14px] rounded-[16px] bg-[#fff8ec] px-[18px] py-[14px] ring-1 ring-[#f6e0c2]">
        <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-white text-[24px] ring-1 ring-[#f0e2d2]">🧑‍🍳</span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">Tài xế Anh Tuấn · 59H2-284.16</span>
          <span className="truncate font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#8a8a8a]">📍 Giao đến: {order.address || "—"}</span>
        </div>
        <a
          className="ml-auto flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#22a06b] text-white transition-transform hover:scale-105"
          href="tel:19001234"
          title="Gọi tài xế"
        >
          <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
          </svg>
        </a>
      </div>

      {/* Order summary */}
      <div className="flex flex-col gap-[10px] rounded-[16px] bg-white px-[18px] py-[16px] ring-1 ring-[#f0e2d2]">
        <div className="flex flex-col gap-[8px]">
          {order.items.map((line) => (
            <div className="flex items-center gap-[10px]" key={line.id}>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">{line.qty}×</span>
              <span className="min-w-0 flex-1 truncate font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#212121]">{line.name}</span>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#8a8a8a]">{formatVnd(line.price * line.qty)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-[#f0e2d2] pt-[10px]">
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#8a8a8a]">Tổng thanh toán</span>
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[22px] text-[#d9161c]">{formatVnd(order.total)}</span>
        </div>
      </div>

      {delivered && (
        <button
          className="mx-auto cursor-pointer rounded-[12px] bg-[#f5f5f5] px-[22px] py-[11px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#757575] transition-colors hover:bg-[#f0e2d2]"
          onClick={() => completeOrder()}
          type="button"
        >
          Hoàn tất · lưu vào lịch sử
        </button>
      )}

      {/* Huỷ đơn — chỉ khi bếp chưa giao món cho tài xế */}
      {!delivered &&
        (step < 2 ? (
          confirmCancel ? (
            <div className="flex flex-col gap-[12px] rounded-[16px] bg-[#fff1f0] p-[16px] ring-1 ring-[#f6c9c6]">
              <div className="flex items-start gap-[10px]">
                <span className="text-[22px]">⚠️</span>
                <div className="flex flex-col leading-tight">
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#c1121a]">Huỷ đơn #{order.id}?</span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a05a55]">
                    Bạn sẽ không bị tính phí vì bếp chưa bắt đầu giao. Thao tác này không thể hoàn tác.
                  </span>
                </div>
              </div>
              <div className="flex gap-[10px]">
                <button
                  className="flex-1 cursor-pointer rounded-[12px] bg-white px-[16px] py-[11px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#757575] ring-1 ring-[#e6dccf] transition-colors hover:bg-[#f5f0e8]"
                  onClick={() => setConfirmCancel(false)}
                  type="button"
                >
                  Giữ đơn
                </button>
                <button
                  className="flex-1 cursor-pointer rounded-[12px] bg-[#d9161c] px-[16px] py-[11px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-white shadow-[0px_8px_18px_rgba(205,5,8,0.28)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
                  onClick={() => {
                    setConfirmCancel(false);
                    cancelOrder();
                  }}
                  type="button"
                >
                  Xác nhận huỷ
                </button>
              </div>
            </div>
          ) : (
            <button
              className="mx-auto cursor-pointer rounded-[12px] bg-[#fff1f0] px-[22px] py-[11px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c] ring-1 ring-[#f6c9c6] transition-colors hover:bg-[#ffe4e2]"
              onClick={() => setConfirmCancel(true)}
              type="button"
            >
              Huỷ đơn hàng
            </button>
          )
        ) : (
          <p className="text-center font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">
            Đơn đã được giao cho tài xế nên không thể huỷ. Cần hỗ trợ, bạn gọi hotline 1900 1234 nhé.
          </p>
        ))}

      <OrderHistory />
    </div>
  );
}

/* ----------------------------- Express panel ----------------------------- */

/** Coverage map: the kitchen at the centre, delivery rings, and area pins. */
function CoverageMap({ areas, activeIndex }: { areas: typeof EXPRESS_AREAS; activeIndex: number }) {
  const cx = 160;
  const cy = 96;
  // Fixed pin positions around the kitchen (roughly by distance).
  const pins = [
    { x: 205, y: 78 },
    { x: 108, y: 66 },
    { x: 222, y: 132 },
    { x: 82, y: 138 },
  ];
  return (
    <div className="relative overflow-hidden rounded-[18px] ring-1 ring-[#e7ddd2]">
      <svg className="h-[196px] w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 320 196">
        <rect fill="#e7efe6" height="196" width="320" />
        {[40, 100, 160].map((y) => (
          <line key={`h${y}`} stroke="#d7e3d6" strokeWidth="10" x1="0" x2="320" y1={y} y2={y} />
        ))}
        {[60, 160, 260].map((x) => (
          <line key={`v${x}`} stroke="#d7e3d6" strokeWidth="10" x1={x} x2={x} y1="0" y2="196" />
        ))}
        {/* Delivery radius rings */}
        {[92, 64, 36].map((r) => (
          <circle cx={cx} cy={cy} fill="rgba(250,105,50,0.10)" key={r} r={r} stroke="#fa6932" strokeDasharray="3 6" strokeWidth="1.6" />
        ))}
        {/* Area pins */}
        {pins.map((p, i) => {
          const active = i === activeIndex;
          return (
            <g key={areas[i]?.area ?? i} transform={`translate(${p.x} ${p.y})`}>
              <line stroke={active ? "#d9161c" : "#b9a99f"} strokeDasharray="2 4" strokeWidth="1.4" x1="0" x2={cx - p.x} y1="0" y2={cy - p.y} />
              <circle fill={active ? "#d9161c" : "#ffffff"} r={active ? 9 : 7} stroke={active ? "#7f292a" : "#b9a99f"} strokeWidth="2" />
              {active && <circle fill="none" r="15" stroke="#d9161c" strokeOpacity="0.4" strokeWidth="2">
                <animate attributeName="r" dur="1.6s" repeatCount="indefinite" values="10;18;10" />
                <animate attributeName="stroke-opacity" dur="1.6s" repeatCount="indefinite" values="0.5;0;0.5" />
              </circle>}
            </g>
          );
        })}
        {/* Kitchen */}
        <g transform={`translate(${cx} ${cy})`}>
          <circle fill="#7f292a" r="13" />
          <text fontSize="13" textAnchor="middle" y="4.5">🍔</text>
        </g>
      </svg>
      <span className="absolute left-[12px] top-[12px] rounded-full bg-white/85 px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#7f292a] backdrop-blur-[4px]">
        Vùng giao hàng · bán kính 8 km
      </span>
    </div>
  );
}

function ExpressPanel({ onClose }: { onClose: () => void }) {
  const [express, setExpress] = useState(true);
  const [area, setArea] = useState(EXPRESS_AREAS[0].area);
  const [saved, setSaved] = useState(false);
  const address = useAddress();
  const { subtotal, count, setOpen } = useCart();
  const { openMenu } = useMenuFilter();
  const activeIndex = EXPRESS_AREAS.findIndex((a) => a.area === area);
  const picked = useMemo(() => EXPRESS_AREAS.find((a) => a.area === area) ?? EXPRESS_AREAS[0], [area]);

  const eta = express ? Math.max(10, Math.round(parseInt(picked.eta, 10) * 0.65)) : parseInt(picked.eta, 10);
  const baseFee = express ? picked.fee + 12000 : picked.fee;
  const freeship = subtotal >= FREE_SHIP_FROM;
  const fee = freeship ? 0 : baseFee;
  const missingForFree = Math.max(0, FREE_SHIP_FROM - subtotal);
  // Surcharge for express is charged even when goods qualify for freeship.
  const expressSurcharge = express ? 12000 : 0;

  const confirm = () => {
    saveExpress({ enabled: express, area, eta, fee: expressSurcharge });
    setSaved(true);
    window.setTimeout(() => {
      onClose();
      if (count > 0) setOpen(true);
      else openMenu("all");
    }, 650);
  };

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Coverage map + delivery address */}
      <CoverageMap activeIndex={activeIndex < 0 ? 0 : activeIndex} areas={EXPRESS_AREAS} />
      <div className="flex items-center gap-[10px] rounded-[16px] bg-[#f6ece9] px-[18px] py-[12px] ring-1 ring-[#f0e2d2]">
        <svg className="size-[18px] shrink-0 text-[#d9161c]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="min-w-0 truncate font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#7a6a66]">
          Giao đến: <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#7f292a]">{address || "Chưa đặt địa chỉ"}</span>
        </span>
      </div>

      <button
        className={`flex items-center justify-between gap-[16px] rounded-[18px] px-[22px] py-[16px] text-left transition-all duration-300 ${
          express ? "text-white shadow-[0px_12px_26px_rgba(205,5,8,0.28)]" : "bg-[#f5f0e8] text-[#7a7a7a]"
        }`}
        onClick={() => setExpress((v) => !v)}
        style={express ? { backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" } : undefined}
        type="button"
      >
        <span className="flex items-center gap-[14px]">
          <span className="text-[30px]">🛵</span>
          <span className="flex flex-col leading-tight">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px]">Giao siêu tốc</span>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] opacity-85">Tài xế riêng, không ghép đơn · +12.000 vnd</span>
          </span>
        </span>
        <span className={`relative h-[32px] w-[60px] shrink-0 rounded-full transition-colors duration-300 ${express ? "bg-[#f4de79]" : "bg-[#d8d0c4]"}`}>
          <span
            className={`absolute top-[4px] size-[24px] rounded-full bg-white shadow transition-all duration-300 ${express ? "left-[32px]" : "left-[4px]"}`}
          />
        </span>
      </button>

      <div className="grid grid-cols-2 gap-[12px]">
        {EXPRESS_AREAS.map((item) => {
          const active = item.area === area;
          return (
            <button
              className={`flex cursor-pointer items-center justify-between gap-[10px] rounded-[14px] border-2 px-[18px] py-[13px] text-left transition-all duration-300 ${
                active ? "border-[#d9161c] bg-[#f6ece9]" : "border-[#efe6d9] bg-white hover:border-[#f7c9a8]"
              }`}
              key={item.area}
              onClick={() => setArea(item.area)}
              type="button"
            >
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#212121]">{item.area}</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8a8a8a]">{item.eta}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-stretch gap-[12px]">
        <div className="flex flex-1 flex-col items-center gap-[2px] rounded-[16px] bg-[#fff8ec] py-[16px] ring-1 ring-[#f6e0c2]">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#d9161c]">{eta}′</span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8a8a8a]">Thời gian dự kiến</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-[2px] rounded-[16px] bg-[#fff8ec] py-[16px] ring-1 ring-[#f6e0c2]">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#d9161c]">{fee === 0 ? "Miễn phí" : formatVnd(fee)}</span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8a8a8a]">Phí giao đến {picked.area}</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-[2px] rounded-[16px] bg-[#fff8ec] py-[16px] ring-1 ring-[#f6e0c2]">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#22a06b]">{freeship ? "✓" : formatVnd(subtotal)}</span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8a8a8a]">{freeship ? "Đã được freeship" : "Trong giỏ hiện tại"}</span>
        </div>
      </div>

      {/* Freeship progress from the live cart */}
      <div className="flex flex-col gap-[7px] rounded-[16px] bg-white px-[18px] py-[14px] ring-1 ring-[#f0e2d2]">
        <div className="flex items-center justify-between">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#212121]">
            {freeship ? "🎉 Đơn của bạn đã được miễn phí giao hàng!" : `Mua thêm ${formatVnd(missingForFree)} để được freeship`}
          </span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#8a8a8a]">{formatVnd(subtotal)} / {formatVnd(FREE_SHIP_FROM)}</span>
        </div>
        <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f1e4d4]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${Math.min(100, (subtotal / FREE_SHIP_FROM) * 100)}%`, backgroundImage: freeship ? "linear-gradient(90deg, #22a06b, #1c8f5d)" : "linear-gradient(90deg, #f4de79 0%, #fa6932 60%, #d9161c 100%)" }}
          />
        </div>
      </div>

      {/* Confirm — applies the express choice to the order, then continues */}
      <button
        className="flex cursor-pointer items-center justify-center gap-[10px] rounded-[14px] py-[15px] text-white shadow-[0px_10px_22px_rgba(205,5,8,0.28)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
        onClick={confirm}
        style={{ backgroundImage: saved ? "linear-gradient(115deg, #35c184 0%, #1c8f5d 100%)" : "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #a3232a 100%)" }}
        type="button"
      >
        <span className="text-[20px]">{saved ? "✓" : "🛵"}</span>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">
          {saved
            ? "Đã áp dụng · đang mở giỏ…"
            : express
              ? `Đặt giao siêu tốc đến ${picked.area} · ${eta}′`
              : `Đặt giao thường đến ${picked.area} · ${eta}′`}
        </span>
      </button>
    </div>
  );
}

/* -------------------------------- Section -------------------------------- */

const PANEL_TITLE: Record<PanelId, string> = {
  promo: "🎁 Ưu đãi đang chạy",
  track: "📍 Theo dõi đơn trực tiếp",
  express: "🛵 Giao hàng siêu tốc",
};

/** "Features" band — 3 interactive service cards, each opening its own panel. */
export function FeatureHighlights() {
  const [panel, setPanel] = useState<PanelId | null>(null);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  return (
    <div
      className="relative w-full overflow-hidden px-[221px] pb-[90px] pt-[120px]"
      data-name="Features"
      style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #b31419 45%, #e5471f 82%, #fa6932 120%)" }}
    >
      <div className="pointer-events-none absolute -left-[120px] top-[-140px] size-[420px] rounded-full bg-[#fa6932] opacity-25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[100px] bottom-[-180px] size-[440px] rounded-full bg-[#f4de79] opacity-20 blur-[120px]" />

      <div className="relative flex flex-col items-center gap-[10px] pb-[46px] text-center">
        <span className="flex items-center gap-[10px] rounded-full bg-white/15 px-[18px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tracking-[2px] text-[#f4de79] uppercase">
          <span className="size-[8px] rounded-full bg-[#f4de79]" />
          Dịch vụ của Bite &amp; Bun
        </span>
        <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[46px] leading-[1.1] text-white">Đặt món dễ, nhận món nhanh</p>
        <p className="max-w-[720px] font-['Source_Sans_Pro:Regular',sans-serif] text-[20px] text-[#ffdcb0]">
          Bấm vào từng thẻ để xem mã giảm giá, theo dõi hành trình đơn hàng và kiểm tra thời gian giao tới khu vực của bạn.
        </p>
      </div>

      <div className="relative grid grid-cols-3 gap-[26px]">
        {CARDS.map((card, i) => (
          <button
            className="group relative flex cursor-pointer flex-col items-start gap-[14px] overflow-hidden rounded-[28px] bg-white p-[32px] text-left shadow-[0px_20px_44px_rgba(90,0,2,0.28)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[10px] hover:shadow-[0px_32px_60px_rgba(90,0,2,0.42)]"
            key={card.id}
            onClick={() => setPanel(card.id)}
            style={{ animation: "dish-in 0.5s cubic-bezier(0.16,1,0.3,1) both", animationDelay: `${i * 90}ms` }}
            type="button"
          >
            <span
              className="pointer-events-none absolute right-[-40px] top-[-40px] size-[150px] rounded-full opacity-15 transition-transform duration-700 group-hover:scale-[1.35]"
              style={{ backgroundImage: "linear-gradient(135deg, #fa6932 0%, #d9161c 100%)" }}
            />

            <span
              className="flex size-[76px] items-center justify-center rounded-[22px] text-[38px] shadow-[0px_12px_24px_rgba(205,5,8,0.22)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
              style={{ backgroundImage: "linear-gradient(135deg, #ffd76a 0%, #f4de79 55%, #fa6932 100%)" }}
            >
              {card.emoji}
            </span>

            <span className="relative flex flex-col gap-[4px]">
              <span
                className="bg-clip-text font-['Source_Sans_Pro:Bold',sans-serif] text-[32px] leading-[1.15] text-transparent"
                style={{ backgroundImage: "linear-gradient(95deg, #d9161c 40%, #fa6932 130%)" }}
              >
                {card.title}
              </span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-[#8a8a8a]">{card.sub}</span>
            </span>

            <span className="relative mt-[6px] flex items-center gap-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] text-[#d9161c]">
              {card.cta}
              <svg className="size-[18px] transition-transform duration-300 group-hover:translate-x-[5px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {/* Panel — portaled to <body> so `fixed` escapes the scaled Figma stage. */}
      {panel &&
        createPortal(
          <div className="fixed inset-0 z-[75] flex items-center justify-center p-[24px]">
          <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[3px]" onClick={() => setPanel(null)} type="button" />
          <div className="relative flex max-h-[86vh] w-full max-w-[860px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0px_40px_90px_rgba(0,0,0,0.45)] [animation:dish-in_0.32s_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="flex items-center justify-between gap-[16px] border-b border-[#f0e2d2] px-[28px] py-[20px]">
              <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[27px] text-[#212121]">{PANEL_TITLE[panel]}</p>
              <button
                className="flex size-[44px] cursor-pointer items-center justify-center rounded-full bg-[#f5f5f5] text-[#757575] transition-colors hover:bg-[#d9161c] hover:text-white"
                onClick={() => setPanel(null)}
                type="button"
              >
                <svg className="size-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto px-[28px] py-[24px]">
              {panel === "promo" && <PromoPanel />}
              {panel === "track" && <TrackPanel />}
              {panel === "express" && <ExpressPanel onClose={() => setPanel(null)} />}
            </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
