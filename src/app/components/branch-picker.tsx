import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { setAddress, useAddress } from "./address-store";

/** Width of the portaled address editor. */
const PANEL_WIDTH = 420;

/** Handful of frequently used spots the customer can tap to fill instantly. */
const QUICK_SPOTS = [
  { icon: "🏠", label: "Nhà riêng", value: "98 Nguyễn Công Hoan, P. Cầu Kiệu, Q. Phú Nhuận" },
  { icon: "🏢", label: "Công ty", value: "Tòa nhà Bitexco, 2 Hải Triều, P. Bến Nghé, Q.1" },
  { icon: "🎓", label: "Trường", value: "227 Nguyễn Văn Cừ, P.4, Q.5" },
];

/** Nav control for entering & editing the delivery address of the order. */
export function BranchPicker({ big }: { big?: boolean }) {
  const address = useAddress();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(address);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  /* Nav sits inside a CSS-transformed stage, so the panel is portaled to body. */
  useEffect(() => {
    if (!open) return;
    setDraft(address);
    const place = () => {
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      setAnchor({
        top: rect.bottom + 10,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - PANEL_WIDTH - 12)),
      });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, address]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
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

  const save = () => {
    const value = draft.trim();
    if (value) setAddress(value);
    setOpen(false);
  };

  return (
    <>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`group relative ml-auto flex min-w-0 cursor-pointer items-center rounded-full border border-white/20 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm transition-all duration-300 hover:border-[#f4de79]/60 hover:bg-white/[0.14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4de79] ${
          big ? "min-w-[248px] max-w-[320px] gap-[11px] py-[7px] pl-[8px] pr-[12px]" : "min-w-[208px] max-w-[280px] gap-[8px] py-[5px] pl-[6px] pr-[9px]"
        }`}
        onClick={() => setOpen((v) => !v)}
        ref={btnRef}
        type="button"
      >
        <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#f4de79] text-[#8a0808] shadow-[0_3px_10px_rgba(86,0,0,0.22)] ${big ? "size-[38px]" : "size-[29px]"}`}>
          <svg className={big ? "size-[20px]" : "size-[16px]"} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.35" viewBox="0 0 24 24">
            <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
        <span className="flex min-w-0 flex-1 flex-col text-left leading-[1.1]">
          <span className={`font-['Source_Sans_Pro:Bold',sans-serif] font-bold uppercase tracking-[0.13em] text-[#ffdaab] ${big ? "text-[10px]" : "text-[9px]"}`}>
            Địa chỉ giao đến
          </span>
          <span className={`truncate font-['Source_Sans_Pro:Bold',sans-serif] font-bold text-white ${big ? "mt-[3px] text-[15px]" : "mt-[2px] text-[13px]"}`}>
            {address || "Nhập địa chỉ giao hàng"}
          </span>
        </span>
        <span className={`flex shrink-0 items-center justify-center rounded-full border border-white/15 text-[#ffdaab] transition-all duration-300 group-hover:border-[#f4de79]/60 group-hover:bg-white/10 ${open ? "rotate-180 bg-white/10" : ""} ${big ? "ml-[2px] size-[23px]" : "ml-[1px] size-[19px]"}`}>
          <svg className={big ? "size-[13px]" : "size-[11px]"} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.7" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed z-[95] flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0px_30px_60px_rgba(74,0,1,0.4)] [animation:dish-in_0.26s_cubic-bezier(0.16,1,0.3,1)_both]"
            ref={panelRef}
            style={{ top: anchor.top, left: anchor.left, width: PANEL_WIDTH }}
          >
            <div className="flex flex-col gap-[6px] px-[20px] py-[16px]" style={{ backgroundImage: "linear-gradient(115deg, #7f292a 0%, #d9161c 55%, #fa6932 120%)" }}>
              <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[20px] text-white">Địa chỉ giao đến</span>
              <span className="font-['Source_Sans_Pro:Regular',sans-serif] text-[15px] text-[#ffdcb0]">Nhập hoặc chỉnh sửa địa chỉ để giao món chính xác nhất.</span>
            </div>

            <div className="flex flex-col gap-[14px] p-[18px]">
              <label className="flex flex-col gap-[7px]">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[15px] text-[#7f292a]">Địa chỉ chi tiết</span>
                <textarea
                  className="min-h-[86px] w-full resize-none rounded-[14px] border border-[#f0e2d2] bg-[#f3f3f3] px-[14px] py-[11px] font-['Source_Sans_Pro:Regular',sans-serif] text-[16px] text-[#3b2a20] outline-none transition-colors placeholder:text-[#a8927f] focus:border-[#fa6932] focus:bg-white"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
                  }}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện…"
                  ref={inputRef}
                  value={draft}
                />
              </label>

              <div className="flex flex-col gap-[8px]">
                <span className="font-['Source_Sans_Pro:Bold',sans-serif] text-[13px] uppercase tracking-[0.1em] text-[#a8927f]">Địa chỉ gợi ý</span>
                <div className="flex flex-wrap gap-[8px]">
                  {QUICK_SPOTS.map((spot) => (
                    <button
                      className="flex items-center gap-[7px] rounded-full border border-[#f0e2d2] bg-[#f6ece9] px-[13px] py-[8px] font-['Source_Sans_Pro:Bold',sans-serif] text-[14px] text-[#7f292a] transition-all duration-300 hover:-translate-y-[1px] hover:border-[#fa6932] hover:bg-[#fff1e8]"
                      key={spot.label}
                      onClick={() => setDraft(spot.value)}
                      type="button"
                    >
                      <span className="text-[16px]">{spot.icon}</span>
                      {spot.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-[2px] flex items-center gap-[10px]">
                <button
                  className="font-['Source_Sans_Pro:Bold',sans-serif] rounded-[14px] px-[16px] py-[11px] text-[15px] text-[#8a6d6b] transition-colors hover:bg-[#f3f3f3]"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="font-['Source_Sans_Pro:Bold',sans-serif] flex flex-1 items-center justify-center gap-[8px] rounded-[14px] py-[12px] text-[16px] text-white shadow-[0px_8px_20px_rgba(255,138,0,0.4)] transition-transform duration-300 hover:-translate-y-[2px] active:scale-95 disabled:opacity-50"
                  disabled={!draft.trim()}
                  onClick={save}
                  style={{ backgroundImage: "linear-gradient(135deg, #7f292a 0%, #d9161c 55%, #fa6932 120%)" }}
                  type="button"
                >
                  <svg className="size-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Lưu địa chỉ
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
