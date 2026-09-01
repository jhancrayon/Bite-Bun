import { useEffect, useMemo, useState } from "react";
import { formatVnd, useCart } from "./cart-store";
import { useMenuFilter, type Category } from "./menu-filter";
import { CATEGORY_META, MENU, countByCategory, type MenuItem } from "./menu-data";
import { QuickAddDrawer } from "./quick-add-drawer";

type Sort = "popular" | "price-asc" | "price-desc" | "rating";

const SORTS: { id: Sort; label: string }[] = [
  { id: "popular", label: "Phổ biến" },
  { id: "rating", label: "Đánh giá cao" },
  { id: "price-asc", label: "Giá thấp → cao" },
  { id: "price-desc", label: "Giá cao → thấp" },
];

function Chilli({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-[2px]" title={`Độ cay ${level}/3`}>
      {Array.from({ length: level }, (_, i) => (
        <span key={i}>🌶️</span>
      ))}
    </span>
  );
}

function MenuCard({ item, index, onOpen, onPair }: { item: MenuItem; index: number; onOpen: (item: MenuItem) => void; onPair: (item: MenuItem) => void }) {
  const { add, items } = useCart();
  const inCart = items.find((line) => line.id === item.id)?.qty ?? 0;
  const [pulse, setPulse] = useState(false);
  const smart = Boolean(item.signature || item.seasonal);

  const onAdd = () => {
    if (smart) {
      onPair(item);
      return;
    }
    add({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
    setPulse(true);
    window.setTimeout(() => setPulse(false), 700);
  };

  const discount = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;

  return (
    <div
      className="group relative flex flex-col"
      style={{ animation: "dish-in 0.4s cubic-bezier(0.16,1,0.3,1) both", animationDelay: `${Math.min(index, 11) * 45}ms` }}
    >
      {/* Warm halo on hover */}
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-[24px] opacity-0 blur-[9px] transition-opacity duration-500 group-hover:opacity-70"
        style={{ backgroundImage: "linear-gradient(135deg, #f4de79 0%, #fa6932 55%, #d9161c 100%)" }}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-[#f0e8e2] shadow-[0px_4px_14px_rgba(33,33,33,0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[6px] group-hover:shadow-[0px_24px_44px_rgba(127,41,42,0.22)]">
        <button
          aria-label={`Xem chi tiết ${item.name}`}
          className="relative h-[204px] cursor-pointer overflow-hidden text-left"
          onClick={() => onOpen(item)}
          type="button"
        >
          <img alt={item.name} className="size-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12]" loading="lazy" src={item.image} />
          <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 42%, rgba(20,6,10,0.82) 100%)" }} />

          {/* Hint that the photo opens a detail view */}
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[7px] rounded-full border border-white/40 bg-black/45 px-[15px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-white opacity-0 backdrop-blur-[4px] transition-opacity duration-300 group-hover:opacity-100">
            <svg className="size-[16px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            Xem chi tiết
          </span>

          {/* Huy hiệu bảo chứng chất lượng cho món Signature */}
          {item.trust ? (
            <span
              className="absolute left-[12px] top-[12px] flex items-center gap-[5px] rounded-full px-[12px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#5a2a06] shadow-[0px_6px_16px_rgba(180,120,20,0.5)] ring-1 ring-white/60"
              style={{ backgroundImage: "linear-gradient(115deg, #ffe89a 0%, #f4de79 45%, #e9b949 100%)" }}
            >
              <svg className="size-[14px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="m12 2 2.4 6.9 7.3.2-5.8 4.4 2.1 7-6-4.2-6 4.2 2.1-7L2.3 9.1l7.3-.2L12 2Z" />
              </svg>
              {item.trust}
            </span>
          ) : (
            item.tag && (
              <span
                className="absolute left-[12px] top-[12px] rounded-full px-[12px] py-[6px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-white shadow-[0px_6px_14px_rgba(217,22,28,0.4)]"
                style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 75%)" }}
              >
                {discount > 0 ? `-${discount}%` : item.tag}
              </span>
            )
          )}

          {/* Rating — glass */}
          <span className="absolute bottom-[48px] right-[12px] flex items-center gap-[5px] rounded-full border border-white/25 bg-black/40 px-[10px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-white backdrop-blur-[6px]">
            <svg className="size-[14px] text-[#f4de79]" fill="currentColor" viewBox="0 0 24 24">
              <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" />
            </svg>
            {item.rating}
          </span>

          {item.spicy ? (
            <span className="absolute right-[12px] top-[48px] rounded-full border border-white/25 bg-black/40 px-[8px] py-[4px] text-[13px] backdrop-blur-[6px]">
              <Chilli level={item.spicy} />
            </span>
          ) : null}

          {/* Name over photo */}
          <p className="absolute bottom-[12px] left-[14px] right-[14px] font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] leading-[1.15] text-white drop-shadow-[0px_2px_6px_rgba(0,0,0,0.55)]">
            {item.name}
          </p>
        </button>

        <div className="flex flex-1 flex-col gap-[11px] p-[16px]">
          <p className="line-clamp-2 min-h-[42px] font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] leading-[1.4] text-[#8a7a77]">{item.desc}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-[7px]">
            <span className="flex items-center gap-[5px] rounded-full bg-[#f6ece9] px-[10px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#7f292a]">
              <svg className="size-[13px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {item.minutes}′
            </span>
            <span className="flex items-center gap-[4px] rounded-full bg-[#fdeede] px-[10px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] text-[#fa6932]">🔥 {item.kcal}</span>
            <span className="flex items-center gap-[4px] rounded-full bg-[#f3ece9] px-[10px] py-[4px] font-['Source_Sans_Pro:Regular',sans-serif] text-[13px] text-[#9a827f]">{item.reviews} đánh giá</span>
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-[10px] gap-y-[10px] pt-[4px]">
            <span className="flex flex-col leading-tight">
              {item.oldPrice && (
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#bda9a6] line-through">{formatVnd(item.oldPrice)}</span>
              )}
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[21px] whitespace-nowrap text-[#7f292a]">{formatVnd(item.price)}</span>
            </span>

            <button
              className={`flex flex-1 shrink-0 basis-[110px] cursor-pointer items-center justify-center gap-[6px] rounded-[12px] px-[14px] py-[10px] text-white shadow-[0px_8px_16px_rgba(217,22,28,0.28)] transition-transform duration-300 hover:-translate-y-[2px] hover:scale-[1.03] active:scale-95 ${
                pulse ? "scale-[1.06]" : ""
              }`}
              onClick={onAdd}
              style={{ backgroundImage: pulse ? "linear-gradient(115deg, #35c184 0%, #1c8f5d 100%)" : "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #7f292a 100%)" }}
              type="button"
            >
              {pulse ? (
                <svg className="size-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              ) : smart ? (
                <svg className="size-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" viewBox="0 0 24 24">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                </svg>
              ) : (
                <svg className="size-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] whitespace-nowrap">{pulse ? "Đã thêm" : smart ? "Chọn nhanh" : inCart > 0 ? `Thêm · ${inCart}` : "Thêm"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Zoomed dish view: a framed photo, full price and details for any dish. */
function DishDetail({ item, onClose, onPair }: { item: MenuItem; onClose: () => void; onPair: (item: MenuItem) => void }) {
  const { add, items } = useCart();
  const inCart = items.find((line) => line.id === item.id)?.qty ?? 0;
  const [added, setAdded] = useState(false);
  const meta = CATEGORY_META.find((c) => c.id === item.category);
  const discount = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;
  const smart = Boolean(item.signature || item.seasonal);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onAdd = () => {
    if (smart) {
      onPair(item);
      onClose();
      return;
    }
    add({ id: item.id, name: item.name, price: item.price, image: item.image, category: item.category });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="absolute inset-0 z-[80] flex items-center justify-center p-[12px] sm:p-[24px]">
      <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-[4px]" onClick={onClose} type="button" />

      <div className="relative flex max-h-full w-full max-w-[880px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_40px_90px_rgba(0,0,0,0.5)] [animation:dish-in_0.3s_cubic-bezier(0.16,1,0.3,1)_both] sm:rounded-[26px] md:flex-row">
        {/* Framed photo */}
        <div className="relative h-[180px] shrink-0 overflow-hidden sm:h-[280px] md:h-auto md:w-[44%]">
          <img alt={item.name} className="size-full object-cover" src={item.image} />
          <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(20,6,10,0.55) 100%)" }} />
          {item.tag && (
            <span
              className="absolute left-[16px] top-[16px] rounded-full px-[13px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white shadow-[0px_6px_14px_rgba(217,22,28,0.4)]"
              style={{ backgroundImage: "linear-gradient(115deg, #fa6932 0%, #d9161c 75%)" }}
            >
              {discount > 0 ? `-${discount}%` : item.tag}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-[16px] p-[26px]">
          <button
            aria-label="Đóng"
            className="absolute right-[16px] top-[16px] flex size-[38px] cursor-pointer items-center justify-center rounded-full bg-black/25 text-white transition-colors hover:bg-[#d9161c] md:bg-[#f3ece9] md:text-[#7f292a] md:hover:bg-[#d9161c] md:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {meta && (
            <span className="flex w-fit items-center gap-[7px] rounded-full bg-[#f6ece9] px-[13px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[1px] text-[#7f292a] uppercase">
              {meta.emoji} {meta.label}
            </span>
          )}

          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-wrap items-center gap-[8px]">
              <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] leading-[1.1] text-[#212121]">{item.name}</p>
              {item.trust && (
                <span
                  className="flex items-center gap-[5px] rounded-full px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#5a2a06] shadow-[0px_4px_12px_rgba(180,120,20,0.4)] ring-1 ring-white/60"
                  style={{ backgroundImage: "linear-gradient(115deg, #ffe89a 0%, #f4de79 45%, #e9b949 100%)" }}
                >
                  <svg className="size-[14px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="m12 2 2.4 6.9 7.3.2-5.8 4.4 2.1 7-6-4.2-6 4.2 2.1-7L2.3 9.1l7.3-.2L12 2Z" />
                  </svg>
                  {item.trust}
                </span>
              )}
            </div>
            <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] leading-[1.5] text-[#8a7a77]">{item.desc}</p>
          </div>

          {item.ingredients && item.ingredients.length > 0 && (
            <div className="flex flex-wrap gap-[8px]">
              {item.ingredients.map((line) => (
                <span className="flex items-center gap-[6px] rounded-full bg-[#fdf6e6] px-[13px] py-[7px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#8a5a1a] ring-1 ring-[#f0e2bf]" key={line}>
                  {line}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="flex items-center gap-[5px] rounded-full bg-[#f6ece9] px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#7f292a]">⏱ {item.minutes}′</span>
            <span className="flex items-center gap-[5px] rounded-full bg-[#fdeede] px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#fa6932]">🔥 {item.kcal} kcal</span>
            <span className="flex items-center gap-[5px] rounded-full bg-[#fff1cf] px-[12px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#a86800]">⭐ {item.rating}</span>
            <span className="flex items-center gap-[5px] rounded-full bg-[#f3ece9] px-[12px] py-[5px] font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#9a827f]">{item.reviews} đánh giá</span>
            {item.spicy ? (
              <span className="flex items-center gap-[4px] rounded-full bg-[#ffeceb] px-[12px] py-[5px] text-[14px]">
                <Chilli level={item.spicy} />
              </span>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-[14px] border-t border-[#f4e9dc] pt-[18px]">
            <span className="flex flex-col leading-tight">
              {item.oldPrice && (
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#bda9a6] line-through">{formatVnd(item.oldPrice)}</span>
              )}
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[32px] whitespace-nowrap text-[#7f292a]">{formatVnd(item.price)}</span>
            </span>

            <button
              className="flex flex-1 shrink-0 basis-[180px] cursor-pointer items-center justify-center gap-[8px] rounded-[14px] px-[20px] py-[14px] text-white shadow-[0px_10px_20px_rgba(217,22,28,0.3)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
              onClick={onAdd}
              style={{ backgroundImage: added ? "linear-gradient(115deg, #35c184 0%, #1c8f5d 100%)" : "linear-gradient(115deg, #fa6932 0%, #d9161c 70%, #7f292a 100%)" }}
              type="button"
            >
              <svg className="size-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                {added ? <path d="m5 13 4 4L19 7" /> : <path d="M12 5v14M5 12h14" />}
              </svg>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px] whitespace-nowrap">
                {added ? "Đã thêm vào giỏ" : smart ? "Chọn combo & topping" : inCart > 0 ? `Thêm vào giỏ · ${inCart}` : "Thêm vào giỏ"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full menu overlay: all 7 categories, or a single category when picked. */
export function MenuModal() {
  const { menuOpen, closeMenu, category, setCategory, query, setQuery } = useMenuFilter();
  const { count, subtotal, setOpen } = useCart();
  const [sort, setSort] = useState<Sort>("popular");
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [pairing, setPairing] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  const q = query.trim().toLowerCase();

  const visible = useMemo(() => {
    const list = MENU.filter(
      (item) =>
        (category === "all" || item.category === category) &&
        (q ? item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) : true),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === "popular") sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [category, q, sort]);

  if (!menuOpen) return null;

  const grouped = category === "all" && sort === "popular";
  const activeMeta = CATEGORY_META.find((c) => c.id === category);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-[24px]">
      <button aria-label="Đóng" className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[3px]" onClick={closeMenu} type="button" />

      <div className="relative flex h-[90vh] w-full max-w-[1420px] overflow-hidden rounded-[28px] bg-[#fefaf1] shadow-[0px_40px_90px_rgba(0,0,0,0.45)] [animation:dish-in_0.35s_cubic-bezier(0.16,1,0.3,1)_both]">
        {/* Sidebar */}
        <aside
          className="relative flex w-[286px] shrink-0 flex-col gap-[8px] overflow-y-auto p-[22px] text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ backgroundImage: "linear-gradient(170deg, #7f292a 0%, #b31419 55%, #fa6932 140%)" }}
        >
          <div className="pointer-events-none absolute -left-[60px] top-[-70px] size-[240px] rounded-full bg-[#f4de79] opacity-25 blur-[80px]" />

          <div className="relative flex flex-col gap-[2px] px-[8px] pb-[14px]">
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[3px] text-[#f4de79] uppercase">Bite &amp; Bun</span>
            <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[30px] leading-[1.1]">Thực đơn</p>
            <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#ffdcb0]">{MENU.length} món · bếp mở đến 23:00</span>
          </div>

          <button
            className={`relative flex cursor-pointer items-center gap-[12px] rounded-[14px] px-[14px] py-[12px] text-left transition-all duration-300 ${
              category === "all" ? "bg-[#f4de79] text-[#7f292a] shadow-[0px_8px_18px_rgba(0,0,0,0.18)]" : "text-[#f7e7a8] hover:bg-white/12"
            }`}
            onClick={() => setCategory("all")}
            type="button"
          >
            <span className="text-[22px]">🍽️</span>
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">Tất cả món</span>
            <span className="ml-auto font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] opacity-80">{MENU.length}</span>
          </button>

          {CATEGORY_META.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                className={`group relative flex cursor-pointer items-center gap-[12px] rounded-[14px] py-[9px] pl-[9px] pr-[14px] text-left transition-all duration-300 ${
                  active ? "bg-[#f4de79] text-[#7f292a] shadow-[0px_8px_18px_rgba(0,0,0,0.18)]" : "text-[#f7e7a8] hover:bg-white/12"
                }`}
                key={cat.id}
                onClick={() => setCategory(cat.id as Category)}
                type="button"
              >
                <img
                  alt={cat.label}
                  className={`size-[42px] shrink-0 rounded-[10px] object-cover transition-transform duration-500 group-hover:scale-105 ${
                    active ? "ring-2 ring-[#7f292a]" : "ring-1 ring-white/25"
                  }`}
                  loading="lazy"
                  src={cat.image}
                />
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[18px]">{cat.label}</span>
                  <span className={`font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] ${active ? "text-[#9a3103]" : "text-[#f4de79]"}`}>
                    {countByCategory(cat.id)} món
                  </span>
                </span>
                <span className="ml-auto shrink-0 text-[20px]">{cat.emoji}</span>
              </button>
            );
          })}

          <button
            className="relative mt-auto flex cursor-pointer items-center justify-between gap-[8px] rounded-[14px] bg-white/15 px-[16px] py-[13px] transition-colors hover:bg-white/25"
            onClick={() => {
              closeMenu();
              setOpen(true);
            }}
            type="button"
          >
            <span className="flex items-center gap-[8px]">
              <svg className="size-[20px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16l-1.2 11.1a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 6Z" />
                <path d="M9 10a3 3 0 0 0 6 0" />
              </svg>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px]">Giỏ ({count})</span>
            </span>
            <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#f4de79]">{formatVnd(subtotal)}</span>
          </button>
        </aside>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Hero banner */}
          <div className="relative flex h-[168px] shrink-0 items-end overflow-hidden">
            <img alt="" className="absolute inset-0 size-full object-cover" src={activeMeta?.image ?? CATEGORY_META[0].image} />
            <span className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(100deg, rgba(20,6,10,0.92) 8%, rgba(127,41,42,0.78) 46%, rgba(250,105,50,0.28) 100%)" }} />
            <div className="pointer-events-none absolute -left-[40px] -top-[60px] size-[220px] rounded-full bg-[#fa6932] opacity-30 blur-[90px]" />

            <div className="relative flex w-full items-end justify-between gap-[20px] px-[30px] py-[22px]">
              <div className="flex min-w-0 flex-col gap-[6px]">
                <span className="flex w-fit items-center gap-[7px] rounded-full bg-white/15 px-[13px] py-[5px] font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[2px] text-[#f4de79] uppercase backdrop-blur-[4px]">
                  {activeMeta ? `${countByCategory(activeMeta.id)} món` : `${MENU.length} món · ${CATEGORY_META.length} nhóm`}
                </span>
                <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[38px] leading-[1.02] text-white drop-shadow-[0px_2px_10px_rgba(0,0,0,0.5)]">
                  {activeMeta ? `${activeMeta.emoji} ${activeMeta.label}` : "🍽️ Toàn bộ thực đơn"}
                </p>
                <p className="truncate font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#f3e3d6]">
                  {activeMeta?.blurb ?? "Bếp nấu theo đơn — giao nóng hổi, thơm lừng trong 30 phút"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-[12px]">
                <span className="flex items-center gap-[8px] rounded-full border border-white/25 bg-white/15 px-[16px] py-[9px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-white backdrop-blur-[6px]">
                  <span className="size-[8px] animate-pulse rounded-full bg-[#4ade80]" />
                  Bếp đang mở
                </span>
                <button
                  className="flex size-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-[6px] transition-colors hover:bg-[#d9161c]"
                  onClick={closeMenu}
                  type="button"
                >
                  <svg className="size-[22px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Search + sort */}
          <div className="flex items-center gap-[14px] border-b border-[#f4e9dc] bg-white/70 px-[28px] py-[14px]">
            <div className="flex flex-1 items-center gap-[10px] rounded-[14px] bg-[#f5f5f5] px-[16px] py-[11px]">
              <svg className="size-[20px] shrink-0 text-[#d9161c]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="w-full bg-transparent font-['Source_Sans_Pro:Regular',sans-serif] text-[18px] text-[#212121] outline-none placeholder:text-[#9e9e9e]"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm món ăn trong thực đơn..."
                value={query}
              />
              {query && (
                <button className="cursor-pointer text-[#9e9e9e] hover:text-[#d9161c]" onClick={() => setQuery("")} type="button">
                  <svg className="size-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-[6px]">
              {SORTS.map((option) => (
                <button
                  className={`cursor-pointer rounded-full px-[14px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] whitespace-nowrap transition-all duration-300 ${
                    sort === option.id ? "bg-[#d9161c] text-white shadow-[0px_6px_14px_rgba(205,5,8,0.26)]" : "bg-[#f5f5f5] text-[#757575] hover:bg-[#f7e7a8] hover:text-[#d9161c]"
                  }`}
                  key={option.id}
                  onClick={() => setSort(option.id)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto px-[28px] py-[24px]">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-[10px] py-[90px]">
                <span className="text-[52px]">🍽️</span>
                <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[22px] text-[#212121]">Không tìm thấy món nào</p>
                <p className="font-['Source_Sans_Pro:Regular',sans-serif] text-[17px] text-[#9a9a9a]">
                  Thử từ khoá khác hoặc chọn nhóm món bên trái nhé.
                </p>
              </div>
            ) : grouped ? (
              CATEGORY_META.map((cat) => {
                const items = visible.filter((item) => item.category === cat.id);
                if (items.length === 0) return null;
                return (
                  <section className="mb-[38px]" key={cat.id}>
                    <div className="mb-[16px] flex items-center gap-[12px]">
                      <span className="text-[26px]">{cat.emoji}</span>
                      <p className="font-['Source_Sans_Pro:Bold',sans-serif] text-[27px] text-[#7f292a]">{cat.label}</p>
                      <span className="rounded-full bg-[#f6ece9] px-[12px] py-[4px] font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#d9161c]">
                        {items.length} món
                      </span>
                      <span className="hidden font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#a5a5a5] xl:inline">{cat.blurb}</span>
                      <span className="ml-[8px] h-[2px] flex-1 rounded-full bg-[#f0e2d2]" />
                      <button
                        className="cursor-pointer font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] whitespace-nowrap text-[#d9161c] hover:underline"
                        onClick={() => setCategory(cat.id as Category)}
                        type="button"
                      >
                        Xem nhóm này →
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-[20px]">
                      {items.map((item, i) => (
                        <MenuCard index={i} item={item} key={item.id} onOpen={setDetail} onPair={setPairing} />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <div className="grid grid-cols-4 gap-[20px]">
                {visible.map((item, i) => (
                  <MenuCard index={i} item={item} key={item.id} onOpen={setDetail} onPair={setPairing} />
                ))}
              </div>
            )}
          </div>
        </div>

        {detail && <DishDetail item={detail} onClose={() => setDetail(null)} onPair={setPairing} />}
        {pairing && <QuickAddDrawer item={pairing} onClose={() => setPairing(null)} />}
      </div>
    </div>
  );
}
