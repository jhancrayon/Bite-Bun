import image_1787327268951_277782549997264420_g4335956720103512018_00be84787900d38f6cce972dea531672_1 from '@/imports/1787327268951_277782549997264420_g4335956720103512018_00be84787900d38f6cce972dea531672-1.jpg'
import image_1787327268951_277782549997264420_g4335956720103512018_00be84787900d38f6cce972dea531672 from '@/imports/1787327268951_277782549997264420_g4335956720103512018_00be84787900d38f6cce972dea531672.jpg'
import { useEffect, useState } from "react";
import { formatVnd, useCart, FREE_SHIP_FROM } from "./cart-store";
import { useMenuFilter } from "./menu-filter";
import img1 from "../../imports/Sections/7132e70e1991a78a2fbc0c1ae100a898350f7b98.png";
import img2 from "../../imports/Sections/4fa787e84253771c7d782dac277834314ae49d1d.png";
import img3 from "../../imports/Sections/77643ad30670a1dd5dec501ea5ca252bdff5996e.png";
import img4 from "../../imports/Sections/3ea1efb9076dfdebcd784d4f296c250947a40522.png";

/* Ảnh túi tote quà tặng dịp 2/9 của Bite & Bun. */
const TOTE_IMAGE = "https://cdn.phototourl.com/free/2026-08-22-82c031a0-c2d1-411b-ba29-4cf037874bc3.jpg";

type Promo = {
  id: string;
  name: string;
  desc: string;
  price: number;
  oldPrice: number;
  percent: number;
  hours: number;
  sold: number;
  stock: number;
  image: string;
  /** Loại món — dùng cho ưu đãi Mua 1 Tặng 1 burger. */
  category?: string;
};

const PROMOS: Promo[] = [
  { id: "p1", name: "Burger Bò Bacon Phô Mai", desc: "Bacon giòn · cheddar kép", price: 71200, oldPrice: 89000, percent: 20, hours: 5, sold: 68, stock: 100, image: img1, category: "burger" },
  { id: "p2", name: "Salad Trộn Giấm Táo", desc: "Rau hữu cơ · giấm táo", price: 55250, oldPrice: 65000, percent: 15, hours: 8, sold: 41, stock: 80, image: img2 },
  { id: "p3", name: "Gà Giòn Cay", desc: "Ướp ớt Hàn · giòn tan", price: 76500, oldPrice: 85000, percent: 10, hours: 12, sold: 92, stock: 120, image: img3 },
  { id: "p4", name: "Mì Ý Sốt Cua Phô Mai", desc: "Thịt cua tươi · sốt kem", price: 61750, oldPrice: 95000, percent: 35, hours: 2, sold: 74, stock: 90, image: img4 },
];

function useCountdown(hours: number) {
  const [left, setLeft] = useState(hours * 3600);
  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    h: pad(Math.floor(left / 3600)),
    m: pad(Math.floor((left % 3600) / 60)),
    s: pad(left % 60),
  };
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c1 3.5-1.5 5-2.5 6.5C8 11 9 13 12 13c2 0 3-1.5 2.5-3.5C16 11 17 13.5 17 16a5 5 0 1 1-10 0c0-3 2-4.5 2.5-6.5C10 7 12 5.5 12 2Z" />
    </svg>
  );
}

function TimeBox({ value }: { value: string }) {
  return (
    <span className="flex min-w-[46px] items-center justify-center rounded-[12px] bg-white/12 px-[10px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] text-[#f4de79] tabular-nums shadow-[inset_0px_0px_0px_1px_rgba(244,222,121,0.25)]">
      {value}
    </span>
  );
}

