import { useEffect, useState, type ReactNode } from "react";
import { formatVnd } from "./cart-store";
import { MENU } from "./menu-data";
import { useMenuFilter } from "./menu-filter";

const PERKS = [
  { icon: "🎁", title: "Ưu đãi riêng cho app", desc: "Mã giảm 25% mỗi thứ 4" },
  { icon: "📍", title: "Theo dõi tài xế live", desc: "Xem đường đi từng phút" },
  { icon: "⚡", title: "Đặt lại 1 chạm", desc: "Lưu món và địa chỉ quen" },
];

const STATS = [
  { value: "4.9★", label: "12k lượt đánh giá" },
  { value: "500k+", label: "Lượt tải" },
  { value: "22′", label: "Giao trung bình" },
];

/** Deterministic pseudo-QR pattern — decorative only. */
const QR_CELLS = Array.from({ length: 169 }, (_, i) => {
  const row = Math.floor(i / 13);
  const col = i % 13;
  const corner = (r: number, c: number) => r < 3 && (c < 3 || c > 9);
  if (corner(row, col) || (row > 9 && col < 3)) return (row + col) % 3 !== 1;
  return (row * 7 + col * 5 + ((row * col) % 4)) % 3 === 0;
});

const TRACK = ["Bếp nhận đơn", "Đang chiên burger", "Tài xế đã lấy hàng", "Sắp tới cửa"];

/** Phone screen 1 — a live order-tracking card. */
function TrackScreen() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % TRACK.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex size-full flex-col bg-[#fff9f0]">
      <div className="flex flex-col gap-[10px] px-[20px] pb-[18px] pt-[42px]" style={{ backgroundImage: "linear-gradient(140deg, #7f292a 0%, #d9161c 55%, #fa6932 120%)" }}>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[2.5px] text-[#f4de79] uppercase">Đơn #BB-2481</span>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] leading-[1.1] text-white">Đến sau 8 phút</span>
        <div className="mt-[4px] h-[6px] w-full overflow-hidden rounded-full bg-white/25">
          <span className="block h-full rounded-full bg-[#f4de79] transition-all duration-700" style={{ width: `${((step + 1) / TRACK.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-[12px] p-[18px]">
        {TRACK.map((label, i) => (
          <div className="flex items-center gap-[10px]" key={label}>
            <span
              className={`flex size-[22px] shrink-0 items-center justify-center rounded-full font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] transition-colors duration-500 ${
                i <= step ? "bg-[#22a06b] text-white" : "bg-[#efe1d4] text-[#b9a695]"
              }`}
            >
              {i <= step ? "✓" : i + 1}
            </span>
            <span className={`font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] transition-colors duration-500 ${i <= step ? "text-[#3b2a20]" : "text-[#b9a695]"}`}>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-[10px] border-t border-[#efe1d4] bg-white p-[16px]">
        <span className="flex size-[38px] items-center justify-center rounded-full bg-[#f7e7a8] text-[18px]">🛵</span>
        <span className="flex flex-col leading-tight">
          <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#3b2a20]">Anh Tuấn · 59H1-284.11</span>
          <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#a8927f]">Cách bạn 1,2 km</span>
        </span>
      </div>
    </div>
  );
}

/** Phone screen 2 — the menu feed. */
function MenuScreen() {
  const dishes = MENU.slice(0, 3);

  return (
    <div className="flex size-full flex-col bg-[#fff9f0]">
      <div className="flex flex-col gap-[10px] px-[18px] pb-[14px] pt-[42px]" style={{ backgroundImage: "linear-gradient(140deg, #f4de79 0%, #fa6932 70%, #fa6932 120%)" }}>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] leading-tight text-[#4a1516]">Chào buổi tối 👋</span>
        <span className="rounded-[10px] bg-white/85 px-[12px] py-[8px] font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#a8927f]">🔍 Tìm burger, pizza…</span>
      </div>

      <div className="flex flex-col gap-[11px] p-[14px]">
        {dishes.map((dish) => (
          <div className="flex items-center gap-[10px] rounded-[14px] bg-white p-[9px] shadow-[0px_4px_12px_rgba(205,5,8,0.07)]" key={dish.id}>
            <img alt={dish.name} className="size-[52px] shrink-0 rounded-[10px] object-cover" loading="lazy" src={dish.image} />
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#3b2a20]">{dish.name}</span>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#d9161c]">{formatVnd(dish.price)}</span>
            </span>
            <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#d9161c] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white">+</span>
          </div>
        ))}
      </div>

      <div className="mx-[14px] mt-auto mb-[16px] flex items-center gap-[9px] rounded-[14px] px-[14px] py-[12px]" style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 75%)" }}>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-white">Giỏ hàng · 3 món</span>
        <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#f4de79]">239k</span>
      </div>
    </div>
  );
}

/** iPhone-style bezel wrapper. */
function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative h-[560px] w-[272px] shrink-0 rounded-[42px] bg-[#14060a] p-[10px] shadow-[0px_36px_70px_rgba(74,0,1,0.45)] ring-1 ring-white/15 ${className}`}>
      <div className="relative size-full overflow-hidden rounded-[33px]">
        {children}
        <span className="absolute left-1/2 top-[12px] h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#14060a]" />
      </div>
    </div>
  );
}

