import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatVnd, useCart } from "./cart-store";
import { MENU } from "./menu-data";
import { removeFavorite, useFavorites } from "./favorites-store";

/** Width of the portaled favourites panel. */
const PANEL_WIDTH = 340;

/** Heart button in the nav bar that opens the list of favourite dishes. */
export function FavoritesButton({ big }: { big?: boolean }) {
  const favorites = useFavorites();
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const dishes = favorites.flatMap((id) => MENU.filter((dish) => dish.id === id));

  /* The nav lives inside a CSS-transformed stage, so the panel is portaled to
     the body and positioned from the button's viewport rect. */
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      setAnchor({
        top: rect.bottom + 10,
        left: Math.max(12, Math.min(rect.right - PANEL_WIDTH, window.innerWidth - PANEL_WIDTH - 12)),
      });
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
      if (!btnRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="Món yêu thích"
        className={`group relative flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/12 text-[#f3f3f3] transition-all duration-300 hover:scale-105 hover:bg-white/25 ${
          big ? "size-[54px]" : "size-[44px]"
        } ${open ? "bg-white/25" : ""}`}
        onClick={() => setOpen((v) => !v)}
        ref={btnRef}
        type="button"
      >
        <svg
          className={`${big ? "size-[24px]" : "size-[21px]"} transition-all duration-300 group-hover:scale-110 ${
            dishes.length > 0 ? "fill-[#f4de79] text-[#f4de79] drop-shadow-[0px_0px_10px_rgba(255,179,14,0.65)]" : "fill-none"
          }`}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path d="M12 20.5S3.8 15.3 3.8 9.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.2 2.9c0 5.7-8.2 10.9-8.2 10.9Z" />
        </svg>
        {dishes.length > 0 && (
          <span
            className={`absolute -right-[2px] -top-[2px] flex items-center justify-center rounded-full bg-[#f4de79] font-['Source_Sans_Pro:Bold',sans-serif] text-[#7f292a] tabular-nums ${
              big ? "size-[24px] text-[15px]" : "size-[20px] text-[13px]"
            }`}
          >
            {dishes.length}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[95] flex max-h-[520px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0px_30px_60px_rgba(74,0,1,0.4)] [animation:dish-in_0.26s_cubic-bezier(0.16,1,0.3,1)_both]"
            ref={panelRef}
            style={{ top: anchor.top, left: anchor.left, width: PANEL_WIDTH }}
          >
            <div
              className="flex items-center gap-[10px] px-[18px] py-[15px]"
              style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #d9161c 55%, #fa6932 120%)" }}
            >
              <span className="text-[20px]">❤️</span>
              <span className="flex flex-col leading-tight">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white">Món yêu thích</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[14px] text-[#ffdcb0]">
                  {dishes.length > 0 ? `${dishes.length} món đã lưu` : "Chưa lưu món nào"}
                </span>
              </span>
            </div>

            {dishes.length === 0 ? (
              <div className="flex flex-col items-center gap-[8px] px-[24px] py-[34px] text-center">
                <span className="text-[38px]">🤍</span>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#4a3b33]">Danh sách đang trống</span>
                <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#a8927f]">
                  Bấm trái tim trên món ăn để lưu lại nhé.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-[10px] overflow-y-auto px-[14px] py-[14px]">
                {dishes.map((dish) => (
                  <div className="flex items-center gap-[11px] rounded-[16px] bg-[#f3f3f3] p-[10px] ring-1 ring-[#f0e2d2]" key={dish.id}>
                    <img alt={dish.name} className="size-[54px] shrink-0 rounded-[13px] object-cover" src={dish.image} />
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#3b2a20]">{dish.name}</span>
                      <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[16px] text-[#d9161c]">{formatVnd(dish.price)}</span>
                    </span>
                    <button
                      aria-label="Thêm vào giỏ"
                      className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#d9161c] font-['Source_Sans_Pro:Bold',sans-serif] text-[19px] text-white transition-transform duration-300 hover:-translate-y-[2px] active:scale-95"
                      onClick={() => add({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, category: dish.category })}
                      type="button"
                    >
                      +
                    </button>
                    <button
                      aria-label="Bỏ yêu thích"
                      className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#ffeceb] text-[#d9161c] transition-colors duration-300 hover:bg-[#ffd9d7]"
                      onClick={() => removeFavorite(dish.id)}
                      type="button"
                    >
                      <svg className="size-[17px] fill-current" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 20.5S3.8 15.3 3.8 9.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.2 2.9c0 5.7-8.2 10.9-8.2 10.9Z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