function PromoCard({ promo, index }: { promo: Promo; index: number }) {
  const { add } = useCart();
  const t = useCountdown(promo.hours);
  const soldPercent = Math.round((promo.sold / promo.stock) * 100);
  const almostGone = soldPercent >= 80;
  const hot = promo.percent >= 25;

  return (
    <div
      className="group relative flex flex-col"
      data-name="Promo Card"
      style={{ animation: "dish-in 0.5s cubic-bezier(0.16,1,0.3,1) both", animationDelay: `${index * 80}ms` }}
    >
      {/* Warm halo on hover */}
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-[32px] opacity-0 blur-[12px] transition-opacity duration-500 group-hover:opacity-80"
        style={{ backgroundImage: "linear-gradient(135deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)" }}
      />

      <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_18px_40px_rgba(0,0,0,0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[10px]">
        <div className="relative h-[230px] overflow-hidden">
          <img alt={promo.name} className="size-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12]" src={promo.image} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(127,41,42,0.65)_100%)]" />

          {/* Diagonal discount ribbon */}
          <div className="pointer-events-none absolute -left-[52px] top-[26px] w-[190px] -rotate-45">
            <div
              className="flex items-center justify-center gap-[4px] py-[8px] text-white shadow-[0px_8px_18px_rgba(0,0,0,0.35)]"
              style={{ backgroundImage: "linear-gradient(90deg, #fa6932 0%, #d9161c 100%)" }}
            >
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] leading-none">-{promo.percent}%</span>
            </div>
          </div>

          {/* HOT badge */}
          {hot && (
            <span className="absolute right-[14px] top-[14px] flex items-center gap-[5px] rounded-full bg-[#f4de79] px-[12px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#7f292a] shadow-[0px_6px_14px_rgba(0,0,0,0.25)]">
              <FlameIcon className="size-[15px] text-[#d9161c]" />
              HOT
            </span>
          )}

          {/* Countdown chip */}
          <div className="absolute bottom-[14px] left-[14px] right-[14px] flex items-center gap-[8px] rounded-[14px] border border-white/20 bg-black/40 px-[12px] py-[8px] backdrop-blur-[6px]">
            <svg className="size-[16px] shrink-0 text-[#f4de79]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-white/75">Kết thúc sau</span>
            <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] tabular-nums tracking-[1px] text-[#f4de79]">{t.h}:{t.m}:{t.s}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[13px] p-[18px]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] leading-[1.2] text-[#7f292a]">{promo.name}</p>
            <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#9a827f]">{promo.desc}</p>
          </div>

          {/* Scarcity bar */}
          <div className="flex flex-col gap-[6px]">
            <div className="h-[9px] w-full overflow-hidden rounded-full bg-[#f3ece9]">
              <div
                className="h-full rounded-full transition-[width] duration-1000"
                style={{ width: `${soldPercent}%`, backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)" }}
              />
            </div>
            <span className={`flex items-center gap-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] ${almostGone ? "text-[#d9161c]" : "text-[#fa6932]"}`}>
              {almostGone && <FlameIcon className="size-[14px]" />}
              {almostGone ? `Sắp cháy hàng · còn ${promo.stock - promo.sold} suất` : `Đã bán ${promo.sold}/${promo.stock} suất`}
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-[10px]">
            <div className="flex flex-col leading-tight">
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#bda9a6] line-through">{formatVnd(promo.oldPrice)}</span>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#d9161c]">{formatVnd(promo.price)}</span>
            </div>
            <button
              className="flex shrink-0 cursor-pointer items-center gap-[7px] rounded-[14px] px-[18px] py-[12px] text-white shadow-[0px_10px_22px_rgba(217,22,28,0.4)] transition-all duration-300 hover:-translate-y-[2px] hover:scale-[1.04] active:scale-95"
              onClick={() => add({ id: promo.id, name: promo.name, price: promo.price, image: promo.image, category: promo.category })}
              style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #7f292a 100%)" }}
              type="button"
            >
              <svg className="size-[17px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] whitespace-nowrap">Đặt ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Countdown to a fixed target date (National Day). */
function useDateCountdown(target: number) {
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const sec = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    d: pad(Math.floor(sec / 86400)),
    h: pad(Math.floor((sec % 86400) / 3600)),
    m: pad(Math.floor((sec % 3600) / 60)),
    s: pad(sec % 60),
  };
}

/** Gold 5-point star — the National Day motif. */
function GoldStar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.7 6.3 6.8.5-5.2 4.4 1.7 6.6L12 16.9 6 20.3l1.7-6.6L2.5 9.3l6.8-.5z" />
    </svg>
  );
}

