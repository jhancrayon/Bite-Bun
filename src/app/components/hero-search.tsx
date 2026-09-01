import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MENU } from "./menu-data";
import { useMenuFilter } from "./menu-filter";

/** Hero search field + button: type a dish and jump straight into the menu. */
export function HeroSearch() {
  const { openMenu } = useMenuFilter();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0, width: 0 });
  const fieldRef = useRef<HTMLDivElement | null>(null);

  /* The hero card clips its overflow, so the suggestion list is portaled out
     and positioned from the field's viewport rect. */
  useEffect(() => {
    if (!focused) return;
    const place = () => {
      const rect = fieldRef.current?.getBoundingClientRect();
      if (rect) setAnchor({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [focused]);

  /* Empty field = browse the whole menu; typing narrows it down. */
  const suggestions = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return MENU;
    return MENU.filter((dish) => dish.name.toLowerCase().includes(q) || dish.desc.toLowerCase().includes(q));
  }, [text]);

  const search = (q = text) => openMenu("all", q.trim());

  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Text Field + Button">
      <div className="relative min-w-px flex-[1_0_0]" ref={fieldRef}>
        <div
          className="flex cursor-text items-center gap-[12px] rounded-[8px] bg-[#f5f5f5] px-[16px] py-[15px] ring-2 ring-transparent transition-all duration-300 focus-within:bg-white focus-within:ring-[#f4de79]"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;
            event.currentTarget.querySelector("input")?.focus();
          }}
        >
          <svg className="size-[24px] shrink-0 text-[#ef6d70]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            className="w-full bg-transparent font-['Open_Sans:Regular',sans-serif] text-[18px] text-[#212121] outline-none placeholder:text-[#9e9e9e]"
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Nhập tên món bạn muốn ăn…"
            value={text}
          />
          {text && (
            <button className="shrink-0 cursor-pointer text-[#9e9e9e] transition-colors hover:text-[#d9161c]" onClick={() => setText("")} type="button">
              <svg className="size-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {focused &&
          suggestions.length > 0 &&
          createPortal(
            <div
              className="fixed z-[92] flex max-h-[380px] flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_24px_50px_rgba(26,5,7,0.28)] ring-1 ring-[#f0e8e2]"
              style={{ top: anchor.top, left: anchor.left, width: anchor.width }}
            >
              <div className="flex items-center justify-between border-b border-[#f4eee9] px-[16px] py-[10px]">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] tracking-[2px] text-[#b0a8a2] uppercase">
                  {text.trim() ? "Kết quả" : "Tất cả món"}
                </span>
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#d9161c] tabular-nums">{suggestions.length} món</span>
              </div>
              <div className="flex flex-col overflow-y-auto">
            {suggestions.map((dish) => (
              <button
                className="flex cursor-pointer items-center gap-[12px] px-[14px] py-[10px] text-left transition-colors duration-200 hover:bg-[#f3f3f3]"
                key={dish.id}
                onClick={() => {
                  setText(dish.name);
                  search(dish.name);
                }}
                type="button"
              >
                <img alt={dish.name} className="size-[42px] shrink-0 rounded-[11px] object-cover" src={dish.image} />
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate font-['Source_Sans_Pro:Bold',sans-serif] text-[17px] text-[#212121]">{dish.name}</span>
                  <span className="truncate font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#9a9a9a]">{dish.desc}</span>
                </span>
              </button>
              ))}
              </div>
            </div>,
            document.body,
          )}
      </div>

      <button
        className="group relative flex shrink-0 cursor-pointer items-center justify-center gap-[12px] overflow-hidden rounded-[12px] px-[52px] py-[22px] shadow-[0px_10px_20px_rgba(205,5,8,0.28),0px_22px_44px_rgba(255,138,0,0.32)] transition-transform duration-300 hover:-translate-y-[3px] hover:scale-[1.03] active:scale-95"
        data-name="Button"
        onClick={() => search()}
        style={{ backgroundImage: "linear-gradient(109.64deg, #fa6932 0%, #d9161c 55%, #a3232a 100%)" }}
        type="button"
      >
        <span className="pointer-events-none absolute inset-y-0 -left-[60%] w-[40%] -skew-x-12 bg-white/25 blur-[6px] transition-transform duration-700 group-hover:translate-x-[380%]" />
        <svg className="relative size-[22px] text-[#f4de79]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="relative font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] whitespace-nowrap text-white">Tìm món ăn</span>
      </button>
    </div>
  );
}