function StoreButton({ store, sub }: { store: string; sub: string }) {
  return (
    <button
      className="flex cursor-pointer items-center gap-[11px] rounded-[16px] bg-[#14060a] px-[22px] py-[13px] shadow-[0px_12px_26px_rgba(20,6,10,0.32)] transition-transform duration-300 hover:-translate-y-[3px] active:scale-95"
      type="button"
    >
      <span className="text-[24px]">{store === "App Store" ? "" : "▶"}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#c9b6a8]">{sub}</span>
        <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] whitespace-nowrap text-white">{store}</span>
      </span>
    </button>
  );
}

/** "Tải ứng dụng ngay" — redesigned app-download band. */
export function AppDownload() {
  const { openMenu } = useMenuFilter();
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative w-full overflow-hidden py-[90px]" data-name="App Download">
      <span className="absolute inset-0" style={{ backgroundImage: "linear-gradient(115deg, #f3f3f3 0%, #f7e7a8 46%, #f4de79 100%)" }} />
      <div className="pointer-events-none absolute -left-[140px] top-[-100px] size-[460px] rounded-full bg-[#fa6932] opacity-30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-[120px] bottom-[-160px] size-[520px] rounded-full bg-[#d9161c] opacity-20 blur-[150px]" />
      <p className="pointer-events-none absolute -bottom-[36px] right-[120px] font-['Source_Sans_Pro:Bold',sans-serif] text-[190px] leading-none text-[#d9161c]/[0.06] uppercase">App</p>

      <div className="relative flex items-center justify-between gap-[60px] px-[221px]">
        {/* Copy */}
        <div className="flex max-w-[700px] flex-col gap-[22px]">
          <span className="flex w-fit items-center gap-[10px] rounded-full bg-[#d9161c]/10 px-[18px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tracking-[3px] text-[#d9161c] uppercase">
            <span className="size-[8px] animate-pulse rounded-full bg-[#fa6932]" />
            Có mặt trên iOS & Android
          </span>

          <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[62px] leading-[1.02] text-[#4a1516]">
            Tải ứng dụng{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(95deg, #fa6932 0%, #d9161c 60%, #7f292a 100%)" }}>
              Bite &amp; Bun
            </span>{" "}
            ngay!
          </p>

          <p className="max-w-[560px] font-['Open_Sans:Regular',sans-serif] text-[20px] leading-[1.5] text-[#7a6357]">
            Đặt món trong 3 chạm, theo dõi tài xế trên bản đồ và nhận mã giảm giá chỉ có trên app.
          </p>

          {/* Perks */}
          <div className="flex flex-col gap-[10px] pt-[2px]">
            {PERKS.map((perk) => (
              <div className="flex items-center gap-[13px] rounded-[16px] bg-white/60 px-[16px] py-[12px] ring-1 ring-white/70 backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-[2px] hover:bg-white/85" key={perk.title}>
                <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[13px] bg-[#f3f3f3] text-[21px] shadow-[0px_5px_12px_rgba(205,5,8,0.12)]">{perk.icon}</span>
                <span className="flex flex-col leading-tight">
                  <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-[#4a1516]">{perk.title}</span>
                  <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#8d7a6c]">{perk.desc}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Stores + QR */}
          <div className="flex flex-wrap items-center gap-[18px] pt-[6px]">
            <div className="flex flex-col gap-[11px]">
              <div className="flex gap-[12px]">
                <StoreButton store="App Store" sub="Tải trên" />
                <StoreButton store="Google Play" sub="Tải trên" />
              </div>
              <button
                className="w-fit cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#d9161c] underline-offset-4 hover:underline"
                onClick={() => openMenu("all")}
                type="button"
              >
                Hoặc đặt ngay trên web →
              </button>
            </div>

            <div className="flex items-center gap-[14px] rounded-[20px] bg-white p-[14px] shadow-[0px_14px_32px_rgba(205,5,8,0.14)]">
              <span className="grid size-[92px] grid-cols-[repeat(13,minmax(0,1fr))] gap-px rounded-[8px] bg-white p-[4px]">
                {QR_CELLS.map((on, i) => (
                  <span className={on ? "bg-[#4a1516]" : "bg-transparent"} key={i} />
                ))}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#4a1516]">Quét để tải</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#8d7a6c]">Tặng mã 25% đơn đầu</span>
                <button
                  className={`mt-[6px] w-fit cursor-pointer rounded-[9px] px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] tracking-[1.5px] transition-colors duration-300 ${
                    copied ? "bg-[#22a06b] text-white" : "bg-[#f3f3f3] text-[#d9161c]"
                  }`}
                  onClick={() => {
                    navigator.clipboard?.writeText("BBAPP25").catch(() => undefined);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  }}
                  type="button"
                >
                  {copied ? "Đã chép ✓" : "BBAPP25"}
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Phones */}
        <div className="relative flex shrink-0 items-end">
          <Phone className="mb-[-30px] mt-[46px]">
            <MenuScreen />
          </Phone>
          <Phone className="ml-[26px]">
            <TrackScreen />
          </Phone>

          {/* Floating stat chips */}
          <div className="pointer-events-none absolute -left-[46px] top-[26px] flex flex-col gap-[10px]">
            {STATS.map((stat) => (
              <span className="flex items-center gap-[9px] rounded-[14px] bg-white/92 px-[14px] py-[9px] shadow-[0px_10px_24px_rgba(74,0,1,0.16)]" key={stat.label}>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[21px] text-[#d9161c]">{stat.value}</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] whitespace-nowrap text-[#8d7a6c]">{stat.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