/** Triangle-flag bunting garland across the top. */
function Bunting() {
  const colors = ["#f4de79", "#d9161c", "#fa6932", "#f4de79", "#d9161c", "#fa6932", "#f4de79", "#d9161c", "#fa6932", "#f4de79", "#d9161c", "#fa6932", "#f4de79", "#d9161c"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-[10px]">
      {colors.map((c, i) => (
        <span
          key={i}
          className="h-[26px] w-[24px] shadow-[0px_4px_6px_rgba(74,0,1,0.25)]"
          style={{ backgroundColor: c, clipPath: "polygon(0 0, 100% 0, 50% 100%)", opacity: 0.92 }}
        />
      ))}
    </div>
  );
}

function CountUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-[6px]">
      <span
        className="flex min-w-[72px] items-center justify-center rounded-[16px] px-[14px] py-[12px] font-['Source_Sans_Pro:Bold',sans-serif] text-[38px] tabular-nums text-[#7f292a] shadow-[0px_10px_22px_rgba(74,0,1,0.35)]"
        style={{ backgroundImage: "linear-gradient(160deg, #ffe9a8 0%, #f4de79 55%, #f0c64b 100%)" }}
      >
        {value}
      </span>
      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] tracking-[2px] text-[#ffe6c2] uppercase">{label}</span>
    </div>
  );
}

/** Seasonal event banner — National Day 2/9 mega sale. */
function SeasonalPromo() {
  const { subtotal, setOpen } = useCart();
  const { openMenu } = useMenuFilter();
  /* Đếm ngược tới hết ngày Quốc Khánh 2/9. */
  const cd = useDateCountdown(new Date(new Date().getFullYear(), 8, 2, 23, 59, 59).getTime());
  const toteProgress = Math.min(100, Math.round((subtotal / FREE_SHIP_FROM) * 100));
  const toteUnlocked = subtotal >= FREE_SHIP_FROM;
  const toteLeft = Math.max(0, FREE_SHIP_FROM - subtotal);

  return (
    <div
      className="relative mt-[44px] overflow-hidden rounded-[32px] bg-[#fbf6ee] shadow-[0px_24px_60px_rgba(127,41,42,0.22)] ring-1 ring-[#7f292a]/10"
      data-name="Seasonal Promo"
    >
      {/* ===== Thanh tiêu đề đậm chất lễ ===== */}
      <div
        className="relative overflow-hidden px-[48px] py-[36px]"
        style={{ backgroundImage: "linear-gradient(105deg, #7f292a 0%, #a5121a 55%, #d9161c 100%)" }}
      >
        {/* Vệt sáng chéo tinh tế */}
        <div className="pointer-events-none absolute -right-[40px] -top-[60px] size-[280px] rounded-full bg-[#f4de79] opacity-15 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-40px] left-[30%] size-[220px] rounded-full bg-[#fa6932] opacity-20 blur-[80px]" />

        <div className="relative flex flex-wrap items-center justify-between gap-[28px]">
          {/* Nhận diện dịp lễ */}
          <div className="flex flex-col gap-[12px]">
            <span className="flex w-fit items-center gap-[8px] rounded-full border border-[#f4de79]/45 px-[16px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[3px] text-[#f4de79] uppercase">
              <GoldStar className="size-[14px]" />
              Mừng Quốc Khánh 2 · 9
            </span>
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[46px] leading-[1.02] text-white">
              Đại lễ 2/9 · <span className="text-[#f4de79]">Sale khủng</span>
            </p>
            <p className="max-w-[440px] font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] leading-[1.45] text-white/85">
              Mừng ngày Quốc Khánh cùng Bite & Bun với ưu đãi lớn nhất năm.
            </p>
          </div>

          {/* Đồng hồ đếm ngược */}
          <div className="flex flex-col items-center gap-[10px] rounded-[22px] bg-white/10 px-[24px] py-[18px] backdrop-blur-[4px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] tracking-[3px] text-white/75 uppercase">Ưu đãi kết thúc sau</span>
            <div className="flex items-end gap-[8px]">
              <CountUnit value={cd.d} label="Ngày" />
              <span className="pb-[28px] font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#f4de79]">:</span>
              <CountUnit value={cd.h} label="Giờ" />
              <span className="pb-[28px] font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#f4de79]">:</span>
              <CountUnit value={cd.m} label="Phút" />
              <span className="pb-[28px] font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] text-[#f4de79]">:</span>
              <CountUnit value={cd.s} label="Giây" />
            </div>
          </div>
        </div>
      </div>

      {/* Dải phân cách vàng gold */}
      <div className="h-[5px] w-full" style={{ backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 50%, #d9161c 100%)" }} />

      {/* ===== Hai ưu đãi ===== */}
      <div className="grid grid-cols-2 gap-[24px] p-[36px]">
        {/* Ưu đãi 1 — Mua 1 Tặng 1 */}
        <div
          className="group relative flex flex-col justify-between gap-[24px] overflow-hidden rounded-[26px] p-[30px] shadow-[0px_18px_44px_rgba(127,41,42,0.14)] ring-1 ring-[#e8c884]/60 transition-all duration-500 hover:-translate-y-[6px] hover:shadow-[0px_28px_60px_rgba(127,41,42,0.22)]"
          style={{ backgroundImage: "linear-gradient(158deg, #ffffff 0%, #fff6ea 52%, #ffeede 100%)" }}
        >
          {/* Viền vàng gold nội + ánh sáng góc */}
          <div className="pointer-events-none absolute inset-[6px] rounded-[20px] ring-1 ring-[#e8c884]/40" />
          <div className="pointer-events-none absolute -right-[40px] -top-[40px] size-[160px] rounded-full bg-[radial-gradient(circle,rgba(244,222,121,0.55)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -left-[60px] bottom-[-50px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(250,105,50,0.18)_0%,transparent_70%)]" />

          <div className="relative flex items-start gap-[20px]">
            {/* Huy chương burger vẽ tay */}
            <div className="relative shrink-0">
              <div
                className="flex size-[86px] items-center justify-center rounded-[24px] shadow-[0px_12px_26px_rgba(217,22,28,0.4)] ring-1 ring-white/50 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
                style={{ backgroundImage: "linear-gradient(145deg, #ffb057 0%, #fa6932 45%, #d9161c 100%)" }}
              >
                <svg className="size-[56px] drop-shadow-[0px_3px_4px_rgba(74,0,1,0.4)]" viewBox="0 0 64 60" fill="none">
                  <defs>
                    <radialGradient id="bogoBunTop" cx="42%" cy="18%" r="85%">
                      <stop offset="0%" stopColor="#ffd58a" />
                      <stop offset="55%" stopColor="#f4a63f" />
                      <stop offset="100%" stopColor="#d9822b" />
                    </radialGradient>
                    <linearGradient id="bogoBunBottom" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f2ab52" />
                      <stop offset="100%" stopColor="#cf7c2a" />
                    </linearGradient>
                    <linearGradient id="bogoPatty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8a4a24" />
                      <stop offset="100%" stopColor="#5f2f14" />
                    </linearGradient>
                    <linearGradient id="bogoCheese" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffd94a" />
                      <stop offset="100%" stopColor="#f5b91f" />
                    </linearGradient>
                  </defs>
                  {/* Bun trên */}
                  <path d="M6 27C6 15.4 17.6 7 32 7s26 8.4 26 20c0 1.9-1.5 3-3.4 3H9.4C7.5 30 6 28.9 6 27Z" fill="url(#bogoBunTop)" />
                  {/* Highlight bóng trên bun */}
                  <path d="M14 18c4-6 12-8 18-8" stroke="#fff0cf" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
                  {/* Mè */}
                  <ellipse cx="22" cy="18" rx="2.1" ry="1.3" fill="#fff6df" transform="rotate(-22 22 18)" />
                  <ellipse cx="31" cy="14" rx="2.1" ry="1.3" fill="#fff6df" transform="rotate(12 31 14)" />
                  <ellipse cx="40" cy="17" rx="2.1" ry="1.3" fill="#fff6df" transform="rotate(-8 40 17)" />
                  <ellipse cx="47" cy="22" rx="2.1" ry="1.3" fill="#fff6df" transform="rotate(18 47 22)" />
                  <ellipse cx="15" cy="24" rx="2.1" ry="1.3" fill="#fff6df" transform="rotate(10 15 24)" />
                  {/* Xà lách */}
                  <path d="M7 30c3.2-3.4 5.4 1.2 8.6-.8s5.4 1.2 8.6-.8 5.4 1.2 8.6-.8 5.4 1.2 8.6-.8 5.4 1.2 7.2.2c1.6-1 2.8.6 2.8.6v3.4c0 1.2-1 2.2-2.2 2.2H9.2C8 34.4 7 33.4 7 32.2V30Z" fill="#84c74f" />
                  <path d="M7 30c3.2-3.4 5.4 1.2 8.6-.8s5.4 1.2 8.6-.8 5.4 1.2 8.6-.8" stroke="#63a736" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  {/* Phô mai chảy */}
                  <path d="M11 33h42v2.6c0 .7-.6 1.2-1.3 1.2l-6.4 3.4-6.3-3.2-6.3 3.4-6.3-3.4-6.3 3.4-6.3-3.4-2.1.9c-.6.3-1.4-.2-1.4-1V33Z" fill="url(#bogoCheese)" />
                  {/* Miếng bò */}
                  <rect x="9.5" y="39" width="45" height="8" rx="4" fill="url(#bogoPatty)" />
                  <rect x="9.5" y="39" width="45" height="2.4" rx="1.2" fill="#a05c31" opacity="0.55" />
                  {/* Bun dưới */}
                  <path d="M11 47h42c0 4.4-3.4 6.6-7.6 6.6H18.6C14.4 53.6 11 51.4 11 47Z" fill="url(#bogoBunBottom)" />
                </svg>
              </div>
              <span
                className="absolute -bottom-[8px] -right-[10px] flex items-center justify-center rounded-full px-[9px] py-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#7f292a] shadow-[0px_5px_12px_rgba(74,0,1,0.28)] ring-1 ring-white/70"
                style={{ backgroundImage: "linear-gradient(150deg, #ffe9a8 0%, #f0c64b 100%)" }}
              >
                1+1
              </span>
            </div>

            <div className="flex flex-col gap-[7px]">
              <span
                className="flex w-fit items-center gap-[5px] rounded-full px-[12px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] tracking-[1.5px] text-[#7f292a] uppercase shadow-[0px_4px_10px_rgba(232,200,132,0.5)]"
                style={{ backgroundImage: "linear-gradient(120deg, #ffe9a8 0%, #f4de79 100%)" }}
              >
                🔥 Hot nhất dịp lễ
              </span>
              <p
                className="font-['Source_Sans_Pro:Bold',sans-serif] text-[36px] leading-[1.0] text-transparent"
                style={{ backgroundImage: "linear-gradient(120deg, #7f292a 0%, #d9161c 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}
              >
                Mua 1 Tặng 1
              </p>
              <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] leading-[1.5] text-[#9a827f]">
                Áp dụng toàn bộ burger — mua một chiếc, nhận ngay chiếc thứ hai <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[#d9161c]">hoàn toàn miễn phí</span>.
              </p>
            </div>
          </div>

          <button
            className="group/btn relative flex cursor-pointer items-center justify-center gap-[9px] overflow-hidden rounded-[18px] px-[24px] py-[17px] text-white shadow-[0px_12px_26px_rgba(217,22,28,0.4)] transition-all duration-300 hover:-translate-y-[2px] active:scale-95"
            onClick={() => openMenu("burger")}
            style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 68%, #7f292a 100%)" }}
            type="button"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-[30%] w-[40%] -skew-x-[20deg] bg-white/25 blur-[6px] transition-transform duration-700 ease-out group-hover/btn:translate-x-[320%]" />
            <svg className="relative size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1.6" />
              <circle cx="18" cy="20" r="1.6" />
            </svg>
            <span className="relative font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">Chọn burger ngay</span>
          </button>
        </div>

        {/* Ưu đãi 2 — Tặng túi tote trên 200k */}
        <div
          className="group relative flex flex-col justify-between gap-[24px] overflow-hidden rounded-[26px] p-[30px] shadow-[0px_18px_44px_rgba(127,41,42,0.14)] ring-1 ring-[#e8c884]/60 transition-all duration-500 hover:-translate-y-[6px] hover:shadow-[0px_28px_60px_rgba(127,41,42,0.22)]"
          style={{ backgroundImage: "linear-gradient(158deg, #ffffff 0%, #fffaf0 52%, #fff4d8 100%)" }}
        >
          {/* Đường viền vàng gold nội */}
          <div className="pointer-events-none absolute inset-[6px] rounded-[20px] ring-1 ring-[#e8c884]/40" />
          {/* Ánh sáng góc */}
          <div className="pointer-events-none absolute -left-[40px] -bottom-[40px] size-[170px] rounded-full bg-[radial-gradient(circle,rgba(244,222,121,0.55)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -right-[50px] -top-[50px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(250,105,50,0.15)_0%,transparent_70%)]" />

          <div className="relative flex items-start gap-[18px]">
            {/* Ảnh túi + tem quà mạ vàng */}
            <div className="relative shrink-0">
              <img
                alt="Túi tote quà tặng Bite & Bun"
                className="size-[122px] rounded-[20px] object-cover shadow-[0px_12px_26px_rgba(74,0,1,0.25)] ring-1 ring-white/60 transition-transform duration-500 group-hover:scale-[1.04]"
                src={image_1787327268951_277782549997264420_g4335956720103512018_00be84787900d38f6cce972dea531672_1}
              />
              <span
                className="absolute -bottom-[8px] -right-[10px] flex items-center justify-center rounded-full px-[10px] py-[3px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#7f292a] shadow-[0px_5px_12px_rgba(74,0,1,0.28)] ring-1 ring-white/70"
                style={{ backgroundImage: "linear-gradient(150deg, #ffe9a8 0%, #f0c64b 100%)" }}
              >
                FREE
              </span>
            </div>
            <div className="flex flex-col gap-[7px]">
              <span
                className="flex w-fit items-center gap-[5px] rounded-full px-[12px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[12px] tracking-[1.5px] text-[#7f292a] uppercase shadow-[0px_4px_10px_rgba(232,200,132,0.5)]"
                style={{ backgroundImage: "linear-gradient(120deg, #ffe9a8 0%, #f4de79 100%)" }}
              >
                🎁 Quà tặng giới hạn
              </span>
              <p
                className="font-['Source_Sans_Pro:Bold',sans-serif] text-[26px] leading-[1.1] text-transparent"
                style={{ backgroundImage: "linear-gradient(120deg, #7f292a 0%, #d9161c 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}
              >
                Hóa đơn trên 200k tặng túi tote
              </p>
              <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] leading-[1.5] text-[#9a827f]">
                Túi canvas Bite & Bun bản đặc biệt dịp 2/9 — đi chợ, đi học đều xinh.
              </p>
            </div>
          </div>

          {/* Tiến trình + CTA */}
          <div className="relative flex flex-col gap-[12px]">
            <div className="h-[12px] w-full overflow-hidden rounded-full bg-[#f3ece9] ring-1 ring-[#e8c884]/40">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{ width: `${toteProgress}%`, backgroundImage: "linear-gradient(90deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)" }}
              />
            </div>
            <span className={`font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] ${toteUnlocked ? "text-[#22a06b]" : "text-[#d9161c]"}`}>
              {toteUnlocked ? "🎁 Bạn đã đủ điều kiện nhận túi tote!" : `Mua thêm ${formatVnd(toteLeft)} để nhận túi tote miễn phí`}
            </span>
            <button
              className={`group/btn relative flex cursor-pointer items-center justify-center gap-[9px] overflow-hidden rounded-[18px] px-[24px] py-[17px] text-white transition-all duration-300 hover:-translate-y-[2px] active:scale-95 ${
                toteUnlocked ? "shadow-[0px_12px_26px_rgba(34,160,107,0.4)]" : "shadow-[0px_12px_26px_rgba(217,22,28,0.4)]"
              }`}
              onClick={() => (toteUnlocked ? setOpen(true) : openMenu("all"))}
              style={{ backgroundImage: toteUnlocked ? "linear-gradient(115deg, #26b877 0%, #1f9463 100%)" : "linear-gradient(115deg, #fa6932 0%, #d9161c 68%, #7f292a 100%)" }}
              type="button"
            >
              {/* Vệt sáng lướt qua khi hover */}
              <span className="pointer-events-none absolute inset-y-0 -left-[30%] w-[40%] -skew-x-[20deg] bg-white/25 blur-[6px] transition-transform duration-700 ease-out group-hover/btn:translate-x-[320%]" />
              <svg className="relative size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                {toteUnlocked ? <path d="M5 12l5 5L20 7" /> : <path d="M12 5v14M5 12h14" />}
              </svg>
              <span className="relative font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">{toteUnlocked ? "Đi tới thanh toán · nhận túi" : "Thêm món để nhận túi"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Khuyến mãi" — dramatic flash-sale event on a deep-brand stage. */
export function Promotions() {
  const t = useCountdown(5);

  return (
    <div className="w-full px-[221px] py-[70px]" data-name="Flash Deals">
      <div
        className="relative overflow-hidden rounded-[40px] px-[56px] py-[56px] shadow-[0px_30px_70px_rgba(127,41,42,0.35)]"
        style={{ backgroundImage: "linear-gradient(135deg, #7f292a 0%, #9e1418 48%, #d9161c 100%)" }}
      >
        {/* Warm glow blobs */}
        <div className="pointer-events-none absolute -left-[80px] -top-[90px] size-[380px] rounded-full bg-[#fa6932] opacity-30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-[60px] top-[40px] size-[340px] rounded-full bg-[#f4de79] opacity-20 blur-[130px]" />

        {/* Header */}
        <div className="relative mb-[44px] flex flex-wrap items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[12px]">
            <span className="flex w-fit items-center gap-[9px] rounded-full bg-white/12 px-[16px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] tracking-[2.5px] text-[#f4de79] uppercase backdrop-blur-[4px]">
              <FlameIcon className="size-[17px] text-[#f4de79]" />
              Flash sale hôm nay
            </span>
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[48px] leading-[1.05] text-white">
              Deal hời <span className="text-[#f4de79]">giảm tới 35%</span>
            </p>
            <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[19px] text-white/80">
              Giá sốc có hạn — nhanh tay kẻo lỡ, hết suất là hết deal
            </p>
          </div>

          <div className="flex flex-col items-center gap-[10px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[2px] text-white/70 uppercase">Kết thúc sau</span>
            <div className="flex items-center gap-[8px]">
              <TimeBox value={t.h} />
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#f4de79]">:</span>
              <TimeBox value={t.m} />
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[24px] text-[#f4de79]">:</span>
              <TimeBox value={t.s} />
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-4 gap-[24px]">
          {PROMOS.map((promo, i) => (
            <PromoCard index={i} key={promo.id} promo={promo} />
          ))}
        </div>
      </div>

      {/* Seasonal event — National Day 2/9 */}
      <SeasonalPromo />
    </div>
  );
}
